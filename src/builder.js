import _ from 'lodash';

const buildPropertyNode = (key, value, sign = ' ') => ({
  type: 'Property', sign, key, value,
});

const buildDiffAst = (beforeData, afterData) => {
  const beforeObjectKeys = Object.keys(beforeData);
  const afterObjectKeys = Object.keys(afterData);
  const allKeys = _.concat(beforeObjectKeys, afterObjectKeys);
  const keysSet = new Set(allKeys);
  const uniqKeys = [...keysSet];
  const properties = uniqKeys.reduce((acc, key) => {
    if (beforeData[key] instanceof Object && afterData[key] instanceof Object) {
      const propertyNode = buildPropertyNode(key, buildDiffAst(beforeData[key], afterData[key]));
      return [...acc, propertyNode];
    }
    if (!_.has(beforeData, key) || !_.has(afterData, key)) {
      const propertyNode = _.has(beforeData, key)
        ? buildPropertyNode(key, beforeData[key], '-')
        : buildPropertyNode(key, afterData[key], '+');
      return [...acc, propertyNode];
    }
    if (beforeData[key] === afterData[key]) {
      const propertyNode = buildPropertyNode(key, beforeData[key]);
      return [...acc, propertyNode];
    }
    const deletedPropertyNode = buildPropertyNode(key, beforeData[key], '-');
    const addedPropertyNode = buildPropertyNode(key, afterData[key], '+');
    return [...acc, deletedPropertyNode, addedPropertyNode];
  }, []);
  return { type: 'Diff', properties };
};

export default buildDiffAst;
