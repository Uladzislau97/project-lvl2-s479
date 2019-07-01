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

const renderAst = (properties, depth = 0) => {
  const indentation = ' '.repeat(indentLength * depth);
  const renderProperty = (property) => {
    switch (property.type) {
      case NodeTypes.complex: {
        const value = renderAst(property.value, depth + 1);
        return `${indentation}    ${property.key}: ${value}`;
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
        return property.children.map(renderProperty).join('\n');
      }
      default: {
        throw new Error('Unknown attribute type');
      }
    }
  };
  const renderedProperties = properties.map(renderProperty);
  const finalContent = _.flatten(renderedProperties).join('\n');
  return `{\n${finalContent}\n${indentation}}`;
};

const renderInNestedFormat = data => renderAst(data);

export default renderInNestedFormat;
