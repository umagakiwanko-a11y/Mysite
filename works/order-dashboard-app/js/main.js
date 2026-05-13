const filterButtons = document.querySelectorAll('[data-filter]');
const searchInput = document.querySelector('#searchInput');
const orderRows = document.querySelectorAll('.order-row');
const detailDialog = document.querySelector('#detailDialog');
const detailText = document.querySelector('#detailText');
const closeButtons = [document.querySelector('#closeDialog'), document.querySelector('#closeDialogBottom')];

let activeFilter = 'all';

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  orderRows.forEach((row) => {
    const matchesFilter = activeFilter === 'all' || row.dataset.status === activeFilter;
    const matchesSearch = !query || row.dataset.keyword.includes(query);
    row.classList.toggle('hidden', !(matchesFilter && matchesSearch));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);

document.querySelectorAll('[data-detail]').forEach((button) => {
  button.addEventListener('click', () => {
    detailText.textContent = button.dataset.detail;
    if (typeof detailDialog.showModal === 'function') {
      detailDialog.showModal();
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => detailDialog.close());
});
