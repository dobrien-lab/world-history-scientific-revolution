const videos = [
  { id: "LcqqgZeeARc", title: "How the Venice Arsenal Invented the Assembly Line", prompt: "How did standard parts and an organized process make production faster and more reliable?" },
  { id: "A5az6kLxXZc", title: "The Scientist Imprisoned for Looking Up", prompt: "Why could evidence that challenged accepted authority be dangerous?" },
  { id: "mFK0hvmFSqY", title: "How the Sun Replaced the Earth", prompt: "What changed when thinkers replaced the geocentric model with a heliocentric one?" },
  { id: "7U2pxglJns8", title: "How Gutenberg’s Press Sparked a Revolution", prompt: "How did faster printing help people share, question, and improve new ideas?" },
  { id: "scZILM55cZI", title: "How Vesalius Mapped the Human Body", prompt: "How did direct observation help Vesalius correct older ideas about anatomy?" }
];

const grid = document.querySelector("#videoGrid");
const dialog = document.querySelector("#videoDialog");
const playerWrap = document.querySelector("#playerWrap");
const dialogTitle = document.querySelector("#dialogTitle");
const youtubeLink = document.querySelector("#youtubeLink");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const response = document.querySelector("#exitResponse");
const saveStatus = document.querySelector("#saveStatus");
const storageKey = "scientific-revolution-unit-ii";

function readState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || { completed: [], response: "" };
  } catch {
    return { completed: [], response: "" };
  }
}

let state = readState();

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function updateProgress() {
  const count = state.completed.length;
  progressText.textContent = `${count} of ${videos.length} complete`;
  progressBar.style.width = `${(count / videos.length) * 100}%`;
}

function openVideo(video, index) {
  dialogTitle.textContent = `Video ${String(index + 1).padStart(2, "0")} · ${video.title}`;
  youtubeLink.href = `https://youtube.com/shorts/${video.id}`;
  playerWrap.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0" title="${video.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  dialog.showModal();
}

videos.forEach((video, index) => {
  const card = document.createElement("article");
  card.className = "video-card";
  const number = String(index + 1).padStart(2, "0");
  card.innerHTML = `
    <button class="thumb-button" type="button" aria-label="Play video ${number}: ${video.title}">
      <img src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" alt="" loading="lazy" />
      <span class="video-number">VIDEO ${number}</span>
      <span class="play" aria-hidden="true">▶</span>
    </button>
    <div class="card-copy">
      <h3>${video.title}</h3>
      <p>${video.prompt}</p>
      <label class="complete-label">
        <input type="checkbox" data-video="${video.id}" ${state.completed.includes(video.id) ? "checked" : ""} />
        <span>Mark as watched</span>
      </label>
    </div>`;
  card.querySelector(".thumb-button").addEventListener("click", () => openVideo(video, index));
  card.querySelector("input").addEventListener("change", (event) => {
    state.completed = event.target.checked
      ? [...new Set([...state.completed, video.id])]
      : state.completed.filter((id) => id !== video.id);
    saveState();
    updateProgress();
  });
  grid.append(card);
});

document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => { playerWrap.innerHTML = ""; });

response.value = state.response;
response.addEventListener("input", () => {
  state.response = response.value;
  saveState();
  saveStatus.textContent = "Saved";
});

document.querySelector("#clearProgress").addEventListener("click", () => {
  if (!confirm("Reset watched videos and clear your exit ticket?")) return;
  state = { completed: [], response: "" };
  response.value = "";
  document.querySelectorAll(".complete-label input").forEach((box) => { box.checked = false; });
  saveState();
  updateProgress();
  saveStatus.textContent = "Lesson reset";
});

updateProgress();

