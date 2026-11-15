import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile.js';

const emptyFields = () => Object.fromEntries(profile.site.contact.fields.map(({ name }) => [name, '']));

export function useContactForm() {
  const [values, setValues] = useState(emptyFields);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const request = useRef(null);
  const rawEndpoint = import.meta.env[profile.contact.form.endpointEnv]?.trim() || '';
  let endpoint = null;
  try {
    const parsed = new URL(rawEndpoint);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') endpoint = parsed.href;
  } catch { /* An empty or invalid endpoint leaves the direct-contact fallback. */ }
  const configured = Boolean(endpoint);

  useEffect(() => () => request.current?.abort(), []);
  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status !== 'sending') setStatus('idle');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!configured || request.current) return;
    const form = event.currentTarget;
    const nextErrors = {};
    for (const field of profile.site.contact.fields) {
      const value = values[field.name].trim();
      const input = form.elements.namedItem(field.name);
      if (!value || (field.minLength && value.length < field.minLength)
        || value.length > field.maxLength || !input.validity.valid) {
        nextErrors[field.name] = profile.site.contact.fieldErrors[field.name];
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus('invalid');
      form.elements.namedItem(Object.keys(nextErrors)[0]).focus();
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setStatus('sending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(Object.entries(values).map(([name, value]) => [name, value.trim()]))),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.errors?.length) throw new Error('Contact request was not accepted.');
      setValues(emptyFields());
      setStatus('success');
    } catch (error) {
      setStatus(error.name === 'AbortError' ? 'timeout' : 'error');
    } finally {
      clearTimeout(timeout);
      request.current = null;
    }
  };

  return { values, errors, status, configured, updateField, submit };
}
