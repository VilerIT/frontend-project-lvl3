export default class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = 'Hello, World!';
    // eslint-disable-next-line
    console.log('hi!!!');
  }
}
