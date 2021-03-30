import axios from 'axios';

import initView from './view.js';
import validateLink from './validateLink.js';
import parseRSS from './parseRSS.js';

const routes = {
  allorigins: (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`,
};

export default () => {
  const state = {
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

  const watchedState = initView(state);

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('.form-control');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const link = formData.get('url');

    const error = validateLink(link, watchedState.feeds);
    watchedState.rssForm.error = error;

    if (error) {
      watchedState.rssForm.isSuccess = false;
    }

    watchedState.rssForm.valid = !error;

    if (watchedState.rssForm.valid) {
      watchedState.rssForm.state = 'pending';

      const feedId = watchedState.feeds.length + 1;

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

          watchedState.feeds.push(newFeed);
          watchedState.uiState.activeFeedId = feedId;
          watchedState.rssForm.isSuccess = true;

          form.reset();
          input.focus();
        })
        .catch(() => {
          watchedState.rssForm.isSuccess = false;
          watchedState.rssForm.error = 'Something went wrong';
        })
        .finally(() => {
          watchedState.rssForm.state = 'filling';
        });
    }
  });
};
