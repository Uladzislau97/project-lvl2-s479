import yaml from 'js-yaml';
import ini from 'ini-config-parser';

const parseByExtname = {
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
  '.json': JSON.parse,
};

const parse = (content, extname) => parseByExtname[extname](content);

export default parse;
