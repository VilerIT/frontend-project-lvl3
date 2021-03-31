/* eslint-disable no-param-reassign */

import validateLink from './validate-link.js';
import loadRSS from './load-rss.js';

export const handleAddFeed = (e, state, i18nInstance) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url');

  const error = validateLink(link, state.feeds, i18nInstance);
  state.rssForm.error = error;

  if (error) {
    state.rssForm.isSuccess = false;
  }

  state.rssForm.valid = !error;

  if (state.rssForm.valid) {
    state.rssForm.state = 'pending';

    loadRSS(e, link, state, i18nInstance);
  }
};

export const handleSelectLanguage = (e, state, i18nInstance) => {
  const lang = (e.target.value === 'English' ? 'en' : 'ru');
  i18nInstance.changeLanguage(lang);
  state.lang = lang;
};
