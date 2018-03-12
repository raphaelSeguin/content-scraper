// HTML parser
'use strict';

const htmlRegExp = /<\/?\w+>/g;

const htmlDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>Document</title>
</head>
<body>
    BLABLA
</body>
</html>
`;

const lexer = (doc) => {
    const tags = doc.match(htmlRegExp);
    return tags.map( (tag) => {
        return {
            type: /<\//.test(tag) ? 'closing' : 'opening',
            name: tag,
        }
    });
}

const parser = (tokens) => {
    const tree = {
        root: null,
        left: null,
        right: null,
        add: function() {
            
        },

    }
}


console.log(lexer(htmlDoc));

/*
let index = 0;
const tokens = [];

function getNext() {
    return index < htmlDoc.length ? htmlDoc.charAt(index++) : undefined;
}
function peekNext() {
    return index < htmlDoc.length ? htmlDoc.charAt(index) : undefined;
}
function skipText() {
    let char = peekNext();
    while(char !== '<' && index < length) {
        char = getNext();
    }
    return;
}
function tagScan() {
    let char = peekNext();
    let tagContent = '';
    if (char === '<') {
        char
    }
}
function createToken(content, val) {
    return {
        name: name,
        val: val
    }
}
function tokenize() {
    while( index < htmlDoc.length ) {
        skipText();

    }
}
*/
