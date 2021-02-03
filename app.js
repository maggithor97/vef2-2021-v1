/*  eslint linebreak-style: ["error", "windows"] */
import fs from 'fs';
import express from 'express';

const app = express();

app.use(express.static('public'));
app.use(express.static('styles'));

// Get database
const data = fs.readFileSync('./videos.json');
const { videos } = JSON.parse(data);
const { categories } = JSON.parse(data);

app.set('view engine', 'ejs');

app.locals.secondsToHms = (second) => {
  const sec = Number(second);
  const h = Math.floor(sec / 3600);
  const m = Math.floor(sec % 3600 / 60);
  const s = Math.floor(sec % 3600 % 60);

  const hDisplay = h > 0 ? `${h}:` : '';
  const mDisplay = m > 10 ? `${m}:` : `0${m}:`;
  const sDisplay = s > 10 ? s : `0${s}`;
  return hDisplay + mDisplay + sDisplay;
};

app.locals.timeSince = (timeThen) => {
  const x = Math.abs((Date.now() - timeThen)) / 1000;
  const diff = Math.floor(x);
  const day = 3600 * 24;
  const times = [day / 24, day, day * 7, day * 30, day * 365];
  const strings = [['klukkustund', 'klukkustundum'],
    ['degi', 'dögum'],
    ['viku', 'vikum'],
    ['mánuði', 'mánuðum'],
    ['ári', 'árum']];
  let dayMonthYear;
  let i;
  for (i = 1; i < times.length; i += 1) {
    if (diff < times[i]) break;
  }
  let number = Math.floor(diff / times[i - 1]);
  if (number <= 1) {
    dayMonthYear = strings[i === 0 ? i : i - 1][0];
    number = 1;
  } else dayMonthYear = strings[i === 0 ? i : i - 1][1];
  return 'Fyrir' + number + ' ' + dayMonthYear + 'síðan';
};

app.get('/', (req, res) => {
  res.render('index',
    {
      videos,
      categories,
    });
});

app.get('/:id', (req, res) => {
  const videoId = req.params.id;
  for (let i = 0; i < videos.length; i = i + 1) {
    if (videos[i].id === videoId) {
      res.render('video', { video: videos[i] });
    }
  }

  res.status(404).send('<h1>Síða ekki til</h1>');
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
