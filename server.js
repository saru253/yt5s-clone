const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/download', (req, res) => {
  const { url, format } = req.body;

  const command = format === 'mp3'
    ? `yt-dlp.exe -x --audio-format mp3 -o "%(title)s.%(ext)s" ${url}`
    : `yt-dlp.exe -o "%(title)s.%(ext)s" ${url}`;

  console.log("Running:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Download error:", error.message);
      return res.send("❌ Failed to download. Please try again.");
    }
    console.log(stdout);
    res.send("✅ Download started! Check your folder.");
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
