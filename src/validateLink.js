import * as yup from 'yup';

const schema = yup.string().url();

export default (link, feeds) => {
  const sameFeed = feeds.find(({ url }) => (url === link));

  if (sameFeed) {
    return 'RSS already exists';
  }

  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e.message;
  }
};
