import { map, values } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { ChessSkinType } from 'src/components/Battle/types';
import { Scroller } from 'src/components/Scroller/store/Scroller';
import { Clicker } from 'src/shared/classes/Clicker';
import { getElementSize } from 'src/shared/helpers/getElementSize';
import { getPointByRelativeElement } from 'src/shared/helpers/getPointByRelativeElement';
import { getPositionFromPoint } from 'src/shared/helpers/getPositionFromPoint';
import { Nullable } from 'src/types';
import { AnimatableValue } from '../../../../store/AnimatableValue';
import { Radio } from './Radio';
import { SkinButton } from './SkinButton';
import { DifficultyRadios, Options, PositionValue, RuleRadios, SkinButtons, SkinButtonsData, TimerRadios } from './types';

export class SettingsPanel {
  public readonly position = new AnimatableValue<PositionValue>('side');

  public readonly scroller = new Scroller();

  public readonly sideRadios = {
    blackSide: new Radio({
      content: 'за чёрных',
    }),
    whiteSide: new Radio({
      content: 'за белых',
    }),
  };

  public readonly timerRadios: TimerRadios = {
    timerNo: new Radio({ content: 'нет' }),
    timer10: new Radio({ content: '10 мин' }),
    timer15: new Radio({ content: '15 мин' }),
    timer30: new Radio({ content: '30 мин' }),
  };

  public readonly difficultyRadios: DifficultyRadios = {
    easy: new Radio({ content: 'новичок' }),
    medium: new Radio({ content: 'любитель' }),
    hard: new Radio({ content: 'эксперт' }),
  };

  public readonly ruleRadios: RuleRadios = {
    wcdf: new Radio({ content: 'WCDF' }),
  };

  public readonly submitButton = {
    clicker: new Clicker({ enabled: false }),
  };

  protected _bubblesParent: Nullable<HTMLDivElement> = null;

  @observable
  protected _scrollbar = {
    y: 0,
    height: 0,
  };

  protected readonly _skinButtonsData: SkinButtonsData = [
    {
      skinType: ChessSkinType.Default,
    },
    {
      skinType: ChessSkinType.Type1,
    },
    {
      skinType: ChessSkinType.Type2,
    },
  ];

  @observable
  protected _skinButtons!: SkinButtons;

  @observable
  protected _isSideSelectionEnabled = true;

  @observable
  protected _isTimerSelectionEnabled = true;

  public constructor(options?: Options) {
    makeObservable(this);
    this.scroller.events.on('refChange', this._handleScrollerRefChange);
    this.scroller.events.on('scroll', this._handleScrollerScroll);
    this._initSkinButtons(options);
  }

  public get scrollbar() {
    return this._scrollbar;
  }

  public get skinButtons() {
    return this._skinButtons;
  }

  public get selectedSkinTypeOrDefault() {
    const skinButtons = values(this.skinButtons);
    const skinType = skinButtons.find((skinButton) => skinButton.isSelected)?.skinType ?? ChessSkinType.Default;
    return skinType;
  }

  @action.bound
  public setIsSideSelectionEnabled(isSideSelectionEnabled: boolean) {
    this._isSideSelectionEnabled = isSideSelectionEnabled;
  }

  @action.bound
  public setIsTimerSelectionEnabled(isTimerSelectionEnabled: boolean) {
    this._isTimerSelectionEnabled = isTimerSelectionEnabled;
  }

  public resetStates() {
    values(this.sideRadios).forEach((radio) => {
      radio.setIsSelected(false);
      radio.clicker.disable();
    });
    values(this.timerRadios).forEach((radio) => {
      radio.setIsSelected(false);
      radio.clicker.disable();
    });
    values(this.skinButtons).forEach((skinButton) => {
      skinButton.setIsSelected(false);
      skinButton.clicker.disable();
    });
    values(this.ruleRadios).forEach((skinButton) => {
      skinButton.setIsSelected(false);
      skinButton.clicker.disable();
    });
    values(this.difficultyRadios).forEach((skinButton) => {
      skinButton.setIsSelected(false);
      skinButton.clicker.disable();
    });
    this.position.setValue('side');
    this.submitButton.clicker.disable();
  }

  @action.bound
  public setSkinButtonsBySkinTypes(skinTypes: ChessSkinType[]) {
    this._skinButtons = this._skinButtonsData
      .filter((data) => skinTypes.includes(data.skinType))
      .map(
        (data) =>
          new SkinButton({
            skinType: data.skinType as ChessSkinType,
          }),
      );
  }

  public getSkinButtonBySkinType(skinType: ChessSkinType) {
    const skinButton = this.skinButtons.find((skinButton) => skinButton.skinType === skinType);

    if (!skinButton) {
      throw new Error(`SkinButton with specified skinType (${skinType}) does not exist`);
    }

    return skinButton;
  }

  public getTimerRadioNameIfSelected() {
    const entries = Object.entries(this.timerRadios);
    const selectedEntry = entries.find(([, radio]) => radio.isSelected);
    if (selectedEntry) return selectedEntry[0] as keyof TimerRadios;
    return null;
  }

  protected _initSkinButtons(options?: Options) {
    if (options?.skinTypes) {
      this.setSkinButtonsBySkinTypes(options.skinTypes);
    } else {
      this.setSkinButtonsBySkinTypes(map(this._skinButtonsData, 'skinType'));
    }
  }

  @action.bound
  protected _handleScrollerRefChange() {
    this._updateScrollbar();
  }

  @action.bound
  protected _handleScrollerScroll() {
    this._updateScrollbar();
  }

  @action.bound
  protected _updateScrollbar() {
    const element = this.scroller.element;
    if (!element) return;
    const elementHeight =
      element.offsetHeight - parseFloat(getComputedStyle(element).paddingBottom);
    const ratio = elementHeight / element.scrollHeight;
    this._scrollbar = {
      y: this.scroller.scrollPoint.y * ratio,
      height: elementHeight * ratio,
    };
  }

  protected _getSkinButtonSizePercentage(skinButton: SkinButton) {
    const bubblesParent = this._bubblesParent;
    const skinButtonElement = skinButton.ref.current;

    if (!bubblesParent || !skinButtonElement) {
      return { width: 0, height: 0 };
    }

    const skinButtonSize = getElementSize(skinButtonElement);
    const skinButtonSizePercentage = {
      width: (skinButtonSize.width / bubblesParent.offsetWidth) * 100,
      height: (skinButtonSize.height / bubblesParent.offsetHeight) * 100,
    };
    return skinButtonSizePercentage;
  }

  protected _getSkinButtonPositionPercentage(skinButton: SkinButton) {
    const bubblesParent = this._bubblesParent;
    const skinButtonElement = skinButton.ref.current;

    if (!bubblesParent || !skinButtonElement) {
      return { left: 0, top: 0 };
    }

    const skinButtonPosition = getPositionFromPoint(
      getPointByRelativeElement(skinButtonElement, bubblesParent),
    );
    const skinButtonPositionPercentage = {
      left: (skinButtonPosition.left / bubblesParent.offsetWidth) * 100,
      top: (skinButtonPosition.top / bubblesParent.offsetHeight) * 100,
    };
    return skinButtonPositionPercentage;
  }
}
