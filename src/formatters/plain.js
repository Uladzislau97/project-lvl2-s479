import NodeTypes from '../node-types';

const initialParents = [];

const stringify = (data) => {
  if (data instanceof Object) {
    return '[complex value]';
  }
  if (typeof data === 'string') {
    return `'${data}'`;
  }
  return data;
};

const renderIter = (data, parents) => {
  if (data.type === NodeTypes.object) {
    return data.properties
      .filter(prop => prop.type !== NodeTypes.unchanged)
      .map(prop => renderIter(prop, parents))
      .join('\n');
  }
  if (data.type === NodeTypes.complex) {
    const newParents = [...parents, data.key];
    return data.value.properties
      .filter(prop => prop.type !== NodeTypes.unchanged)
      .map(prop => renderIter(prop, newParents))
      .join('\n');
  }
  const propertyName = [...parents, data.key].join('.');
  if (data.type === NodeTypes.added) {
    const value = stringify(data.value);
    return `Property '${propertyName}' was added with value: ${value}`;
  }
  if (data.type === NodeTypes.removed) {
    return `Property '${propertyName}' was removed`;
  }
  const oldValue = stringify(data.value.old);
  const newValue = stringify(data.value.new);
  return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
};

const renderInPlainFormat = data => renderIter(data, initialParents);

export default renderInPlainFormat;
