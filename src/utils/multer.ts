import multer from 'multer';
import { Request } from 'express';
import lineReader from 'line-reader';
import TimSort from 'timsort';

interface FileResult extends Partial<Express.Multer.File> {
  frecuencies: { word: string; count: number }[];
}

class TextReaderEngine implements multer.StorageEngine {
  constructor() {}

  /**
   * @param  {Request} _req
   * @param  {Express.Multer.File} file
   * @param  {(error:Error|null)=>void} cb
   * * Includes the quantity requested most frequented words of the file in the object returned by multer
   */
  _handleFile = (
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: FileResult) => void,
  ): void => {
    const wordCounts: Record<string, number> = {};

    // ! Do not use encoding value of file since it is deprecated.
    if (file.mimetype !== 'text/plain') {
      cb(new Error('File not supported'));
      return;
    }

    // go through each line of stream (using line-reader)
    lineReader.eachLine(file.stream, (line: string, last: boolean) => {
      // clean up punctuation and split by spaces/tabs/newlines
      // Using Unicode property escapes (\p{L} for letters, \p{N} for numbers)
      // to support multi-language UTF-8 text and ignore punctuation.
      const words = line.trim().split(/[^\p{L}\p{N}']+/gu);

      // iterate array of words and stack each one
      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase();

        if (!word) continue;

        if (Object.prototype.hasOwnProperty.call(wordCounts, word)) {
          wordCounts[word]++;
        } else {
          wordCounts[word] = 1;
        }
      }

      if (last) {
        const wordList: string[] = Object.keys(wordCounts);

        // sort the most frequent words (descending by frequency, then alphabetically)
        TimSort.sort(wordList, (a: string, b: string) => {
          if (wordCounts[a] < wordCounts[b]) return 1;

          if (wordCounts[a] === wordCounts[b] && a > b) return 1;

          return -1;
        });

        const length: number =
          wordList.length > Number(req.params.top)
            ? Number(req.params.top)
            : wordList.length;
        const frecuencies: { word: string; count: number }[] = [];

        // build up JSON to return according to the values found and the top parameter
        for (let i = 0; i < length; i++) {
          const w = wordList[i];
          const c = wordCounts[w];
          frecuencies.push({ word: w, count: c });
        }

        cb(null, { frecuencies });
      }
    });
  };

  /**
   * @param  {Request} _req
   * @param  {Express.Multer.File} file
   * @param  {(error:Error|null)=>void} cb
   * * Function not used since we are not storing the file
   * ! Do not remove, it is required by IStorageEngine
   */
  _removeFile = (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ): void => {
    cb(null);
  };
}

// customized options limitations
const limits = {
  fileSize: 1000000000, //1gb
  files: 1,
};

const uploader = multer({
  storage: new TextReaderEngine(),
  limits,
}).single('file');

export default uploader;