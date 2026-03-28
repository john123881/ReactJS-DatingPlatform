const fs = require('fs');
const path = require('path');
const targetDir = path.join(__dirname, 'components', 'account-center', 'loader');
const files = ['ch-pwd-loader.js', 'collect-loader.js', 'edit-loader.js', 'index-loader.js', 'play-game-loader.js', 'record-loader.js', 'record-loader2.js', 'record-loader3.js'];

files.forEach(f => {
  const filePath = path.join(targetDir, f);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted ' + f);
    } else {
      console.log('File not found: ' + f);
    }
  } catch (e) {
    console.error('Failed ' + f + ': ' + e.message);
  }
});
