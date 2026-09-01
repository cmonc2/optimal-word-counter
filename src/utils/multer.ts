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
   * @param  {Request} req
   * @param  {Express.Multer.File} file
   * @param  {(error?: any, info?: FileResult) => void} cb
   * * Includes the quantity requested most frequent words of the file in the object returned by multer
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

    // Process stream line-by-line using line-reader
    lineReader.eachLine(file.stream, (line: string, last: boolean) => {
      // Split by non-alphanumeric unicode characters to support multi-language UTF-8 text
      const words = line.trim().split(/[^\p{L}\p{N}']+/gu);

      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase();
        if (!word) continue;

        // O(1) frequency tallying
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }

      if (last) {
        const wordList: string[] = Object.keys(wordCounts);

        // Sort by frequency descending, then alphabetically ascending
        TimSort.sort(wordList, (a: string, b: string) => {
          if (wordCounts[a] < wordCounts[b]) return 1;
          if (wordCounts[a] === wordCounts[b] && a > b) return 1;
          return -1;
        });

        const requestedTop = Math.max(1, parseInt(req.params.top, 10) || 10);
        const length: number = Math.min(wordList.length, requestedTop);
        const frecuencies = wordList.slice(0, length).map(w => ({ word: w, count: wordCounts[w] }));

        cb(null, { frecuencies });
      }
    });
  };

  /**
   * @param  {Request} _req
   * @param  {Express.Multer.File} _file
   * @param  {(error: Error | null) => void} cb
   * ! Required by IStorageEngine interface
   */
  _removeFile = (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ): void => {
    cb(null);
  };
}

// Upload size limitations (1GB maximum)
const limits = {
  fileSize: 1_000_000_000,
  files: 1,
};

const uploader = multer({
  storage: new TextReaderEngine(),
  limits,
}).single('file');

export default uploader;