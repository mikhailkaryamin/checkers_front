import { DraughtsPlayer } from 'rapid-draughts';
import { ChessSkinType } from 'src/components/Battle/types';
import { Side } from 'src/types';
import { NewSkinType } from '../../components/Popup/store/Popup/types';

export const defaultNewSkinType: NewSkinType = 'type2';

export const defaultPlayerSide: Side = DraughtsPlayer.LIGHT;

export const defaultSkinType: ChessSkinType = ChessSkinType.Default;

export const allPanelSkinTypes: ChessSkinType[] = [
  ChessSkinType.Default,
  ChessSkinType.Type1,
  ChessSkinType.Type2,
];
