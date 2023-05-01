export default class NotificationMessage {
  static current= null;

  root = document.body;
  element = null;
  timerId = null;

  constructor(text = '', options = {}) {
    this.text = text;
    this.duration = options.duration;
    this.type = options.type;

    this.getTemplate();
  }

  show(root) {
    if (root) {
      this.root = root;
    }

    if (NotificationMessage.current) {
      this.destroy();
    }

    this.render();
  }


  getTemplate() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.text}
          </div>
        </div>
      </div>
    `;

    this.element = wrapper.firstElementChild;
  }

  render() {
    this.getTemplate();
    NotificationMessage.current = this;
    this.root.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  destroy() {
    clearTimeout(this.timerId);

    if (NotificationMessage.current) {
      NotificationMessage.current.remove();
    }

    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}
