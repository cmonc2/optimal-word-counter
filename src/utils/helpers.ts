import { loremIpsum } from 'lorem-ipsum';
import fs from 'fs';

export type Options = {
  count?: number | null;
  size?: number | null;
};

/**
 * Checks if a file exists at the given path. If not, creates a new one for testing purposes.
 */
export async function FindOrCreateFile(filePath: string, opts?: Options): Promise<void> {
  if (fs.existsSync(filePath)) {
    return;
  }

  let data: string | Buffer = '';

  if (opts?.count) {
    const utf8Words = [
      'Ernleȝe', 'liðe', 'Laȝamon', 'Leovenaðes', 'þer', 'æðelen', 'Кругом',
      'Sîne', 'klâwen', 'stîget', 'ûf', 'grôzer', 'grâwen', 'tägelîch',
      'пустынных', 'бедный', 'топким', 'там', 'лес', 'солнца', 'Река',
      'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
      'Je', 'peux', 'manger', 'du', 'verre', 'ça', 'fait',
      'obras', 'todo', 'sol', 'debajo', 'es', 'vanidad', 'del',
    ];

    data = loremIpsum({
      count: opts.count,
      format: 'plain',
      random: Math.random,
      suffix: '\n',
      units: 'paragraph',
      words: utf8Words,
    });
  } else if (opts?.size) {
    data = Buffer.alloc(1024 * 1024 * opts.size);
  }

  fs.writeFileSync(filePath, data);
}