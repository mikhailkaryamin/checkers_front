import { values } from 'lodash';
import { DraughtsPlayer } from 'rapid-draughts';
import { Chess } from 'src/components/Chess/store/Chess';
import { Difficulty } from 'src/components/Chess/store/Chess/types';
import { CancellableAction } from 'src/shared/classes/CancellableAction';
import { Deferred } from 'src/shared/classes/Deferred';
import { Nullable } from 'src/types';
import { SettingsPanel } from '../../components/SettingsPanel/store/SettingsPanel';
import { Background } from '../Background';
import { Timer } from '../Timer';
import { ViewUpdater } from '../ViewUpdater';
import { possibleTimerData } from './constants';
import {
  ActionData,
  DifficultyRadioClickActionData,
  Options,
  RuleRadioClickActionData,
  SideRadioClickActionData,
  SkinButtonClickActionData,
  SubmitButtonClickActionData,
  TimerRadioClickActionData
} from './types';

export class SettingsScenario extends CancellableAction {
  protected readonly _waitAction = new CancellableAction({
    run: async () => {
      this._toggleActivity(true);

      const actionData = await Promise.race<ActionData>([
        this._waitSideRadiosClick(),
        this._waitRuleRadiosClick(),
        this._waitDifficultyRadiosClick(),
        this._waitTimerRadiosClick(),
        this._waitSkinButtonsClick(),
        this._waitSubmitButtonClick(),
      ]);

      this._toggleActivity(false);
      this._resetClicks();
      return actionData;
    },
    cancel: () => this._resetClicks(),
    done: (actionData) => {
      if (actionData.type === 'sideRadioClick') {
        this._handleSideRadioClick(actionData.index);
        this._waitAction.run();
      } else if (actionData.type === 'timerRadioClick') {
        this._handleTimerRadioClick(actionData.index);
        this._waitAction.run();
      } else if (actionData.type === 'skinButtonClick') {
        this._handleSkinButtonClick(actionData.index);
        this._waitAction.run();
      } else if (actionData.type === 'ruleRadioClick') {
        this._handleRuleRadioClick(actionData.index);
        this._waitAction.run();
      } else if (actionData.type === 'difficultyRadioClick') {
        this._handleDifficultyRadioClick(actionData.index);
        this._waitAction.run();
      } else {
        this._handleSubmitButtonClick();
      }
    },
  });

  protected readonly _background: Background;

  protected readonly _chess: Chess;

  protected readonly _settingsPanel: SettingsPanel;

  protected readonly _timer: Timer;

  protected readonly _viewUpdater: ViewUpdater;

  protected _deferredScenario: Nullable<Deferred<void>> = null;

  protected _isHintsEnabled = true;

  public constructor(options: Options) {
    super({
      run: () => this._runScenario(),
      cancel: () => this._cancelScenario(),
      done: options.done,
    });
    this._background = options.background;
    this._chess = options.chess;
    this._settingsPanel = options.settingsPanel;
    this._timer = options.timer;
    this._viewUpdater = new ViewUpdater({
      chess: this._chess,
      timer: this._timer,
      background: this._background,
    });
  }

  public get isHintsEnabled() {
    return this._isHintsEnabled;
  }

  public setIsHintsEnabled(isHintsEnabled: boolean) {
    this._isHintsEnabled = isHintsEnabled;
  }

  protected async _runScenario() {
    this._deferredScenario = new Deferred();
    this._waitAction.run();
    await this._deferredScenario.promise;
  }

  protected _cancelScenario() {
    this._deferredScenario = null;
    this._waitAction.cancelSoft();
  }

  protected _toggleActivity(isEnabled: boolean) {
    values(this._settingsPanel.sideRadios).forEach((radio) => radio.clicker.toggle(isEnabled));
    values(this._settingsPanel.ruleRadios).forEach((radio) => radio.clicker.toggle(isEnabled));
    values(this._settingsPanel.difficultyRadios).forEach((radio) => radio.clicker.toggle(isEnabled));
    values(this._settingsPanel.timerRadios).forEach((radio) => radio.clicker.toggle(isEnabled));
    values(this._settingsPanel.skinButtons).forEach((skinButton) =>
      skinButton.clicker.toggle(isEnabled),
    );
  }

  protected _handleSideRadioClick(radioIndex: number) {
    const radios = values(this._settingsPanel.sideRadios);
    radios.forEach((radio, index) => radio.setIsSelected(index === radioIndex));
    this._updateViewIfNeed();
    this._toggleSubmitButtonActivity();
  }

  protected _handleRuleRadioClick(radioIndex: number) {
    const radios = values(this._settingsPanel.ruleRadios);
    radios.forEach((radio, index) => radio.setIsSelected(index === radioIndex));
    this._toggleSubmitButtonActivity();
  }

  protected _handleDifficultyRadioClick(radioIndex: number) {
    const radios = values(this._settingsPanel.difficultyRadios);
    radios.forEach((radio, index) => radio.setIsSelected(index === radioIndex));
    if (radioIndex === 0) {
      this._chess.setDifficulty(Difficulty.Easy)
    } else if (radioIndex === 1) {
      this._chess.setDifficulty(Difficulty.Medium)
    } else if (radioIndex === 2) {
      this._chess.setDifficulty(Difficulty.Hard)
    }

    this._toggleSubmitButtonActivity();
  }

  protected _handleTimerRadioClick(radioIndex: number) {
    const radios = values(this._settingsPanel.timerRadios);
    radios.forEach((radio, index) => radio.setIsSelected(index === radioIndex));
    this._updateViewIfNeed();
    this._toggleSubmitButtonActivity();
  }

