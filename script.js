const menuItems = [
  { title: 'Bread', image: 'res/bread.jpg' },
  { title: 'Cake', image: 'res/cake.jpg' },
  { title: 'Cream', image: 'res/cream.jpg' },
  { title: 'Ham', image: 'res/ham.jpg' },
  { title: 'Hotdog', image: 'res/hotdog.jpg' },
  { title: 'Juice', image: 'res/juice.jpg' },
  { title: 'Lait', image: 'res/lait.jpg' },
  { title: 'Parfait', image: 'res/parfait.jpg' },
  { title: 'Rice', image: 'res/rice.jpg' },
  { title: 'Salad', image: 'res/salad.jpg' },
  { title: 'Soda', image: 'res/soda.jpg' }
];

const checkoutItem = {
  title: 'Checkout',
  image: 'res/waddle.jpg',
  isCheckout: true
};

const menuGrid = document.getElementById('menu-grid');
const selectedItemsList = document.getElementById('selected-items-list');
const selectionPanel = document.getElementById('selection-panel');
const landingPage = document.getElementById('landing-page');
const menuPage = document.getElementById('menu-page');
const enterButton = document.querySelector('.enter-button');
const backButton = document.getElementById('back-button');
const stopAudioButton = document.getElementById('stop-audio');
const toggleSelectionPanelButton = document.getElementById('toggle-selection-panel');
const clearAllButton = document.getElementById('clear-all-button');
const audio = document.getElementById('menu-audio');
const selectedItems = new Set();

function renderMenu() {
  if (!menuGrid) return;

  const menuCards = [...menuItems, checkoutItem];

  menuGrid.innerHTML = menuCards
    .map((item) => {
      if (item.isCheckout) {
        return `
          <article class="menu-item checkout-card ${selectedItems.size > 0 ? 'active' : 'disabled'}" data-checkout="true">
            <div class="checkout-badge">♡</div>
            <img src="${item.image}" alt="Checkout" />
            <h3>Checkout</h3>
            <p class="menu-note">${selectedItems.size > 0 ? 'Ready to order' : 'Pick at least 1 treat'}</p>
          </article>
        `;
      }

      return `
        <article class="menu-item ${selectedItems.has(item.title) ? 'selected' : ''}" data-title="${item.title}">
          <button class="menu-select" type="button" aria-label="Select ${item.title}">
            ${selectedItems.has(item.title) ? '✓' : '+'}
          </button>
          <img src="${item.image}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p class="menu-note">Price: Have 2 Love Me</p>
        </article>
      `;
    })
    .join('');

  menuGrid.querySelectorAll('.menu-item').forEach((card) => {
    if (card.dataset.checkout === 'true') {
      card.addEventListener('click', () => {
        if (selectedItems.size === 0) return;
        localStorage.setItem('birthdaySelectedItems', JSON.stringify([...selectedItems]));
        window.location.href = 'thank-you.html';
      });
      return;
    }

    card.addEventListener('click', () => {
      const title = card.dataset.title;
      if (!title) return;

      if (selectedItems.has(title)) {
        selectedItems.delete(title);
      } else {
        selectedItems.add(title);
      }

      renderMenu();
      renderSelectedList();
    });
  });

  renderSelectedList();
}

function renderSelectedList() {
  if (!selectedItemsList) return;

  const selected = [...selectedItems];

  if (selected.length === 0) {
    selectedItemsList.innerHTML = '<li class="empty-state">No treats picked yet</li>';
    return;
  }

  selectedItemsList.innerHTML = selected
    .map((item) => `<li>${item}</li>`)
    .join('');
}

function clearSelectedItems() {
  selectedItems.clear();
  renderMenu();
  renderSelectedList();
}

function toggleAudio() {
  if (!audio) return;

  if (audio.paused) {
    audio.volume = 0.7;
    audio.play().catch(() => {
      console.log('Audio play was blocked until the user interacted with the page.');
    });
    if (stopAudioButton) {
      stopAudioButton.textContent = 'Stop Music';
    }
  } else {
    audio.pause();
    audio.currentTime = 0;
    if (stopAudioButton) {
      stopAudioButton.textContent = 'Resume Music';
    }
  }
}

function showMenu() {
  if (landingPage) landingPage.classList.add('hidden');
  if (menuPage) menuPage.classList.remove('hidden');
  if (audio && audio.paused) {
    audio.volume = 0.7;
    audio.play().catch(() => {
      console.log('Audio play was blocked until the user interacted with the page.');
    });
  }
  if (stopAudioButton) {
    stopAudioButton.style.display = 'block';
    stopAudioButton.textContent = 'Stop Music';
  }
}

function showLanding() {
  if (menuPage) menuPage.classList.add('hidden');
  if (landingPage) landingPage.classList.remove('hidden');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (stopAudioButton) {
    stopAudioButton.style.display = 'none';
    stopAudioButton.textContent = 'Stop Music';
  }
}

function toggleSelectionPanel() {
  if (!selectionPanel) return;
  selectionPanel.classList.toggle('closed');
}

if (audio) {
  audio.pause();
  audio.currentTime = 0;
}

if (stopAudioButton) {
  stopAudioButton.style.display = 'none';
}

enterButton?.addEventListener('click', showMenu);
backButton?.addEventListener('click', showLanding);
stopAudioButton?.addEventListener('click', toggleAudio);
toggleSelectionPanelButton?.addEventListener('click', toggleSelectionPanel);
clearAllButton?.addEventListener('click', clearSelectedItems);

const shouldShowMenu = new URLSearchParams(window.location.search).get('showMenu') === 'true';
if (shouldShowMenu) {
  showMenu();
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, '', cleanUrl);
}

renderMenu();
