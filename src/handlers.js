/* eslint-disable no-param-reassign */

import $ from 'jquery';

import validateLink from './validate-link.js';
import loadRSS from './load-rss.js';
import updateRSS from './update-rss.js';

export const handleAddFeed = (e, state, i18nInstance) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const link = formData.get('url');

  const error = validateLink(link, state.feeds);
  state.form.error = error;

  if (!error) {
    console.log(link);

    state.form.state = 'pending';

    loadRSS(link)
      .then((rss) => {
        state.feeds.unshift(rss.feed);
        state.posts = [...rss.posts, ...state.posts];

        state.form.state = 'success';

        updateRSS(link, state);

        e.target.reset();
      })
      .catch((err) => {
        state.form.state = 'failed';
        if (err.isAxiosError) {
          state.form.error = i18nInstance.t('errors.netError');
        } else {
          state.form.error = i18nInstance.t('errors.invalidRSS');
        }
      })
      .finally(() => {
        console.log(JSON.stringify(state));
      });
  } else {
    state.form.state = 'failed';
  }
};

export const handleSelectLanguage = (e, state, i18nInstance) => {
  i18nInstance.changeLanguage(e.target.dataset.lang);
  state.lang = e.target.dataset.lang;

  const buttonGroup = e.target.closest('.btn-group');
  const active = buttonGroup.querySelector('.active');

  active.classList.remove('btn-light');
  active.classList.add('btn-outline-light');

  e.target.parentElement.classList.remove('btn-outline-light');
  e.target.parentElement.classList.add('btn-light');
};

export const handleViewPost = (post) => {
  $('body').addClass('modal-open');

  const modalWindow = $('#modal');

  $('.modal-title').text(post.title);

  $('.modal-body').html(post.desc);

  $('.full-article').prop('href', post.url);

  modalWindow.modal('show');
};

export const handleCloseModal = () => {
  $('body').removeClass('modal-open');

  $('#modal').modal('hide');
};
