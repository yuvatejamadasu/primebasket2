const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://nest-backend-v6.vercel.app';
const files = [
  '/assets/imgs/theme/favicon.svg',
  '/assets/imgs/theme/logo.svg',
  '/assets/imgs/theme/flag-us.png',
  '/assets/imgs/theme/flag-fr.png',
  '/assets/imgs/theme/flag-jp.png',
  '/assets/imgs/theme/flag-cn.png',
  '/assets/imgs/people/avatar-1.png',
  '/assets/imgs/people/avatar-2.png',
  '/assets/imgs/people/avatar-3.png',
  '/assets/imgs/people/avatar-4.png',
  '/assets/fonts/material-icon/MaterialIcons-Round.ttf',
  '/assets/fonts/material-icon/MaterialIcons-Round.woff2',
  '/assets/fonts/material-icon/MaterialIcons-Round.woff'
];

function download(file) {
  return new Promise((resolve) => {
    const dest = path.join(__dirname, 'public', file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const fileStream = fs.createWriteStream(dest);
    https.get(baseUrl + file, (res) => {
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', () => {
      fs.unlink(dest, () => resolve());
    });
  });
}

Promise.all(files.map(download)).then(() => console.log('All missing assets downloaded perfectly.'));
