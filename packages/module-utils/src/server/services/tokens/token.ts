import { customAlphabet, nanoid } from 'nanoid/async';
import { v4 as uuidv4 } from 'uuid';
import * as AlphabetTypes from './alphabet.constants.js';

const DEFAULT_TOKEN_SIZE = 21;

type AlphabetType =
  | 'UPPERCASE_ALPHA'
  | 'LOWERCASE_ALPHA'
  | 'ALPHA'
  | 'NUM'
  | 'ALPHA_NUM'
  | 'UPPERCASE_ALPHA_NUM'
  | 'LOWERCASE_ALPHA_NUM';

const customAlphabetCacheManager: Record<string, () => Promise<string>> = {};

/**
 * Creates a random token with desired alphabets and length.
 *
 * @param options An option.
 */
const createToken = async (
  options: {
    alphabetType?: AlphabetType;
    size?: number;
  } = {}
): Promise<string> => {
  const { alphabetType, size = DEFAULT_TOKEN_SIZE } = options;
  if (alphabetType) {
    const alphabet = AlphabetTypes[alphabetType];
    if (!alphabet) {
      throw new Error(`Invalid alphabet type ${alphabetType}`);
    }

    const cacheKey = `${alphabetType} ${size}`;

    customAlphabetCacheManager[cacheKey] =
      customAlphabetCacheManager[cacheKey] || customAlphabet(alphabet, size);

    return customAlphabetCacheManager[cacheKey]();
  }
  return nanoid(size);
};

export const Token = {
  create: createToken,
  uuid: uuidv4,
};
