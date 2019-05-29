const renderDiff = (properties, tabs) => {
  const indentation = ' '.repeat(tabs);
  return `{\n${properties}\n${indentation}}`;
};

const stringify = (data, tabs) => {
  if (!(data instanceof Object)) {
    return data;
  }
  const properties = Object.keys(data)
    .map((key) => {
      const value = stringify(data[key], tabs + 4);
      const indentation = ' '.repeat(tabs + 4);
      return `${indentation}${key}: ${value}`;
    });
  return renderDiff(properties, tabs);
};

const renderDiffAst = (node, tabs = 0) => {
  if (node.type === 'Property') {
    const value = node.value.type === 'Diff'
      ? renderDiffAst(node.value, tabs + 2)
      : stringify(node.value, tabs + 2);
    const indentation = ' '.repeat(tabs);
    return `${indentation}${node.sign} ${node.key}: ${value}`;
  }
  const properties = node.properties.map(
    prop => renderDiffAst(prop, tabs + 2),
  ).join('\n');
  return renderDiff(properties, tabs);
};

export default renderDiffAst;
