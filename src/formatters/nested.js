import NodeTypes from '../node-types';

const indent = ' ';
const initialIndentSize = 0;
const smallIndentSize = 2;
const bigIndentSize = 4;

const stringifyObjectByProperties = (properties, indentSize) => {
  const indentation = indent.repeat(indentSize);
  return `{\n${properties}\n${indentation}}`;
};

const stringify = (data, indentSize) => {
  if (!(data instanceof Object)) {
    return data;
  }
  const properties = Object.keys(data)
    .map((key) => {
      const value = stringify(data[key], indentSize + bigIndentSize);
      const indentation = indent.repeat(indentSize + bigIndentSize);
      return `${indentation}${key}: ${value}`;
    });
  return stringifyObjectByProperties(properties, indentSize);
};

const renderIter = (data, indentSize) => {
  if (data.type === NodeTypes.object) {
    const properties = data.properties.map(
      prop => renderIter(prop, indentSize + smallIndentSize),
    ).join('\n');
    return stringifyObjectByProperties(properties, indentSize);
  }
  if (data.type === NodeTypes.complex) {
    const value = renderIter(data.value, indentSize + smallIndentSize);
    const indentation = indent.repeat(indentSize);
    return `${indentation}  ${data.key}: ${value}`;
  }
  if (data.type === NodeTypes.unchanged) {
    const value = stringify(data.value, indentSize + smallIndentSize);
    const indentation = indent.repeat(indentSize);
    return `${indentation}  ${data.key}: ${value}`;
  }
  if (data.type === NodeTypes.removed) {
    const value = stringify(data.value, indentSize + smallIndentSize);
    const indentation = indent.repeat(indentSize);
    return `${indentation}- ${data.key}: ${value}`;
  }
  if (data.type === NodeTypes.added) {
    const value = stringify(data.value, indentSize + smallIndentSize);
    const indentation = indent.repeat(indentSize);
    return `${indentation}+ ${data.key}: ${value}`;
  }
  const oldValue = stringify(data.value.old, indentSize + smallIndentSize);
  const newValue = stringify(data.value.new, indentSize + smallIndentSize);
  const indentation = indent.repeat(indentSize);
  return `${indentation}- ${data.key}: ${oldValue}\n${indentation}+ ${data.key}: ${newValue}`;
};

const renderInNestedFormat = data => renderIter(data, initialIndentSize);

export default renderInNestedFormat;
