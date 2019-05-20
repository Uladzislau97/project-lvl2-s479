import yaml from 'js-yaml';
import ini from 'ini';

const parse = (content, extname) => {
  if (extname === '.yml') {
    return yaml.safeLoad(content);
  }
  if (extname === '.ini') {
    return ini.parse(content);
  }
  return JSON.parse(content);
};

export default parse;
