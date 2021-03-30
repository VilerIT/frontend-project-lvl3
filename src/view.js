import onChange from 'on-change';

const buildPosts = (posts) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '<h2>Posts</h2>';

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    li.dataset.id = post.id;

    li.innerHTML = `
    <a href="${post.url}" class="font-weight-bold" target="_blank" rel="noopener noreferrer">
      ${post.title}
    </a>
    <button type="button" class="btn btn-primary btn-sm">View</button>
    `;

    ul.append(li);
  });

  postsContainer.append(ul);
};

const buildFeeds = (feeds) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '<h2>Feeds</h2>';

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.dataset.id = feed.id;

    li.innerHTML = `
    <h3>${feed.title}</h3>
    <p>${feed.desc}</p>
    `;

    ul.prepend(li);
  });

  feedsContainer.append(ul);
};

const render = (state) => {
  const input = document.querySelector('.form-control');
  const feedback = document.querySelector('.feedback');
  const { activeFeedId } = state.uiState;

  feedback.textContent = '';

  if (state.rssForm.error) {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = state.rssForm.error;
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
  }

  if (state.rssForm.isSuccess) {
    feedback.classList.add('text-success');
    feedback.textContent = 'RSS successfully loaded';
  } else {
    feedback.classList.remove('text-success');
  }

  if (state.feeds.length > 0) {
    buildFeeds(state.feeds);
  }

  if (activeFeedId) {
    const posts = state.posts
      .filter((post) => (post.feedId === activeFeedId));

    buildPosts(posts);
  }
};

export default (state) => {
  const submitButton = document.querySelector('[type="submit"]');
  const input = document.querySelector('.form-control');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'rssForm.state') {
      switch (value) {
        case 'filling':
          submitButton.disabled = false;
          input.disabled = false;
          break;
        case 'pending':
          submitButton.disabled = true;
          input.disabled = true;
          break;
        default:
          throw new Error(`Unexpected state: ${value}`);
      }
    }
    render(watchedState);
  });

  return watchedState;
};
