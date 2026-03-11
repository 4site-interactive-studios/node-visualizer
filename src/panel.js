let panel, closeBtn, coverEl, titleEl, authorEl, genreEl, yearEl, ratingEl, descEl, connEl;

export function initPanel() {
  panel = document.getElementById('detail-panel');
  closeBtn = document.getElementById('panel-close');
  coverEl = document.getElementById('panel-cover');
  titleEl = document.getElementById('panel-title');
  authorEl = document.getElementById('panel-author');
  genreEl = document.getElementById('panel-genre');
  yearEl = document.getElementById('panel-year');
  ratingEl = document.getElementById('panel-rating');
  descEl = document.getElementById('panel-description');
  connEl = document.getElementById('panel-connections');

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanel();
    // Dispatch event so graph knows to deselect
    window.dispatchEvent(new CustomEvent('panel-close'));
  });

  // Prevent clicks inside panel from reaching SVG
  panel.addEventListener('click', (e) => e.stopPropagation());
}

export function openPanel(book, nodeConnections, onConnectionClick) {
  coverEl.innerHTML = '';
  coverEl.appendChild(generateLargeCover(book));

  titleEl.textContent = book.title;
  authorEl.textContent = `by ${book.author}`;
  genreEl.textContent = formatGenre(book.genre);
  yearEl.textContent = book.year;
  ratingEl.innerHTML = renderStars(book.rating);
  descEl.textContent = book.description;

  connEl.innerHTML = '';
  nodeConnections.forEach(({ book: otherBook, type }) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="conn-type ${type}">${formatType(type)}</span> ${otherBook.title}`;
    li.addEventListener('click', () => {
      if (onConnectionClick) onConnectionClick(otherBook);
    });
    connEl.appendChild(li);
  });

  panel.classList.add('open');
}

export function closePanel() {
  panel.classList.remove('open');
}

function generateLargeCover(book) {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 180, 240);
  gradient.addColorStop(0, book.coverColor.primary);
  gradient.addColorStop(1, book.coverColor.secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 180, 240);

  ctx.globalAlpha = 0.1;
  ctx.fillStyle = book.coverColor.accent;
  ctx.beginPath();
  ctx.arc(140, 40, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(30, 200, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = book.coverColor.accent;
  ctx.fillRect(20, 180, 140, 3);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  wrapText(ctx, book.title, 90, 70, 150, 20);

  ctx.font = '11px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(book.author, 90, 215);

  return canvas;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  const maxLines = 4;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y + lineCount * lineHeight);
      line = words[i] + ' ';
      lineCount++;
      if (lineCount >= maxLines) break;
    } else {
      line = testLine;
    }
  }
  if (lineCount < maxLines) {
    ctx.fillText(line.trim(), x, y + lineCount * lineHeight);
  }
}

function renderStars(rating) {
  let html = '';
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  for (let i = 0; i < full; i++) html += '<span class="star-filled">&#9733;</span>';
  if (hasHalf) html += '<span class="star-half">&#9733;</span>';
  for (let i = 0; i < empty; i++) html += '<span class="star-empty">&#9733;</span>';
  html += `<span style="margin-left: 6px; font-size: 0.85rem; color: rgba(255,255,255,0.5)">${rating.toFixed(1)}</span>`;
  return html;
}

function formatType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatGenre(genre) {
  return genre.replace(/\b\w/g, c => c.toUpperCase());
}
