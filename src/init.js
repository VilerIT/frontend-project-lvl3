import i18next from 'i18next';

import resources from '../assets/locales/index.js';
import { handleAddFeed, handleSelectLanguage } from './handlers.js';
import initView from './view.js';

export default async () => {
  const state = {
    lang: 'en',
    rssForm: {
      state: 'filling',
      valid: false,
      error: null,
      isSuccess: false,
    },
    feeds: [],
    posts: [],
    uiState: {
      activeFeedId: null,
    },
  };

  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: state.lang,
    resources,
  });

  const watchedState = initView(state, i18nInstance);

  const form = document.querySelector('.rss-form');

  const languageSelector = document.querySelector('.language-selector');

  form.addEventListener('submit', (e) => {
    handleAddFeed(e, watchedState);
  });

  languageSelector.addEventListener('change', (e) => {
    handleSelectLanguage(e, watchedState, i18nInstance);
  });
};
