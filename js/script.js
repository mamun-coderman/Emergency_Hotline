/* ---------------------------------------------------
   1. DATA — single source of truth for every card
--------------------------------------------------- */
const services = [
  { id: 1, icon: "./assets/emergency.png", name: "National Emergency Number", tag: "All",   number: "999" },
  { id: 2, icon: "./assets/police.png", name: "Police Helpline Number",      tag: "Police",        number: "999" },
  { id: 3, icon: "./assets/fire-service.png", name: "Fire Service Number",         tag: "Fire",          number: "999" },
  { id: 4, icon: "./assets/ambulance.png", name: "Ambulance Service",           tag: "Health",        number: "1994-999999" },
  { id: 5, icon: "./assets/emergency.png", name: "Women & Child Helpline",      tag: "Help",          number: "109" },
  { id: 6, icon: "./assets/emergency.png", name: "Anti-Corruption Helpline",    tag: "Govt",          number: "106" },
  { id: 7, icon: "./assets/emergency.png", name: "Electricity Helpline",        tag: "Electricity",   number: "16216" },
  { id: 8, icon: "./assets/brac.png", name: "Brac Helpline",               tag: "NGO",           number: "16445" },
  { id: 9, icon: "./assets/Bangladesh-Railway.png", name: "Bangladesh Railway Helpline", tag: "Travel",        number: "163" },
];

/* ---------------------------------------------------
   2. STATE
--------------------------------------------------- */
let history = JSON.parse(localStorage.getItem("callHistory") || "[]");

/* ---------------------------------------------------
   3. RENDER — build cards from data (no hardcoded HTML)
--------------------------------------------------- */
const grid = document.getElementById("service-grid");

function renderCards() {
  grid.innerHTML = services.map(s => `
    <div class="service-card bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2" data-id="${s.id}">
      <div class="flex items-start justify-between">
        <span class="h-14 w-14 p-4 bg-[#ffe3e2] rounded-2xl"><img src="${s.icon}" alt="${s.name}"></span>
        <button class="favorite-btn text-gray-300 hover:text-red-400 text-sm" data-id="${s.id}"><i class="fa-regular fa-heart"></i></button>
      </div>
      <div>
        <p class="font-semibold text-sm leading-tight">${s.name}</p>
        <p class="text-[11px] text-gray-400">${s.tag}</p>
      </div>
      <p class="text-xl font-bold text-gray-800">${s.number}</p>
      <div class="flex gap-2 mt-1">
        <button class="copy-btn btn btn-outline flex-1" data-id="${s.id}">Copy</button>
        <button class="call-btn  btn btn-success bg-[#00a63e] text-white flex-1" data-id="${s.id}">Call</button>
      </div>
    </div>
  `).join("");
}

function renderHistory() {
  const list = document.getElementById("call-history");
  const empty = document.getElementById("history-empty");

  if (history.length === 0) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  list.innerHTML = history.slice().reverse().map(h => `
    <li class="fade-in border-b border-gray-100 pb-2">
      <p class="font-medium">${h.name}</p>
      <div class="flex justify-between text-gray-400">
        <span>${h.number} · ${h.action}</span>
        <span>${h.time}</span>
      </div>
    </li>
  `).join("");
}

/* ---------------------------------------------------
   4. HELPERS
--------------------------------------------------- */
function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addToHistory(service, action) {
  history.push({ name: service.name, number: service.number, action, time: timeNow() });
  localStorage.setItem("callHistory", JSON.stringify(history));
  renderHistory();
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "alert alert-success text-white text-xs py-2 fade-in";
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

/* ---------------------------------------------------
   5. EVENT DELEGATION — one listener handles all cards
--------------------------------------------------- */
grid.addEventListener("click", (e) => {
  const copyBtn = e.target.closest(".copy-btn");
  const callBtn = e.target.closest(".call-btn");
  const favBtn  = e.target.closest(".favorite-btn");

  if (copyBtn) {
    const service = services.find(s => s.id == copyBtn.dataset.id);
    navigator.clipboard.writeText(service.number).then(() => {
      showToast(`${service.number} copied`);
      addToHistory(service, "Copied");
    });
  }

  if (callBtn) {
    const service = services.find(s => s.id == callBtn.dataset.id);
    addToHistory(service, "Called");
    window.location.href = `tel:${service.number}`;
  }

  if (favBtn) {
    favBtn.textContent = favBtn.textContent === "♡" ? "❤️" : "♡";
  }
});

document.getElementById("clear-history").addEventListener("click", () => {
  history = [];
  localStorage.removeItem("callHistory");
  renderHistory();
});

/* ---------------------------------------------------
   6. INIT
--------------------------------------------------- */
renderCards();
renderHistory();

