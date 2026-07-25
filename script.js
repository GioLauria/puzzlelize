(() => {
  const fileInput = document.getElementById('imgfile');
  const rowsInput = document.getElementById('rows');
  const colsInput = document.getElementById('cols');
  const totalInput = document.getElementById('total');
  const applyGridBtn = document.getElementById('applyGrid');
  const scrambleBtn = document.getElementById('scramble');
  const resetBtn = document.getElementById('reset');
  const board = document.getElementById('board');

  let img = null;
  let rows = 4, cols = 4;
  let pieces = []; // {id, dataUrl, origPos}
  let boardPos = []; // boardPos[index] = pieceId
  let pieceW = 0, pieceH = 0, boardW = 0, boardH = 0;
  let cursor = {r:0,c:0};
  let selected = null; // index of selected piece (board index)
  let originalBoardPos = [];

  function updateTotalFromRowsCols(){
    totalInput.value = rows * cols;
  }

  function computeGridFromTotal(n){
    let r = Math.floor(Math.sqrt(n));
    let c = Math.ceil(n / r);
    return {r,c};
  }

  totalInput.addEventListener('change', () => {
    const t = Math.max(1, parseInt(totalInput.value)||1);
    const g = computeGridFromTotal(t);
    rowsInput.value = g.r; colsInput.value = g.c;
  });

  applyGridBtn.addEventListener('click', () => {
    rows = Math.max(1, parseInt(rowsInput.value)||1);
    cols = Math.max(1, parseInt(colsInput.value)||1);
    updateTotalFromRowsCols();
    if(img) preparePieces(img);
  });

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const i = new Image();
      i.onload = () => {
        img = i;
        rows = Math.max(1, parseInt(rowsInput.value)||4);
        cols = Math.max(1, parseInt(colsInput.value)||4);
        updateTotalFromRowsCols();
        preparePieces(i);
      };
      i.src = ev.target.result;
    };
    reader.readAsDataURL(f);
  });

  function preparePieces(image){
    // scale image to fit board max width
    const maxW = 700;
    const scale = Math.min(1, maxW / image.width);
    boardW = Math.round(image.width * scale);
    boardH = Math.round(image.height * scale);

    const full = document.createElement('canvas');
    full.width = boardW; full.height = boardH;
    const fc = full.getContext('2d');
    fc.drawImage(image, 0, 0, boardW, boardH);

    pieceW = Math.floor(boardW / cols);
    pieceH = Math.floor(boardH / rows);

    pieces = [];
    const total = rows * cols;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const pc = document.createElement('canvas');
        pc.width = pieceW; pc.height = pieceH;
        const pctx = pc.getContext('2d');
        pctx.drawImage(full, c*pieceW, r*pieceH, pieceW, pieceH, 0,0,pieceW,pieceH);
        const data = pc.toDataURL();
        const id = r*cols + c;
        pieces.push({id, data, r, c});
      }
    }

    boardPos = pieces.map(p => p.id);
    originalBoardPos = boardPos.slice();
    cursor = {r:0,c:0};
    selected = null;
    render();
    board.style.width = (pieceW*cols) + 'px';
    board.style.height = (pieceH*rows) + 'px';
    board.focus();
  }

  function render(){
    board.innerHTML = '';
    for(let idx=0; idx<boardPos.length; idx++){
      const pid = boardPos[idx];
      const piece = pieces.find(p=>p.id===pid);
      const r = Math.floor(idx/cols), c = idx%cols;
      const el = document.createElement('div');
      el.className = 'piece';
      el.style.width = pieceW + 'px';
      el.style.height = pieceH + 'px';
      el.style.left = (c*pieceW) + 'px';
      el.style.top = (r*pieceH) + 'px';
      el.style.backgroundImage = `url(${piece.data})`;
      if(cursor.r===r && cursor.c===c) el.classList.add('cursor');
      if(selected === idx) el.classList.add('selected');
      el.dataset.index = idx;
      el.addEventListener('click', (ev) => {
        const i = parseInt(ev.currentTarget.dataset.index);
        cursor.r = Math.floor(i/cols); cursor.c = i%cols;
        board.focus();
        render();
      });
      board.appendChild(el);
    }
  }

  function swapPositions(i,j){
    const tmp = boardPos[i]; boardPos[i] = boardPos[j]; boardPos[j] = tmp;
  }

  function scramble(){
    // Fisher-Yates
    for(let i=boardPos.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      swapPositions(i,j);
    }
    selected = null; cursor = {r:0,c:0}; render();
  }

  scrambleBtn.addEventListener('click', () => { if(boardPos.length) scramble(); });
  resetBtn.addEventListener('click', () => { if(boardPos.length){ boardPos = originalBoardPos.slice(); selected = null; cursor = {r:0,c:0}; render(); } });

  board.addEventListener('keydown', (e) => {
    if(!boardPos.length) return;
    const key = e.key;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)){
      e.preventDefault();
      if(key==='ArrowUp') cursor.r = Math.max(0, cursor.r-1);
      if(key==='ArrowDown') cursor.r = Math.min(rows-1, cursor.r+1);
      if(key==='ArrowLeft') cursor.c = Math.max(0, cursor.c-1);
      if(key==='ArrowRight') cursor.c = Math.min(cols-1, cursor.c+1);
      render();
      return;
    }
    if(key===' '){
      e.preventDefault();
      const curIndex = cursor.r * cols + cursor.c;
      if(selected === null){
        selected = curIndex;
      } else if(selected === curIndex){
        selected = null;
      } else {
        swapPositions(selected, curIndex);
        selected = null;
      }
      render();
      return;
    }
  });

  // initial focus helper
  board.addEventListener('click', () => board.focus());

  // allow clicking on container to focus
  document.getElementById('boardContainer').addEventListener('click', () => board.focus());

})();
