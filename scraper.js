'use strict';

const fs = require('fs');

// use 2 packages
// - scraper package
// - csv file package

// http://shirts4mike.com
// -> Title, Price, ImageURL, URL, and Time (in that order)
// -> CSV file

fs.exists('./data', exists => {
  console.log( exists ? 'data folder exixts' : 'data folder is missing' );
})
/*
fs.readdir('./data', (err, data) => {
  if (err) {
    fs.mkdir('./data', err => {
      if (err) {
        console.log(err);
      }
    });
  } else {
    console.log('folder data already exists');
  }
});
*/


console.log(Date.now());

//fs.writeFile('./data/message.txt', 'Hello Node.js', 'utf8', err => console.log(err) );
