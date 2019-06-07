import AstNodeAttributes from '../ast-node-attributes';

const initialParents = [];

const stringify = (data) => {
  if (data instanceof Object) {
    return '[complex value]';
  }
  if (parseInt(data, 10)) {
    return data;
  }
  if (typeof data === 'string') {
    return `'${data}'`;
  }
  return data;
};

const renderIter = (data, parents) => {
  if (data.type === AstNodeAttributes.type.object) {
    return data.properties
      .filter(prop => prop.state !== AstNodeAttributes.propertyState.unchanged)
      .map(prop => renderIter(prop, parents))
      .join('\n');
  }
  if (data.state === AstNodeAttributes.propertyState.complex) {
    const newParents = [...parents, data.key];
    return data.value.properties
      .filter(prop => prop.state !== AstNodeAttributes.propertyState.unchanged)
      .map(prop => renderIter(prop, newParents))
      .join('\n');
  }
  const propertyName = [...parents, data.key].join('.');
  if (data.state === AstNodeAttributes.propertyState.added) {
    const value = stringify(data.value);
    return `Property '${propertyName}' was added with value: ${value}`;
  }
  if (data.state === AstNodeAttributes.propertyState.removed) {
    return `Property '${propertyName}' was removed`;
  }
  const oldValue = stringify(data.value.old);
  const newValue = stringify(data.value.new);
  return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
};

const renderInPlainFormat = data => renderIter(data, initialParents);

export default renderInPlainFormat;
