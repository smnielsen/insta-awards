const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('.'));

app.get('/', (req, res) => {
  let images = [];
  const dir = __dirname + '/images';
  fs.readdir(dir, (err, files) => {
    images = files.filter((file) => file.indexOf('.') !== 0);
    const imagesHtml = images.reduce((html, file) => {
      html += `<img src=/images/${encodeURI(file)} />\n`;
      return html;
    }, '');
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>TITLE</title>
        <meta name="description" content="DESCRIPTION">
        <link rel="stylesheet" href="/app.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>         
      </head>
      <body>
        <div class="container"></div>
        <script>
        window.IMAGES = ${JSON.stringify(images)};
        </script>
        <script src="/app.js"></script>
      </body>
    </html>
    `;

    res.send(html);
  })

});

app.listen(3000, function() {
  console.log(`Listening on ${this.address().port}`);
});
