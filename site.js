const grid = document.getElementById('grid');
const frameId = document.getElementById('frameId');
const pilot = [...document.querySelectorAll('.pilot i')];

if (grid) {
  const cells = Array.from({ length: 18 * 14 }, () => {
    const el = document.createElement('i');
    grid.appendChild(el);
    return el;
  });

  let frame = 0;
  const render = () => {
    frame += 1;
    const seed = frame * 1103515245 + 12345;
    cells.forEach((cell, index) => {
      const value = Math.sin((seed + index * 7919) * 0.0000137) + Math.cos((frame * 17 + index) * 0.41);
      cell.classList.toggle('on', value > 0);
    });
    const gray = frame ^ (frame >> 1);
    pilot.forEach((cell, index) => cell.classList.toggle('on', Boolean(gray & (1 << index))));
    if (frameId) frameId.textContent = `FRAME ${String(frame % 10000).padStart(4, '0')}`;
  };

  render();
  setInterval(render, 180);
}
