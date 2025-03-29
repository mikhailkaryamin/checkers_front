import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { IconButton } from 'src/components/IconButton';
import { checkIfIOS } from 'src/shared/helpers/checkIfIOS';
import { useFullscreen } from 'src/shared/hooks/useFullscreen';
import styles from './index.module.scss';

export const FullscreenButton = observer(function BackButton() {
  const { isFullscreen, toggle } = useFullscreen();
  const isIOS = useMemo(() => {
    return checkIfIOS();
  }, [])

  if (isIOS) return null;

  return <IconButton
    className={styles.fullscreenButton}
    type={isFullscreen ? "fullscreenOut" : "fullscreenIn"}
    onClick={toggle}
    data-testid="fullscreen_button"
  />
})
