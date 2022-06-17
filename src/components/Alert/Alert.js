/* global $ */
const Alert = (message, type, container) => {
  const alertPlaceholder = document.getElementById(container);
  alertPlaceholder.innerText = '';
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="alert" class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>Error: </strong>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
    </div>`;
  alertPlaceholder.append(wrapper);
  $('#alert').fadeTo(2000, 500).slideUp(500, () => {
    $('#alert').slideUp(500);
  });
};

export default Alert;
