import { Fade } from 'src/components/Fade';
import { rootStore } from 'src/store/RootStore';
import { BackButton } from '../BackButton';
import { Background } from './components/Background';
import { Chess } from './components/Chess';
import { Popup } from './components/Popup';
import { ResetButton } from './components/ResetButton';
import { SettingsPanel } from './components/SettingsPanel';
import { Timer } from './components/Timer';

export const Battle = () => {
  const { battleStore: model } = rootStore;
  return (
    <Fade model={model.fade} absolute fullSize>
      <Background model={model.background} />
      <Chess model={model.draughts} />
      <SettingsPanel model={model.settingsPanel} />
      <Timer model={model.timer} />
      <ResetButton model={model.resetButton} />
      <BackButton onClick={model.backButton.click}/>
      <Popup model={model.winPopup} />
      <Popup model={model.lossPopup} />
      <Popup model={model.drawPopup} />
    </Fade>
  );
};
