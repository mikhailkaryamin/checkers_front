import { Clicker } from 'src/shared/classes/Clicker';

export const waitFirstClicker = async (clickers: Clicker[]) => {
  const { clicker, index } = await Promise.race(
    clickers.map(async (clicker, index) => {
      await clicker.waitClick();
      return { clicker, index };
    }),
  );

  clickers.forEach((clicker) => clicker.resetWait());

  return { clicker, index };
};
