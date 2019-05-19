import fs from 'fs';
import path from 'path';
import gendiff from '../src';

test('gendiff', () => {
  const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_1');
  const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
  const beforeFullPath = path.resolve(__dirname, '__fixtures__/before_1.json');
  const afterFullPath = path.resolve(__dirname, '__fixtures__/after_1.json');
  const actualDiff = gendiff(beforeFullPath, afterFullPath);
  expect(actualDiff).toBe(expectedDiff);
});
