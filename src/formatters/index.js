import renderInNestedFormat from './nested';
import renderInPlainFormat from './plain';

const renderByDataFormat = {
  plain: renderInPlainFormat,
  json: JSON.stringify,
  nested: renderInNestedFormat,
};

const renderDiff = (data, format) => renderByDataFormat[format](data);

export default renderDiff;
