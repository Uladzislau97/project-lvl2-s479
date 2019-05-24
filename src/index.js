import fs from 'fs';
import path from 'path';
import parse from './parsers';
import buildDiffAst from './builder';
import renderDiffAst from './renderer';

const getFileData = (filepath) => {
  const extname = path.extname(filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  return parse(content, extname);
};

const gendiff = (beforePath, afterPath) => {
  const beforeData = getFileData(beforePath);
  const afterData = getFileData(afterPath);
  const diffData = buildDiffAst(beforeData, afterData);
  return renderDiffAst(diffData);
};

export default gendiff;
