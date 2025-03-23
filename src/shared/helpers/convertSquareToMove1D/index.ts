const columns = [['a', 'b'], ['c', 'd'], ['e', 'f'], ['g', 'h']];

export const convertSquareToMove1D = (value: string): number => {
  const letter = value[0];
  const row = Number(value[1]);

  const numberByLetter = Number(columns.findIndex((el) => el.includes(letter)));
  const numberByRow = (8 - row) * 4;

  return numberByLetter + numberByRow;
}
