'use strict';

const app = require('app');
const fs = require('fs');
const BrowserWindow = require('browser-window');
const Tray = require('tray');
const Menu = require('menu');
const Canvas = require('canvas');
const moment = require('moment');
const NativeImage = require('native-image');
const exec = require('child_process').exec;
const config = require('./configuration');
const crashReporter = require('electron').crashReporter;

const timeFormat = 'ddd h:mm A';

const winConf = {
  width: 245,
  height: 450,
  innerWidth: 225,
  show: false,
  frame: false,
  resizable: false,
  transparent: true,
  fullscreen: false,
  'standard-window': false,
  'use-content-size': true,
  'overlay-scrollbars': false,
  'always-on-top': true
};


var trayIcon,
    mainWindow,
    lastTimeClicked;

// report crashes to the Electron project
crashReporter.start({
  productName: 'osx-tray-clock',
  companyName: 'dbachko',
  submitURL: 'http://127.0.0.1'
});

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

/**
 * Create main window
 */
function initMainWindow() {
  mainWindow = new BrowserWindow(winConf);
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.on('blur', () => {
    if(mainWindow.isVisible()) {
      // hideMainWindow();
    }
  });

  const ipc = require('electron-safe-ipc/host');
  // Listen for events from app
  ipc.on('exit-app', () => {
    app.quit()
  });
}

// function calcWindowCoords(bounds) {
//   let {x, y, width: w, height: h} = bounds;
//   return {
//     x: x + Math.round(w / 2) - 125,
//     y: y,
//     w,
//     h
//   };
// };

// function makeScreenshot(x, y, w, h)

/**
 * Create tray icon
 */
function initTrayIcon(buf) {
  // let icon = NativeImage.createEmpty(),
  let label = moment().format(timeFormat);
  let icon = NativeImage.createFromBuffer(buf, 2);

  trayIcon = new Tray(icon);
  trayIcon.setTitle(label);
  trayIcon.setHighlightMode(false);

  trayIcon.on('click', (ev, bounds) => {
    if(!mainWindow) return;
    let x = bounds.x + Math.round((bounds.width - winConf.innerWidth) / 2),
        y = bounds.height,
        w = winConf.innerWidth,
        h = winConf.height;
    let scr = `screencapture -R${x},${y},${w},${h} app/img/background.png`;

    if(mainWindow.isVisible()) {
      hideMainWindow();
    } else {
      exec(scr, (err, stdout, stderr) => {
        showMainWindow(bounds);
      });
    }
    lastTimeClicked = Date.now();
  });

  trayIcon.on('double-click', (ev, bounds) => {
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
}

/**
 * Updates tray icon
 */
function updateTrayIcon(buf) {
  trayIcon.setImage(NativeImage.createFromBuffer(buf));
}

/**
 * Show/Hide main window
 */
function showMainWindow(bounds) {
  const ipc = require('electron-safe-ipc/host');

  let coords = {
    x: bounds.x + Math.round(bounds.width / 2) - 125,
    y: bounds.y
  };

  ipc.send('updateBackground');

  mainWindow.setPosition(coords.x, coords.y);
  mainWindow.show();
}

// @TODO: add fade animation
function hideMainWindow(bounds) {
  mainWindow.hide();
}

/**
 * Generates and updates current time in tray
 */
function updateTime() {
  let label = moment().format(timeFormat);

  trayIcon.setTitle(label);
}

/**
 * Generates images for tray icons
 */
function generateTrayIcon(callback) {
  var now = moment().format('D'),
      canvas = new Canvas(44, 44),
      ctx = canvas.getContext('2d'),
      dateOffset = now.length === 1 ? 16 : 11;

  var fontLoc = `${__dirname}/assets/fonts/open-sans`,
      font = new Canvas.Font('OpenSans', `${fontLoc}/OpenSans-Regular.ttf`);

  font.addFace(`${fontLoc}/OpenSans-Regular.ttf`, 'normal');
  font.addFace(`${fontLoc}/OpenSans-Light.ttf`, 'light');
  font.addFace(`${fontLoc}/OpenSans-Bold.ttf`, 'bold');
  font.addFace(`${fontLoc}/OpenSans-Italic.ttf`, 'normal', 'italic');
  font.addFace(`${fontLoc}/OpenSans-BoldItalic.ttf`, 'bold', 'italic');

  ctx.addFont(font)
  // ctx.font = 'bold 20px OpenSans'
  ctx.font = 'normal 22px "Helvetica Neue"'
  ctx.fillStyle = '#000';

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw icon in tray
  fs.readFile(`${__dirname}/assets/img/calendar.png`, (err, calendar) => {
    if (err) throw err;
    var img = new Canvas.Image();

    img.src = calendar;

    ctx.drawImage(img, 0, 0, img.width, img.height);
    // Add date
    ctx.fillText(now, dateOffset, 32);

    canvas.toBuffer((err, buf) => {
      callback(buf);
    });
  });
}

// Sets experiment features
app.commandLine.appendSwitch('enable-experimental-web-platform-features', true);

// Hide dock icon
app.dock.hide();

// Init app on ready
app.on('ready', () => {
  // if(!config.getSettings('shortcutKeys')) {
  //   config.setSettings('shortcutKeys', ['ctrl', 'shift']);
  // }
  generateTrayIcon(initTrayIcon);
  initMainWindow();
});
