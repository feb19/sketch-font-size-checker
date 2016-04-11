
var appName = 'Font Size Checker', suffix = 'pt';

function checkForIOS(context) {
  appName += ' [iOS]';
  check_(context, [11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 28, 32, 36, 50, 64, 80]);
};
function checkForAndroid(context) {
  appName += ' [Android]';
  suffix = 'sp';
  check_(context, [12, 14, 16, 20, 24, 34, 45, 56, 112]);
};
function checkForAndroidDesktop(context) {
  appName += ' [Android Desktop]';
  suffix = 'sp';
  check_(context, [12, 13, 15, 20, 24, 34, 45, 56, 112]);
};
function checkForCustom(context) {
  var doc = context.document;
  var data = doc.askForUserInput_initialValue('Please input font sizes here (comma separated).', '12, 14, ');
  var d = data.split(',');
  var input = [];
  for (var i = 0; i < d.length; i++) {
    input.push(parseInt(d, 10));
  }
  if (input.length > 0) {
    check_(context, input);
  } else {
    app.displayDialog_withTitle('invalid params.', appName);
  }
};
function check_(context, fontSizeSet) {
  var text = '',
      app = NSApplication.sharedApplication(),
      doc = context.document,
      documentName = doc.displayName(),
      pages = doc.pages();

  for (var i = 0; i < pages.length(); i++) {
    var validPage = true;
    var artboards = pages[i].artboards();

    for (var j = 0; j < artboards.length(); j++) {
      var validArtboard = true;
      var layers = artboards[j].children();

      for (var k = 0; k < layers.count(); k++) {
        if (layers.objectAtIndex(k).class() == "MSTextLayer") {
          var valid = false;

          for (var l = 0; l < fontSizeSet.length; l++) {
            if (layers.objectAtIndex(k).fontSize() === fontSizeSet[l]) {
              valid = true;
              break;
            }
          }
          if (!valid) {
            if (validPage) {
              validPage = false;
              text += '\n' + pages[i].name() + '\n';
            }
            if (validArtboard) {
              validArtboard = false;
              text += ' - ' + artboards[j].name() + '\n';
            }
            text += '   \"' + layers.objectAtIndex(k).name() + '\"  ' + layers.objectAtIndex(k).fontSize() + suffix + '\n';
          }
        }
      }
    }
  }

  if (text == '') {
    app.displayDialog_withTitle(documentName + '\n\n😋 All text layers are valid.', appName);
  } else {
    app.displayDialog_withTitle(documentName + '\n\n😁 Confirm here.\n' +text, appName);
  }
};
