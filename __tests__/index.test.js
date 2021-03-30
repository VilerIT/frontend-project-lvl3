import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import init from '../src/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (name) => path.join(__dirname, '__fixtures__', name);

const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

beforeEach(async () => {
  const html = await readFile('index.html');
  document.body.innerHTML = html;
});

test('init', () => {
  init();
  expect(true).toBeDefined();
});
