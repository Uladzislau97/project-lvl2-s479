import fs from 'fs';
import path from 'path';
import gendiff from '../src';

describe('nested format', () => {
  describe('data without nestings', () => {
    const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_1');
    const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
    const filesPaths = [
      ['__fixtures__/before_1.json', '__fixtures__/after_1.json'],
      ['__fixtures__/before_2.yml', '__fixtures__/after_2.yml'],
      ['__fixtures__/before_3.ini', '__fixtures__/after_3.ini'],
    ];

    test.each(filesPaths)(
      'return correct diff for different file types',
      (beforePath, afterPath) => {
        const beforeFullPath = path.resolve(__dirname, beforePath);
        const afterFullPath = path.resolve(__dirname, afterPath);
        const actualDiff = gendiff(beforeFullPath, afterFullPath);
        expect(actualDiff).toBe(expectedDiff);
      },
    );
  });

  describe('data with nestings', () => {
    const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_2');
    const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
    const filesPaths = [
      ['__fixtures__/before_4.json', '__fixtures__/after_4.json'],
      ['__fixtures__/before_5.yml', '__fixtures__/after_5.yml'],
      ['__fixtures__/before_6.ini', '__fixtures__/after_6.ini'],
    ];

    test.each(filesPaths)(
      'return correct diff for different file types',
      (beforePath, afterPath) => {
        const beforeFullPath = path.resolve(__dirname, beforePath);
        const afterFullPath = path.resolve(__dirname, afterPath);
        const actualDiff = gendiff(beforeFullPath, afterFullPath);
        expect(actualDiff).toBe(expectedDiff);
      },
    );
  });
});

describe('plain format', () => {
  const format = 'plain';
  const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_3');
  const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
  const filesPaths = [
    ['__fixtures__/before_4.json', '__fixtures__/after_4.json'],
    ['__fixtures__/before_5.yml', '__fixtures__/after_5.yml'],
    ['__fixtures__/before_6.ini', '__fixtures__/after_6.ini'],
  ];

  test.each(filesPaths)(
    'return correct diff for different file types',
    (beforePath, afterPath) => {
      const beforeFullPath = path.resolve(__dirname, beforePath);
      const afterFullPath = path.resolve(__dirname, afterPath);
      const actualDiff = gendiff(beforeFullPath, afterFullPath, format);
      expect(actualDiff).toBe(expectedDiff);
    },
  );
});

describe('json format', () => {
  const format = 'json';
  const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_4');
  const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
  const filesPaths = [
    ['__fixtures__/before_4.json', '__fixtures__/after_4.json'],
    ['__fixtures__/before_5.yml', '__fixtures__/after_5.yml'],
    ['__fixtures__/before_6.ini', '__fixtures__/after_6.ini'],
  ];

  test.each(filesPaths)(
    'return correct diff for different file types',
    (beforePath, afterPath) => {
      const beforeFullPath = path.resolve(__dirname, beforePath);
      const afterFullPath = path.resolve(__dirname, afterPath);
      const actualDiff = gendiff(beforeFullPath, afterFullPath, format);
      expect(actualDiff).toBe(expectedDiff);
    },
  );
});
