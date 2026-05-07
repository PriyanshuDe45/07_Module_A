
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const marker = document.getElementById('marker');
  const bSlider = document.getElementById('brightness');
  const bVal = document.getElementById('bval');
  const hexOut = document.getElementById('hexout');
  const swatch = document.getElementById('swatch');
  const hint = document.getElementById('hint');

  const SIZE = 280;
  const CX = SIZE / 2, CY = SIZE / 2, R = SIZE / 2 - 2;

  let pickedHue = null, pickedSat = null;
  let brightness = 100;

  function drawWheel(bright) {
    ctx.clearRect(0, 0, SIZE, SIZE);
    const imageData = ctx.createImageData(SIZE, SIZE);
    const data = imageData.data;
    const b = bright / 100;

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - CX, dy = y - CY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > R) continue;
        const angle = Math.atan2(dy, dx);
        const hue = ((angle * 180 / Math.PI) + 360) % 360;
        const sat = dist / R;
        const [r, g, bl] = hslToRgb(hue / 360, sat, 0.5 * b);
        const i = (y * SIZE + x) * 4;
        data[i] = r; data[i + 1] = g; data[i + 2] = bl; data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function toHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join('');
  }

  function updateResult() {
    if (pickedHue === null) return;
    const b = brightness / 100;
    const [r, g, bl] = hslToRgb(pickedHue / 360, pickedSat, 0.5 * b);
    const hex = toHex(r, g, bl);
    hexOut.textContent = hex;
    swatch.style.background = hex;
    hint.textContent = 'Adjust brightness to change the shade';
  }

  function pickColor(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width, scaleY = SIZE / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const dx = x - CX, dy = y - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > R) return;
    const angle = Math.atan2(dy, dx);
    pickedHue = ((angle * 180 / Math.PI) + 360) % 360;
    pickedSat = dist / R;
    marker.style.display = 'block';
    marker.style.left = (x / SIZE * 100) + '%';
    marker.style.top = (y / SIZE * 100) + '%';
    updateResult();
  }

  canvas.addEventListener('click', pickColor);
  canvas.addEventListener('mousemove', e => { if (e.buttons === 1) pickColor(e); });

  bSlider.addEventListener('input', () => {
    brightness = parseInt(bSlider.value);
    bVal.textContent = brightness + '%';
    drawWheel(brightness);
    updateResult();
  });

  drawWheel(100);
