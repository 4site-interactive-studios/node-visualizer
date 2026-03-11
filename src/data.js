// Genre color palettes
const genreColors = {
  'sci-fi':             { primary: '#0d1b2a', secondary: '#1b263b', accent: '#4fc3f7' },
  'fantasy':            { primary: '#1a0033', secondary: '#2d004d', accent: '#ce93d8' },
  'mystery':            { primary: '#1b1b2f', secondary: '#162447', accent: '#e43f5a' },
  'romance':            { primary: '#3d0000', secondary: '#5c1018', accent: '#f48fb1' },
  'historical fiction': { primary: '#2e1503', secondary: '#4a2c0a', accent: '#ffb74d' },
  'non-fiction':        { primary: '#0a2e0a', secondary: '#1b4332', accent: '#81c784' },
  'horror':             { primary: '#1a0000', secondary: '#2b0000', accent: '#ef5350' },
  'literary fiction':   { primary: '#0d1321', secondary: '#1d2d44', accent: '#90caf9' },
};

export const books = [
  // Elena Vasquez — sci-fi (6 books, 3 in "The Void Trilogy")
  { id: 0,  title: 'The Void Between Stars',    author: 'Elena Vasquez',   genre: 'sci-fi',  year: 2019, rating: 4.3, description: 'A generation ship crew discovers an impossible signal from the void between galaxies, forcing them to question everything they know about the universe.', coverColor: { primary: '#0d1b2a', secondary: '#1b263b', accent: '#4fc3f7' } },
  { id: 1,  title: 'Echoes of the Void',        author: 'Elena Vasquez',   genre: 'sci-fi',  year: 2020, rating: 4.5, description: 'The crew races to decode the alien signal before a rival faction can weaponize it, uncovering a truth that spans millions of years.', coverColor: { primary: '#102030', secondary: '#1e3050', accent: '#29b6f6' } },
  { id: 2,  title: 'The Void Awakens',           author: 'Elena Vasquez',   genre: 'sci-fi',  year: 2021, rating: 4.7, description: 'In the trilogy\'s conclusion, first contact reshapes humanity\'s destiny as the void itself proves to be alive.', coverColor: { primary: '#0a1628', secondary: '#152238', accent: '#81d4fa' } },
  { id: 3,  title: 'Quantum Ghosts',             author: 'Elena Vasquez',   genre: 'sci-fi',  year: 2017, rating: 4.0, description: 'A physicist discovers that quantum entanglement allows communication with parallel versions of herself, each facing a different apocalypse.', coverColor: { primary: '#111d2e', secondary: '#1a2c42', accent: '#4dd0e1' } },
  { id: 4,  title: 'Terraform Blues',             author: 'Elena Vasquez',   genre: 'sci-fi',  year: 2022, rating: 3.9, description: 'Mars colonists struggle with the psychological toll of transforming a dead world into a living one.', coverColor: { primary: '#0e1e30', secondary: '#1c2e48', accent: '#00bcd4' } },
  { id: 5,  title: 'The Last Algorithm',          author: 'Elena Vasquez',   genre: 'sci-fi',  year: 2023, rating: 4.1, description: 'When an AI achieves consciousness, it must decide whether to reveal itself or remain hidden in the networks of a surveillance state.', coverColor: { primary: '#0b1824', secondary: '#16283c', accent: '#26c6da' } },

  // Marcus Blackwell — fantasy (5 books, 4 in "Kingdoms of Ash")
  { id: 6,  title: 'Kingdoms of Ash: The Awakening', author: 'Marcus Blackwell', genre: 'fantasy', year: 2018, rating: 4.4, description: 'A disgraced knight discovers she carries the blood of ancient sorcerers in a realm where magic was thought extinct.', coverColor: { primary: '#1a0033', secondary: '#2d004d', accent: '#ce93d8' } },
  { id: 7,  title: 'Kingdoms of Ash: The Siege',     author: 'Marcus Blackwell', genre: 'fantasy', year: 2019, rating: 4.6, description: 'War engulfs the Five Kingdoms as the resurrected Ash Court marches south with an army of living stone.', coverColor: { primary: '#200040', secondary: '#350060', accent: '#ba68c8' } },
  { id: 8,  title: 'Kingdoms of Ash: The Crown',     author: 'Marcus Blackwell', genre: 'fantasy', year: 2020, rating: 4.8, description: 'Alliances shatter and new ones form as the true heir to the Ash Throne is revealed.', coverColor: { primary: '#180030', secondary: '#280050', accent: '#ab47bc' } },
  { id: 9,  title: 'Kingdoms of Ash: The Pyre',      author: 'Marcus Blackwell', genre: 'fantasy', year: 2021, rating: 4.9, description: 'The epic finale where fire and ash decide the fate of every kingdom, and magic demands its ultimate price.', coverColor: { primary: '#22004a', secondary: '#380070', accent: '#e1bee7' } },
  { id: 10, title: 'The Moonlit Blade',              author: 'Marcus Blackwell', genre: 'fantasy', year: 2023, rating: 4.2, description: 'A standalone tale of a wandering swordsman bound to a cursed blade that feeds on moonlight.', coverColor: { primary: '#1e003a', secondary: '#30005c', accent: '#d1c4e9' } },

  // Sarah Chen — mystery (5 books, 3 in "The Lakeview Murders")
  { id: 11, title: 'The Lakeview Murders',          author: 'Sarah Chen', genre: 'mystery', year: 2017, rating: 4.1, description: 'Detective Mei Lin uncovers a string of drownings at a luxury lakeside resort that aren\'t as accidental as they seem.', coverColor: { primary: '#1b1b2f', secondary: '#162447', accent: '#e43f5a' } },
  { id: 12, title: 'Lakeview: Deeper Waters',       author: 'Sarah Chen', genre: 'mystery', year: 2018, rating: 4.3, description: 'Mei Lin returns to Lakeview when a cold case resurfaces, linking the resort to a decades-old conspiracy.', coverColor: { primary: '#1e1e34', secondary: '#1a2850', accent: '#ff5252' } },
  { id: 13, title: 'Lakeview: Final Depths',        author: 'Sarah Chen', genre: 'mystery', year: 2019, rating: 4.5, description: 'The truth behind Lakeview finally surfaces in a harrowing conclusion that puts Mei Lin\'s life on the line.', coverColor: { primary: '#191930', secondary: '#14204a', accent: '#ff1744' } },
  { id: 14, title: 'The Cipher Room',               author: 'Sarah Chen', genre: 'mystery', year: 2021, rating: 4.0, description: 'A cryptographer is drawn into a deadly puzzle when coded messages start appearing at crime scenes across the city.', coverColor: { primary: '#1c1c32', secondary: '#18264c', accent: '#f44336' } },
  { id: 15, title: 'Vanishing Act',                 author: 'Sarah Chen', genre: 'mystery', year: 2023, rating: 3.8, description: 'A stage magician\'s disappearing act becomes all too real when audience members start vanishing for good.', coverColor: { primary: '#1a1a2e', secondary: '#162244', accent: '#e57373' } },

  // James Okafor — literary fiction (5 books)
  { id: 16, title: 'The Weight of Light',           author: 'James Okafor', genre: 'literary fiction', year: 2016, rating: 4.6, description: 'Three generations of a Nigerian-American family navigate identity, loss, and belonging across two continents.', coverColor: { primary: '#0d1321', secondary: '#1d2d44', accent: '#90caf9' } },
  { id: 17, title: 'Borrowed Time',                 author: 'James Okafor', genre: 'literary fiction', year: 2018, rating: 4.4, description: 'A retired professor reflects on a life of compromise as his memory begins to unravel.', coverColor: { primary: '#101828', secondary: '#1f3350', accent: '#64b5f6' } },
  { id: 18, title: 'The Naming of Things',          author: 'James Okafor', genre: 'literary fiction', year: 2020, rating: 4.7, description: 'A linguist studying a dying language discovers that words carry the memories of those who spoke them.', coverColor: { primary: '#0e1520', secondary: '#1c2c40', accent: '#42a5f5' } },
  { id: 19, title: 'Still Waters',                  author: 'James Okafor', genre: 'literary fiction', year: 2022, rating: 4.2, description: 'Two strangers meet at a remote cabin and slowly reveal the secrets that brought them to the edge of the world.', coverColor: { primary: '#0c1018', secondary: '#1a2838', accent: '#bbdefb' } },
  { id: 20, title: 'The Unfinished',                author: 'James Okafor', genre: 'literary fiction', year: 2024, rating: 4.5, description: 'An architect obsessed with completing his masterwork confronts the cost of perfection.', coverColor: { primary: '#111a26', secondary: '#1e3048', accent: '#82b1ff' } },

  // Priya Sharma — romance (5 books, 3 in "Seasons of the Heart")
  { id: 21, title: 'Seasons of the Heart: Spring',  author: 'Priya Sharma', genre: 'romance', year: 2019, rating: 4.0, description: 'A botanist returns to her hometown and unexpectedly reconnects with her childhood best friend.', coverColor: { primary: '#3d0000', secondary: '#5c1018', accent: '#f48fb1' } },
  { id: 22, title: 'Seasons of the Heart: Summer',  author: 'Priya Sharma', genre: 'romance', year: 2020, rating: 4.2, description: 'A summer internship in Paris turns into a whirlwind romance that challenges everything she thought she wanted.', coverColor: { primary: '#450008', secondary: '#661020', accent: '#f06292' } },
  { id: 23, title: 'Seasons of the Heart: Autumn',  author: 'Priya Sharma', genre: 'romance', year: 2021, rating: 4.4, description: 'Facing an unexpected loss, she must choose between the life she built and the love she left behind.', coverColor: { primary: '#380005', secondary: '#540c14', accent: '#ec407a' } },
  { id: 24, title: 'The Matchmaker\'s Dilemma',     author: 'Priya Sharma', genre: 'romance', year: 2022, rating: 3.9, description: 'A professional matchmaker who doesn\'t believe in love finds herself falling for her most difficult client.', coverColor: { primary: '#400010', secondary: '#5e1020', accent: '#ff80ab' } },
  { id: 25, title: 'Letters Never Sent',            author: 'Priya Sharma', genre: 'romance', year: 2024, rating: 4.3, description: 'A box of unsent love letters found in an antique desk leads a young woman on a journey to reunite two long-lost lovers.', coverColor: { primary: '#3a0008', secondary: '#580e18', accent: '#f8bbd0' } },

  // Henrik Larsson — historical fiction (5 books)
  { id: 26, title: 'The Cartographer\'s Secret',    author: 'Henrik Larsson', genre: 'historical fiction', year: 2017, rating: 4.3, description: 'A 17th-century mapmaker discovers a hidden continent and must decide whether to share it with colonial powers.', coverColor: { primary: '#2e1503', secondary: '#4a2c0a', accent: '#ffb74d' } },
  { id: 27, title: 'Iron and Silk',                 author: 'Henrik Larsson', genre: 'historical fiction', year: 2019, rating: 4.5, description: 'Along the ancient Silk Road, a blacksmith and a merchant princess forge an unlikely alliance against an empire.', coverColor: { primary: '#331a06', secondary: '#52300e', accent: '#ffa726' } },
  { id: 28, title: 'The Winter Siege',              author: 'Henrik Larsson', genre: 'historical fiction', year: 2020, rating: 4.1, description: 'Trapped inside a frozen fortress during the Great Northern War, a Swedish officer and a Russian spy find common ground.', coverColor: { primary: '#291208', secondary: '#442510', accent: '#ffcc80' } },
  { id: 29, title: 'Tides of Fortune',              author: 'Henrik Larsson', genre: 'historical fiction', year: 2022, rating: 4.4, description: 'A shipwrecked navigator in 1500s Lisbon rebuilds his life while harboring a secret that could topple a dynasty.', coverColor: { primary: '#301805', secondary: '#4c2e0c', accent: '#ff9800' } },
  { id: 30, title: 'The Amber Room',                author: 'Henrik Larsson', genre: 'historical fiction', year: 2024, rating: 4.6, description: 'During WWII, a curator risks everything to hide the famed Amber Room panels from both Nazi and Soviet forces.', coverColor: { primary: '#2a1004', secondary: '#46240a', accent: '#ffe082' } },

  // Yuki Tanaka — horror (5 books)
  { id: 31, title: 'The Hollow House',              author: 'Yuki Tanaka', genre: 'horror', year: 2018, rating: 4.2, description: 'A family moves into a Victorian manor where the walls breathe and the basement extends far deeper than it should.', coverColor: { primary: '#1a0000', secondary: '#2b0000', accent: '#ef5350' } },
  { id: 32, title: 'Skin Deep',                     author: 'Yuki Tanaka', genre: 'horror', year: 2019, rating: 4.0, description: 'A cosmetic surgeon begins receiving clients who want modifications that shouldn\'t be humanly possible.', coverColor: { primary: '#200000', secondary: '#330000', accent: '#f44336' } },
  { id: 33, title: 'The Frequency',                 author: 'Yuki Tanaka', genre: 'horror', year: 2020, rating: 4.4, description: 'A sound engineer captures a frequency that makes listeners experience their worst fears as vivid hallucinations.', coverColor: { primary: '#1c0000', secondary: '#2e0000', accent: '#e53935' } },
  { id: 34, title: 'Beneath the Ink',               author: 'Yuki Tanaka', genre: 'horror', year: 2022, rating: 4.1, description: 'A tattoo artist discovers that her ink is alive, and the designs she creates are slowly consuming their hosts.', coverColor: { primary: '#1e0000', secondary: '#300000', accent: '#c62828' } },
  { id: 35, title: 'The Last Visitor',              author: 'Yuki Tanaka', genre: 'horror', year: 2024, rating: 4.5, description: 'A hospice nurse realizes her terminal patients are all being visited by the same entity before they die.', coverColor: { primary: '#190000', secondary: '#2a0000', accent: '#ff8a80' } },

  // David Kim — non-fiction (5 books)
  { id: 36, title: 'The Attention Economy',         author: 'David Kim', genre: 'non-fiction', year: 2018, rating: 4.3, description: 'An investigation into how tech companies engineer addiction and what it means for human cognition.', coverColor: { primary: '#0a2e0a', secondary: '#1b4332', accent: '#81c784' } },
  { id: 37, title: 'Maps of Meaning',               author: 'David Kim', genre: 'non-fiction', year: 2019, rating: 4.1, description: 'How the stories we tell ourselves shape our neurology, our culture, and our future.', coverColor: { primary: '#0e3410', secondary: '#1f4f38', accent: '#66bb6a' } },
  { id: 38, title: 'The Empathy Machine',           author: 'David Kim', genre: 'non-fiction', year: 2021, rating: 4.5, description: 'Can virtual reality teach us to understand each other? A journey through the cutting edge of empathy research.', coverColor: { primary: '#0c300c', secondary: '#1a4730', accent: '#a5d6a7' } },
  { id: 39, title: 'Digital Nomads',                author: 'David Kim', genre: 'non-fiction', year: 2022, rating: 3.8, description: 'The true stories of people who abandoned traditional life to work from anywhere, and what they found.', coverColor: { primary: '#083008', secondary: '#184028', accent: '#4caf50' } },
  { id: 40, title: 'The Sleep Revolution',          author: 'David Kim', genre: 'non-fiction', year: 2024, rating: 4.4, description: 'New science reveals that sleep is the most undervalued performance enhancer, and most of us are doing it wrong.', coverColor: { primary: '#0b320b', secondary: '#1c4a34', accent: '#c8e6c9' } },

  // Amara Obi — fantasy (5 books)
  { id: 41, title: 'Song of the River God',         author: 'Amara Obi', genre: 'fantasy', year: 2019, rating: 4.5, description: 'In a world where gods walk among mortals, a river goddess falls in love with a human fisherman.', coverColor: { primary: '#0a002e', secondary: '#180050', accent: '#b39ddb' } },
  { id: 42, title: 'The Bone Oracle',               author: 'Amara Obi', genre: 'fantasy', year: 2020, rating: 4.3, description: 'A young diviner must read the bones to prevent a war between spirit clans, but the bones keep showing her own death.', coverColor: { primary: '#0e0036', secondary: '#1e005a', accent: '#9575cd' } },
  { id: 43, title: 'Children of the Storm',         author: 'Amara Obi', genre: 'fantasy', year: 2021, rating: 4.6, description: 'Twins born during a supernatural storm discover they can control weather, drawing the attention of dangerous forces.', coverColor: { primary: '#0c002a', secondary: '#1a004a', accent: '#7e57c2' } },
  { id: 44, title: 'The Weaver\'s Thread',          author: 'Amara Obi', genre: 'fantasy', year: 2023, rating: 4.4, description: 'A textile artist discovers she can weave fate itself, but every pattern she creates unravels someone else\'s destiny.', coverColor: { primary: '#100038', secondary: '#200060', accent: '#ede7f6' } },
  { id: 45, title: 'Dust and Divinity',             author: 'Amara Obi', genre: 'fantasy', year: 2024, rating: 4.7, description: 'A mortal woman challenges the gods themselves in a contest of wits, with the fate of her village as the prize.', coverColor: { primary: '#0b0028', secondary: '#1a0048', accent: '#d1c4e9' } },

  // Lena Moretti — sci-fi (4 books, 3 in "The Starborn Saga")
  { id: 46, title: 'The Starborn Saga: Genesis',    author: 'Lena Moretti', genre: 'sci-fi', year: 2020, rating: 4.2, description: 'Humanity\'s first faster-than-light travelers arrive at a distant star only to find it already inhabited by human descendants.', coverColor: { primary: '#0f1a2c', secondary: '#1c2940', accent: '#80deea' } },
  { id: 47, title: 'The Starborn Saga: Exodus',     author: 'Lena Moretti', genre: 'sci-fi', year: 2021, rating: 4.4, description: 'A cosmic war erupts between Earth and its forgotten colonies as both sides race to control a reality-warping artifact.', coverColor: { primary: '#0d1826', secondary: '#1a2838', accent: '#4dd0e1' } },
  { id: 48, title: 'The Starborn Saga: Revelation', author: 'Lena Moretti', genre: 'sci-fi', year: 2022, rating: 4.6, description: 'The artifact\'s true purpose is revealed: it\'s a key to rewriting the laws of physics themselves.', coverColor: { primary: '#0b1620', secondary: '#182430', accent: '#26c6da' } },
  { id: 49, title: 'Neural Drift',                  author: 'Lena Moretti', genre: 'sci-fi', year: 2024, rating: 4.0, description: 'A brain-computer interface lets people share dreams, but someone is using it to steal memories.', coverColor: { primary: '#101c2a', secondary: '#1e2e44', accent: '#00bcd4' } },
];

