import _ from 'lodash';
import NodeTypes from './node-types';

const buildPropertyNode = (key, value, type) => ({ type, key, value });

const buildDiffAst = (beforeData, afterData) => {
  const beforeObjectKeys = Object.keys(beforeData);
  const afterObjectKeys = Object.keys(afterData);
  const addedKeys = _.difference(afterObjectKeys, beforeObjectKeys);
  const changedProperties = beforeObjectKeys.reduce((acc, key) => {
    if (beforeData[key] instanceof Object && afterData[key] instanceof Object) {
      const value = buildDiffAst(beforeData[key], afterData[key]);
      const type = NodeTypes.complex;
      const propertyNode = buildPropertyNode(key, value, type);
      return [...acc, propertyNode];
    }
    if (!_.has(afterData, key)) {
      const value = beforeData[key];
      const type = NodeTypes.removed;
      const propertyNode = buildPropertyNode(key, value, type);
      return [...acc, propertyNode];
    }
    if (beforeData[key] === afterData[key]) {
      const value = beforeData[key];
      const type = NodeTypes.unchanged;
      const propertyNode = buildPropertyNode(key, value, type);
      return [...acc, propertyNode];
    }
    const value = { old: beforeData[key], new: afterData[key] };
    const type = NodeTypes.updated;
    const propertyNode = buildPropertyNode(key, value, type);
    return [...acc, propertyNode];
  }, []);
  const addedProperties = addedKeys.reduce((acc, key) => {
    const value = afterData[key];
    const type = NodeTypes.added;
    const propertyNode = buildPropertyNode(key, value, type);
    return [...acc, propertyNode];
  }, []);
  const properties = _.concat(changedProperties, addedProperties);
  return { type: NodeTypes.object, properties };
};

export default buildDiffAst;
