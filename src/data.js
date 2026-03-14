// === Procedural book data generator (250 books) ===

const genreColors = {
  'sci-fi':             { primary: '#0d1b2a', secondary: '#1b263b', accent: '#4fc3f7' },
  'fantasy':            { primary: '#1a0033', secondary: '#2d004d', accent: '#ce93d8' },
  'mystery':            { primary: '#1b1b2f', secondary: '#162447', accent: '#e43f5a' },
  'romance':            { primary: '#3d0000', secondary: '#5c1018', accent: '#f48fb1' },
  'historical fiction': { primary: '#2e1503', secondary: '#4a2c0a', accent: '#ffb74d' },
  'non-fiction':        { primary: '#0a2e0a', secondary: '#1b4332', accent: '#81c784' },
  'horror':             { primary: '#1a0000', secondary: '#2b0000', accent: '#ef5350' },
  'literary fiction':   { primary: '#0d1321', secondary: '#1d2d44', accent: '#90caf9' },
  'thriller':           { primary: '#0f0f1a', secondary: '#1a1a2e', accent: '#ff7043' },
  'memoir':             { primary: '#1a1200', secondary: '#2e2000', accent: '#dce775' },
};

// Seeded PRNG for deterministic output
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Color variation helper
function varyColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.floor((rand() - 0.5) * amount)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.floor((rand() - 0.5) * amount)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.floor((rand() - 0.5) * amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// === Author pool ===
const AUTHORS = [
  { name: 'Elena Vasquez',     genre: 'sci-fi' },
  { name: 'Marcus Blackwell',  genre: 'fantasy' },
  { name: 'Sarah Chen',        genre: 'mystery' },
  { name: 'James Okafor',      genre: 'literary fiction' },
  { name: 'Priya Sharma',      genre: 'romance' },
  { name: 'Henrik Larsson',    genre: 'historical fiction' },
  { name: 'Yuki Tanaka',       genre: 'horror' },
  { name: 'David Kim',         genre: 'non-fiction' },
  { name: 'Amara Obi',         genre: 'fantasy' },
  { name: 'Lena Moretti',      genre: 'sci-fi' },
  { name: 'Rafael Torres',     genre: 'thriller' },
  { name: 'Ingrid Holm',       genre: 'literary fiction' },
  { name: 'Chiara Russo',      genre: 'romance' },
  { name: 'Omar Hassan',       genre: 'historical fiction' },
  { name: 'Nadia Petrova',     genre: 'sci-fi' },
  { name: 'Kwame Asante',      genre: 'fantasy' },
  { name: 'Margot Delacroix',  genre: 'mystery' },
  { name: 'Tobias Greer',      genre: 'horror' },
  { name: 'Aisha Nakamura',    genre: 'non-fiction' },
  { name: 'Soren Ekberg',      genre: 'thriller' },
  { name: 'Luna Reyes',        genre: 'memoir' },
  { name: 'Declan Byrne',      genre: 'literary fiction' },
  { name: 'Fatima Al-Rashid',  genre: 'historical fiction' },
  { name: 'Zara Okonkwo',      genre: 'romance' },
  { name: 'Milo Fontaine',     genre: 'mystery' },
  { name: 'Vera Lindqvist',    genre: 'horror' },
  { name: 'Kai Nakamura',      genre: 'sci-fi' },
  { name: 'Esme Whitfield',    genre: 'memoir' },
];

// === Title word banks by genre ===
const TITLE_WORDS = {
  'sci-fi': {
    adj: ['Quantum', 'Stellar', 'Digital', 'Cosmic', 'Neural', 'Orbital', 'Parallel', 'Frozen', 'Infinite', 'Dark', 'Binary', 'Synthetic', 'Hollow', 'Shattered', 'Silent', 'Crimson', 'Last', 'Final', 'Distant', 'Burning'],
    noun: ['Stars', 'Signal', 'Void', 'Drift', 'Echo', 'Horizon', 'Circuit', 'Algorithm', 'Nexus', 'Threshold', 'Colony', 'Pulse', 'Archive', 'Fracture', 'Frontier', 'Meridian', 'Dawn', 'Paradox', 'Equation', 'Remnant'],
  },
  'fantasy': {
    adj: ['Shadow', 'Iron', 'Golden', 'Ancient', 'Fallen', 'Crimson', 'Emerald', 'Silver', 'Broken', 'Enchanted', 'Mythic', 'Obsidian', 'Wandering', 'Sacred', 'Forsaken', 'Eternal', 'Wild', 'Midnight', 'Frostborn', 'Storm'],
    noun: ['Crown', 'Blade', 'Throne', 'Oracle', 'Kingdom', 'Flame', 'Weaver', 'Spell', 'Rune', 'Chalice', 'Dragon', 'Prophecy', 'Sorcerer', 'Gate', 'Tower', 'Song', 'Oath', 'Heir', 'Veil', 'Spirit'],
  },
  'mystery': {
    adj: ['Silent', 'Hidden', 'Cold', 'Dark', 'Missing', 'Twisted', 'Blind', 'Forgotten', 'Final', 'Hollow', 'Vanishing', 'Buried', 'Deadly', 'Glass', 'Black', 'Shattered', 'Last', 'Double', 'False', 'Crimson'],
    noun: ['Witness', 'Trail', 'Alibi', 'Shadow', 'Case', 'Confession', 'Cipher', 'Suspect', 'Evidence', 'Verdict', 'Corner', 'Secret', 'Trace', 'Deception', 'Game', 'Room', 'Clock', 'Key', 'Night', 'Figure'],
  },
  'romance': {
    adj: ['Stolen', 'Secret', 'Summer', 'Midnight', 'Golden', 'Tender', 'Wild', 'Unexpected', 'Bittersweet', 'Moonlit', 'Bright', 'Gentle', 'Tangled', 'Hidden', 'Forever', 'Fleeting', 'Reckless', 'Autumn', 'Spring', 'Fading'],
    noun: ['Heart', 'Promise', 'Kiss', 'Letters', 'Garden', 'Dance', 'Bridge', 'Shoreline', 'Flame', 'Whisper', 'Chance', 'Bloom', 'Vow', 'Memory', 'Echo', 'Dream', 'Harbor', 'Path', 'Rose', 'Season'],
  },
  'historical fiction': {
    adj: ['Forgotten', 'Ancient', 'Lost', 'Golden', 'Iron', 'Distant', 'Fallen', 'Burning', 'Silent', 'Crimson', 'Forbidden', 'Sacred', 'Final', 'Hidden', 'Shattered', 'Tarnished', 'Stolen', 'Pale', 'Grand', 'Last'],
    noun: ['Empire', 'Crown', 'Fortress', 'Dynasty', 'Sword', 'Harbor', 'Revolution', 'Siege', 'Voyage', 'Throne', 'Archive', 'Relic', 'Cathedral', 'Treaty', 'Conquest', 'Compass', 'Tapestry', 'Chronicle', 'Tomb', 'Decree'],
  },
  'non-fiction': {
    adj: ['Hidden', 'Digital', 'Silent', 'Modern', 'Human', 'Natural', 'Deep', 'Inner', 'Social', 'Radical', 'Quiet', 'Open', 'Real', 'True', 'Connected', 'Broken', 'Living', 'Waking', 'Everyday', 'Invisible'],
    noun: ['Mind', 'Truth', 'Pattern', 'System', 'Network', 'Code', 'Logic', 'Revolution', 'Blueprint', 'Equation', 'Design', 'Framework', 'Question', 'Nature', 'Balance', 'Engine', 'Experiment', 'Future', 'Signal', 'Lens'],
  },
  'horror': {
    adj: ['Hollow', 'Dark', 'Bleeding', 'Rotting', 'Silent', 'Crawling', 'Eyeless', 'Pale', 'Hungry', 'Whispering', 'Drowned', 'Burning', 'Nameless', 'Forgotten', 'Twisted', 'Skinless', 'Last', 'Black', 'Cold', 'Empty'],
    noun: ['House', 'Mirror', 'Bone', 'Skin', 'Teeth', 'Door', 'Grave', 'Shadow', 'Thing', 'Basement', 'Figure', 'Night', 'Well', 'Ritual', 'Mask', 'Cellar', 'Woods', 'Doll', 'Tenant', 'Visitor'],
  },
  'literary fiction': {
    adj: ['Quiet', 'Small', 'Ordinary', 'Last', 'Hidden', 'Infinite', 'Broken', 'Gentle', 'Distant', 'Blue', 'Still', 'Fading', 'Brief', 'Long', 'Slow', 'Bright', 'Narrow', 'Empty', 'Lost', 'Open'],
    noun: ['Light', 'River', 'Hours', 'Room', 'Distance', 'Name', 'Story', 'Water', 'Sky', 'Window', 'Garden', 'Year', 'Morning', 'Evening', 'Stranger', 'Letter', 'Road', 'Season', 'Bridge', 'Weight'],
  },
  'thriller': {
    adj: ['Dead', 'Silent', 'Dark', 'Blind', 'Last', 'Final', 'Cold', 'Burning', 'Fatal', 'Double', 'Shadow', 'Zero', 'Black', 'Red', 'Razor', 'Ghost', 'Steel', 'Locked', 'Deep', 'Fast'],
    noun: ['Protocol', 'Target', 'Edge', 'Line', 'Zone', 'Kill', 'Wire', 'Drop', 'File', 'Agent', 'Contact', 'Point', 'Run', 'Switch', 'Signal', 'Asset', 'Option', 'Mark', 'Grid', 'Extract'],
  },
  'memoir': {
    adj: ['Small', 'Wild', 'Long', 'Strange', 'Quiet', 'Beautiful', 'Difficult', 'Honest', 'Brave', 'Lost', 'Young', 'Hungry', 'Open', 'Simple', 'Broken', 'Tender', 'Loud', 'Raw', 'First', 'Untold'],
    noun: ['Life', 'Year', 'Road', 'Voice', 'Kitchen', 'Childhood', 'Journey', 'World', 'Home', 'Truth', 'Body', 'Heart', 'Country', 'Self', 'Story', 'Place', 'Time', 'Language', 'Song', 'Ground'],
  },
};

// Title templates
const TITLE_TEMPLATES = [
  (a, n) => `The ${a} ${n}`,
  (a, n) => `${a} ${n}`,
  (_a, n) => `The ${n}`,
  (a, n) => `${n} of the ${a}`,
  (a, n) => `The ${a} ${n}s`,
  (a, n) => `${a} and ${n}`,
];

// Series name templates
const SERIES_TEMPLATES = [
  (a, n) => `The ${a} ${n}`,
  (_a, n) => `Chronicles of ${n}`,
  (a, _n) => `The ${a} Cycle`,
  (_a, n) => `${n} Wars`,
  (a, _n) => `The ${a} Saga`,
];

// Description templates
const DESC_TEMPLATES = [
  (title, genre) => `In this gripping ${genre} tale, ${title} explores the boundaries between what we know and what we fear to discover.`,
  (title, genre) => `A masterful work of ${genre} that weaves together fate, ambition, and the human spirit in unexpected ways.`,
  (title, genre) => `${title} plunges readers into a richly imagined world where nothing is as it seems and every choice carries weight.`,
  (title, genre) => `An unforgettable ${genre} journey that challenges assumptions and rewards the curious reader with revelations at every turn.`,
  (title, genre) => `Blending suspense with emotional depth, this ${genre} work asks what it means to be human in a world that keeps shifting beneath our feet.`,
  (title, _genre) => `${title} is a haunting, luminous story about the choices that define us and the secrets that refuse to stay buried.`,
  (_title, genre) => `A bold and inventive ${genre} narrative that will linger in your thoughts long after the final page.`,
  (title, _genre) => `With ${title}, the author delivers a tour de force of imagination, empathy, and razor-sharp storytelling.`,
];

// === Generate data ===

const usedTitles = new Set();
function generateTitle(genre) {
  const words = TITLE_WORDS[genre];
  for (let attempt = 0; attempt < 50; attempt++) {
    const template = pick(TITLE_TEMPLATES);
    const title = template(pick(words.adj), pick(words.noun));
    if (!usedTitles.has(title)) {
      usedTitles.add(title);
      return title;
    }
  }
  // Fallback: add a number
  const t = `${pick(TITLE_WORDS[genre].adj)} ${pick(TITLE_WORDS[genre].noun)} ${Math.floor(rand() * 900) + 100}`;
  usedTitles.add(t);
  return t;
}

function generateColor(genre) {
  const base = genreColors[genre];
  return {
    primary: varyColor(base.primary, 20),
    secondary: varyColor(base.secondary, 20),
    accent: varyColor(base.accent, 30),
  };
}

// Assign books to authors
const TARGET = 250;
const booksPerAuthor = [];
let remaining = TARGET;

AUTHORS.forEach((author, i) => {
  const base = i < 10 ? 8 : 9; // Slightly more for newer authors to fill 250
  const count = Math.min(base + Math.floor(rand() * 4), remaining);
  booksPerAuthor.push(count);
  remaining -= count;
});
// Distribute remainder
while (remaining > 0) {
  for (let i = 0; i < AUTHORS.length && remaining > 0; i++) {
    booksPerAuthor[i]++;
    remaining--;
  }
}

const generatedBooks = [];
const generatedConnections = [];
const seriesList = []; // Track series for same_series connections

let nextId = 0;

AUTHORS.forEach((author, authorIdx) => {
  const count = booksPerAuthor[authorIdx];
  const authorBookIds = [];
  const startYear = 2014 + Math.floor(rand() * 4); // Authors start publishing between 2014-2017

  // Decide series: each author has 0–2 series
  const numSeries = count >= 6 ? (rand() < 0.7 ? 2 : 1) : (rand() < 0.6 ? 1 : 0);
  const seriesConfigs = [];
  for (let s = 0; s < numSeries; s++) {
    const words = TITLE_WORDS[author.genre];
    const template = pick(SERIES_TEMPLATES);
    const seriesName = template(pick(words.adj), pick(words.noun));
    const seriesLength = 2 + Math.floor(rand() * 3); // 2-4 books per series
    seriesConfigs.push({ name: seriesName, length: seriesLength, ids: [] });
  }

  let seriesBooksBudget = seriesConfigs.reduce((sum, s) => sum + s.length, 0);
  const standaloneCount = count - seriesBooksBudget;

  // Generate series books first
  let yearCursor = startYear;
  seriesConfigs.forEach(series => {
    for (let i = 0; i < series.length; i++) {
      const id = nextId++;
      const title = `${series.name}: Book ${i + 1}`;
      usedTitles.add(title);
      const year = yearCursor + Math.floor(rand() * 2);
      yearCursor = year + 1;
      generatedBooks.push({
        id,
        title,
        author: author.name,
        genre: author.genre,
        year: Math.min(year, 2025),
        rating: +(3.5 + rand() * 1.4).toFixed(1),
        description: pick(DESC_TEMPLATES)(title, author.genre),
        coverColor: generateColor(author.genre),
      });
      series.ids.push(id);
      authorBookIds.push(id);
    }
    seriesList.push(series);
  });

  // Generate standalone books
  for (let i = 0; i < standaloneCount; i++) {
    const id = nextId++;
    const title = generateTitle(author.genre);
    const year = startYear + Math.floor(rand() * 11);
    generatedBooks.push({
      id,
      title,
      author: author.name,
      genre: author.genre,
      year: Math.min(year, 2025),
      rating: +(3.2 + rand() * 1.7).toFixed(1),
      description: pick(DESC_TEMPLATES)(title, author.genre),
      coverColor: generateColor(author.genre),
    });
    authorBookIds.push(id);
  }

  // Same-author connections (chain through all of this author's books)
  for (let i = 0; i < authorBookIds.length - 1; i++) {
    generatedConnections.push({
      source: authorBookIds[i],
      target: authorBookIds[i + 1],
      type: 'same_author',
    });
  }
});

// Same-series connections
seriesList.forEach(series => {
  for (let i = 0; i < series.ids.length - 1; i++) {
    generatedConnections.push({
      source: series.ids[i],
      target: series.ids[i + 1],
      type: 'same_series',
    });
  }
});

// Same-genre connections (cross-author within each genre)
const byGenre = {};
generatedBooks.forEach(b => {
  if (!byGenre[b.genre]) byGenre[b.genre] = [];
  byGenre[b.genre].push(b.id);
});

Object.values(byGenre).forEach(ids => {
  const shuffled = shuffle(ids);
  // Create a sparse web: connect ~30% of pairs within genre across different authors
  const numLinks = Math.floor(ids.length * 0.4);
  for (let i = 0; i < numLinks && i + 1 < shuffled.length; i++) {
    const a = generatedBooks[shuffled[i]];
    const b = generatedBooks[shuffled[i + 1]];
    if (a.author !== b.author) {
      generatedConnections.push({
        source: shuffled[i],
        target: shuffled[i + 1],
        type: 'same_genre',
      });
    }
  }
});

// Recommended connections (cross-genre bridges)
const allIds = shuffle(generatedBooks.map(b => b.id));
const numRecommended = Math.floor(generatedBooks.length * 0.2); // ~50 recommended links
for (let i = 0; i < numRecommended; i++) {
  const a = generatedBooks[allIds[i * 2 % allIds.length]];
  const b = generatedBooks[allIds[(i * 2 + 1) % allIds.length]];
  if (a.genre !== b.genre && a.id !== b.id) {
    generatedConnections.push({
      source: a.id,
      target: b.id,
      type: 'recommended',
    });
  }
}

// === Anchor selection: ~20 foundational books (2 per genre) ===
const genreGroups = {};
generatedBooks.forEach(b => {
  if (!genreGroups[b.genre]) genreGroups[b.genre] = [];
  genreGroups[b.genre].push(b);
});
Object.values(genreGroups).forEach(group => {
  // Prefer standalone books (no series notation) with highest ratings
  const candidates = [...group].sort((a, b) => {
    const aIsSeries = a.title.includes(': Book ') ? 1 : 0;
    const bIsSeries = b.title.includes(': Book ') ? 1 : 0;
    if (aIsSeries !== bIsSeries) return aIsSeries - bIsSeries;
    return b.rating - a.rating;
  });
  for (let i = 0; i < Math.min(2, candidates.length); i++) {
    candidates[i].anchor = true;
  }
});

// Deduplicate connections
const connSet = new Set();
const dedupedConnections = [];
generatedConnections.forEach(c => {
  const key = `${Math.min(c.source, c.target)}-${Math.max(c.source, c.target)}-${c.type}`;
  if (!connSet.has(key)) {
    connSet.add(key);
    dedupedConnections.push(c);
  }
});

export const books = generatedBooks;
export const connections = dedupedConnections;
