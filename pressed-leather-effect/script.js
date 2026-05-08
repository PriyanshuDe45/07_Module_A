async function exportPNG() {
  const status = document.getElementById('status');
  status.textContent = 'Rendering...';

  const W = 800, H = 560;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const loadImg = src => new Promise((res, rej) => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => res(img); img.onerror = rej;
    img.src = src;
  });

  try {
    const [leather, logo] = await Promise.all([
      loadImg('asset.jpg'), loadImg('logo.png')
    ]);

    // Draw leather base
    ctx.drawImage(leather, 0, 0, W, H);

    // Logo dimensions (55% of width, centered)
    const lw = W * 0.55;
    const lh = lw * (logo.height / logo.width);
    const lx = (W - lw) / 2;
    const ly = (H - lh) / 2;

    // Shadow layer (offset +3,+5, blurred, multiply)
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.35;
    ctx.filter = 'blur(6px) brightness(0%)';
    ctx.drawImage(logo, lx + 3, ly + 5, lw, lh);
    ctx.restore();

    //  Main logo — multiply blend
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.55;
    ctx.filter = 'brightness(60%) contrast(140%)';
    ctx.drawImage(logo, lx, ly, lw, lh);
    ctx.restore();

    // Highlight — screen blend (offset -2,-3)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.12;
    ctx.filter = 'brightness(200%) blur(1px)';
    ctx.drawImage(logo, lx - 2, ly - 3, lw, lh);
    ctx.restore();

    
   
  } catch(e) {
    status.textContent = ' Error: ' + e.message + ' — make sure asset.jpg and logo.png are in the same folder.';
    console.error(e);
  }
}