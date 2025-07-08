const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");

let entriesDir;

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  const userDataPath = app.getPath("userData");
  entriesDir = path.join(userDataPath, "entries");
  if (!fs.existsSync(entriesDir)) {
    fs.mkdirSync(entriesDir, { recursive: true });
  }

  createWindow();
});

ipcMain.handle("save-entry", async (_, content) => {
  try {
    const filename = `entry-${Date.now()}.txt`;
    fs.writeFileSync(path.join(entriesDir, filename), content, "utf-8");
    return "Entry saved successfully!";
  } catch (err) {
    console.error("Error saving entry", err);
    return "Failed to save entry";
  }
});

ipcMain.handle("load-entries", () => {
  try {
    return fs.readdirSync(entriesDir).map((file) => fs.readFileSync(path.join(entriesDir, file), "utf-8"));
  } catch (err) {
    console.error("Error loading entries", err);
    return [];
  }
});

ipcMain.on("open-entry-window", (event, content) => {
    const entryWin = new BrowserWindow({
        width: 400,
        height: 400,
        title: "Journal Entry",
        parent: BrowserWindow.getFocusedWindow(),
        modal: true,
    });
    const htmlContent = `
        <!DOCTYPE html>
        <html><head><title>Entry</title><style>body{font-family:sans-serif;padding:20px;white-space:pre-wrap;}</style></head>
          <body>
            ${content.replace("//g", ">")}
          </body>
        </html>`;
    entryWin.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(htmlContent));
});

ipcMain.handle("show-notification", (_, title, body) => {
  new Notification({ title, body }).show();
});