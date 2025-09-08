const ENDPOINT = 'https://script.google.com/macros/s/AKfycbx5Kx0-sBucXwHQlCIm46nLhWEzUoAPN_IF93CSi3rjBtv1b9Tev01gd5Kjzr34MVpOuw/exec';

let data = [], paused = false, timer = null;

const $ = sel => document.querySelector(sel);
const formatDate = d => {
  const x = new Date(d);
  return isNaN(x) ? d : `${String(x.getDate()).padStart(2,'0')}/${String(x.getMonth()+1).padStart(2,'0')}/${String(x.getFullYear()).slice(-2)}`;
};

async function load(){
  try{
    const res = await fetch(ENDPOINT, {cache:'no-store'});
    data = await res.json();
    render(data);
  }catch(e){ console.error(e); }
}
function render(arr){
  const tbl = $('#table');
  tbl.innerHTML = '';
  arr.forEach((row,i)=>{
    const tr = document.createElement('tr');
    row.forEach((cell,j)=>{
      if(i===0 && j===2) return;
      const tag = i===0 ? 'th' : 'td';
      const el = document.createElement(tag);
      if(i===0) el.textContent = cell;
      else if(j===0 && typeof row[2]==='string' && row[2].startsWith('http')){
        el.innerHTML = `<a href="${row[2]}" target="_blank" rel="noreferrer">${cell}</a>`;
      }else if(j===0||j===4) el.textContent = formatDate(cell);
      else el.textContent = cell;
      tr.appendChild(el);
    });
    tbl.appendChild(tr);
  });
  $('#count').textContent = arr.length - 1;
}
function roll(){
  if(paused) return;
  const tbl = $('#table');
  const row = tbl.rows[1];
  if(!row) return;
  row.classList.add('fade');
  row.addEventListener('animationend',()=>{
    tbl.appendChild(row);
    row.classList.remove('fade');
  },{once:true});
}
$('#toggle').onclick = () => {
  paused = !paused;
  $('#toggle').textContent = paused ? '▶️' : '⏸';
};
$('#search').oninput = e => {
  const kw = e.target.value.toLowerCase();
  const fil = data.filter((r,i)=> i===0 || r.some(c=>String(c).toLowerCase().includes(kw)));
  render(fil);
};
load();
setInterval(load, 10_000);
setInterval(roll, 5_000);

