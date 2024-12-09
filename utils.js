const create = (el) => {
  const element = document.createElement(el);
  if (el) return element;

  throw new Error('--------> Enter a element <--------');
};


const get = (el) => {
  const element = document.querySelector(el);
  if (el) return element;

  throw new Error('--------> Enter a element <--------');
};

export { create, get };
