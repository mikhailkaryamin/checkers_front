import { Nullable } from 'src/types';
import { TimerRadios } from '../../components/SettingsPanel/store/SettingsPanel/types';
import { Data as TimerData } from '../Timer/types';

export const possibleTimerData: Record<keyof TimerRadios, Nullable<TimerData>> = {
  timerNo: null,
  timer10: {
    mainTime: 600000,
    extraTime: 5000,
  },
  timer15: {
    mainTime: 900000,
    extraTime: 10000,
  },
  timer30: {
    mainTime: 1800000,
    extraTime: 0,
  },
};
