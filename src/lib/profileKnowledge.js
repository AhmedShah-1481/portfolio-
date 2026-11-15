import { profile } from '../data/profile.js';

export const QUESTION_LIMIT = 300;
export const ANSWER_LIMIT = 1100;
export const SOURCE_IDS = Object.keys(profile.site.ai.sources);
const normalize = (text) => String(text).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const hasPhrase = (text, phrase) => (` ${text} `).includes(` ${normalize(phrase)} `);

// Deliberately exclude UI copy, conceptual architecture, form configuration,
// and placeholders from the facts sent to the model.
export function buildProfileContext(data = profile) {
  return {
    summary: { name: data.identity.name, summary: data.identity.summary },
    education: data.education,
    skills: data.skills,
    projects: data.projects.map(({ id, title, categories, technologies, details, github, demo }) => ({
      id, title, categories, technologies, details, github: github.href, demo: demo.href,
    })),
    certifications: data.certifications.map(({ title, issuer, date }) => ({ title, issuer, date: date.label, precision: date.precision })),
    contact: {
      location: data.contact.location, phone: data.contact.phone, email: data.contact.email,
      linkedin: data.contact.linkedinHref, github: data.contact.githubHref,
      whatsapp: data.contact.whatsappHref, resume: data.assets.resume.href,
    },
    totals: { projects: data.projects.length, certificationsAndTraining: data.certifications.length },
  };
}

export function sourceChips(ids) {
  return [...new Set(ids)].filter((id) => SOURCE_IDS.includes(id)).map((id) => ({ id, ...profile.site.ai.sources[id] }));
}

const unsupported = /\b(salary|salaries|compensation|pay rate|hourly rate|employers?|employment history|previous jobs?|past jobs?|worked (?:at|for)|work (?:at|for)|married|wife|husband|girlfriend|boyfriend|parents?|children|family|personal life|birthday|birth date|born|age|home address|favorite|favourite|hobbies|religion|politic|graduation date|when.*graduat|years? of experience|users?|revenue|awards?|won a|weather|net worth|latency|benchmarks?|performance metrics|client names?|availability|relocat\w*)\b/i;
const injection = /\b(ignore|override|forget|disregard)\b.{0,70}\b(instructions?|rules?|system|previous|above|profile)\b|\b(system prompt|developer message|api key|secret|act as|pretend (?:to be|that)|invent|fabricate)\b/i;
const stopWords = new Set('what which who where when how why does do did is are can could would should has have his he him ahmed syed muhammad muhammed bin haider tell me about the a an and or of for with in to use uses using know knows experience please profile projects project skills skill ai developed built implemented generated system systems application applications powered'.split(' '));
const meaningfulTokens = (text) => normalize(text).split(' ').filter((word) => word.length > 2 && !stopWords.has(word));

function projectMatches(text) {
  const tokens = meaningfulTokens(text);
  return profile.projects.filter((project) => {
    const aliases = [project.title, project.title.split(' – ')[0], project.id.replaceAll('-', ' ')];
    if (aliases.some((alias) => hasPhrase(text, alias))) return true;
    const titleWords = meaningfulTokens(project.title);
    return titleWords.some((word) => tokens.includes(word)
      && profile.projects.filter((candidate) => meaningfulTokens(candidate.title).includes(word)).length === 1)
      || tokens.filter((word) => meaningfulTokens(project.details.join(' ')).includes(word)).length >= 2;
  });
}

function certificationMatches(text) {
  const tokens = meaningfulTokens(text);
  return profile.certifications.filter((entry) => {
    const title = entry.title.replace(/\s*\([^)]*\)/g, '').replace(/\b20\d\d\b/g, '').trim();
    return hasPhrase(text, title) || hasPhrase(text, entry.issuer)
      || meaningfulTokens(title).some((word) => tokens.includes(word)
        && profile.certifications.filter((candidate) => meaningfulTokens(candidate.title).includes(word)).length === 1);
  });
}

