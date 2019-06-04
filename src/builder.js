import _ from 'lodash';

const buildPropertyNode = (key, value, state) => ({
  type: 'Property', key, value, state,
});

const buildDiffAst = (beforeData, afterData) => {
  const beforeObjectKeys = Object.keys(beforeData);
  const afterObjectKeys = Object.keys(afterData);
  const addedKeys = _.difference(afterObjectKeys, beforeObjectKeys);
  const changedProperties = beforeObjectKeys.reduce((acc, key) => {
    if (beforeData[key] instanceof Object && afterData[key] instanceof Object) {
      const value = buildDiffAst(beforeData[key], afterData[key]);
      const state = 'complex';
      const propertyNode = buildPropertyNode(key, value, state);
      return [...acc, propertyNode];
    }
    if (!_.has(afterData, key)) {
      const value = beforeData[key];
      const state = 'removed';
      const propertyNode = buildPropertyNode(key, value, state);
      return [...acc, propertyNode];
    }
    if (beforeData[key] === afterData[key]) {
      const value = beforeData[key];
      const state = 'unchanged';
      const propertyNode = buildPropertyNode(key, value, state);
      return [...acc, propertyNode];
    }
    const value = { old: beforeData[key], new: afterData[key] };
    const state = 'changed';
    const propertyNode = buildPropertyNode(key, value, state);
    return [...acc, propertyNode];
  }, []);
  const addedProperties = addedKeys.reduce((acc, key) => {
    const value = afterData[key];
    const state = 'added';
    const propertyNode = buildPropertyNode(key, value, state);
    return [...acc, propertyNode];
  }, []);
  const properties = _.concat(changedProperties, addedProperties);
  return { type: 'Object', properties };
};

export default buildDiffAst;
