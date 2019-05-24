const renderDiffAst = (node, indentation = '') => {
  if (!(node instanceof Object)) {
    return node;
  }
  if (node.type === 'Property') {
    const value = renderDiffAst(node.value, `  ${indentation}`);
    return `${indentation}${node.sign} ${node.key}: ${value}`;
  }
  const renderedProperties = node.properties.map(
    prop => renderDiffAst(prop, `  ${indentation}`),
  ).join('\n');
  return [
    '{',
    renderedProperties,
    `${indentation}}`,
  ].join('\n');
};

export default renderDiffAst;
