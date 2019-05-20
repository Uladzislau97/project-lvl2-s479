import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_1');
const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
const filesPaths = [
  ['__fixtures__/before_1.json', '__fixtures__/after_1.json'],
  ['__fixtures__/before_2.yml', '__fixtures__/after_2.yml'],
  ['__fixtures__/before_3.ini', '__fixtures__/after_3.ini'],
];

test.each(filesPaths)(
  'gendiff for different file types',
  (beforePath, afterPath) => {
    const beforeFullPath = path.resolve(__dirname, beforePath);
    const afterFullPath = path.resolve(__dirname, afterPath);
    const actualDiff = gendiff(beforeFullPath, afterFullPath);
    expect(actualDiff).toBe(expectedDiff);
  },
);
