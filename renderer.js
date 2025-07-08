const sillyQuotes = ["gurt: yo", "six seven", "empl*yment"];

async function saveEntry() {
  const entry = document.getElementById("entry").value;
  if (!entry.trim()) {
    alert("Cannot save an empty entry!");
    return;
  }
  const result = await window.journalAPI.save(entry);

  const randomQuote = sillyQuotes[Math.floor(Math.random() * sillyQuotes.length)];
  new Notification("Entry Saved!", { body: randomQuote });

  document.getElementById("entry").value = "";
  loadEntries();
}

async function loadEntries() {
  const entries = await window.journalAPI.load();
  const list = document.getElementById("entriesList");
  list.innerHTML = "";
  entries.reverse().forEach((content) => {
    const li = document.createElement("li");
    li.textContent = content.slice(0, 50) + (content.length > 50 ? "..." : "");
    li.dataset.fullEntry = content;
    li.addEventListener("click", () => {
      window.journalAPI.openEntry(li.dataset.fullEntry);
    });
    list.appendChild(li);
  });
}

window.onload = () => {
  Notification.requestPermission();
  loadEntries();
};
