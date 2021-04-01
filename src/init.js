import i18next from 'i18next';
import { setLocale } from 'yup';

import resources from '../assets/locales/index.js';
import { handleAddFeed, handleSelectLanguage } from './handlers.js';
import initView from './view.js';

export default () => {
  const state = {
    lang: 'ru',
    rssForm: {
      state: 'filling',
      valid: false,
      error: null,
      isSuccess: false,
    },
    updateProcess: {
      state: 'idle',
    },
    feeds: [],
    posts: [],
    uiState: {
      viewedPostsIds: [],
    },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: state.lang,
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => i18nInstance.t('errors.rssExists'),
      },
      string: {
        url: () => i18nInstance.t('errors.invalidURL'),
      },
    });
  });

  const watchedState = initView(state, i18nInstance);

  const form = document.querySelector('.rss-form');

  const languageSelector = document.querySelector('.language-selector');

  form.addEventListener('submit', (e) => {
    handleAddFeed(e, watchedState, i18nInstance);
  });

  languageSelector.addEventListener('change', (e) => {
    handleSelectLanguage(e, watchedState, i18nInstance);
  });
};
