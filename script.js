let originalData = [];
let scrollPaused = false;

const formatTanggal = (input) => {
  const date = new Date(input);
  return isNaN(date) ? input :
    `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getFullYear()).slice(-2)}`;
};

async function fetchData() {

  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxoZvhFliYUB10gTxlxXl7CBd5_35gqDzOIJBpfRioNOpS3uAdlcYXjP6qGbO9sm6qP5g/exec', { cache: 'no-store' });
    const data = await res.json();
    originalData = data;
    renderTable(data);
  } catch (e) {
    console.error("Gagal memuat:", e);
  } 
}

function renderTable(data) {
  const table = document.getElementById("dataTable");
  const fragment = document.createDocumentFragment();

  data.forEach((row, i) => {
    const tr = document.createElement("tr");

    row.forEach((cell, j) => {
      if (i !== 0 && j === 2) return;

      const el = document.createElement(i === 0 ? "th" : "td");

      if (i === 0) {
        el.textContent = (j === 2) ? "" : cell;
      } else if (j === 0 && typeof row[2] === "string" && row[2].startsWith("http")) {
        el.innerHTML = `<a href="${row[2]}" target="_blank">${cell}</a>`;
      } else if (j === 0 || j === 4) {
        el.textContent = formatTanggal(cell);
      } else {
        el.textContent = cell;
      }

      tr.appendChild(el);
    });

    fragment.appendChild(tr);
  });

  table.replaceChildren(fragment);
  document.getElementById("rowCount").textContent = `(${originalData.length - 1})`;
}

function rollingMarquee() {
  if (scrollPaused) return;
  const table = document.getElementById("dataTable");
  const row = table.rows[1];
  if (!row) return;
  row.classList.add("fade-out");
  setTimeout(() => {
    table.deleteRow(1);
    table.appendChild(row);
    row.classList.remove("fade-out");
  }, 1000);
}

function toggleMarquee() {
  scrollPaused = !scrollPaused;
  document.getElementById("marqueeBtn").textContent = scrollPaused ? "▶️" : "⏸";
}

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = originalData.filter((row, index) =>
    index === 0 || row.some(cell => String(cell).toLowerCase().includes(keyword))
  );
  renderTable(filtered);
});

fetchData();
setInterval(fetchData, 10000);
setInterval(rollingMarquee, 5000);

