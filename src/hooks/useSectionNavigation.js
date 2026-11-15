import { useCallback } from 'react';

export function useSectionNavigation(controller, motionEnabled) {
  return useCallback((event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `#${id}`);
    }
    // Let a closing native dialog restore focus before moving it to the section.
    requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
      if (controller.current && motionEnabled) {
        // Lenis and native scrolling both honor the root scroll-padding.
        controller.current.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'start' });
      }
    });
  }, [controller, motionEnabled]);
}
