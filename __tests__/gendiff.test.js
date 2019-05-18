import fs from 'fs';
import path from 'path';
import gendiff from '../src';

test('gendiff', () => {
  const diffFullPath = path.resolve(__dirname, '__fixtures__/diff_1');
  const expectedDiff = fs.readFileSync(diffFullPath, 'utf8');
  const actualDiff = gendiff(
    '__fixtures__/before_1.json',
    '__fixtures__/after_1.json',
  );
  expect(actualDiff).toBe(expectedDiff);
});
