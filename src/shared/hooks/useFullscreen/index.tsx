import { useCallback, useEffect, useState } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggle = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }, [isFullscreen]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement);
    });
  }, []);

  return { isFullscreen, toggle };
};
