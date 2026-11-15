import { useRef, useState } from 'react';
import { profile } from '../data/profile.js';

export default function ResumeLink({ children, ...props }) {
  const { resume } = profile.assets;
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const download = async (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (busy.current) return;
    busy.current = true; setPending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      // The build generates this JSON directly from public/resume.pdf. Its
      // transport avoids native PDF interception while preserving identical bytes.
      const response = await fetch(resume.downloadPayload, { signal: controller.signal });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('PDF unavailable.');
      const payload = await response.json();
      if (payload.type !== 'application/pdf' || typeof payload.data !== 'string') throw new Error('PDF unavailable.');
      const binary = atob(payload.data);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url; link.download = resume.downloadName;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      window.location.assign(resume.href);
    } finally { clearTimeout(timeout); busy.current = false; setPending(false); }
  };
  return <a {...props} href={resume.href} download={resume.downloadName} onClick={download} aria-busy={pending || undefined}>{children}</a>;
}
