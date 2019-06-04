const indentSize = 4;
const smallIndentSize = 2;

const renderObject = (properties, indentsNumber) => {
  const indentation = ' '.repeat(indentsNumber);
  return `{\n${properties}\n${indentation}}`;
};

const stringify = (data, indentsNumber) => {
  if (!(data instanceof Object)) {
    return data;
  }
  const properties = Object.keys(data)
    .map((key) => {
      const value = stringify(data[key], indentsNumber + indentSize);
      const indentation = ' '.repeat(indentsNumber + indentSize);
      return `${indentation}${key}: ${value}`;
    });
  return renderObject(properties, indentsNumber);
};

const formatNested = (node, indentsNumber = 0) => {
  if (node.type === 'Object') {
    const properties = node.properties.map(
      prop => formatNested(prop, indentsNumber + smallIndentSize),
    ).join('\n');
    return renderObject(properties, indentsNumber);
  }
  if (node.state === 'complex') {
    const value = formatNested(node.value, indentsNumber + smallIndentSize);
    const indentation = ' '.repeat(indentsNumber);
    return `${indentation}  ${node.key}: ${value}`;
  }
  if (node.state === 'unchanged') {
    const value = stringify(node.value, indentsNumber + smallIndentSize);
    const indentation = ' '.repeat(indentsNumber);
    return `${indentation}  ${node.key}: ${value}`;
  }
  if (node.state === 'removed') {
    const value = stringify(node.value, indentsNumber + smallIndentSize);
    const indentation = ' '.repeat(indentsNumber);
    return `${indentation}- ${node.key}: ${value}`;
  }
  if (node.state === 'added') {
    const value = stringify(node.value, indentsNumber + smallIndentSize);
    const indentation = ' '.repeat(indentsNumber);
    return `${indentation}+ ${node.key}: ${value}`;
  }
  const oldValue = stringify(node.value.old, indentsNumber + smallIndentSize);
  const newValue = stringify(node.value.new, indentsNumber + smallIndentSize);
  const indentation = ' '.repeat(indentsNumber);
  return `${indentation}- ${node.key}: ${oldValue}\n${indentation}+ ${node.key}: ${newValue}`;
};

export default formatNested;
