import _ from 'lodash';

const buildPropertyNode = (key, value, sign = ' ') => ({
  type: 'Property', sign, key, value,
});

const buildNodeValue = (valueData) => {
  if (!(valueData instanceof Object)) {
    return valueData;
  }
  const properties = Object.keys(valueData).reduce((acc, key) => {
    const valueAst = buildPropertyNode(key, buildNodeValue(valueData[key]));
    return [...acc, valueAst];
  }, []);
  return { type: 'Object', properties };
};

const buildDiffAst = (beforeData, afterData) => {
  const beforeObjectKeys = Object.keys(beforeData);
  const afterObjectKeys = Object.keys(afterData);
  const allKeys = _.concat(beforeObjectKeys, afterObjectKeys);
  const keysSet = new Set(allKeys);
  const uniqKeys = [...keysSet];
  const properties = uniqKeys.reduce((acc, key) => {
    if (!_.has(beforeData, key) || !_.has(afterData, key)) {
      const propertyNode = _.has(beforeData, key)
        ? buildPropertyNode(key, buildNodeValue(beforeData[key]), '-')
        : buildPropertyNode(key, buildNodeValue(afterData[key]), '+');
      return [...acc, propertyNode];
    }
    if (beforeData[key] instanceof Object && afterData[key] instanceof Object) {
      return [
        ...acc,
        buildPropertyNode(key, buildDiffAst(beforeData[key], afterData[key])),
      ];
    }
    if (beforeData[key] === afterData[key]) {
      const propertyNode = buildPropertyNode(key, buildNodeValue(beforeData[key]));
      return [...acc, propertyNode];
    }
    return [
      ...acc,
      buildPropertyNode(key, buildNodeValue(beforeData[key]), '-'),
      buildPropertyNode(key, buildNodeValue(afterData[key]), '+'),
    ];
  }, []);
  return { type: 'Object', properties };
};

export default buildDiffAst;
