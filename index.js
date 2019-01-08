const {app, dialog, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const prompt = require('electron-prompt');

var fs = require('fs')

function start() {
  dialog.showOpenDialog({filters: [ {name: 'atlas', extensions: ['atlas']}, {name: 'All Files', extensions: ['*']} ] });
}

app.on('window-all-closed', e => e.preventDefault() );
app.on('ready', start);
//app.on('window-all-closed', app.quit);
