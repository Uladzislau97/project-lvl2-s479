import { renderInNestedFormat, renderInPlainFormat } from './formatters';

const renderDiff = (data, format) => {
  if (format === 'plain') {
    return renderInPlainFormat(data);
  }
  return renderInNestedFormat(data);
};

export default renderDiff;
