import fs from 'fs';

/**
 * Gets JSON file content.
 *
 * @param filePath A path to a file.
 */
export const getJsonFromFile = (filePath: string): any => {
  const text = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(text);
};

/**
 * Gets JSON file content.
 *
 * @param filePath A path to a file.
 */
export const getJsonFromFileAsync = async (filePath: string): Promise<any> => {
  const text = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(text);
};
