// lancer le scraper sur l'URL de la homePage
// récupérer les urls des pages tshirts => array
// récupérer les infos de chaque t-shirt
// Title, Price, ImageURL, URL, and Time (in that order)
// écrire tout ça dans un CSV file

'use strict';

const fs = require('fs');
const http = require('http');
const cheerio = require('cheerio');
const csv = require('csv');

// data
const entryPointURL = 'http://shirts4mike.com/shirts.php';

// function
const getPage = url => {
    return new Promise( (resolve, reject) => {
        let htmlString = '';
        http.get( url, (res) => {
            const { statusCode } = res;

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
                reject(error);
            }
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                htmlString += chunk;
            });
            res.on('end', () => {
                const page = {
                    url: url,
                    html: htmlString
                };
                resolve(page);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

// util
const monitor = str => {
    console.log(str);
}

// biz
getPage(entryPointURL)
    .then( page => {
        const links = [];
        const $ = cheerio.load(page.html);
        $('ul.products li').each( function(i, el) {
            links.push( $(this).children().attr('href') );
        });
        return links;
    })
    .then( urlsArray => {
        return Promise.all(
            urlsArray.map( (url) => {
                //
                //    HUM HUM HUM
                //
                const tShirtUrl = 'http://shirts4mike.com/' + url;


                return getPage(tShirtUrl);
            })
        );
    })
    .then( pagesArray => {
        return pagesArray.map( page => {
            const infos = {};
            const $ = cheerio.load(page.html);
            infos.title = $('title').text();
            infos.price = $('.shirt-details h1 span').text();
            infos.image = $('img').attr('src');
            infos.url = page.url;
            infos.time = Date.now();
            return infos;
        })
    })
    .then(
        monitor
        //Title, Price, ImageURL, URL, and Time (in that order)
    )
    //.then( monitor )
    /*
    .then( array => {
        array.forEach( element => {
             console.log(element);
         });
    })
    .catch( err => console.log('ERRRORRRRR : \r\n\r\n\r\n\r\n' + err + '\r\n\r\n\r\n\r\n'))
    .then( getTshirtPages() )
    .then( getTshirtInfos() )
    .then( writeInfos() )
    */

/*
fs.readdir('./data', (err, data) => {
    if (err) {
        fs.mkdir('./data', err => {
            if (err) {
                console.log(err);
            }
        });
    }
    const stream = fs.createWriteStream('./data/bibi.txt');
    let c = 2500;
    while (c > 0) {
        stream.write(String.fromCharCode(Math.floor(Math.random() * (0xFFFF + 1))));
        if (c % 40 === 0) {
            stream.write('\n');
        }
        c--;
    }
    stream.end();
});
*/
//fs.writeFile('./data/message.txt', 'Hello Node.js', 'utf8', err => console.log(err) );
