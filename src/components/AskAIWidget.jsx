import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile.js';
import { askAI } from '../lib/askAI.js';
import { QUESTION_LIMIT } from '../lib/profileKnowledge.js';
import Icon from './Icon.jsx';

export default function AskAIWidget({ motionEnabled, open, onOpen, onClose, returnFocusRef, navigate }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [pending, setPending] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const input = useRef(null);
  const dialog = useRef(null);
  const list = useRef(null);
  const busy = useRef(false);
  const sequence = useRef(0);
  const copy = profile.site.ai;

  useEffect(() => {
    const panel = dialog.current;
    if (open && !panel.open) { panel.showModal(); input.current.focus({ preventScroll: true }); }
    if (!open && panel.open) {
      panel.close();
      const trigger = returnFocusRef.current;
      (trigger?.isConnected ? trigger : document.querySelector('.chat-launcher'))?.focus({ preventScroll: true });
    }
  }, [open, returnFocusRef]);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  useEffect(() => {
    const update = () => {
      const viewport = window.visualViewport;
      dialog.current.style.setProperty('--chat-viewport-height', `${viewport?.height || window.innerHeight}px`);
      dialog.current.style.setProperty('--chat-keyboard-offset', `${Math.max(0, window.innerHeight - (viewport?.height || window.innerHeight) - (viewport?.offsetTop || 0))}px`);
    };
    update();
    window.visualViewport?.addEventListener('resize', update);
    return () => window.visualViewport?.removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    if (open && list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [messages, pending, open]);
  useEffect(() => () => { sequence.current += 1; }, []);

  const send = async (text) => {
    const clean = text.trim();
    if (!clean || clean.length > QUESTION_LIMIT || busy.current) return;
    busy.current = true;
    const id = ++sequence.current;
    setMessages((current) => [...current, { id: `${id}-question`, role: 'visitor', text: clean }]);
    setQuestion(''); setPending(true); setAnnouncement('');
    const result = await askAI(clean);
    if (id !== sequence.current) return;
    setMessages((current) => [...current, { id: `${id}-answer`, role: 'assistant', text: result.answer, sources: result.sources, mode: result.mode }]);
    setAnnouncement(`${result.mode === 'ai' ? copy.aiLabel : copy.localLabel}. ${result.answer}`);
    setPending(false); busy.current = false;
    if (dialog.current.open) input.current?.focus({ preventScroll: true });
  };
  const visitSource = (event, href) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    onClose(); navigate(event, href.slice(1));
  };
  const trapFocus = (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')];
    const first = controls[0]; const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return <>
    <button className="chat-launcher" type="button" aria-label={copy.openLabel} aria-haspopup="dialog"
      aria-expanded={open} aria-controls="ask-ai-panel" onClick={onOpen}><Icon name="message" size={21} /><span>{copy.title}</span></button>
    <dialog ref={dialog} id="ask-ai-panel" className="chat-dialog" aria-labelledby="chat-title" onKeyDown={trapFocus}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div className="chat-panel" initial={false} animate={{ opacity: open ? 1 : 0, y: open ? 0 : 14 }}
        transition={{ duration: motionEnabled ? 0.2 : 0 }}>
        <div className="chat-header"><span className="chat-avatar" aria-hidden="true"><Icon name="branch" size={20} /></span>
          <div><h2 id="chat-title">{copy.title}</h2><p>{copy.subtitle}</p></div>
          <button className="chat-close" type="button" aria-label={copy.closeLabel} onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        <div className="chat-messages" ref={list} role="log" aria-live="off" aria-label={copy.title}>
          <div className="chat-welcome"><p>{copy.welcome}</p></div>
          {!messages.length && <div className="chat-starters" role="group" aria-label={copy.startersLabel}>
            {copy.starters.map((starter) => <button type="button" key={starter} onClick={() => send(starter)} disabled={pending}>{starter}<Icon name="arrow" size={12} /></button>)}
          </div>}
          {messages.map((message) => <div className={`chat-message chat-message-${message.role}`} key={message.id}>
            <span className="chat-message-author">{message.role === 'visitor' ? copy.visitorLabel : copy.assistantLabel}</span>
            <p>{message.text}</p>
            {message.role === 'assistant' && <>
              <span className="chat-answer-mode">{message.mode === 'ai' ? copy.aiLabel : copy.localLabel}</span>
              {message.sources.length > 0 ? <div className="chat-sources" role="group" aria-label={copy.sourcesLabel}>
                {message.sources.map((source) => <a key={source.id} href={source.href} onClick={(event) => visitSource(event, source.href)}>{source.label}<Icon name="arrow" size={10} /></a>)}
              </div> : <a className="chat-contact-link" href="#contact" onClick={(event) => visitSource(event, '#contact')}>{copy.contactCta}<Icon name="arrow" size={11} /></a>}
            </>}
          </div>)}
          {pending && <p className="chat-thinking" role="status">{copy.thinking}</p>}
        </div>
        <form className="chat-input-row" onSubmit={(event) => { event.preventDefault(); send(question); }}>
          <label className="sr-only" htmlFor="chat-question">{copy.inputLabel}</label>
          <input ref={input} id="chat-question" name="question" value={question} maxLength={QUESTION_LIMIT} placeholder={copy.placeholder}
            autoComplete="off" onChange={(event) => setQuestion(event.target.value)} aria-describedby="chat-character-count" />
          <button type="submit" disabled={!question.trim() || pending} aria-label={copy.sendLabel}><Icon name="arrow" size={19} /></button>
          <span id="chat-character-count" className="chat-character-count">{question.length}/{QUESTION_LIMIT}</span>
        </form>
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      </motion.div>
    </dialog>
  </>;
}
