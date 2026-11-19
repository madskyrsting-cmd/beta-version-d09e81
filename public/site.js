document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');

if (menuButton && menu) {
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());


// Indhold kan redigeres i Pages CMS og indlæses fra statiske JSON-filer.
// Siden beholder sit oprindelige indhold, hvis en fil ikke kan indlæses.
const localContent = async (file) => {
  const response = await fetch(new URL('./content/' + file, document.baseURI), { cache: 'no-cache' });
  if (!response.ok) throw new Error('Indhold ikke tilgængeligt: ' + file);
  return response.json();
};

const safeImage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  // Kun lokale uploadede billeder må bruges i de offentlige kort.
  const match = value.match(/^(?:\/|\.\/)?img\/uploads\/[a-zA-Z0-9_./-]+$/);
  return match && !value.includes('..') ? value.replace(/^\//, './') : '';
};

function element(name, className, content) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (content != null) node.textContent = String(content);
  return node;
}

function shortText(value, max = 170) {
  const cleaned = String(value || '').trim().replace(/\s+/g, ' ');
  return cleaned.length > max ? cleaned.slice(0, max - 1).trimEnd() + '…' : cleaned;
}

function newsCard(item, featured = false) {
  const article = element('article', featured ? 'featured-story' : 'small-story');
  const pic = safeImage(item.image);
  if (featured) {
    const art = element('div', 'featured-art');
    if (pic) {
      const image = element('img', 'content-photo');
      image.src = pic;
      image.alt = '';
      image.loading = 'lazy';
      art.append(image);
    } else {
      art.append(element('span', 'art-wordmark', 'hej, nabo.'));
    }
    article.append(art);
  } else {
    const icon = element('div', 'story-icon');
    icon.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-waves"/></svg>';
    if (pic) {
      const image = element('img', 'story-photo');
      image.src = pic;
      image.alt = '';
      image.loading = 'lazy';
      icon.replaceChildren(image);
    }
    article.append(icon);
  }
  const body = element('div', featured ? 'featured-body' : 'story-content');
  body.append(element('span', 'category', item.category || 'Fra landsbyen'));
  body.append(element('h3', '', item.title || 'Nyhed'));
  body.append(element('p', '', shortText(item.summary || item.body)));
  // Hele nyheden står til rådighed i tekstfeltet og som udvideligt indhold.
  if (item.body && item.body.trim() && item.body.trim() !== item.summary?.trim()) {
    const details = element('details', 'story-details');
    const summary = element('summary', '', 'Læs hele nyheden');
    const text = element('p', '', item.body);
    details.append(summary, text);
    body.append(details);
  }
  article.append(body);
  return article;
}

function showNews(entries) {
  const grid = document.querySelector('#news-content');
  if (!grid || !Array.isArray(entries)) return;
  const visible = entries.filter(item => item && item.published !== false && item.title);
  visible.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  grid.replaceChildren();
  if (!visible.length) {
    grid.append(element('p', 'content-empty', 'Der er endnu ingen nyheder.'));
    return;
  }
  grid.append(newsCard(visible[0], true));
  if (visible.length > 1) {
    const rest = element('div', 'story-list');
    visible.slice(1).forEach(item => rest.append(newsCard(item)));
    grid.append(rest);
  }
  if (!visible.some(item => item.example === true)) document.querySelector('.beta-notice')?.remove();
}

const formatDate = (value) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return String(value || '');
  const withTime = typeof value === 'string' && value.includes('T');
  return new Intl.DateTimeFormat('da-DK', {
    day: 'numeric', month: 'long', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
  }).format(date);
};

function showEvents(entries) {
  const target = document.querySelector('#calendar-content');
  if (!target || !Array.isArray(entries)) return;
  const upcoming = entries.filter(item => item && item.title && item.date && item.published !== false && Date.parse(item.date) >= Date.now() - 86400000)
    .sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
  if (!upcoming.length) return; // Behold det pæne eksisterende tomt-kalender-kort.
  const wrap = element('div', 'event-list');
  upcoming.forEach(item => {
    const card = element('article', 'event-card');
    const photo = safeImage(item.image);
    if (photo) {
      const img = element('img', 'event-photo');
      img.src = photo;
      img.alt = '';
      img.loading = 'lazy';
      card.append(img);
    }
    card.append(element('span', 'category', formatDate(item.date)));
    card.append(element('h3', '', item.title));
    if (item.location) card.append(element('p', 'event-location', item.location));
    if (item.description) card.append(element('p', '', item.description));
    wrap.append(card);
  });
  target.replaceWith(wrap);
}

function showTexts(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return;
  const heroImage = document.querySelector('.hero-image');
  if (heroImage && typeof data.hero_image === 'string') {
    const src = data.hero_image === '/img/landscape.jpg'
      ? './img/landscape.jpg'
      : safeImage(data.hero_image);
    if (src) heroImage.src = src;
  }
  const mapping = {
    hero_line1: 'hero-line1', hero_line2: 'hero-line2',
    hero_description: 'hero-description',
    intro_lead: 'intro-lead', intro_body: 'intro-body',
    calendar_description: 'calendar-description',
    association_intro: 'association-intro', association_body: 'association-body',
    contact_description: 'contact-description'
  };
  for (const [key, id] of Object.entries(mapping)) {
    if (typeof data[key] === 'string') {
      const node = document.getElementById(id);
      if (node) node.textContent = data[key];
    }
  }
}

Promise.allSettled([
  localContent('tekster.json').then(showTexts),
  localContent('nyheder.json').then(showNews),
  localContent('arrangementer.json').then(showEvents)
]).then(results => {
  results.filter(result => result.status === 'rejected').forEach(result => console.warn(result.reason));
});
