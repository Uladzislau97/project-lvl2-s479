import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers';

const buildDiffData = (beforeData, afterData) => {
  const beforeObjectKeys = Object.keys(beforeData);
  const afterObjectKeys = Object.keys(afterData);
  const allKeys = _.concat(beforeObjectKeys, afterObjectKeys);
  const uniqKeysSet = new Set(allKeys);
  const uniqKeys = [...uniqKeysSet];
  return uniqKeys.reduce((acc, key) => {
    if (!_.has(beforeData, key)) {
      return [...acc, { sign: '+', key, value: afterData[key] }];
    }
    if (!_.has(afterData, key)) {
      return [...acc, { sign: '-', key, value: beforeData[key] }];
    }
    if (beforeData[key] === afterData[key]) {
      return [...acc, { sign: ' ', key, value: beforeData[key] }];
    }
    return [
      ...acc,
      { sign: '-', key, value: beforeData[key] },
      { sign: '+', key, value: afterData[key] },
    ];
  }, []);
};

const renderDiff = (diffData) => {
  const result = diffData.map(
    ({ sign, key, value }) => `  ${sign} ${key}: ${value}`,
  );
  return ['{', ...result, '}'].join('\n');
};

const getFileData = (filepath) => {
  const extname = path.extname(filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  return parse(content, extname);
};

const gendiff = (beforePath, afterPath) => {
  const beforeData = getFileData(beforePath);
  const afterData = getFileData(afterPath);
  const diffData = buildDiffData(beforeData, afterData);
  return renderDiff(diffData);
};

export default gendiff;
