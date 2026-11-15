import { ANSWER_LIMIT, QUESTION_LIMIT, SOURCE_IDS, localAnswer, sourceChips } from './profileKnowledge.js';

export async function askAI(question) {
  if (typeof question !== 'string' || !question.trim() || question.length > QUESTION_LIMIT) return localAnswer(question);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('/api/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ question: question.trim() }), signal: controller.signal,
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Use local retrieval.');
    const payload = await response.json();
    if (typeof payload.answer !== 'string' || !payload.answer.trim() || payload.answer.length > ANSWER_LIMIT
      || !Array.isArray(payload.sources) || payload.sources.length > SOURCE_IDS.length
      || payload.sources.some((id) => !SOURCE_IDS.includes(id))) throw new Error('Use local retrieval.');
    return { answer: payload.answer.trim(), sources: sourceChips(payload.sources), mode: response.headers.get('x-answer-mode') === 'local' ? 'local' : 'ai' };
  } catch {
    return localAnswer(question);
  } finally { clearTimeout(timer); }
}
