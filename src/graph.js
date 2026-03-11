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

  // === SVG Defs: filters and clip paths ===
  const defs = svg.append('defs');

  // Glow filter for connection lines
  const glow = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  glow.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
  const glowMerge = glow.append('feMerge');
  glowMerge.append('feMergeNode').attr('in', 'blur');
  glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Strong glow for selected node
  const glowStrong = defs.append('filter')
    .attr('id', 'glow-strong')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  glowStrong.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'blur');
  const strongMerge = glowStrong.append('feMerge');
  strongMerge.append('feMergeNode').attr('in', 'blur');
  strongMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Node glow (subtle halo around each book)
  const nodeGlow = defs.append('filter')
    .attr('id', 'node-glow')
    .attr('x', '-100%').attr('y', '-100%')
    .attr('width', '300%').attr('height', '300%');
  nodeGlow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
  const nodeGlowMerge = nodeGlow.append('feMerge');
  nodeGlowMerge.append('feMergeNode').attr('in', 'blur');
  nodeGlowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

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

  const simulation = d3.forceSimulation(books)
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('link', d3.forceLink(linkData).id(d => d.id).distance(120).strength(0.2))
    .force('collision', d3.forceCollide().radius(NODE_RADIUS + 10))
    .force('x', d3.forceX(width / 2).strength(0.04))
    .force('y', d3.forceY(height / 2).strength(0.06))
    .alphaDecay(0.008)
    .velocityDecay(0.3);

  // === Graph container (zoom target) ===
  const graphGroup = svg.append('g').attr('class', 'graph-layer');

  // === Render links ===
  const linkGroup = graphGroup.append('g').attr('class', 'links');
  const linkElements = linkGroup.selectAll('line')
    .data(linkData)
    .join('line')
    .attr('stroke', d => CONNECTION_COLORS[d.type])
    .attr('stroke-opacity', d => CONNECTION_OPACITY[d.type])
    .attr('stroke-width', 1)
    .style('filter', 'url(#glow)');

  // === Render nodes ===
  const nodeGroup = graphGroup.append('g').attr('class', 'nodes');
  const nodeElements = nodeGroup.selectAll('g.node')
    .data(books)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer');

  // Outer glow ring
  nodeElements.append('circle')
    .attr('r', NODE_RADIUS + 2)
    .attr('fill', 'none')
    .attr('stroke', d => d.coverColor.accent)
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.3)
    .style('filter', 'url(#node-glow)');

  // Glowing center dot (star point) — behind cover image
  nodeElements.append('circle')
    .attr('r', 2.5)
    .attr('fill', '#fff')
    .attr('opacity', 0.85)
    .style('filter', 'url(#glow)');

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

  // Title label (hidden by default, shown on hover)
  nodeElements.append('text')
    .text(d => d.title.length > 20 ? d.title.slice(0, 18) + '...' : d.title)
    .attr('text-anchor', 'middle')
    .attr('dy', NODE_RADIUS + 16)
    .attr('fill', 'rgba(255, 255, 255, 0.7)')
    .attr('font-size', '10px')
    .attr('font-family', 'Segoe UI, system-ui, sans-serif')
    .attr('opacity', 0)
    .attr('class', 'node-label');

  // Hover: show label + highlight connected nodes
  nodeElements
    .on('mouseenter', function (event, d) {
      d3.select(this).select('.node-label')
        .transition().duration(200).attr('opacity', 1);

      if (selectedNode) return;
      if (filteredIds && !filteredIds.has(d.id)) return;

      const connectedIds = getConnectedIds(d);

      nodeElements
        .interrupt('hover-dim')
        .transition('hover-dim')
        .duration(150)
        .style('opacity', n => {
          if (filteredIds && !filteredIds.has(n.id)) return 0.06;
          return connectedIds.has(n.id) ? 1 : 0.3;
        });

      linkElements
        .interrupt('hover-link')
        .transition('hover-link')
        .duration(150)
        .attr('stroke-opacity', l => {
          const srcId = typeof l.source === 'object' ? l.source.id : l.source;
          const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
          if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
          return (srcId === d.id || tgtId === d.id) ? 0.7 : 0.08;
        });
    })
    .on('mouseleave', function () {
      d3.select(this).select('.node-label')
        .transition().duration(200).attr('opacity', 0);

      if (selectedNode) return;

      nodeElements
        .interrupt('hover-dim')
        .transition('hover-dim')
        .duration(300)
        .style('opacity', d => {
          if (filteredIds && !filteredIds.has(d.id)) return 0.06;
          return 1;
        })
        .on('end', function (d) {
          if (!filteredIds || filteredIds.has(d.id)) {
            d3.select(this).style('opacity', null);
          }
        });

      linkElements
        .interrupt('hover-link')
        .transition('hover-link')
        .duration(300)
        .attr('stroke-opacity', l => {
          const srcId = typeof l.source === 'object' ? l.source.id : l.source;
          const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
          if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
          return CONNECTION_OPACITY[l.type];
        });
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

  // === Zoom & Pan ===
  const zoomBehavior = d3.zoom()
    .scaleExtent([0.2, 6])
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
  function getConnectedIds(node) {
    const ids = new Set([node.id]);
    linkData.forEach(c => {
      const srcId = typeof c.source === 'object' ? c.source.id : c.source;
      const tgtId = typeof c.target === 'object' ? c.target.id : c.target;
      if (srcId === node.id) ids.add(tgtId);
      if (tgtId === node.id) ids.add(srcId);
    });
    return ids;
  }

  function getNodeConnections(node) {
    return linkData
      .filter(c => {
        const srcId = typeof c.source === 'object' ? c.source.id : c.source;
        const tgtId = typeof c.target === 'object' ? c.target.id : c.target;
        return srcId === node.id || tgtId === node.id;
      })
      .map(c => {
        const srcId = typeof c.source === 'object' ? c.source.id : c.source;
        const tgtId = typeof c.target === 'object' ? c.target.id : c.target;
        const otherId = srcId === node.id ? tgtId : srcId;
        const otherBook = books.find(b => b.id === otherId);
        return { book: otherBook, type: c.type };
      });
  }

  function selectNode(d) {
    if (selectedNode && selectedNode.id === d.id) return;
    selectedNode = d;

    const connectedIds = getConnectedIds(d);

    // Dim non-connected nodes
    nodeElements
      .interrupt('dim')
      .transition('dim')
      .duration(400)
      .style('opacity', n => connectedIds.has(n.id) ? 1 : 0.1);

    // Highlight connected links
    linkElements
      .interrupt('highlight')
      .transition('highlight')
      .duration(400)
      .attr('stroke-opacity', l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return (srcId === d.id || tgtId === d.id) ? 0.9 : 0.03;
      })
      .attr('stroke-width', l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return (srcId === d.id || tgtId === d.id) ? 2 : 0.5;
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
    linkElements.interrupt('highlight');
    linkElements
      .transition('link-restore')
      .duration(400)
      .attr('stroke-opacity', l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
        return CONNECTION_OPACITY[l.type];
      })
      .attr('stroke-width', 1);

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

  // === Gentle floating reheat ===
  setInterval(() => {
    if (!selectedNode) {
      simulation.alpha(0.03).restart();
    }
  }, 8000);

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

    linkElements
      .interrupt('filter')
      .transition('filter')
      .duration(400)
      .attr('stroke-opacity', l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        if (filteredIds && (!filteredIds.has(srcId) || !filteredIds.has(tgtId))) return 0;
        return CONNECTION_OPACITY[l.type];
      });

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

  // Abbreviated title
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.round(size * 0.2)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const words = book.title.split(' ');
  const line1 = words.slice(0, 2).join(' ');
  const line2 = words.length > 2 ? words.slice(2, 4).join(' ') : '';

  ctx.fillText(line1, size / 2, size / 2 - (line2 ? 5 : 0), size - 4);
  if (line2) {
    ctx.fillText(line2, size / 2, size / 2 + 10, size - 4);
  }

  return canvas.toDataURL();
}
