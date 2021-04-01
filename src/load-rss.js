/* eslint-disable no-param-reassign */

import axios from 'axios';

import parseRSS from './parse-rss.js';

const routes = {
  allOrigins: (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&timestamp=${new Date().getTime()}`,
};

export default (link, state) => {
  const feedId = state.feeds.length + 1;

  return axios.get(routes.allOrigins(link))
    .then((response) => parseRSS(response.data.contents))
    .then((rss) => {
      const result = {
        feed: null,
        posts: [],
      };

      const title = rss.querySelector('title').textContent;
      const desc = rss.querySelector('description').textContent;

      const posts = rss.querySelectorAll('item')
        .forEach((post) => {
          const postTitle = post.querySelector('title').textContent;
          const postDesc = post.querySelector('description').textContent;
          const postLink = post.querySelector('link').textContent;

          const postId = state.posts.length + result.posts.length + 1;

          const data = {
            id: postId, feedId, title: postTitle, desc: postDesc, url: postLink,
          };

          result.posts.push(data);
        });

      result.feed = {
        id: feedId, title, desc, url: link, posts,
      };

      return result;
    });
};
