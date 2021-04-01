/* eslint-disable no-param-reassign */

import validateLink from './validate-link.js';
import loadRSS from './load-rss.js';
import updateRSS from './update-rss.js';

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

    loadRSS(link, state)
      .then((rss) => {
        state.rssForm.state = 'filling';

        state.feeds.unshift(rss.feed);
        state.posts = [...rss.posts, ...state.posts];

        state.rssForm.isSuccess = true;

        updateRSS(link, state);

        e.target.reset();
      })
      .catch((err) => {
        if (err.isAxiosError) {
          state.rssForm.error = i18nInstance.t('errors.netError');
        } else {
          state.rssForm.error = i18nInstance.t('errors.invalidRSS');
        }
      });
  }
};

export const handleSelectLanguage = (e, state, i18nInstance) => {
  const lang = (e.target.value === 'English' ? 'en' : 'ru');
  i18nInstance.changeLanguage(lang);
  state.lang = lang;
};
