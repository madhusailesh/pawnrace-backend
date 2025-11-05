const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT;


app.get('/', (_req, res) => {
  res.send('Hello World this is madhu sailesh hellow sir! ');
});


const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

