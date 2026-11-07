const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const http = require('http')

const PORT = 3000
let mainWindow
let nextProcess

function waitForServer(url, retries = 30) {
  return new Promise((resolve, reject) => {
    const try_ = (n) => {
      http.get(url, () => resolve()).on('error', () => {
        if (n <= 0) return reject(new Error('Server did not start'))
        setTimeout(() => try_(n - 1), 500)
      })
    }
    try_(retries)
  })
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Multi-AI Hub',
    icon: path.join(__dirname, '../public/icons/icon-512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#030712',
    show: false,
  })

  // Open external links in browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  const isDev = !app.isPackaged

  if (isDev) {
    // Start Next.js dev server
    nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      env: { ...process.env, PORT: String(PORT) },
    })
    await waitForServer(`http://localhost:${PORT}`)
    mainWindow.loadURL(`http://localhost:${PORT}`)
  } else {
    // Production: serve built Next.js
    nextProcess = spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      env: { ...process.env, PORT: String(PORT) },
    })
    await waitForServer(`http://localhost:${PORT}`)
    mainWindow.loadURL(`http://localhost:${PORT}`)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
