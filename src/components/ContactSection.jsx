import { motion } from 'framer-motion';
import { profile } from '../data/profile.js';
import { useContactForm } from '../hooks/useContactForm.js';
import SectionHeading from './SectionHeading.jsx';
import Icon from './Icon.jsx';
import ResumeLink from './ResumeLink.jsx';

export default function ContactSection({ index, motionEnabled }) {
  const { site, contact } = profile;
  const copy = site.contact;
  const { values, errors, status, configured, updateField, submit } = useContactForm();
  const message = !configured ? copy.unavailable : status === 'success' ? copy.success
    : status === 'error' ? copy.error : status === 'timeout' ? copy.timeout : status === 'invalid' ? copy.validationSummary : '';
  const errorStatus = ['error', 'timeout', 'invalid'].includes(status);
  const sending = status === 'sending';
  return (
    <section id="contact" className="content-section contact-section" tabIndex={-1} aria-labelledby="contact-heading">
      <SectionHeading id="contact" index={index} copy={copy} />
      <div className="contact-layout">
        <div className="contact-direct">
          <div className="contact-details" role="group" aria-label={copy.directLabel}>
            <a href={contact.emailHref} className="contact-detail"><span>{copy.emailLabel}</span><strong>{contact.email}</strong><Icon name="arrow" size={17} /></a>
            <a href={contact.phoneHref} className="contact-detail"><span>{copy.phoneLabel}</span><strong>{contact.phone}</strong><Icon name="arrow" size={17} /></a>
            <div className="contact-detail"><span>{copy.locationLabel}</span><strong>{contact.location}</strong><Icon name="location" size={17} /></div>
          </div>
          <div className="contact-socials">
            <a href={contact.linkedinHref} target="_blank" rel="noopener noreferrer"><Icon name="linkedin" size={17} />{site.labels.linkedin}<Icon name="arrow" size={12} /></a>
            <a href={contact.githubHref} target="_blank" rel="noopener noreferrer"><Icon name="github" size={17} />{site.labels.github}<Icon name="arrow" size={12} /></a>
          </div>
          <div className="contact-actions">
            <a className="whatsapp-button" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer"><Icon name="message" size={18} />{copy.whatsappLabel}<Icon name="arrow" size={16} /></a>
            <ResumeLink className="contact-resume"><Icon name="download" size={17} />{site.labels.downloadResume}</ResumeLink>
          </div>
        </div>
        <motion.div className="contact-form-panel" initial={motionEnabled ? { opacity: 0, y: 18 } : false}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: motionEnabled ? 0.55 : 0 }}>
          <h3>{copy.formHeading}</h3><p>{copy.formDescription}</p>
          <form className="contact-form" data-configured={configured ? 'true' : 'false'} data-status={status} noValidate onSubmit={submit}>
            {copy.fields.map((field) => {
              const id = `contact-${field.name}`;
              const props = { id, name: field.name, value: values[field.name], placeholder: field.placeholder,
                required: true, minLength: field.minLength, maxLength: field.maxLength,
                autoComplete: field.autoComplete, disabled: sending,
                'aria-invalid': Boolean(errors[field.name]), 'aria-describedby': errors[field.name] ? `${id}-error` : undefined,
                onChange: (event) => updateField(field.name, event.target.value) };
              return <div className="contact-field" key={field.name}>
                <label htmlFor={id}>{field.label}</label>
                {field.type === 'textarea' ? <textarea {...props} rows={5} /> : <input {...props} type={field.type} />}
                {errors[field.name] && <span className="field-error" id={`${id}-error`}>{errors[field.name]}</span>}
              </div>;
            })}
            <motion.button className="contact-submit" type="submit" disabled={!configured || sending}
              whileHover={motionEnabled && configured && !sending ? { y: -2 } : undefined} whileTap={motionEnabled ? { scale: 0.99 } : undefined}>
              {sending ? copy.sendingLabel : copy.submitLabel}<Icon name={sending ? 'clock' : 'arrow'} size={18} />
            </motion.button>
            <div className={`contact-status${errorStatus ? ' is-error' : ''}${status === 'success' ? ' is-success' : ''}`}
              role={errorStatus ? 'alert' : 'status'} aria-live={errorStatus ? 'assertive' : 'polite'} aria-atomic="true">
              {message}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
