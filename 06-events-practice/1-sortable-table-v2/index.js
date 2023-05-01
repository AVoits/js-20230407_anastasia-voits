export default class SortableTable {
  element = null;
  subElements = null;
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.initTable();
  }


  initTable() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const res = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const sub of elements) {
      res[sub.dataset.element] = sub;
    }

    return res;
  }

  getTable() {
    return `
    <div class="sortable-table">
      ${this.getTableHeader()}
      ${this.getTableBody(this.data)}
    </div>
    `;
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(el => this.getHeaderCell(el)).join('')}
    </div>`;
  }

  /**
   * @param {HeaderConfig} config
   * @returns {string}
   */
  getHeaderCell(config) {
    const sort = config.sortable ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>' : '';

    return `
      <div class="sortable-table__cell" data-id="${config.id}" data-sortable="${config.sortable}">
        <span>${config.title}</span>
        ${sort}
      </div>
    `;
  }

  getTableBody(data) {
    return `<div data-element="body" class="sortable-table__body">${data.map(el => this.getTableRow(el)).join('')}</div>`;
  }

  /**
   *
   * @param {Object} element
   * @returns {string}
   */
  getTableRow(element) {
    return `<a href="/${element.id}" class="sortable-table__row">${this.getTableCell(element)}</a>`;
  }

  /**
   * @param {Object} element
   * @returns {string}
   */
  getTableCell(element) {
    return this.headerConfig.map(column => {
      let data = element[column.id];

      let tmpl = `<div class="sortable-table__cell">${data}</div>`;

      if (column.template) {
        tmpl = column.template(data);
      }

      return tmpl;
    }).join('');
  }


  sort(fieldValue, orderValue) {
    const orderParam = orderValue === 'asc' ? 1 : -1;
    const column = this.headerConfig.find(el => el.id === fieldValue);

    if (!column.sortable) {
      return;
    }

    const sortedData = this.getSortedData(column, fieldValue, orderParam);

    this.subElements.body.innerHTML = sortedData.map(el => this.getTableRow(el)).join('');
  }

  sortString({arr, param, field}) {
    const newArr = [...arr];
    return newArr.sort((a, b) => a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'}) * param);
  }

  getSortedData(column, fieldValue, orderParam) {
    let data;

    if (column.sortType === 'string') {
      data = this.sortString({arr: this.data, param: orderParam, field: fieldValue});
    }

    if (column.sortType === 'number') {
      data = [...this.data].sort((a, b) => (a[fieldValue] - b[fieldValue]) * orderParam);
    }

    return data;
  }

  destroy() {
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}
