import { UAParser } from 'ua-parser-js';

export const checkIfIOS = () => {
  const parser = new UAParser();
  return parser.getOS().name === 'iOS';
};
