import yaml from 'js-yaml';

const parse = (content, extname) => {
  if (extname === '.yml') {
    return yaml.safeLoad(content);
  }
  return JSON.parse(content);
};

export default parse;