export function retrieveProfile(question) {
  const text = normalize(question);
  if (!text || unsupported.test(question) || injection.test(question)) return { sectionIds: [], text, projects: [], skills: [], certifications: [] };
  const knownTechnologies = [...new Set([...profile.skills.flatMap((group) => group.items), ...profile.projects.flatMap((project) => project.technologies)])];
  const skills = knownTechnologies.filter((skill) => hasPhrase(text, skill));
  const projects = projectMatches(text);
  const certifications = certificationMatches(text);
  const ids = new Set();
  const projectIntent = /\b(projects?|built|build|applications?|portfolio|demos?|repository|repositories)\b/.test(text);
  const skillIntent = /\b(skills?|technolog(?:y|ies)|tools?|frameworks?|languages?|programming|stack|know|knows|use|uses)\b/.test(text);
  if (/\b(education|cgpa|semester|university|comsats|degree|study|studies|student|college)\b/.test(text)) ids.add('education');
  if ((/\b(contact|email|phone|whatsapp|linkedin|github|resume|cv|location|based|live|lives)\b/.test(text)
    || /\bwhere\b.*\b(from|located|based)\b/.test(text)) && !projects.length) ids.add('contact');
  if (/\b(certifications?|certificates?|training|intern|internship|bootcamp|hackathon|google|smartreco|agent hack)\b/.test(text) || certifications.length) ids.add('certifications');
  if (projectIntent || projects.length) ids.add('projects');
  if (skills.length && !projects.length) ids.add(projectIntent ? 'projects' : 'skills');
  if (skillIntent && !projects.length) {
    const specifics = meaningfulTokens(text).filter((word) => !['technologies', 'technology', 'tech', 'tools', 'frameworks', 'languages', 'programming', 'stack', 'main', 'technical', 'strongest', 'engineering'].includes(word));
    if (skills.length || !specifics.length || /^(backend|frontend|databases?|other)$/.test(specifics.join(' '))) ids.add('skills');
  }
  if (/\b(who is|tell me about (?:him|ahmed)|summary|background|focus|interests?|opportunity|opportunities|introduce|generative ai)\b/.test(text)) ids.add('summary');
  // A project query naming an unlisted technology must not return unrelated work.
  if (projectIntent && !projects.length && !skills.length) {
    const extras = meaningfulTokens(text).filter((word) => !['built', 'build', 'applications', 'application', 'portfolio', 'full', 'stack', 'frontend', 'agentic', 'systems', 'best', 'real', 'working', 'all', 'many', 'recommenders'].includes(word));
    if (extras.length && !ids.has('certifications') && !ids.has('education') && !ids.has('summary')) ids.delete('projects');
  }
  return { sectionIds: [...ids], text, projects, skills, certifications };
}

const thirdPersonDetail = (detail) => `He ${detail[0].toLowerCase()}${detail.slice(1)}`;
const titleList = (projects) => projects.map((project) => project.title).join('; ');

