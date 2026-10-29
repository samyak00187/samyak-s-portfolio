const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 900, minHeight: 600,
    backgroundColor: '#0b0b0b', title: 'Samyak Jain \u2014 Portfolio',
    icon: path.join(__dirname, 'icon.png'), autoHideMenuBar: true, show: false
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('file:') && url.toLowerCase().endsWith('.pdf')) { shell.openPath(path.join(__dirname, 'resume.pdf')); }
    else if (/^(https?:|mailto:)/.test(url)) { shell.openExternal(url); }
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) { e.preventDefault(); if (/^(https?:|mailto:)/.test(url)) shell.openExternal(url); }
  });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
