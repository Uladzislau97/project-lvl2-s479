import _ from 'lodash';
import AstNodeAttributes from './ast-node-attributes';

const buildPropertyNode = (key, value, state) => ({
  type: AstNodeAttributes.type.property, key, value, state,
});

const buildDiffAst = (beforeData, afterData) => {
  const beforeObjectKeys = Object.keys(beforeData);
  const afterObjectKeys = Object.keys(afterData);
  const addedKeys = _.difference(afterObjectKeys, beforeObjectKeys);
  const changedProperties = beforeObjectKeys.reduce((acc, key) => {
    if (beforeData[key] instanceof Object && afterData[key] instanceof Object) {
      const value = buildDiffAst(beforeData[key], afterData[key]);
      const state = AstNodeAttributes.propertyState.complex;
      const propertyNode = buildPropertyNode(key, value, state);
      return [...acc, propertyNode];
    }
    if (!_.has(afterData, key)) {
      const value = beforeData[key];
      const state = AstNodeAttributes.propertyState.removed;
      const propertyNode = buildPropertyNode(key, value, state);
      return [...acc, propertyNode];
    }
    if (beforeData[key] === afterData[key]) {
      const value = beforeData[key];
      const state = AstNodeAttributes.propertyState.unchanged;
      const propertyNode = buildPropertyNode(key, value, state);
      return [...acc, propertyNode];
    }
    const value = { old: beforeData[key], new: afterData[key] };
    const state = AstNodeAttributes.propertyState.updated;
    const propertyNode = buildPropertyNode(key, value, state);
    return [...acc, propertyNode];
  }, []);
  const addedProperties = addedKeys.reduce((acc, key) => {
    const value = afterData[key];
    const state = AstNodeAttributes.propertyState.added;
    const propertyNode = buildPropertyNode(key, value, state);
    return [...acc, propertyNode];
  }, []);
  const properties = _.concat(changedProperties, addedProperties);
  return { type: AstNodeAttributes.type.object, properties };
};

export default buildDiffAst;
