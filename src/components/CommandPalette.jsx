import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile, getNavigationCommands } from '../data/profile.js';
import { useCommandDialog } from '../hooks/useCommandDialog.js';
import Icon from './Icon.jsx';

export default function CommandPalette({ navigate, onClose, returnFocusRef, motionEnabled }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const { dialogRef, inputRef, startedOutside, trapFocus, outside } = useCommandDialog(returnFocusRef);
  const copy = profile.site.palette;
  const results = getNavigationCommands(query);
  const activeIndex = Math.min(index, results.length - 1);
  const choose = (event, id) => { onClose(); navigate(event, id); };
  return (
    <dialog ref={dialogRef} className="command-dialog" aria-labelledby="command-palette-title" onKeyDown={trapFocus}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDown={(event) => { startedOutside.current = outside(event); }}
      onClick={(event) => { if (startedOutside.current && outside(event)) onClose(); }}>
      <motion.div className="command-panel" initial={motionEnabled ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: motionEnabled ? 0.2 : 0 }}>
        <h2 className="sr-only" id="command-palette-title">{copy.title}</h2>
        <div className="command-search-row"><Icon name="search" size={21} />
          <label htmlFor="command-search" className="sr-only">{copy.searchLabel}</label>
          <input ref={inputRef} id="command-search" type="text" value={query} placeholder={copy.placeholder}
            autoComplete="off" spellCheck={false} role="combobox" aria-autocomplete="list" aria-expanded="true"
            aria-controls="command-results" aria-activedescendant={results[activeIndex] ? `command-${results[activeIndex].id}` : undefined}
            onChange={(event) => { setQuery(event.target.value); setIndex(0); }}
            onKeyDown={(event) => {
              if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length) {
                event.preventDefault();
                setIndex((current) => (current + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
              } else if (event.key === 'Enter' && results[activeIndex]) { event.preventDefault(); choose(event, results[activeIndex].id); }
            }} />
          <button type="button" className="command-close" aria-label={copy.closeLabel} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div id="command-results" role="listbox" aria-label={copy.resultsLabel} className="command-results">
          {results.map((command, optionIndex) => (
            <button type="button" role="option" tabIndex={-1} key={command.id} id={`command-${command.id}`}
              aria-selected={optionIndex === activeIndex} onPointerMove={() => setIndex(optionIndex)} onClick={(event) => choose(event, command.id)}>
              <span className="command-option-symbol" aria-hidden="true"><Icon name="arrow" size={15} /></span>
              <span><strong>{command.label}</strong><small>{command.description}</small></span>
              <span className="command-enter" aria-hidden="true">↵</span>
            </button>
          ))}
        </div>
        {!results.length && <p className="command-empty" role="status">{copy.empty}</p>}
        <div className="command-hints"><span>{copy.navigateHint}</span><span>{copy.enterHint}</span><span>{copy.escapeHint}</span></div>
      </motion.div>
    </dialog>
  );
}