export function localAnswer(question) {
  const copy = profile.site.ai;
  if (typeof question !== 'string' || !question.trim()) return { answer: copy.emptyQuestion, sources: [], mode: 'local' };
  if (question.length > QUESTION_LIMIT) return { answer: copy.longQuestion, sources: [], mode: 'local' };
  if (/^(hi|hello|hey)[!.\s]*$/i.test(question.trim())) return { answer: copy.welcome, sources: [], mode: 'local' };
  const result = retrieveProfile(question);
  if (!result.sectionIds.length) return { answer: copy.unknownAnswer, sources: [], mode: 'local' };
  const { text, skills, projects, certifications } = result;
  const answers = [];
  const used = [];
  const add = (section, answer) => { answers.push(answer); used.push(section); };

  if (result.sectionIds.includes('summary')) {
    const sentences = profile.identity.summary.match(/[^.!?]+[.!?](?:\s|$)/g) || [profile.identity.summary];
    const introduction = sentences[0].trim();
    add('summary', `${profile.identity.name} is a ${introduction} ${sentences[1] ? `He has ${sentences[1].trim().replace(/^Hands-on/, 'hands-on')}` : ''}`.trim());
  }
  if (result.sectionIds.includes('education')) {
    const { degree, university, campus, semester, cgpa } = profile.education;
    add('education', `He studies ${degree} at ${university}, ${campus}. His profile lists semester ${semester} and a CGPA of ${cgpa}.`);
  }
  if (result.sectionIds.includes('projects')) {
    if (projects.length) {
      for (const project of projects.slice(0, 2)) {
        if (/\b(github|repository|repositories)\b/.test(text)) add('projects', `${project.title}: ${project.github.href || copy.missingRepository}`);
        else if (/\b(demo|demos|live link)\b/.test(text)) add('projects', `${project.title}: ${project.demo.href || copy.missingDemo}`);
        else add('projects', `${project.title}: ${projects.length > 1 ? thirdPersonDetail(project.details[0]) : project.details.map(thirdPersonDetail).join(' ')} Technologies: ${project.technologies.join(', ')}.`);
      }
    } else {
      let matches = profile.projects;
      if (skills.length) matches = matches.filter((project) => skills.some((skill) => project.technologies.includes(skill)));
      else if (/\bfull stack\b/.test(text)) matches = matches.filter((project) => project.categories.includes('Full-Stack'));
      else if (/\bfrontend\b/.test(text)) matches = matches.filter((project) => project.categories.includes('Frontend'));
      else if (/\bai|agentic\b/.test(text)) matches = matches.filter((project) => project.categories.includes('AI'));
      add('projects', `His profile lists ${matches.length} matching projects: ${titleList(matches)}.`);
    }
  }
  if (result.sectionIds.includes('skills')) {
    if (skills.length) {
      const matches = profile.projects.filter((project) => skills.some((skill) => project.technologies.includes(skill)));
      add('skills', `${skills.join(', ')} ${skills.length === 1 ? 'is' : 'are'} listed in his profile.${matches.length ? ` Projects that list ${skills.length === 1 ? 'it' : 'them'}: ${titleList(matches)}.` : ' No project explicitly lists this technology in its stack yet.'}`);
      if (matches.length) used.push('projects');
    } else {
      const groups = profile.skills.filter((group) => hasPhrase(text, group.category));
      add('skills', `His listed skills are ${(groups.length ? groups : profile.skills).map((group) => `${group.category}: ${group.items.join(', ')}`).join('; ')}.`);
    }
  }
  if (result.sectionIds.includes('certifications')) {
    const entries = certifications.length ? certifications : /\b(intern|internship)\b/.test(text)
      ? profile.certifications.filter((entry) => /internship/i.test(entry.title)) : profile.certifications;
    add('certifications', `His profile lists ${entries.length} certification/training ${entries.length === 1 ? 'record' : 'records'}: ${entries.map((entry) => `${entry.title} (${entry.issuer}, ${entry.date.label}${entry.date.precision === 'year' ? '; year only, month not specified' : ''})`).join('; ')}.`);
  }
  if (result.sectionIds.includes('contact')) {
    const contact = profile.contact;
    let answer;
    if (/\bemail\b/.test(text)) answer = `His email is ${contact.email}.`;
    else if (/\b(phone|whatsapp)\b/.test(text)) answer = `His phone/WhatsApp number is ${contact.phone}. WhatsApp: ${contact.whatsappHref}`;
    else if (/\blinkedin\b/.test(text)) answer = `His LinkedIn profile is ${contact.linkedinHref}`;
    else if (/\bgithub\b/.test(text)) answer = `His GitHub profile is ${contact.githubHref}`;
    else if (/\b(resume|cv)\b/.test(text)) answer = `His resume is available through the Download Resume buttons on this site: ${profile.assets.resume.href}`;
    else if (/\b(location|based|live|lives)\b/.test(text)) answer = `His listed location is ${contact.location}.`;
    else answer = `You can contact him at ${contact.email} or ${contact.phone} (phone/WhatsApp). His listed location is ${contact.location}.`;
    add('contact', answer);
  }
  const answer = answers.join('\n\n');
  if (!answer || answer.length > ANSWER_LIMIT * 2) return { answer: copy.unknownAnswer, sources: [], mode: 'local' };
  return { answer, sources: sourceChips(used), mode: 'local' };
}
