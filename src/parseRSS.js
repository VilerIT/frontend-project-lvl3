export default (content) => {
  const parser = new DOMParser();

  return parser.parseFromString(content, 'text/xml');
};
