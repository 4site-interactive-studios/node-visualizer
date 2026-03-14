import * as d3 from 'd3';

const CONNECTION_COLORS = {
  same_author:  '#64b5f6',
  same_genre:   '#81c784',
  same_series:  '#ffb74d',
  recommended:  '#ce93d8',
};

const CONNECTION_OPACITY = {
  same_author:  0.55,
  same_genre:   0.35,
  same_series:  0.65,
  recommended:  0.3,
};

const NODE_RADIUS = 22;
const PANEL_WIDTH = 380;

export function initGraph(svgElement, books, connections, { onNodeSelect, onNodeDeselect, onNodeNavigate }) {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let selectedNode = null;
  let filteredIds = null; // null = no filter active (show all)

  const svg = d3.select(svgElement)
    .attr('width', width)
    .attr('height', height);

  // === SVG Defs: clip paths + anchor glow filter ===
  const defs = svg.append('defs');

  // Soft glow filter for anchor nodes
  const glowFilter = defs.append('filter')
    .attr('id', 'anchor-glow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  glowFilter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 6)
    .attr('result', 'blur');
  const glowMerge = glowFilter.append('feMerge');
  glowMerge.append('feMergeNode').attr('in', 'blur');
  glowMerge.append('feMergeNode').attr('in', 'blur');
  glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Circular clip paths for book covers
  books.forEach(book => {
    defs.append('clipPath')
      .attr('id', `clip-${book.id}`)
      .append('circle')
      .attr('r', NODE_RADIUS);
  });

  // === Generate placeholder covers ===
  const coverMap = new Map();
  books.forEach(book => {
    coverMap.set(book.id, generateCover(book));
  });

  // === Force simulation ===
  // Deep copy connections so D3 mutation doesn't affect original data
  const linkData = connections.map(c => ({ ...c }));

  // Pre-build adjacency map for fast lookups (avoids O(n) scans on every hover)
  const adjacency = new Map(); // nodeId -> Set of connected nodeIds
  const nodeLinkMap = new Map(); // nodeId -> array of link indices
  linkData.forEach((c, i) => {
    const srcId = typeof c.source === 'object' ? c.source.id : c.source;
    const tgtId = typeof c.target === 'object' ? c.target.id : c.target;
    if (!adjacency.has(srcId)) adjacency.set(srcId, new Set());
    if (!adjacency.has(tgtId)) adjacency.set(tgtId, new Set());
    adjacency.get(srcId).add(tgtId);
    adjacency.get(tgtId).add(srcId);
    if (!nodeLinkMap.has(srcId)) nodeLinkMap.set(srcId, []);
    if (!nodeLinkMap.has(tgtId)) nodeLinkMap.set(tgtId, []);
    nodeLinkMap.get(srcId).push(i);
    nodeLinkMap.get(tgtId).push(i);
  });

  const simulation = d3.forceSimulation(books)
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('link', d3.forceLink(linkData).id(d => d.id).distance(80).strength(0.15))
    .force('collision', d3.forceCollide().radius(NODE_RADIUS + 6))
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.07))
    .alphaDecay(0.02)
    .velocityDecay(0.35);

  // === Graph container (zoom target) ===
  const graphGroup = svg.append('g').attr('class', 'graph-layer')
    .attr('opacity', 0); // Start hidden; fade in after layout settles

  // === Render links (single layer — no glow) ===
  const linkGroup = graphGroup.append('g').attr('class', 'links');
  const linkElements = linkGroup.selectAll('line')
    .data(linkData)
    .join('line')
    .attr('stroke', d => CONNECTION_COLORS[d.type])
    .attr('stroke-opacity', d => CONNECTION_OPACITY[d.type])
    .attr('stroke-width', 1.5)
    .attr('stroke-linecap', 'round');

  // === Render nodes ===
  const nodeGroup = graphGroup.append('g').attr('class', 'nodes');

  // Overlay groups — sit above base layers for highlighted elements
  const linkOverlay = graphGroup.append('g').attr('class', 'links-overlay');
  const nodeOverlay = graphGroup.append('g').attr('class', 'nodes-overlay');

  const nodeElements = nodeGroup.selectAll('g.node')
    .data(books)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer');

  // Anchor: large soft glow disc (blurred, behind everything)
  nodeElements.filter(d => d.anchor).append('circle')
    .attr('r', NODE_RADIUS + 12)
    .attr('fill', d => d.coverColor.accent)
    .attr('fill-opacity', 0.15)
    .attr('stroke', 'none')
    .attr('filter', 'url(#anchor-glow)')
    .attr('pointer-events', 'none');

  // Anchor: outer glow ring
  nodeElements.filter(d => d.anchor).append('circle')
    .attr('r', NODE_RADIUS + 8)
    .attr('fill', 'none')
    .attr('stroke', d => d.coverColor.accent)
    .attr('stroke-width', 2.5)
    .attr('stroke-opacity', 0.4)
    .attr('pointer-events', 'none');

  // Anchor: sparkle ring (animated dashed stroke)
  nodeElements.filter(d => d.anchor).append('circle')
    .attr('r', NODE_RADIUS + 5)
    .attr('fill', 'none')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.5)
    .attr('stroke-dasharray', '2 8')
    .attr('class', 'anchor-sparkle')
    .attr('pointer-events', 'none');

  // Outer ring — accent border
  nodeElements.append('circle')
    .attr('r', NODE_RADIUS + 2)
    .attr('fill', 'none')
    .attr('stroke', d => d.coverColor.accent)
    .attr('stroke-width', d => d.anchor ? 2.5 : 1)
    .attr('stroke-opacity', d => d.anchor ? 0.85 : 0.4)
    .attr('pointer-events', 'none');

  // Cover image (clipped to circle)
  nodeElements.append('image')
    .attr('href', d => coverMap.get(d.id))
    .attr('width', NODE_RADIUS * 2)
    .attr('height', NODE_RADIUS * 2)
    .attr('x', -NODE_RADIUS)
    .attr('y', -NODE_RADIUS)
    .attr('clip-path', d => `url(#clip-${d.id})`)
    .attr('preserveAspectRatio', 'xMidYMid slice');

  // Invisible hit area for easier clicking
  nodeElements.append('circle')
    .attr('r', NODE_RADIUS + 5)
    .attr('fill', 'transparent')
    .attr('class', 'hit-area');


  // === Overlay promote / demote ===
  function getConnectedIds(node) {
    const ids = new Set([node.id]);
    const neighbors = adjacency.get(node.id);
    if (neighbors) neighbors.forEach(id => ids.add(id));
    return ids;
  }

  // Move only link lines above nodes (safe for hover — no DOM re-parenting of nodes)
  function promoteLinksOnly(nodeId) {
    const indices = nodeLinkMap.get(nodeId);
    if (indices) {
      const overlayNode = linkOverlay.node();
      indices.forEach(i => overlayNode.appendChild(linkElements.nodes()[i]));
    }
  }
  // Move links AND connected nodes above (used on click/select only)
  function promoteAll(nodeId) {
    promoteLinksOnly(nodeId);
    const connectedIds = getConnectedIds({ id: nodeId });
    nodeElements.each(function (d) {
      if (connectedIds.has(d.id)) nodeOverlay.node().appendChild(this);
    });
  }
  function demoteAll() {
    const linkGroupNode = linkGroup.node();
    linkOverlay.selectAll('line').each(function () {
      linkGroupNode.appendChild(this);
    });
    const nodeGroupNode = nodeGroup.node();
    nodeOverlay.selectAll('g.node').each(function () {
      nodeGroupNode.appendChild(this);
    });
  }

  // Track hovered node and deferred restore
  let hoveredNode = null;
  let hoverRestoreTimer = null;

  function restoreHover() {
    nodeElements.interrupt('hover-dim').style('opacity', n => {
      if (filteredIds && !filteredIds.has(n.id)) return 0.06;
      return null;
    });
    linkElements.interrupt('hover-link').attr('stroke-opacity', l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
      return CONNECTION_OPACITY[l.type];
    });
  }

  // Hover: show label + highlight connected nodes (instant — no transitions for perf)
  nodeElements
    .on('mouseenter', function (event, d) {
      if (selectedNode) return;
      if (filteredIds && !filteredIds.has(d.id)) return;

      // Cancel any pending restore — cursor landed on a new node
      if (hoverRestoreTimer) { clearTimeout(hoverRestoreTimer); hoverRestoreTimer = null; }

      // Clean up previous hover state if switching between nodes
      hoveredNode = d;

      const connectedIds = getConnectedIds(d);

      // Instant opacity changes (no transitions — avoids 600+ concurrent timers)
      nodeElements.interrupt('hover-dim').style('opacity', n => {
        if (filteredIds && !filteredIds.has(n.id)) return 0.06;
        return connectedIds.has(n.id) ? 1 : 0.3;
      });

      linkElements.interrupt('hover-link').attr('stroke-opacity', l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
        return (srcId === d.id || tgtId === d.id) ? 0.8 : 0.06;
      });
    })
    .on('mouseleave', function (event, d) {
      if (selectedNode) return;
      if (!hoveredNode || hoveredNode.id !== d.id) return;

      // Defer restore — if cursor lands on another node within 150ms, cancel
      hoveredNode = null;
      hoverRestoreTimer = setTimeout(() => {
        hoverRestoreTimer = null;
        if (!hoveredNode && !selectedNode) restoreHover();
      }, 150);
    });

  // === Tick ===
  simulation.on('tick', () => {
    linkElements
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeElements
      .attr('transform', d => `translate(${d.x}, ${d.y})`);
  });

  // === Pre-settle layout (prevents visible jumbling on load) ===
  simulation.stop();
  simulation.tick(300);   // Synchronously compute ~300 iterations
  simulation.alpha(0.01); // Near-zero energy — essentially static
  simulation.restart();

  // Compute min zoom to fit all nodes (with a little extra room to zoom out past)
  const padding = 60;
  const xExtent = d3.extent(books, d => d.x);
  const yExtent = d3.extent(books, d => d.y);
  const graphW = (xExtent[1] - xExtent[0]) + padding * 2;
  const graphH = (yExtent[1] - yExtent[0]) + padding * 2;
  const fitScale = Math.min(width / graphW, height / graphH);
  const minZoom = fitScale * 0.8; // Allow ~20% past the fit-all boundary

  // Fade the settled constellation in
  graphGroup.transition('reveal')
    .duration(800)
    .ease(d3.easeCubicOut)
    .attr('opacity', 1);

  // === Zoom & Pan ===
  const zoomBehavior = d3.zoom()
    .scaleExtent([minZoom, 6])
    .on('zoom', (event) => {
      graphGroup.attr('transform', event.transform);
    });

  svg.call(zoomBehavior);

  // Disable double-click zoom (we use click for selection)
  svg.on('dblclick.zoom', null);

  function zoomToNode(node) {
    const scale = 2.5;
    const availableWidth = selectedNode ? width - PANEL_WIDTH : width;
    const transform = d3.zoomIdentity
      .translate(availableWidth / 2, height / 2)
      .scale(scale)
      .translate(-node.x, -node.y);

    svg.transition('zoom')
      .duration(750)
      .ease(d3.easeCubicInOut)
      .call(zoomBehavior.transform, transform);
  }

  // === Click to select ===
  function getNodeConnections(node) {
    const indices = nodeLinkMap.get(node.id) || [];
    return indices.map(i => {
      const c = linkData[i];
      const srcId = typeof c.source === 'object' ? c.source.id : c.source;
      const tgtId = typeof c.target === 'object' ? c.target.id : c.target;
      const otherId = srcId === node.id ? tgtId : srcId;
      const otherBook = books.find(b => b.id === otherId);
      return { book: otherBook, type: c.type };
    });
  }

  function selectNode(d) {
    if (selectedNode && selectedNode.id === d.id) return;
    demoteAll(); // Return any previously promoted elements
    selectedNode = d;

    const connectedIds = getConnectedIds(d);
    promoteAll(d.id);

    // Dim non-connected nodes
    nodeElements
      .interrupt('dim')
      .transition('dim')
      .duration(400)
      .style('opacity', n => connectedIds.has(n.id) ? 1 : 0.1);

    // Highlight connected links
    const selectLinkOpacity = l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      return (srcId === d.id || tgtId === d.id) ? 0.9 : 0.03;
    };
    linkElements
      .interrupt('highlight')
      .transition('highlight')
      .duration(400)
      .attr('stroke-opacity', selectLinkOpacity)
      .attr('stroke-width', l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return (srcId === d.id || tgtId === d.id) ? 2.5 : 0.5;
      });

    // Zoom in
    zoomToNode(d);

    // Notify panel
    onNodeSelect(d, getNodeConnections(d));
  }

  nodeElements.on('click', (event, d) => {
    event.stopPropagation();
    selectNode(d);
  });

  // Deselect on background click
  svg.on('click', () => {
    if (selectedNode) deselectNode();
  });

  // Escape to deselect
  d3.select('body').on('keydown', (event) => {
    if (event.key === 'Escape' && selectedNode) deselectNode();
  });

  // Panel close button triggers deselect via custom event
  window.addEventListener('panel-close', () => {
    deselectNode();
  });

  function deselectNode() {
    if (!selectedNode) return;
    selectedNode = null;
    demoteAll();

    // Animate zoom out (filter-aware: zoom to fit filtered nodes, or reset to identity)
    svg.interrupt('zoom');
    if (filteredIds) {
      const visibleBooks = books.filter(b => filteredIds.has(b.id));
      if (visibleBooks.length > 0) {
        const padding = 80;
        const xExtent = d3.extent(visibleBooks, d => d.x);
        const yExtent = d3.extent(visibleBooks, d => d.y);
        const bboxW = (xExtent[1] - xExtent[0]) + padding * 2;
        const bboxH = (yExtent[1] - yExtent[0]) + padding * 2;
        const cx = (xExtent[0] + xExtent[1]) / 2;
        const cy = (yExtent[0] + yExtent[1]) / 2;
        const scale = Math.min(width / bboxW, height / bboxH, 2.5);
        const transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-cx, -cy);
        svg.transition('zoom')
          .duration(750)
          .ease(d3.easeCubicInOut)
          .call(zoomBehavior.transform, transform);
      }
    } else {
      const currentTransform = d3.zoomTransform(svg.node());
      if (currentTransform.k !== 1 || currentTransform.x !== 0 || currentTransform.y !== 0) {
        graphGroup.transition('zoom-reset')
          .duration(750)
          .ease(d3.easeCubicInOut)
          .attr('transform', 'translate(0,0) scale(1)');
        svg.property('__zoom', d3.zoomIdentity);
      }
    }

    // Restore node opacities (respect active filter)
    nodeElements.interrupt('dim');
    nodeElements.transition('dim').duration(400)
      .style('opacity', d => {
        if (filteredIds && !filteredIds.has(d.id)) return 0.06;
        return 1;
      })
      .style('pointer-events', d => {
        if (filteredIds && !filteredIds.has(d.id)) return 'none';
        return 'all';
      })
      .on('end', function(d) {
        if (!filteredIds || filteredIds.has(d.id)) {
          d3.select(this).style('opacity', null).style('pointer-events', null);
        }
      });

    // Restore link styles (respect active filter)
    const restoreOpacity = l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
      return CONNECTION_OPACITY[l.type];
    };
    linkElements.interrupt('highlight');
    linkElements.transition('link-restore').duration(400)
      .attr('stroke-opacity', restoreOpacity)
      .attr('stroke-width', 1.5);

    onNodeDeselect();
  }

  // === Drag ===
  const drag = d3.drag()
    .clickDistance(4)
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });

  nodeElements.call(drag);

  // === Zoom control buttons ===
  const ZOOM_STEP = 1.4;
  document.getElementById('zoom-in').addEventListener('click', () => {
    svg.transition('zoom').duration(300).ease(d3.easeCubicOut)
      .call(zoomBehavior.scaleBy, ZOOM_STEP);
  });
  document.getElementById('zoom-out').addEventListener('click', () => {
    svg.transition('zoom').duration(300).ease(d3.easeCubicOut)
      .call(zoomBehavior.scaleBy, 1 / ZOOM_STEP);
  });
  document.getElementById('zoom-reset').addEventListener('click', () => {
    svg.transition('zoom').duration(500).ease(d3.easeCubicInOut)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  });

  // === Resize handler ===
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.attr('width', width).attr('height', height);
    simulation.force('center', d3.forceCenter(width / 2, height / 2));
    simulation.force('x', d3.forceX(width / 2).strength(0.03));
    simulation.force('y', d3.forceY(height / 2).strength(0.05));
    simulation.alpha(0.3).restart();
  });

  // === Public API for navigating to a book from panel connections ===
  if (onNodeNavigate) {
    onNodeNavigate((book) => {
      selectNode(book);
    });
  }

  // === Filter API ===
  function applyFilter(visibleIds) {
    if (selectedNode) return;

    filteredIds = visibleIds.size === books.length ? null : visibleIds;

    nodeElements
      .interrupt('filter')
      .transition('filter')
      .duration(400)
      .style('opacity', d => (!filteredIds || filteredIds.has(d.id)) ? 1 : 0.06)
      .style('pointer-events', d => (!filteredIds || filteredIds.has(d.id)) ? 'all' : 'none');

    const filterLinkOpacity = l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
      return CONNECTION_OPACITY[l.type];
    };
    linkElements.interrupt('filter').transition('filter').duration(400)
      .attr('stroke-opacity', filterLinkOpacity);

    // Zoom to frame visible nodes
    if (filteredIds) {
      const visibleBooks = books.filter(b => filteredIds.has(b.id));
      if (visibleBooks.length > 0) {
        const padding = 80;
        const xExtent = d3.extent(visibleBooks, d => d.x);
        const yExtent = d3.extent(visibleBooks, d => d.y);
        const bboxW = (xExtent[1] - xExtent[0]) + padding * 2;
        const bboxH = (yExtent[1] - yExtent[0]) + padding * 2;
        const cx = (xExtent[0] + xExtent[1]) / 2;
        const cy = (yExtent[0] + yExtent[1]) / 2;
        const scale = Math.min(width / bboxW, height / bboxH, 2.5);
        const transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-cx, -cy);

        svg.transition('zoom')
          .duration(750)
          .ease(d3.easeCubicInOut)
          .call(zoomBehavior.transform, transform);
      }
    } else {
      // No filter — reset zoom to identity
      svg.transition('zoom')
        .duration(750)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    }
  }

  return { selectNode, deselectNode, applyFilter };
}

// === Cover generator ===
function generateCover(book) {
  const size = NODE_RADIUS * 2;
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, book.coverColor.primary);
  gradient.addColorStop(1, book.coverColor.secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Accent stripe
  ctx.fillStyle = book.coverColor.accent;
  ctx.fillRect(0, size - 8, size, 3);

  // Abbreviated title — positioned near top of visible circle area
  ctx.fillStyle = '#fff';
  const fontSize = Math.round(size * 0.2);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const words = book.title.split(' ');
  const line1 = words.slice(0, 2).join(' ');
  const line2 = words.length > 2 ? words.slice(2, 4).join(' ') : '';
  const lineHeight = fontSize * 1.25;
  const totalTextH = line2 ? lineHeight * 2 : lineHeight;
  const startY = (size - totalTextH) / 2 - 2;

  ctx.fillText(line1, size / 2, startY, size - 4);
  if (line2) {
    ctx.fillText(line2, size / 2, startY + lineHeight, size - 4);
  }

  return canvas.toDataURL();
}
