import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';
import { screen } from '@testing-library/dom/dist/screen.js';
import { fireEvent } from '@testing-library/dom/dist/events.js';
import { waitFor } from '@testing-library/dom/dist/wait-for.js';
import nock from 'nock';
import '@testing-library/jest-dom';

import init from '../src/init.js';

nock.disableNetConnect();

axios.defaults.adapter = adapter;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const readFixture = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

beforeEach(async () => {
  const html = await readFixture('index.html');
  document.body.innerHTML = html;

  await init();
});

test('init', () => {
  expect(document.body.innerHTML).toMatchSnapshot();
});

test('add rss feed', async () => {
  const requestURL = 'https://google.com';
  const fakeRSS = await readFixture('rss1.xml');

  nock('https://hexlet-allorigins.herokuapp.com')
    .get(`/get?url=${encodeURIComponent(requestURL)}&disableCache=true`)
    .reply(200, { contents: fakeRSS });

  fireEvent.input(screen.getByTestId('input'), { target: { value: requestURL } });
  fireEvent.submit(screen.getByTestId('form'));

  const success = await screen.findByText('RSS successfully loaded');
  expect(success).toBeInTheDocument();

  expect(document.body.innerHTML).toMatchSnapshot();
});

test('open/close modal', async () => {
  const requestURL = 'https://google.com';
  const fakeRSS = await readFixture('rss1.xml');

  nock('https://hexlet-allorigins.herokuapp.com')
    .get(`/get?url=${encodeURIComponent(requestURL)}&disableCache=true`)
    .reply(200, { contents: fakeRSS });

  fireEvent.input(screen.getByTestId('input'), { target: { value: requestURL } });
  fireEvent.submit(screen.getByTestId('form'));

  const viewButtons = await screen.findAllByText('View');
  fireEvent.click(viewButtons[0]);

  const modalTitle = await screen.findByTestId('modal-title');
  const modalBody = await screen.findByTestId('modal-body');

  expect(modalTitle).toHaveTextContent('Woohoo');
  expect(modalBody).toHaveTextContent('1111');

  fireEvent.click(screen.getByTestId('close-modal'));

  await waitFor(() => {
    expect(screen.getByTestId('modal')).not.toHaveClass('show');
  });

  expect(document.body.innerHTML).toMatchSnapshot();
});
