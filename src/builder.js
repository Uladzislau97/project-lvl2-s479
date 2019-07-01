import _ from 'lodash';
import NodeTypes from './node-types';

const detectType = (key, beforeData, afterData) => {
  if (_.isObject(beforeData[key]) && _.isObject(afterData[key])) {
    return NodeTypes.complex;
  }
  if (_.has(beforeData, key) && !_.has(afterData, key)) {
    return NodeTypes.removed;
  }
  if (!_.has(beforeData, key) && _.has(afterData, key)) {
    return NodeTypes.added;
  }
  if (beforeData[key] === afterData[key]) {
    return NodeTypes.unchanged;
  }
  if (beforeData[key] !== afterData[key]) {
    return NodeTypes.updated;
  }
  return '';
};

const buildDiffAst = (beforeData, afterData) => {
  const uniqKeys = _.union(_.keys(beforeData), _.keys(afterData));
  const properties = uniqKeys.reduce((acc, key) => {
    const type = detectType(key, beforeData, afterData);
    switch (type) {
      case NodeTypes.complex: {
        const children = buildDiffAst(beforeData[key], afterData[key]);
        const propertyNode = { type, key, children };
        return [...acc, propertyNode];
      }
      case NodeTypes.removed: {
        const value = beforeData[key];
        const propertyNode = { type, key, value };
        return [...acc, propertyNode];
      }
      case NodeTypes.added: {
        const value = afterData[key];
        const propertyNode = { type, key, value };
        return [...acc, propertyNode];
      }
      case NodeTypes.unchanged: {
        const value = beforeData[key];
        const propertyNode = { type, key, value };
        return [...acc, propertyNode];
      }
      case NodeTypes.updated: {
        const oldValue = beforeData[key];
        const oldType = NodeTypes.removed;
        const oldPropertyNode = { type: oldType, key, value: oldValue };
        const newValue = afterData[key];
        const newType = NodeTypes.added;
        const newPropertyNode = { type: newType, key, value: newValue };
        const value = [oldPropertyNode, newPropertyNode];
        const propertyNode = { type, key, value };
        return [...acc, propertyNode];
      }
      default: {
        throw new Error('Unknown attribute type');
      }
    }
  }, []);
  return properties;
};

export default buildDiffAst;
