// When an error occurs, log it to a file named scraper-error.log .
// It should append to the bottom of the file with a time stamp and error e.g.
// [Tue Feb 16 2016 10:02:12 GMT-0800 (PST)] <error message>


// AMELIORATIONS
// réécrire en encapsulant toutes les fonctions !
// passer un objet s'il faut plusieurs arguments...
// utiliser Promise.all pour d'un coté fs de l'autre les infos

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const {URL} = require('url');
const cheerio = require('cheerio');
const stringify = require('csv-stringify/lib/sync');

// data
const bizData = {
    entryPointURL: new URL('http://shirts4mike.com/shirts.php'),
    folderName: 'data',
    logFileName: 'scraper-error.log',
    goodbyeMessage: '\nThanks for using Scraper !\n',
    getFileName: () => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.csv`
    }
}

//----------------------------------------
//                               FUNCTIONS
//----------------------------------------
const createFolder = path => {
    return new Promise( (resolve, reject) => {
        fs.mkdir(path, err => {
            if ( !err || /EEXIST/.test(err.message) ) {
                resolve(path);
            } else {
                reject('folder failure !\n' + err.message);
            }
        });
    });
}
// in: url
// out: page object { htmlString, url }
const getPage = url => {
    return new Promise( (resolve, reject) => {
        let htmlString = '';
        http.get( url, (res) => {
            const { statusCode } = res;

            let error;
            if (statusCode !== 200) {
                const error = new Error("Error, impossible to reach www.shirts4mike.com/");
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
// in: path, content
const writeFile = (path, content) => {
    return new Promise( (resolve, reject) => {
        fs.writeFile(path, content, err => {
            if (err) reject('file error !\n' + err);
            else resolve('file written successfully !');
        });
    });
};
// in: path, content
const appendFile = (path, content) => {
    return new Promise( (resolve, reject) => {
        fs.appendFile(path, content, err => {
            if (err) reject('file append error !\n' + err);
            else resolve('file appended successfully !');
        });
    });
}

//----------------------------------------
//                                   UTILS
//----------------------------------------
const monitor = str => {
    console.log(str);
}

//----------------------------------------
//                                   CHAIN
//----------------------------------------

getPage(bizData.entryPointURL)
    .catch( err => {
        const logTime = `[${new Date().toString()}] `;
        console.log(err.message);
        appendFile(bizData.logFileName, logTime + err.message + '\n');
    })
    .then( page => {
        const links = [];
        const $ = cheerio.load(page.html);
        $('ul.products li').each( function(i, el) {
            links.push( $(this).children().attr('href') );
        });
        return links;
    })
    .then( pathsArray => {
        return Promise.all(
            pathsArray.map( (path) => {
                const tShirtUrl = bizData.entryPointURL.origin + '/' + path;
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
            infos.time = new Date().toTimeString();
            return infos;
        })
    })
    .then( infosArray => {
        return infosArray.map( obj => {
            const {title, price, image, url, time} = obj;
            const row = [title, price, image, url, time];
            return row;
        });
    })
    .then( stringify )
    .then( str => bizData.fileContent = str)
    .then( () => {
        return createFolder(bizData.folderName);
    })
    .then( folderPath => writeFile( path.join(folderPath, bizData.getFileName()), bizData.fileContent ))
    .then( monitor )
    .catch( err => {} )
    .then( (any, way) => console.log(bizData.goodbyeMessage))

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-

// -!-!-!-!-!-!-!-!-!-!-!-
