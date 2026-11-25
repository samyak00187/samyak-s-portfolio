const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const { isExternalUrl, isLocalPdfUrl, toUnpackedPath } = require('./link-policy');

async function openExternal(url) {
  if (!isExternalUrl(url)) return;
  try {
    await shell.openExternal(url);
  } catch (err) {
    console.error(`Failed to open external URL "${url}":`, err);
  }
}

async function openResume() {
  // resume.pdf is listed in build.asarUnpack, so resolve the real on-disk
  // path; a path inside app.asar cannot be opened by an external viewer.
  const resumePath = toUnpackedPath(path.join(__dirname, 'resume.pdf'));
  try {
    const error = await shell.openPath(resumePath);
    if (error) throw new Error(error);
  } catch (err) {
    console.error('Failed to open resume.pdf:', err);
    dialog.showErrorBox(
      'Could not open resume',
      'The resume PDF could not be opened. You can find it in the project folder as resume.pdf.'
    );
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 900, minHeight: 600,
    backgroundColor: '#0b0b0b', title: 'Samyak Jain — Portfolio',
    icon: path.join(__dirname, 'icon.png'), autoHideMenuBar: true, show: false,
    webPreferences: {
      // Pinned explicitly so an Electron upgrade cannot silently change them.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  win.once('ready-to-show', () => win.show());
  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error(`Failed to load portfolio (${errorCode}): ${errorDescription}`);
    if (!win.isDestroyed()) {
      win.show(); // never leave an invisible window hanging on screen
      dialog.showErrorBox(
        'Portfolio failed to load',
        'The portfolio page could not be loaded. Please restart the app; if the problem persists, reinstall it.'
      );
    }
  });
  win.loadFile(path.join(__dirname, 'index.html')).catch((err) => {
    console.error('Failed to load index.html:', err);
    if (!win.isDestroyed()) win.show();
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isLocalPdfUrl(url)) openResume();
    else openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) { e.preventDefault(); openExternal(url); }
  });
}

app.whenReady().then(createWindow).catch((err) => {
  console.error('Failed to start app:', err);
  dialog.showErrorBox('Portfolio failed to start', 'The app could not be started. Please try again.');
  app.quit();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
