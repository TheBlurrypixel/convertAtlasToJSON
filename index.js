const {app, dialog, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const prompt = require('electron-prompt');

var fs = require('fs')
var re = /[^\:]*[^d]\.[^d][^\:]*/;
var re2 = /^[^\:]*$/;

function start() {
  var files = dialog.showOpenDialog({filters: [ {name: 'atlas', extensions: ['atlas']}, {name: 'All Files', extensions: ['*']} ] });

  var res = {};

  function assayTokens(tokens) {
    tokens.forEach((i) => {
      if(re.test(i)) {
        // console.log('i is: ' + i);
        let solves = i.match(/[^\.]+/g);
        res['name'] = solves.input ? solves : solves.reduce( (acc, cur) => {
          return acc + '_' + cur;
        });
      }
      else if(re2.test(i)) {
        console.log(i + ' going up a level');
      }
      else {
        var propSplits = i.split(':', 2);
        var resSplits = propSplits.map( (item) => {
          return item.trim();
        });
        res[resSplits[0]] = resSplits[1];
      }
    });
  }

	if((files) && (files.length > 0)) {
    var atlasText = fs.readFileSync(files[0], 'utf8');
    var tokens = atlasText.trim().split('\n');
    tokens.forEach((i) => {
      if(re.test(i)) {
        // console.log('i is: ' + i);
        let solves = i.match(/[^\.]+/g);
        res['name'] = solves.input ? solves : solves.reduce( (acc, cur) => {
          return acc + '_' + cur;
        });
      }
      else if(re2.test(i)) {
        console.log(i + ' going up a level');
      }
      else {
        var propSplits = i.split(':', 2);
        var resSplits = propSplits.map( (item) => {
          return item.trim();
        });
        res[resSplits[0]] = resSplits[1];
      }
    });
    console.log(res);
  }
  app.quit();
}

app.on('window-all-closed', e => e.preventDefault() );
app.on('ready', start);
//app.on('window-all-closed', app.quit);
