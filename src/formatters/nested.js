import _ from 'lodash';
import NodeTypes from '../node-types';

const indentLength = 4;

const stringify = (data, depth) => {
  if (!_.isObject(data)) return data;
  const indentation = ' '.repeat(indentLength * depth);
  const properties = _.keys(data).map((key) => {
    const value = stringify(data[key], depth);
    return `${indentation}    ${key}: ${value}`;
  });
  return `{\n${properties}\n${indentation}}`;
};

const renderProperties = (properties, depth = 0) => {
  const indentation = ' '.repeat(indentLength * depth);
  const renderProperty = (property) => {
    switch (property.type) {
      case NodeTypes.complex: {
        const children = renderProperties(property.children, depth + 1);
        return `${indentation}    ${property.key}: ${children}`;
      }
      case NodeTypes.unchanged: {
        const value = stringify(property.value, depth + 1);
        return `${indentation}    ${property.key}: ${value}`;
      }
      case NodeTypes.removed: {
        const value = stringify(property.value, depth + 1);
        return `${indentation}  - ${property.key}: ${value}`;
      }
      case NodeTypes.added: {
        const value = stringify(property.value, depth + 1);
        return `${indentation}  + ${property.key}: ${value}`;
      }
      case NodeTypes.updated: {
        const oldValue = stringify(property.oldValue, depth + 1);
        const newValue = stringify(property.newValue, depth + 1);
        return [
          `${indentation}  - ${property.key}: ${oldValue}`,
          `${indentation}  + ${property.key}: ${newValue}`,
        ];
      }
      default: {
        throw new Error(`Unknown attribute type: ${property.type}`);
      }
    }
  };
  const renderedProperties = properties.map(renderProperty);
  const content = _.flatten(renderedProperties).join('\n');
  return `{\n${content}\n${indentation}}`;
};

const renderInNestedFormat = data => renderProperties(data);

export default renderInNestedFormat;
