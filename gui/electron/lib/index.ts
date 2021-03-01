import { app, BrowserWindow } from 'electron'
import { join } from 'path'

function createWindow (): void {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile(join(__dirname, '../out/index.html')).catch(undefined)
}

app.whenReady()
  .then(createWindow)
  .catch(undefined)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
