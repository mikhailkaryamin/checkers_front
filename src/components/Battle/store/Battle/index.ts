import { values } from 'lodash';
import { Chess } from 'src/components/Chess/store/Chess';
import { Fade } from 'src/components/Fade/store/Fade';
import { CancellableAction } from 'src/shared/classes/CancellableAction';
import { Clicker } from 'src/shared/classes/Clicker';
import { Deferred } from 'src/shared/classes/Deferred';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { StorageStore } from 'src/store/StorageStore';
import { MatchResult, Nullable } from 'src/types';
import { DrawPopup } from '../../components/Popup/store/DrawPopup';
import { LossPopup } from '../../components/Popup/store/LossPopup';
import { WinPopup } from '../../components/Popup/store/WinPopup';
import { SettingsPanel } from '../../components/SettingsPanel/store/SettingsPanel';
import { Background } from '../Background';
import { GameScenario } from '../GameScenario';
import { SettingsScenario } from '../SettingsScenario';
import { SoundManager } from '../SoundManager';
import { Sound } from '../SoundManager/types';
import { Timer } from '../Timer';
import { ViewUpdater } from '../ViewUpdater';
import {
    allPanelSkinTypes,
    defaultPlayerSide,
    defaultSkinType
} from './constants';
import { Button, EventTypeMap, GameActionResult, Options } from './types';

export class Battle {
  public readonly fade: Fade;

  public readonly background = new Background(defaultSkinType);

  public readonly draughts = new Chess();

  public readonly settingsPanel = new SettingsPanel();

  public readonly timer = new Timer({ data: { mainTime: 600000, extraTime: 5000 } });

  public readonly resetButton: Button = {
    fade: new Fade({ duration: 300, shown: false, hasUnmount: true }),
    clicker: new Clicker({ enabled: false }),
  };

  public readonly backButton = new Clicker();

  public readonly winPopup = new WinPopup({
    playerSide: defaultPlayerSide,
    isShown: false,
  });

  public readonly lossPopup = new LossPopup({
    playerSide: defaultPlayerSide,
    isShown: false,
  });

  public readonly drawPopup = new DrawPopup({
    playerSide: defaultPlayerSide,
    isShown: false,
  });

  protected readonly _eventEmitter = new EventEmitter<EventTypeMap>();

  protected readonly _soundManager = new SoundManager();

  protected readonly _viewUpdater = new ViewUpdater({
    draughts: this.draughts,
    timer: this.timer,
    background: this.background,
  });

  protected _deferredRunning: Nullable<Deferred<void>> = null;

  protected readonly _startGameAction = new CancellableAction({
    run: async () => {
      this._eventEmitter.emit('start');
      this.resetButton.clicker.enable();

      const result = (await Promise.race([
        this._gameScenario.run().then(() => 'gameOver'),
        this.resetButton.clicker.waitClick().then(() => 'resetButtonClick'),
      ])) as GameActionResult;

      if (result === 'resetButtonClick') {
        this._gameScenario.cancelSoft();
        this.timer.cancel();
      } else if (result === 'settingsButtonClick') {
        this._gameScenario.cancelSoft();
        this.timer.pause();
      }

      this.resetButton.clicker.resetWait();
      this.resetButton.clicker.disable();

      return result;
    },
    done: (result) => {
      if (result === 'gameOver') {
        if (this._gameScenario.gameStatus === 'playerWin') {
          this._soundManager.play(Sound.Win);
          this._storage.setResult({ date: new Date().toISOString(), result: MatchResult.Win })
          this._winPopupAction.run();
        } else if (
          this._gameScenario.gameStatus === 'timeOver' ||
          this._gameScenario.gameStatus === 'playerLoss'
        ) {
          this._soundManager.play(Sound.Lose);
          this._storage.setResult({ date: new Date().toISOString(), result: MatchResult.Loss })
          this._lossPopupAction.run();
        } else {
          this._soundManager.play(Sound.Draw );
          this._storage.setResult({ date: new Date().toISOString(), result: MatchResult.Draw })
          this._drawPopupAction.run();
        }
      } else if (result === 'resetButtonClick') {
        this._eventEmitter.emit('reset');

        this._resetAction.run();
      } else {
        this._transitionToSettingsAction.run();
      }
    },
  });

  protected readonly _gameScenario: GameScenario;

  protected readonly _settingsScenario: SettingsScenario;

  protected readonly _transitionToGameAction = new CancellableAction({
    run: async () => {
      if (this.timer.initialData) {
        this.timer.pause();
        this.timer.position.animateValue('side');
      }
      await Promise.all([
        this.draughts.position.animateValue('center'),
        this.settingsPanel.position.animateValue('corner'),
        this.resetButton.fade.show(),
      ]);
    },
    done: () => {
      this._startGameAction.run()
    },
  });

  protected readonly _resetAction = new CancellableAction({
    run: async () => {
      this.draughts.board.animateResetAllCellsSelectionType();
      this.timer.reset();
      this.timer.cancel();
      await this.draughts.resetPieces();
      await this.draughts.createAndShowPieces();
      this.draughts.resetEngine();
    },
    done: () => this._startGameAction.run(),
  });

  protected readonly _transitionToSettingsAction = new CancellableAction({
    run: async () => {
      this.settingsPanel.setIsSideSelectionEnabled(false);
      this.settingsPanel.setIsTimerSelectionEnabled(false);
      this._updateSettingsPanelSkinButtons();
      this.settingsPanel.submitButton.clicker.enable();

      await Promise.all([
        this.draughts.position.animateValue('side'),
        this.settingsPanel.position.animateValue('side'),
        this.timer.position.animateValue('outside'),
        this.resetButton.fade.hide(),
      ]);
    },
    done: () => this._settingsScenario.run(),
  });

