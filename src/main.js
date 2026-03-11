import { books, connections } from './data.js';
import { initStars } from './stars.js';
import { initGraph } from './graph.js';
import { initPanel, openPanel, closePanel } from './panel.js';

// Initialize background stars
initStars(document.getElementById('star-canvas'));

// Initialize side panel
initPanel();

// Navigation callback holder
let navigateToBook = null;

// Initialize the D3 graph
initGraph(document.getElementById('graph-svg'), books, connections, {
  onNodeSelect: (book, nodeConnections) => {
    openPanel(book, nodeConnections, (otherBook) => {
      if (navigateToBook) navigateToBook(otherBook);
    });
  },
  onNodeDeselect: () => {
    closePanel();
  },
  onNodeNavigate: (fn) => {
    navigateToBook = fn;
  },
});
