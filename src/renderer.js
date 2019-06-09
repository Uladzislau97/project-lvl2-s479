import { renderInNestedFormat, renderInPlainFormat, renderInJSONFormat } from './formatters';

const renderDiff = (data, format) => {
  if (format === 'plain') {
    return renderInPlainFormat(data);
  }
  if (format === 'json') {
    return renderInJSONFormat(data);
  }
  return renderInNestedFormat(data);
};

export default renderDiff;
