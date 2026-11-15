import { useEffect, useRef } from 'react';

export function useCommandDialog(returnFocusRef) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const startedOutside = useRef(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    inputRef.current.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);
  const trapFocus = (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialogRef.current.querySelectorAll('input, button:not([disabled]):not([tabindex="-1"]), a[href]')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const outside = (event) => {
    if (event.target !== dialogRef.current) return false;
    const bounds = dialogRef.current.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  return { dialogRef, inputRef, startedOutside, trapFocus, outside };
}