  protected _handleSkinButtonClick(skinButtonIndex: number) {
    this._selectSkinButton(skinButtonIndex);
  }

  protected _selectSkinButton(skinButtonIndex: number) {
    const skinButtons = values(this._settingsPanel.skinButtons);
    const skinButton = skinButtons[skinButtonIndex];
    skinButtons.forEach((skinButton, index) => {
      skinButton.setIsSelected(index === skinButtonIndex);
    });
    this._updateViewIfNeed();
    this._toggleSubmitButtonActivity();
  }

  protected _handleSubmitButtonClick() {
    this._settingsPanel.submitButton.clicker.disable();
    this._deferredScenario?.resolve();
  }

  protected _updateViewIfNeed() {
    if (this._checkIfSomeSideRadiosAreSelected() || this._checkIfSomeSkinButtonsAreSelected()) {
      const playerColorByRadios = this._settingsPanel.sideRadios.whiteSide.isSelected ? DraughtsPlayer.LIGHT : DraughtsPlayer.DARK;
      const defaultPlayerColor = DraughtsPlayer.LIGHT;
      const playerColor = this._checkIfSomeSideRadiosAreSelected()
        ? playerColorByRadios
        : defaultPlayerColor;
      const skinType = this._settingsPanel.selectedSkinTypeOrDefault;
      this._viewUpdater.toggle({ skinType, side: playerColor });
    }

    const selectedTimerRadioName = this._settingsPanel.getTimerRadioNameIfSelected();
    if (selectedTimerRadioName) {
      this._timer.setData(possibleTimerData[selectedTimerRadioName]);
    }
  }

  protected _checkIfSomeSideRadiosAreSelected() {
    const radios = values(this._settingsPanel.sideRadios);
    const areSomeRadioSelected = radios.some((radio) => radio.isSelected);
    return areSomeRadioSelected;
  }

  protected _checkIfSomeRuleRadiosAreSelected() {
    const radios = values(this._settingsPanel.ruleRadios);
    const areSomeRadioSelected = radios.some((radio) => radio.isSelected);
    return areSomeRadioSelected;
  }

  protected _checkIfSomeDifficultyRadiosAreSelected() {
    const radios = values(this._settingsPanel.difficultyRadios);
    const areSomeRadioSelected = radios.some((radio) => radio.isSelected);
    return areSomeRadioSelected;
  }

  protected _checkIfSomeTimerRadiosAreSelected() {
    const radios = values(this._settingsPanel.timerRadios);
    const areSomeRadioSelected = radios.some((radio) => radio.isSelected);
    return areSomeRadioSelected;
  }

  protected _checkIfSomeSkinButtonsAreSelected() {
    const skinButtons = values(this._settingsPanel.skinButtons);
    const areSomeSkinButtonsSelected = skinButtons.some((skinButton) => skinButton.isSelected);
    return areSomeSkinButtonsSelected;
  }

  protected _checkIfPlayerHasSkin() {
    return true;
  }

  protected _toggleSubmitButtonActivity() {
    if (
      this._checkIfSomeSideRadiosAreSelected() &&
      this._checkIfSomeSkinButtonsAreSelected() &&
      this._checkIfSomeRuleRadiosAreSelected() &&
      this._checkIfSomeDifficultyRadiosAreSelected() &&
      this._checkIfPlayerHasSkin()
    ) {
      this._settingsPanel.submitButton.clicker.enable();
    } else {
      this._settingsPanel.submitButton.clicker.disable();
    }
  }

  protected _resetClicks() {
    values(this._settingsPanel.sideRadios).forEach((radio) => radio.clicker.resetWait());
    values(this._settingsPanel.ruleRadios).forEach((radio) => radio.clicker.resetWait());
    values(this._settingsPanel.skinButtons).forEach((skinButton) => skinButton.clicker.resetWait());
    this._settingsPanel.submitButton.clicker.resetWait();
  }

  protected async _waitSideRadiosClick() {
    return Promise.race(
      values(this._settingsPanel.sideRadios).map(async (radio, index) => {
        await radio.clicker.waitClick();
        return { type: 'sideRadioClick', index } as SideRadioClickActionData;
      }),
    );
  }

  protected async _waitRuleRadiosClick() {
    return Promise.race(
      values(this._settingsPanel.ruleRadios).map(async (radio, index) => {
        await radio.clicker.waitClick();
        return { type: 'ruleRadioClick', index } as RuleRadioClickActionData;
      }),
    );
  }

  protected async _waitDifficultyRadiosClick() {
    return Promise.race(
      values(this._settingsPanel.difficultyRadios).map(async (radio, index) => {
        await radio.clicker.waitClick();
        return { type: 'difficultyRadioClick', index } as DifficultyRadioClickActionData;
      }),
    );
  }

  protected async _waitTimerRadiosClick() {
    return Promise.race(
      values(this._settingsPanel.timerRadios).map(async (radio, index) => {
        await radio.clicker.waitClick();
        return { type: 'timerRadioClick', index } as TimerRadioClickActionData;
      }),
    );
  }

  protected async _waitSkinButtonsClick() {
    return Promise.race(
      values(this._settingsPanel.skinButtons).map(async (skinButton, index) => {
        await skinButton.clicker.waitClick();
        return { type: 'skinButtonClick', index } as SkinButtonClickActionData;
      }),
    );
  }

  protected async _waitSubmitButtonClick() {
    return this._settingsPanel.submitButton.clicker
      .waitClick()
      .then(() => ({ type: 'submitButtonClick' } as SubmitButtonClickActionData));
  }
}
