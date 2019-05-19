import fs from 'fs';
import _ from 'lodash';

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

const gendiff = (beforePath, afterPath) => {
  const beforeContent = fs.readFileSync(beforePath);
  const afterContent = fs.readFileSync(afterPath);
  const beforeData = JSON.parse(beforeContent);
  const afterData = JSON.parse(afterContent);
  const diffData = buildDiffData(beforeData, afterData);
  return renderDiff(diffData);
};

export default gendiff;
