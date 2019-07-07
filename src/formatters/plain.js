import _ from 'lodash';
import NodeTypes from '../node-types';

const stringify = (data) => {
  if (_.isObject(data)) return '[complex value]';
  if (_.isString(data)) return `'${data}'`;
  return data;
};

const renderProperties = (properties, parents = []) => {
  const renderProperty = (property) => {
    switch (property.type) {
      case NodeTypes.complex: {
        const newParents = [...parents, property.key];
        return renderProperties(property.children, newParents);
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
        const oldValue = stringify(property.oldValue);
        const newValue = stringify(property.newValue);
        return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
      }
      default: {
        throw new Error(`Unknown attribute type: ${property.type}`);
      }
    }
  };
  return properties
    .filter(prop => prop.type !== NodeTypes.unchanged)
    .map(prop => renderProperty(prop));
};

const renderInPlainFormat = (data) => {
  const renderedProperties = renderProperties(data);
  const content = _.flatten(renderedProperties).join('\n');
  return content;
};

export default renderInPlainFormat;
