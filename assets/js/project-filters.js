(() => {
  const groups = document.querySelectorAll('[data-project-filter-group]');
  if (!groups.length) return;

  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('type') || 'all';

  const formatValue = (value) => (value || 'all').toLowerCase();

  const updatePaginationLinks = (filterValue) => {
    const links = document.querySelectorAll('.pagination a');
    if (!links.length) return;

    links.forEach((anchor) => {
      try {
        const url = new URL(anchor.href, window.location.origin);
        if (filterValue === 'all') {
          url.searchParams.delete('type');
        } else {
          url.searchParams.set('type', filterValue);
        }
        anchor.href = url.toString();
      } catch (_) {
        // skip anchors that can't be parsed
      }
    });
  };

  const applyFilter = (groupId, filterValue) => {
    const targets = document.querySelectorAll(
      `[data-project-filter-target="${groupId}"] [data-project-type]`
    );
    targets.forEach((item) => {
      const itemType = item.getAttribute('data-project-type') || 'other';
      const matches = filterValue === 'all' || itemType === filterValue;
      item.hidden = !matches;
    });
  };

  groups.forEach((group) => {
    const groupId = group.getAttribute('data-project-filter-group');
    if (!groupId) return;

    const buttons = group.querySelectorAll('[data-filter-value]');
    if (!buttons.length) return;

    const setActive = (value) => {
      buttons.forEach((btn) => {
        const btnValue = formatValue(btn.getAttribute('data-filter-value'));
        btn.classList.toggle('is-active', btnValue === value);
      });
    };

    const sync = (value) => {
      setActive(value);
      applyFilter(groupId, value);
    };

    const initialValue = formatValue(initialFilter);
    sync(initialValue);
    updatePaginationLinks(initialValue);

    buttons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const value = formatValue(btn.getAttribute('data-filter-value'));
        const url = new URL(window.location.href);
        if (value === 'all') {
          url.searchParams.delete('type');
        } else {
          url.searchParams.set('type', value);
        }
        window.history.replaceState({}, '', url);
        sync(value);
        updatePaginationLinks(value);
      });
    });
  });
})();
