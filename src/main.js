import gamesData from './games.json';

let state = {
  searchQuery: '',
  activeCategory: 'All',
  selectedGame: null
};

const elements = {
  grid: document.getElementById('games-grid'),
  searchInput: document.getElementById('search-input'),
  categoriesContainer: document.getElementById('categories-container'),
  noResults: document.getElementById('no-results'),
  modal: document.getElementById('game-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalCategory: document.getElementById('modal-category'),
  modalThumb: document.getElementById('modal-thumb'),
  modalIframe: document.getElementById('game-iframe'),
  modalExternal: document.getElementById('modal-external'),
  closeModal: document.getElementById('close-modal'),
  logo: document.getElementById('logo')
};

function init() {
  renderCategories();
  renderGames();

  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderGames();
  });

  elements.closeModal.addEventListener('click', closeModal);
  elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
  });

  elements.logo.addEventListener('click', () => {
    state.searchQuery = '';
    state.activeCategory = 'All';
    elements.searchInput.value = '';
    renderCategories();
    renderGames();
  });
}

function renderCategories() {
  const cats = new Set(gamesData.map(g => g.category));
  const categories = ['All', ...Array.from(cats)];

  elements.categoriesContainer.innerHTML = categories.map(cat => `
    <button
      class="px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        state.activeCategory === cat
          ? 'bg-emerald-500 text-white'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
      }"
      onclick="window.setCategory('${cat}')"
    >
      ${cat}
    </button>
  `).join('');
}

window.setCategory = (category) => {
  state.activeCategory = category;
  renderCategories();
  renderGames();
};

function renderGames() {
  const filtered = gamesData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesCategory = state.activeCategory === 'All' || game.category === state.activeCategory;
    return matchesSearch && matchesCategory;
  });

  elements.noResults.classList.toggle('hidden', filtered.length > 0);
  
  elements.grid.innerHTML = filtered.map(game => `
    <div
      class="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer shadow-lg hover:shadow-emerald-500/10 transition-all hover:-translate-y-1"
      onclick="window.openGame('${game.id}')"
    >
      <div class="aspect-[4/3] overflow-hidden">
        <img
          src="${game.thumbnail}"
          alt="${game.title}"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerpolicy="no-referrer"
        />
      </div>
      <div class="p-3">
        <h3 class="font-semibold text-sm truncate">${game.title}</h3>
        <p class="text-xs text-zinc-500 mt-1">${game.category}</p>
      </div>
      <div class="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div class="bg-white text-black p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
        </div>
      </div>
    </div>
  `).join('');
}

window.openGame = (id) => {
  const game = gamesData.find(g => g.id === id);
  if (!game) return;

  state.selectedGame = game;
  elements.modalTitle.textContent = game.title;
  elements.modalCategory.textContent = game.category;
  elements.modalThumb.src = game.thumbnail;
  elements.modalIframe.src = game.iframeUrl;
  elements.modalExternal.onclick = () => window.open(game.iframeUrl, '_blank');
  
  elements.modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

function closeModal() {
  state.selectedGame = null;
  elements.modalIframe.src = '';
  elements.modal.classList.add('hidden');
  document.body.style.overflow = '';
}

init();