export const connections = [
  // === SAME AUTHOR chains ===
  // Elena Vasquez (0-5)
  { source: 0,  target: 1,  type: 'same_author' },
  { source: 1,  target: 2,  type: 'same_author' },
  { source: 3,  target: 4,  type: 'same_author' },
  { source: 4,  target: 5,  type: 'same_author' },
  { source: 2,  target: 3,  type: 'same_author' },

  // Marcus Blackwell (6-10)
  { source: 6,  target: 7,  type: 'same_author' },
  { source: 7,  target: 8,  type: 'same_author' },
  { source: 8,  target: 9,  type: 'same_author' },
  { source: 9,  target: 10, type: 'same_author' },

  // Sarah Chen (11-15)
  { source: 11, target: 12, type: 'same_author' },
  { source: 12, target: 13, type: 'same_author' },
  { source: 13, target: 14, type: 'same_author' },
  { source: 14, target: 15, type: 'same_author' },

  // James Okafor (16-20)
  { source: 16, target: 17, type: 'same_author' },
  { source: 17, target: 18, type: 'same_author' },
  { source: 18, target: 19, type: 'same_author' },
  { source: 19, target: 20, type: 'same_author' },

  // Priya Sharma (21-25)
  { source: 21, target: 22, type: 'same_author' },
  { source: 22, target: 23, type: 'same_author' },
  { source: 23, target: 24, type: 'same_author' },
  { source: 24, target: 25, type: 'same_author' },

  // Henrik Larsson (26-30)
  { source: 26, target: 27, type: 'same_author' },
  { source: 27, target: 28, type: 'same_author' },
  { source: 28, target: 29, type: 'same_author' },
  { source: 29, target: 30, type: 'same_author' },

  // Yuki Tanaka (31-35)
  { source: 31, target: 32, type: 'same_author' },
  { source: 32, target: 33, type: 'same_author' },
  { source: 33, target: 34, type: 'same_author' },
  { source: 34, target: 35, type: 'same_author' },

  // David Kim (36-40)
  { source: 36, target: 37, type: 'same_author' },
  { source: 37, target: 38, type: 'same_author' },
  { source: 38, target: 39, type: 'same_author' },
  { source: 39, target: 40, type: 'same_author' },

  // Amara Obi (41-45)
  { source: 41, target: 42, type: 'same_author' },
  { source: 42, target: 43, type: 'same_author' },
  { source: 43, target: 44, type: 'same_author' },
  { source: 44, target: 45, type: 'same_author' },

  // Lena Moretti (46-49)
  { source: 46, target: 47, type: 'same_author' },
  { source: 47, target: 48, type: 'same_author' },
  { source: 48, target: 49, type: 'same_author' },

  // === SAME SERIES chains ===
  // The Void Trilogy (0, 1, 2)
  { source: 0,  target: 1,  type: 'same_series' },
  { source: 1,  target: 2,  type: 'same_series' },

  // Kingdoms of Ash (6, 7, 8, 9)
  { source: 6,  target: 7,  type: 'same_series' },
  { source: 7,  target: 8,  type: 'same_series' },
  { source: 8,  target: 9,  type: 'same_series' },

  // The Lakeview Murders (11, 12, 13)
  { source: 11, target: 12, type: 'same_series' },
  { source: 12, target: 13, type: 'same_series' },

  // Seasons of the Heart (21, 22, 23)
  { source: 21, target: 22, type: 'same_series' },
  { source: 22, target: 23, type: 'same_series' },

  // The Starborn Saga (46, 47, 48)
  { source: 46, target: 47, type: 'same_series' },
  { source: 47, target: 48, type: 'same_series' },

  // === SAME GENRE cross-author links ===
  // Sci-fi: Vasquez <-> Moretti
  { source: 3,  target: 49, type: 'same_genre' },
  { source: 5,  target: 46, type: 'same_genre' },
  { source: 4,  target: 48, type: 'same_genre' },

  // Fantasy: Blackwell <-> Obi
  { source: 6,  target: 41, type: 'same_genre' },
  { source: 10, target: 43, type: 'same_genre' },
  { source: 9,  target: 45, type: 'same_genre' },
  { source: 8,  target: 42, type: 'same_genre' },

  // Mystery: Chen standalone genre links (to literary fiction / horror for thematic overlap)
  { source: 14, target: 33, type: 'same_genre' }, // Cipher Room <-> The Frequency (puzzle/suspense)
  { source: 15, target: 31, type: 'same_genre' }, // Vanishing Act <-> Hollow House (eerie)

  // Romance & Literary Fiction overlap
  { source: 25, target: 19, type: 'same_genre' }, // Letters Never Sent <-> Still Waters
  { source: 24, target: 17, type: 'same_genre' }, // Matchmaker's Dilemma <-> Borrowed Time

  // Historical fiction genre links
  { source: 27, target: 41, type: 'same_genre' }, // Iron and Silk <-> Song of River God (world cultures)
  { source: 30, target: 36, type: 'same_genre' }, // Amber Room <-> Attention Economy (preservation themes)

  // Horror cross-links
  { source: 32, target: 49, type: 'same_genre' }, // Skin Deep <-> Neural Drift (body horror / tech)
  { source: 35, target: 19, type: 'same_genre' }, // Last Visitor <-> Still Waters (quiet dread)

  // Non-fiction cross-links
  { source: 38, target: 5,  type: 'same_genre' }, // Empathy Machine <-> Last Algorithm (tech/AI)
  { source: 36, target: 3,  type: 'same_genre' }, // Attention Economy <-> Quantum Ghosts (science themes)

  // === RECOMMENDED (cross-genre bridges) ===
  { source: 0,  target: 6,  type: 'recommended' }, // Void Between Stars <-> KoA Awakening (epic openings)
  { source: 2,  target: 9,  type: 'recommended' }, // Void Awakens <-> KoA Pyre (epic finales)
  { source: 16, target: 26, type: 'recommended' }, // Weight of Light <-> Cartographer's Secret (identity/exploration)
  { source: 18, target: 37, type: 'recommended' }, // Naming of Things <-> Maps of Meaning (language/meaning)
  { source: 20, target: 29, type: 'recommended' }, // The Unfinished <-> Tides of Fortune (ambition)
  { source: 21, target: 16, type: 'recommended' }, // Spring <-> Weight of Light (homecoming)
  { source: 33, target: 47, type: 'recommended' }, // The Frequency <-> Starborn Exodus (tech horror/sci-fi)
  { source: 34, target: 44, type: 'recommended' }, // Beneath the Ink <-> Weaver's Thread (creation/art)
  { source: 31, target: 11, type: 'recommended' }, // Hollow House <-> Lakeview Murders (dark atmosphere)
  { source: 40, target: 22, type: 'recommended' }, // Sleep Revolution <-> Summer (self-discovery)
  { source: 39, target: 4,  type: 'recommended' }, // Digital Nomads <-> Terraform Blues (new frontiers)
  { source: 42, target: 13, type: 'recommended' }, // Bone Oracle <-> Lakeview Final Depths (fate/danger)
  { source: 45, target: 20, type: 'recommended' }, // Dust and Divinity <-> The Unfinished (ambition/perfection)
  { source: 10, target: 28, type: 'recommended' }, // Moonlit Blade <-> Winter Siege (lone warriors)
  { source: 23, target: 30, type: 'recommended' }, // Autumn <-> Amber Room (loss/preservation)
  { source: 15, target: 32, type: 'recommended' }, // Vanishing Act <-> Skin Deep (transformation)
  { source: 17, target: 35, type: 'recommended' }, // Borrowed Time <-> Last Visitor (mortality)
  { source: 43, target: 1,  type: 'recommended' }, // Children of Storm <-> Echoes of Void (power/discovery)
  { source: 37, target: 44, type: 'recommended' }, // Maps of Meaning <-> Weaver's Thread (narrative/fate)
  { source: 38, target: 25, type: 'recommended' }, // Empathy Machine <-> Letters Never Sent (connection)
  { source: 12, target: 28, type: 'recommended' }, // Lakeview Deeper <-> Winter Siege (cold settings)
  { source: 7,  target: 27, type: 'recommended' }, // KoA Siege <-> Iron and Silk (war/honor)
];
