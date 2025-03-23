const oddRow = ['b', 'd', 'f', 'h'];
const evenRow = ['a', 'c', 'e', 'g'];

const getRowNumber = (value: number) => {
  return 8 - Math.floor(value / 4);
}
const getRowLetter = (value: number) => {
  const rowNumber = getRowNumber(value);

  if (rowNumber % 2) {
    return evenRow[value % 4];
  } else {
    return oddRow[value % 4];
  }
}

export const convertMove1DToSquare = (value: number): string => {
  return `${getRowLetter(value)}${getRowNumber(value)}`
}
