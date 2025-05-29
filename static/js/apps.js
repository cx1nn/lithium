document.addEventListener('DOMContentLoaded', () => {
  fetch('json/apps.json')
    .then(response => response.json())
    .then(apps => {
      const grids = document.querySelectorAll('.apps-grid');
      if (!grids.length) return;
      grids.forEach(grid => grid.innerHTML = '');
      apps.forEach(app => {
        let grid = document.querySelector(`#${app.category} .apps-grid`) || grids[0];
        const a = document.createElement('a');
        a.className = 'app-button';
        a.href = '#';
        a.innerHTML = `
          <img src="${app.image}" alt="${app.name}">
          <span>${app.name}</span>
        `;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.setItem('url', app.link);
          window.location.replace('go.html');

        });
        grid.appendChild(a);
      });
    });
});