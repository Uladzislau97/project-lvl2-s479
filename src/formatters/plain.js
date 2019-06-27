import _ from 'lodash';
import NodeTypes from '../node-types';

const stringify = (data) => {
  if (_.isObject(data)) return '[complex value]';
  if (_.isString(data)) return `'${data}'`;
  return data;
};

const renderInPlainFormat = (properties) => {
  const renderProperty = (property, parents = []) => {
    switch (property.type) {
      case NodeTypes.complex: {
        const newParents = [...parents, property.key];
        return property.value
          .filter(prop => prop.type !== NodeTypes.unchanged)
          .map(prop => renderProperty(prop, newParents));
      }
      case NodeTypes.added: {
        const propertyName = [...parents, property.key].join('.');
        const value = stringify(property.value);
        return `Property '${propertyName}' was added with value: ${value}`;
      }
      case NodeTypes.removed: {
        const propertyName = [...parents, property.key].join('.');
        return `Property '${propertyName}' was removed`;
      }
      case NodeTypes.updated: {
        const propertyName = [...parents, property.key].join('.');
        const [oldNode, newNode] = property.children;
        const oldValue = stringify(oldNode.value);
        const newValue = stringify(newNode.value);
        return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
      }
      default: return '';
    }
  };
  const renderedProperties = properties
    .filter(prop => prop.type !== NodeTypes.unchanged)
    .map(prop => renderProperty(prop));
  const finalContent = _.flatten(renderedProperties).join('\n');
  return finalContent;
};

export default renderInPlainFormat;
