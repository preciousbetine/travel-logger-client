/* global $ */
const Alert = (message, type, container, heading) => {
  const alertPlaceholder = document.getElementById(container);
  alertPlaceholder.innerText = '';
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="${container}Alert" class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>${heading ? `${heading}: ` : ''}</strong>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
    </div>`;
  alertPlaceholder.append(wrapper);
  $(`#${container}Alert`).fadeTo(2000, 500).slideUp(500, () => {
    $(`#${container}Alert`).slideUp(500);
  });
};

export default Alert;