  protected readonly _winPopupAction = new CancellableAction({
    run: async () => {
      this.winPopup.setPlayerSide(this._playerColor);
      await this.winPopup.show();
      await this.winPopup.waitButtonClick();
      await this.winPopup.hide();
    },
    done: () => this._handleAfterBattlePopup(),
  });

  protected readonly _lossPopupAction = new CancellableAction({
    run: async () => {
      this.lossPopup.setPlayerSide(this._playerColor);
      await this.lossPopup.show();
      await this.lossPopup.waitButtonClick();
      await this.lossPopup.hide();
    },
    done: () => this._handleAfterBattlePopup(),
  });

  protected readonly _drawPopupAction = new CancellableAction({
    run: async () => {
      this.drawPopup.setPlayerSide(this._playerColor);
      await this.drawPopup.show();
      await this.drawPopup.waitButtonClick();
      await this.drawPopup.hide();
    },
    done: () => this._handleAfterBattlePopup(),
  });

  protected readonly _repeatAction = new CancellableAction({
    run: async () => {
      this.draughts.board.animateResetAllCellsSelectionType();
      await this.resetButton.fade.hide();
      this.draughts.resetEngine();
      await this.draughts.resetPieces();
      await this.draughts.createAndShowPieces();
      this.settingsPanel.resetStates();
      this.settingsPanel.setIsSideSelectionEnabled(true);
      this.settingsPanel.setIsTimerSelectionEnabled(true);
      this._updateSettingsPanelSkinButtons();
      this.timer.cancel();

      await Promise.all([
        this.draughts.position.animateValue('side'),
        this.settingsPanel.position.animateValue('side'),
        this.timer.position.animateValue('outside'),
      ]);
    },
    done: () => this._settingsScenario.run(),
  });

  protected _storage: StorageStore;

  public constructor(options: Options) {
    this.fade = new Fade({ shown: false, hasUnmount: true });
    this._storage = options.storage;
    this._gameScenario = new GameScenario({
      draughts: this.draughts,
      timer: this.timer,
      soundManager: this._soundManager,
    });
    this._gameScenario.events.on('move', (data) => this._eventEmitter.emit('move', data));
    this._settingsScenario = new SettingsScenario({
      background: this.background,
      draughts: this.draughts,
      settingsPanel: this.settingsPanel,
      timer: this.timer,
      done: async () => {
        this._transitionToGameAction.run();
      },
    });
  }

  public get isHintsEnabled() {
    return this._gameScenario.isHintsEnabled;
  }

  public get events() {
    return new Events({ eventEmitter: this._eventEmitter });
  }

  protected get _playerColor() {
    return this.draughts.board.side;
  }

  public cancel() {
    this._startGameAction.cancelSoft();
    this._gameScenario.cancelSoft();
    this._settingsScenario.cancelSoft();
    this._transitionToGameAction.cancelSoft();
    this._resetAction.cancelSoft();
    this._transitionToSettingsAction.cancelSoft();
    this._winPopupAction.cancelSoft();
    this._lossPopupAction.cancelSoft();
    this._drawPopupAction.cancelSoft();
    this._repeatAction.cancelSoft();
    this.draughts.resetEngine();
    this.draughts.resetPieces();
  }

  public async show() {
    await this.fade.show();
  }

  public async hide() {
    this.cancel();
    await this.fade.hide();
    this.draughts.board.animateResetAllCellsSelectionType();
    this.timer.cancel();
    this.timer.setData(null);
    this.settingsPanel.resetStates();
    this.settingsPanel.setIsSideSelectionEnabled(true);
    this.settingsPanel.setIsTimerSelectionEnabled(true);
    this.draughts.engine
    this.draughts.resetEngine();
  }

  public showInstantly() {
    this.fade.showInstantly();
  }

  public hideInstantly() {
    this.cancel();
    this.fade.hideInstantly();
  }

  public async showOnSettings() {
    this.background.setType(defaultSkinType);
    this.timer.position.setValue('outside');
    this.draughts.position.setValue('side');
    this.draughts.pieces.clearPieces();
    this.resetButton.clicker.disable();
    this.resetButton.fade.hideInstantly();
    this.settingsPanel.resetStates();
    this._updateSettingsPanelSkinButtons();

    await this.show();
    this._settingsScenario.run();
  }

  public async runOnSettings() {
    this._startRunning();
    await this.showOnSettings();
    await this._deferredRunning?.promise;
  }

  public setIsHintsEnabled(isHintsEnabled: boolean) {
    this._gameScenario.setIsHintsEnabled(isHintsEnabled);
    this._settingsScenario.setIsHintsEnabled(isHintsEnabled);
  }

  protected _updateSettingsPanelSkinButtons() {
    this.settingsPanel.setSkinButtonsBySkinTypes(allPanelSkinTypes);
    values(this.settingsPanel.skinButtons).forEach((skinButton) => {
      skinButton.setIsActive(true);
    });
  }

  protected async _handleAfterBattlePopup() {
    this._repeatAction.run();
  }

  protected _startRunning() {
    this._deferredRunning = new Deferred();
  }

  protected _finishRunning() {
    this._deferredRunning?.resolve();
    this._deferredRunning = null;
  }
}
