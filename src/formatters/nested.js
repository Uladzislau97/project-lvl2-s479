import NodeTypes from '../node-types';

const indentLength = 4;
const spaceForSignLength = 2;

const stringify = (data, depth) => {
  if (!(data instanceof Object)) {
    return data;
  }
  const properties = Object.keys(data).map((key) => {
    const currentDepth = depth + 1;
    const value = stringify(data[key], currentDepth);
    const indentationLength = indentLength * currentDepth;
    const indentation = ' '.repeat(indentationLength);
    return `${indentation}${key}: ${value}`;
  });
  const indentation = ' '.repeat(indentLength * depth);
  return `{\n${properties}\n${indentation}}`;
};

const renderIter = (data, depth = 0) => {
  switch (data.type) {
    case NodeTypes.object: {
      const properties = data.properties.map(
        prop => renderIter(prop, depth + 1),
      ).join('\n');
      const indentationLength = indentLength * depth;
      const indentation = ' '.repeat(indentationLength);
      return `{\n${properties}\n${indentation}}`;
    }
    case NodeTypes.complex: {
      const value = renderIter(data.value, depth);
      const indentationLength = indentLength * depth;
      const indentation = ' '.repeat(indentationLength);
      return `${indentation}${data.key}: ${value}`;
    }
    case NodeTypes.unchanged: {
      const value = stringify(data.value, depth);
      const indentationLength = indentLength * depth;
      const indentation = ' '.repeat(indentationLength);
      return `${indentation}${data.key}: ${value}`;
    }
    case NodeTypes.removed: {
      const value = stringify(data.value, depth);
      const indentationLength = indentLength * depth - spaceForSignLength;
      const indentation = ' '.repeat(indentationLength);
      return `${indentation}- ${data.key}: ${value}`;
    }
    case NodeTypes.added: {
      const value = stringify(data.value, depth);
      const indentationLength = indentLength * depth - spaceForSignLength;
      const indentation = ' '.repeat(indentationLength);
      return `${indentation}+ ${data.key}: ${value}`;
    }
    case NodeTypes.updated: {
      const oldValue = stringify(data.value.old, depth);
      const newValue = stringify(data.value.new, depth);
      const indentationLength = indentLength * depth - spaceForSignLength;
      const indentation = ' '.repeat(indentationLength);
      return `${indentation}- ${data.key}: ${oldValue}\n${indentation}+ ${data.key}: ${newValue}`;
    }
    default: return '';
  }
};

const renderInNestedFormat = data => renderIter(data);

export default renderInNestedFormat;
