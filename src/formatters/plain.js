import NodeTypes from '../node-types';

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
  switch (data.type) {
    case NodeTypes.object: {
      return data.properties
        .filter(prop => prop.type !== NodeTypes.unchanged)
        .map(prop => renderIter(prop, parents))
        .join('\n');
    }
    case NodeTypes.complex: {
      const newParents = [...parents, data.key];
      return data.value.properties
        .filter(prop => prop.type !== NodeTypes.unchanged)
        .map(prop => renderIter(prop, newParents))
        .join('\n');
    }
    case NodeTypes.added: {
      const propertyName = [...parents, data.key].join('.');
      const value = stringify(data.value);
      return `Property '${propertyName}' was added with value: ${value}`;
    }
    case NodeTypes.removed: {
      const propertyName = [...parents, data.key].join('.');
      return `Property '${propertyName}' was removed`;
    }
    default: {
      const propertyName = [...parents, data.key].join('.');
      const oldValue = stringify(data.value.old);
      const newValue = stringify(data.value.new);
      return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
    }
  }
};

const renderInPlainFormat = data => renderIter(data, []);

export default renderInPlainFormat;
