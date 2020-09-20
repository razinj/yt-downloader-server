'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');
const morgan = require('morgan');

const fs = require('fs');
const http = require('http');
const exec = require('child_process').exec;

// Routing ----------------------------------------------------------------------------------------

// Body: { "links": [] }
// Array of strings (links)
router.post('/links', (req, res) => {
  try {
    writeListToSourceAndDownload(req.body.links, req.query.type);
    res.status(200).json({ message: 'Links are downloading!' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Get list of downloads
router.get('/downloads', (req, res) => {
  try {
    res.status(200).json({ result: getDownloadsList() });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Helper functions -------------------------------------------------------------------------------

// Write list to source file and init the downloading process
function writeListToSourceAndDownload(list, type) {
  if (list != null && list.length > 0 && type != null && (type === 'audio' || type === 'video')) {
    const stream = fs.createWriteStream(`source-${type}`);
    stream.once('open', () => {
      list.forEach(link => stream.write(`${link}\n`));
      stream.end();
    });

    switch (type) {
      case 'audio':
        downloadAudioFromSource();
        break;
      case 'video':
        downloadVideoFromSource();
        break;
      default:
        break;
    }
  }
}

// Run script
function downloadAudioFromSource() {
  const script = exec('sh yt-audio.sh');
  script.stdout.on('data', (data) => console.log(data));
  script.stderr.on('data', (data) => console.error(data));
}

function downloadVideoFromSource() {
  const script = exec('sh yt-video.sh');
  script.stdout.on('data', (data) => console.log(data));
  script.stderr.on('data', (data) => console.error(data));
}

function getDownloadsList() {
  return fs.readdirSync('./public', { encoding: 'utf-8' }).filter(file => file != '.gitkeep');
}

// App setup --------------------------------------------------------------------------------------

app.use('/public', express.static('public'));

app.use(
  morgan('dev'),
  express.json(),
  cors({ origin: '*' }),
  express.urlencoded({ extended: false }),
  router
);

const server = http.createServer(app);

const port = 3000;

server.listen(port, () => console.log(`[!] Server is running on port ${port}`));
