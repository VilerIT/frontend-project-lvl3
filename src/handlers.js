/* eslint-disable no-param-reassign */

import axios from 'axios';

import validateLink from './validateLink.js';
import parseRSS from './parseRSS.js';

const routes = {
  allorigins: (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`,
};

export const handleAddFeed = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url');

  const error = validateLink(link, state.feeds);
  state.rssForm.error = error;

  if (error) {
    state.rssForm.isSuccess = false;
  }

  state.rssForm.valid = !error;

  if (state.rssForm.valid) {
    state.rssForm.state = 'pending';

    const feedId = state.feeds.length + 1;

    axios.get(routes.allorigins(link))
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

            state.posts.push(data);
          });

        const newFeed = {
          id: feedId, title, desc, url: link, posts,
        };

        state.feeds.push(newFeed);
        state.uiState.activeFeedId = feedId;
        state.rssForm.isSuccess = true;

        e.target.reset();
      })
      .catch(() => {
        state.rssForm.isSuccess = false;
        state.rssForm.error = 'Something went wrong';
      })
      .finally(() => {
        state.rssForm.state = 'filling';
      });
  }
};

export const handleSelectLanguage = (e, state, i18nInstance) => {
  const lang = (e.target.value === 'English' ? 'en' : 'ru');
  i18nInstance.changeLanguage(lang);
  state.lang = lang;
};
