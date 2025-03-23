import cn from "classnames";
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";

export const RotateScreen = () => {
  const [isShow, setIsShow] = useState(() => {
    return window.matchMedia("(orientation: portrait)").matches;
  });


  const handleOrientation = useCallback(() => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    setIsShow(isPortrait);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleOrientation);
    window.addEventListener("orientationchange", handleOrientation);

    return () => {
      window.removeEventListener("resize", handleOrientation);
      window.removeEventListener("orientationchange", handleOrientation);
    }
  }, [])

  return (
    <div className={cn(styles.rotateOverlay, isShow && styles.rotateOverlayShow)}>
      <svg className={styles.rotateIcon} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="4" width="32" height="56" rx="4" ry="4" fill="#6C63FF" />
        <circle cx="32" cy="54" r="2.5" fill="#FFF9F0"/>
        <rect x="20" y="8" width="24" height="40" fill="#FFF9F0"/>
      </svg>

      <div className={styles.rotateText}>
        Поверните устройство
        <br />
        в альбомный режим
      </div>
    </div>
  )
}
