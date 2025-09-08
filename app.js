const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxoZvhFliYUB10gTxlxXl7CBd5_35gqDzOIJBpfRioNOpS3uAdlcYXjP6qGbO9sm6qP5g/exec';

let data = [];
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
$('#search').oninput = e => {
  const kw = e.target.value.toLowerCase();
  const fil = data.filter((r,i)=> i===0 || r.some(c=>String(c).toLowerCase().includes(kw)));
  render(fil);
};
load();
setInterval(load, 10_000);
