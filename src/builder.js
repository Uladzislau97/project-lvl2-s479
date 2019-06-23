import _ from 'lodash';
import NodeTypes from './node-types';

const buildDiffAst = (beforeData, afterData) => {
  const uniqKeys = _.union(_.keys(beforeData), _.keys(afterData));
  const properties = uniqKeys.reduce((acc, key) => {
    if (beforeData[key] instanceof Object && afterData[key] instanceof Object) {
      const value = buildDiffAst(beforeData[key], afterData[key]);
      const type = NodeTypes.complex;
      const propertyNode = { type, key, value };
      return [...acc, propertyNode];
    }
    if (_.has(beforeData, key) && !_.has(afterData, key)) {
      const value = beforeData[key];
      const type = NodeTypes.removed;
      const propertyNode = { type, key, value };
      return [...acc, propertyNode];
    }
    if (!_.has(beforeData, key) && _.has(afterData, key)) {
      const value = afterData[key];
      const type = NodeTypes.added;
      const propertyNode = { type, key, value };
      return [...acc, propertyNode];
    }
    if (beforeData[key] === afterData[key]) {
      const value = beforeData[key];
      const type = NodeTypes.unchanged;
      const propertyNode = { type, key, value };
      return [...acc, propertyNode];
    }
    const value = { old: beforeData[key], new: afterData[key] };
    const type = NodeTypes.updated;
    const propertyNode = { type, key, value };
    return [...acc, propertyNode];
  }, []);
  return { type: NodeTypes.object, properties };
};

export default buildDiffAst;
