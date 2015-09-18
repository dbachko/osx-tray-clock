'use strict';
const app = require('app');
const path = require('path');
const BrowserWindow = require('browser-window');
const Tray = require('tray');
const Menu = require('menu');
// const Canvas = require('canvas');
const moment = require('moment');
const NativeImage = require('native-image');

const timeFormats = {
  on: 'ddd, MMM D, h:mm A',
  off: 'ddd, MMM D, h mm A'
};

var trayIcon,
    mainWindow,
    lastTimeClicked,
    ticker = true;

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();


app.dock.hide();

app.on('ready', () => {
  initTrayIcon();
  initMainWindow();
  // addListeners();
});

/**
 * Add listeners
 */
// function addListeners() {
//   const ipc = require('electron-safe-ipc/host');
//   // Listen for events from app
//   ipc.on('exit-app', function() {
//     app.quit()
//   });
// };

/**
 * Create main window
 */
function initMainWindow() {
  let settings = {
    width: 260,
    height: 350,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    fullscreen: false,
    'standard-window': false,
    'use-content-size': true,
    'overlay-scrollbars': false
  };

  mainWindow = new BrowserWindow(settings);
  mainWindow.loadUrl(`file://${__dirname}/app/index.html`);
  mainWindow.on('blur', () => {
    if(mainWindow.isVisible()) {
      hideMainWindow();
    }
  });

  const ipc = require('electron-safe-ipc/host');
  // Listen for events from app
  ipc.on('exit-app', () => {
    app.quit()
  });
};

/**
 * Create tray icon
 */
function initTrayIcon(buf) {
  let icon = NativeImage.createEmpty(),
      label = moment().format(timeFormats.on);
  // let canvas = new Canvas(22, 22);
  // let icon = NativeImage.createFromBuffer(canvas.toBuffer());
  // let icon = NativeImage.createFromBuffer(buf);

  trayIcon = new Tray(icon);
  trayIcon.setTitle(label);
  trayIcon.setHighlightMode(false);

  trayIcon.on('clicked', (ev, bounds) => {
    if(!mainWindow) return;
    // console.log('clicked: ', bounds);
    lastTimeClicked = Date.now();

    mainWindow.isVisible() ? hideMainWindow() : showMainWindow(bounds);
  });

  trayIcon.on('double-clicked', (ev, bounds) => {
    if(!mainWindow) return;
    let timeDiff = Date.now() - lastTimeClicked;
    // console.log('double-clicked: ', bounds);
    // console.log('Time between: ', timeDiff);

    // Experental number
    if(timeDiff > 200) {
      if(mainWindow.isVisible()) {
        hideMainWindow();
      } else {
        showMainWindow(bounds);
      }
    }
  });

  // Update time every second
  setInterval(() => updateTime(), 1000);
};

// /**
//  * Updates tray icon
//  */
// function updateTrayIcon(buf) {
//   trayIcon.setImage(NativeImage.createFromBuffer(buf));
// };

/**
 * Show/Hide main window
 */
function showMainWindow(bounds) {
  let coords = {
    x: bounds.x + Math.round(bounds.width / 2) - 130,
    y: bounds.y
  };

  mainWindow.setPosition(coords.x, coords.y);
  mainWindow.show();
}

function hideMainWindow(bounds) {
  mainWindow.hide();
}

/**
 * Generates and updates current time in tray
 */
function updateTime() {
  let timeFormatStr = ticker ? timeFormats.on : timeFormats.off;
  let label = moment().format(timeFormatStr);

  trayIcon.setTitle(label);
  ticker = !ticker;
};

// /**
//  * Generates images for tray icons
//  */
// function generateTrayIcon(callback) {
//   let now = moment().format(timeFormats.on),
//       canvas = new Canvas(22, 22),
//       ctx = canvas.getContext('2d'),
//       fs = require('fs');

//   let fontBase = 'assets/fonts/open-sans',
//       font = new Canvas.Font('OpenSans', path.join(__dirname, fontBase, 'OpenSans-Regular.ttf'));
//       font.addFace(path.join(__dirname, fontBase, 'OpenSans-Light.ttf'), 'light');
//       font.addFace(path.join(__dirname, fontBase, 'OpenSans-Bold.ttf'), 'bold');
//       font.addFace(path.join(__dirname, fontBase, 'OpenSans-Italic.ttf'), 'normal', 'italic');
//       font.addFace(path.join(__dirname, fontBase, 'OpenSans-BoldItalic.ttf'), 'bold', 'italic');

//   ctx.addFont(font)
//   ctx.font = '14px OpenSans'

//   ctx.fillStyle = '#000';

//   // Clear canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillText(now, 0, 16);

//   canvas.toBuffer(function(err, buf) {
//     callback(buf);
//   });
// };
