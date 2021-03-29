export const clearElement = container => {
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

export const createDropdown = (list, elemId) => {
  const select = document.createElement('select');
  const firstOption = document.createElement('option');
  firstOption.textContent = '--Select--';
  firstOption.value = '';
  select.appendChild(firstOption);
  select.value = '';
  select.setAttribute('id', elemId);

  list.forEach(method => {
    const option = document.createElement('option');
    option.textContent = method;
    option.value = method;

    select.appendChild(option);
  });

  return select;
};