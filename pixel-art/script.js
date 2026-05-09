
  const COLS = 20, ROWS = 20, SIZE = 10; // SIZE = pixel size in box-shadow (10px as per spec)
  const grid = document.getElementById('grid');
  const colorPicker = document.getElementById('colorPicker');
  const drawBtn = document.getElementById('drawBtn');
  const eraserBtn = document.getElementById('eraserBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const toast = document.getElementById('toast');

  let isDrawing = false;
  let mode = 'draw'; // 'draw' | 'erase'
  const cells = [];

  // Build grid
  for (let r = 0; r < ROWS; r++) {
    cells[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      grid.appendChild(cell);
      cells[r][c] = { el: cell, color: null };
    }
  }

  function paint(cell) {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    if (mode === 'draw') {
      const color = colorPicker.value;
      cells[r][c].color = color;
      cell.style.background = color;
    } else {
      cells[r][c].color = null;
      cell.style.background = '#fff';
    }
  }

  grid.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('cell')) return;
    isDrawing = true;
    paint(e.target);
  });

  grid.addEventListener('mouseover', e => {
    if (!isDrawing || !e.target.classList.contains('cell')) return;
    paint(e.target);
  });

  document.addEventListener('mouseup', () => isDrawing = false);

  // Prevent drag issues
  grid.addEventListener('dragstart', e => e.preventDefault());

  drawBtn.addEventListener('click', () => {
    mode = 'draw';
    drawBtn.classList.add('active');
    eraserBtn.classList.remove('active');
  });

  eraserBtn.addEventListener('click', () => {
    mode = 'erase';
    eraserBtn.classList.add('active');
    drawBtn.classList.remove('active');
  });

  clearBtn.addEventListener('click', () => {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        cells[r][c].color = null;
        cells[r][c].el.style.background = '#fff';
      }
  });

  copyBtn.addEventListener('click', () => {
    const shadows = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = cells[r][c].color;
        if (color) {
          const x = (c + 1) * SIZE;
          const y = (r + 1) * SIZE;
          shadows.push(`${x}px ${y}px 0 0 ${color}`);
        }
      }
    }

    if (shadows.length === 0) {
      showToast('Nothing drawn!');
      return;
    }

    const css = `.pixel-to-css {\n    box-shadow: ${shadows.join(', ')};\n    width: ${SIZE}px;\n    height: ${SIZE}px;\n}`;

    navigator.clipboard.writeText(css).then(() => showToast('Copied to clipboard!'));
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }
