const {app, dialog, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const prompt = require('electron-prompt');

var fs = require('fs')
var re = /[^\:]*[^d]\.[^d][^\:]*/;
var re2 = /^[^\:]*$/;

function start() {
  var files = dialog.showOpenDialog({filters: [ {name: 'atlas', extensions: ['atlas']}, {name: 'All Files', extensions: ['*']} ] });

  function assayTokens(inArr, inLevel) {
    let res = {};
    let i;
    let reString = `^([\\s]{2}){${inLevel}}`;
    let reLevel = new RegExp(reString);

    while((i = inArr.next().value) && reLevel.test(i)) {
      // test if there is no colon if so then create a sub object
      while(i && re2.test(i)) {
        var outObj = assayTokens(inArr, inLevel+1);
        res[i.replace(/\.+/g,'_').trim()] = outObj.res;
        i = outObj.nextName;
      }

      if(i) {
        // there is a colon so first part is name for second part
        var propSplits = i.split(':', 2);
        var resSplits = propSplits.map( (item) => {
          return item.trim();
        });
        res[resSplits[0].replace(/\.+/g,'_')] = resSplits[1];
      }
    }

    var retObj = {};
    retObj.res = res;
    retObj.nextName = i;

    return retObj;
  }

	if((files) && (files.length > 0)) {
    let atlasText = fs.readFileSync(files[0], 'utf8');
    let tokens = atlasText.trim().split('\n');

    let eArr = tokens[Symbol.iterator]();
    let res = assayTokens(eArr, 0);

//    console.log(res.res);
    var dirname = files[0].match(/(.*)[\/\\]/)[1]||'';
    var filename = files[0].match(/(?:(?<=.*[\/\\]))([^\/\\]+\.atlas$)/)[1]||'';
    fs.writeFileSync(dirname + ((process.platform !== 'darwin') ? '\\' : '\/') + filename.replace(/\.atlas$/, '_sheets.json'), JSON.stringify(res.res));
  }
  app.quit();
}

app.on('window-all-closed', e => e.preventDefault() );
app.on('ready', start);
//app.on('window-all-closed', app.quit);
