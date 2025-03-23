import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Scroller } from 'src/components/Scroller';
import { SubmitButton } from '../SubmitButton';
import { Radio } from './components/Radio';
import { SkinButton } from './components/SkinButton';
import styles from './index.module.scss';
import { Props } from './types';

export const SettingsPanel = observer(function SettingsPanel(props: Props) {
  const { model } = props;

  return (
    <div
      className={cn(
        styles.main,
        styles[`main_position_${model.position.value}`],
      )}
      onTransitionEnd={model.position.animation.finish}
    >
      <Scroller className={styles.scroller} model={model.scroller}>
        <div className={cn(styles.title, styles.title_hasTopBigMargin)}>
          Выбери, за кого играть
        </div>
        <div className={styles.sideRadio}>
          <Radio model={model.sideRadios.blackSide} />
        </div>
        <div className={styles.sideRadio}>
          <Radio model={model.sideRadios.whiteSide} />
        </div>
        <div className={styles.title}>
          Таймер
        </div>
        <div className={styles.timerRadio}>
          <Radio model={model.timerRadios.timerNo} />
        </div>
        <div className={styles.timerRadio}>
          <Radio model={model.timerRadios.timer10} />
        </div>
        <div className={styles.timerRadio}>
          <Radio model={model.timerRadios.timer15} />
        </div>
        <div className={styles.timerRadio}>
          <Radio model={model.timerRadios.timer30} />
        </div>
        <div className={styles.title}>
          Набор правил
        </div>
        <div className={styles.sideRadio}>
          <Radio model={model.ruleRadios.wcdf} />
        </div>
        <div className={styles.title}>
          Сложность
        </div>
        <div className={styles.sideRadio}>
          <Radio model={model.difficultyRadios.easy} />
        </div>
        <div className={styles.sideRadio}>
          <Radio model={model.difficultyRadios.medium} />
        </div>
        <div className={styles.sideRadio}>
          <Radio model={model.difficultyRadios.hard} />
        </div>
        <div className={styles.title}>
          Стиль
        </div>
        <div className={styles.skinButtons}>
          {model.skinButtons.map((skinButton) => (
            <SkinButton key={skinButton.skinType} model={skinButton} />
          ))}
        </div>
      </Scroller>
      <div
        style={{
          height: model.scrollbar.height,
          transform: `translateY(${model.scrollbar.y}px)`,
        }}
        className={styles.scrollbar}
      />
      <div className={styles.submitButtonContainer}>
        <SubmitButton
          className={styles.submitButton}
          isEnabled={model.submitButton.clicker.enabled}
          onClick={model.submitButton.clicker.click}
        />
      </div>
    </div>
  );
});
