import { renderInNestedFormat, renderInPlainFormat, renderInJSONFormat } from './formatters';

const renderByDataFormat = {
  plain: renderInPlainFormat,
  json: renderInJSONFormat,
  nested: renderInNestedFormat,
};

const renderDiff = (data, format) => renderByDataFormat[format](data);

export default renderDiff;
