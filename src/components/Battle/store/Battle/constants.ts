import { DraughtsPlayer } from 'rapid-draughts';
import { DraughtsSkinType } from 'src/components/Battle/types';
import { Side } from 'src/types';

export const defaultPlayerSide: Side = DraughtsPlayer.LIGHT;

export const defaultSkinType: DraughtsSkinType = DraughtsSkinType.Default;

export const allPanelSkinTypes: DraughtsSkinType[] = [
  DraughtsSkinType.Default,
  DraughtsSkinType.Type1,
  DraughtsSkinType.Type2,
];
