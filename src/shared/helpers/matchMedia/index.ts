export const matchMedia = (query: string): MediaQueryList => {
  const mediaQuery = window.matchMedia(query);

  const addEventListener = function <K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    // В некоторых версиях сафари, у MediaQueryList нету addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(type, listener, options);
    } else {
      mediaQuery.addListener(listener);
    }
  };

  const removeEventListener = function <K extends keyof MediaQueryListEventMap>(
    type: K,
    listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ) {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener(type, listener, options);
    } else {
      mediaQuery.removeListener(listener);
    }
  };

  addEventListener.bind(mediaQuery);
  removeEventListener.bind(mediaQuery);

  return {
    matches: mediaQuery.matches,
    media: mediaQuery.media,
    onchange: mediaQuery.onchange,
    addListener: mediaQuery.addListener,
    removeListener: mediaQuery.removeListener,
    addEventListener,
    removeEventListener,
  } as MediaQueryList;
};
