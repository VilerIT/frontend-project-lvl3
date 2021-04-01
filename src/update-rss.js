/* eslint-disable no-param-reassign */

import _ from 'lodash';

import loadRSS from './load-rss.js';

const links = [];

const updateRSS = (state) => {
  const promises = links.map((l) => loadRSS(l, state));

  Promise.all(promises)
    .then((results) => {
      const posts = results.flatMap((result) => result.posts);

      const allPosts = _.union(posts, state.posts);
      const newPosts = _.differenceBy(allPosts, state.posts, 'url');

      if (newPosts.length > 0) {
        state.posts = [...newPosts, ...state.posts];
      }
    })
    .finally(() => {
      setTimeout(() => updateRSS(state), 5000);
    });
};

export default (link, state) => {
  links.push(link);

  setTimeout(() => updateRSS(state), 5000);
};
