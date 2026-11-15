import { useEffect, useRef } from 'react';

export function useProjectDialog(returnFocusRef) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const startedOutside = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const trigger = returnFocusRef.current;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    titleRef.current?.focus({ preventScroll: true });
    dialog.scrollTop = 0;
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  const trapFocus = (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
    const first = controls[0];
    const last = controls.at(-1);
    const current = document.activeElement;
    if (event.shiftKey && (current === first || !controls.includes(current))) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && (current === last || !controls.includes(current))) {
      event.preventDefault();
      first?.focus();
    }
  };
  const outside = (event) => {
    if (event.target !== dialogRef.current) return false;
    const bounds = dialogRef.current.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };

  return { dialogRef, titleRef, trapFocus, startedOutside, outside };
}
