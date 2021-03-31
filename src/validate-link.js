import * as yup from 'yup';

const schema = yup.string().url();

export default (link, feeds, i18nInstance) => {
  const sameFeed = feeds.find(({ url }) => (url === link));

  if (sameFeed) {
    return i18nInstance.t('errors.rssExists');
  }

  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return i18nInstance.t('errors.invalidURL');
  }
};
