/* eslint-disable no-param-reassign */

import axios from 'axios';

import parseRSS from './parse-rss.js';

const routes = {
  allOrigins: (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`,
};

export default (e, link, state, i18nInstance) => {
  const feedId = state.feeds.length + 1;

  axios.get(routes.allOrigins(link))
    .then((response) => parseRSS(response.data.contents))
    .then((rss) => {
      const title = rss.querySelector('title').textContent;
      const desc = rss.querySelector('description').textContent;

      const posts = rss.querySelectorAll('item')
        .forEach((post) => {
          const postTitle = post.querySelector('title').textContent;
          const postDesc = post.querySelector('description').textContent;
          const postLink = post.querySelector('link').textContent;

          const postId = state.posts.length + 1;

          const data = {
            id: postId, feedId, title: postTitle, desc: postDesc, url: postLink,
          };

          state.posts.unshift(data);
        });

      const newFeed = {
        id: feedId, title, desc, url: link, posts,
      };

      state.feeds.unshift(newFeed);
      state.uiState.activeFeedId = feedId;
      state.rssForm.isSuccess = true;

      e.target.reset();
    })
    .catch((err) => {
      state.rssForm.isSuccess = false;
      if (err.isAxiosError) {
        state.rssForm.error = i18nInstance.t('errors.netError');
      } else {
        state.rssForm.error = i18nInstance.t('errors.invalidRSS');
      }
    })
    .finally(() => {
      state.rssForm.state = 'filling';
    });
};
