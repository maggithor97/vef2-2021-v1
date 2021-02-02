import fs from 'fs';
import express from 'express';

const app = express();

app.use(express.static('public'));
app.use(express.static('styles'));

// Get database
const data = fs.readFileSync('./videos.json');
const videos = JSON.parse(data).videos;
const categories = JSON.parse(data).categories;


app.set('view engine', 'ejs');


app.locals.secondsToHms = (d) => {
  d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 10 ? m + ":" : "0" + m +":";
    var sDisplay = s > 10 ? s : "0"+s;
    return hDisplay + mDisplay + sDisplay;
}


app.locals.getTimeSince = (timeThen) => {
  var xUnits;
  var TimeUnit;
  var i=0;
  const diff = Math.floor(Math.abs((Date.now()-timeThen))/1000);
  const day = 3600*24;
  const times = [day/24,day,day*7,day*30,day*365];
  const strings = [["klukkustund","klukkustundum"],
                  ["degi","dögum"],
                  ["viku","vikum"],
                  ["mánuði","mánuðum"],
                  ["ári","árum"]];
  for (i=1 ;i < times.length ;i++) {
      if (diff < times[i])
          break;
  }
  xUnits = Math.floor(diff/times[i-1]);
  if (xUnits <= 1) { 
      TimeUnit = strings[i=0? i : i-1][0];
      xUnit = 1;} // 0 hours change to 1 hour
  else TimeUnit = strings[i=0? i : i-1][1];
  return "Fyrir " + xUnits + " " +  TimeUnit +  " síðan";
}



app.get('/', (req, res) => {
  res.render('index', 
  {
    videos: videos,
    categories: categories
  });

});


app.get('/:id', (req, res) => {
  let videoId = req.params.id
  for(let i = 0; i < videos.length; i++) {
    if ( videos[i].id == videoId ){
      res.render('video', {video: videos[i]});
    }
  }

  res.status(404).send('Síða ekki til');
});




app.listen(4000, () => console.log('Example app listening on port 4000!'));


