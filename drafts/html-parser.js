// HTML parser
'use strict';

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

const wantedOutput = {
    tagName: 'root',
    textContent: '',
    parent: null,
    children: [
        {
            tagName: 'html',
            textContent: '',
            parent: 'root',
            children: [
                {
                    tagName: 'head',
                    textContent: '',
                    parent: 'html',
                    children: [
                        {
                            tagName: 'meta',
                            textContent: '',
                            parent: 'head',
                            children: []
                        },
                        {
                            tagName: 'meta',
                            textContent: '',
                            parent: 'head',
                            children: []
                        },
                        {
                            tagName: 'title',
                            textContent: 'Document',
                            parent: 'head',
                            children: []
                        }
                    ]
                },
                {
                    tagName: 'body',
                    textContent: '',
                    parent: 'html',
                    children: [
                        {
                            tagName: 'h1',
                            textContent: 'SALUT LES NAZES !',
                            parent: 'body',
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
}

const objectStringify = object => {
    let indentation = 0;

    const enclosingChars = {
        objects: ['{', '}'],
        arrays: ['[', ']']
    };

    const numberOfProperties = object => {
        let c = 0;
        for (let p in object) {
            c += 1;
        }
        return c;
    }
    const indent = () => {
        let n = indentation;
        let indentationString = '';
        while (n > 0) {
            indentationString += '    ';
            n--;
        }
        return indentationString;
    };

    const objectLog = (object) => {

        const isArray = Array.isArray(object);
        const usedChars = isArray ? enclosingChars.arrays : enclosingChars.objects;
        const props = numberOfProperties(object);
        let string = usedChars[0] + '\n';
        indentation += 1;

        let propCount = 1;
        // ajouter une virgule si propcount < props

        for (let k in object) {
            string += indent();
            string += isArray ? '' : k + ': ' ;
            if ( typeof object[k] === 'object') {
                string += objectLog(object[k]);
            }
            else if (typeof object[k] === 'string') {
                     string += '"' + object[k] + '"';
            }
            else if (typeof object[k] === 'number') {
                string +=  object[k];
            }
            string += propCount < props ? ',' : '';
            string += '\n';
            propCount++;
        }
        //string = string.slice(0, string.length - 1);
        indentation -= 1;
        string += indent() + usedChars[1] ;
        return string;
    };

    return objectLog(object);
}

const testObject = {
    prop1: "stringProp",
    prop2: 17261376,
    propArray: [
        {
            "truc": 23
        },
        {
            "bidule": 25
        },
        {
            "chose": 42
        }

    ],
    stringsArray: [ "hello", "doollllyyyy", "wazzaaaa"],
    lastProp: "last one"
}

const HTMLtoJSON = input => {
    let index = 0;
    let char = '';
    const selfClosing = [
        '!DOCTYPE',
        'meta'
    ];
    const model = {
        name: 'root',
        parent: null,
        children: [],
        textContent: ''
    };
    let currentNode = model;

    const getNextChar = () => input[index++];
    const peekNextChar = () => input[index];
    const skipChar = () => index++;
    const stillNotFinished = () => input[index] !== undefined;
    const getTag = () => {
        let tag = '';
        do {
            tag += getNextChar();
        } while( peekNextChar() !== '>' );
        return tag;
    };

    while ( stillNotFinished() ) {
        char = getNextChar();
        if ( char === '\\') {
            char = getNextChar();
        }
        else {
            if ( char === '<') {
                if ( peekNextChar() === '/') {
                    let str = '';
                    while ( peekNextChar() !== '>' && peekNextChar() !== ' ' ) {
                        str += getNextChar();
                    }
                    console.log('closing tag : ' + str);
                    currentNode = currentNode.parent;
                }
                else {
                    let str = '';
                    while ( peekNextChar() !== '>' && peekNextChar() !== ' ' ) {
                        str += getNextChar();
                    }
                    console.log('opening tag : ' + str);
                    console.log(currentNode);
                    //make an object whose parent is currentNode
                    //set its name prop to the string
                    const newNode = {
                        name: str,
                        parent: currentNode,
                        children: [],
                        textContent: ''
                    };
                    newNode.parent = currentNode;
                    console.log( objectStringify( newNode ) );

                    //add the object to currentNode's children array
                    currentNode.children.push(newNode);
                    if ( !selfClosing.includes(str) ) {
                        currentNode = newNode;
                    } else {
                        console.log('self-closing tag');
                    }
                }
            } else {
                while ( stillNotFinished() && peekNextChar() !== '<' ) {
                    index++;
                }
            }
        }
    }
    return model;
}


//const tested = HTMLtoJSON(htmlDoc);

console.log( objectStringify( tested ) );

/*
Essai avec un parser abstrait plus simple
*/






/*
rootNode = {
    name: 'rootNode',
    parent: null,
    children: []
}

currentNode = HTMLDOC
while there is a next char
    Get the next character (and increment the index)
    if the char is '\'
        skip to next char
    else if the char is '<'
        if the following char is not '/'
            make a new String
            add all the following characters until you find '>' or ' ' (don't add it to the string)
            make an object whose parent is currentNode
            set its name prop to the string
            add the object to currentNode's children array
            set currentNode = the new object
        else if following char is '/'
            make a new string
            add all the following characters until you find '>' or ' ' (don't add it to the string)
            if you can find the string in the parentNode's children array
                set currentNode to parentNode
            else
                throw error


*/

// ???
//process.exit();

// DOBOL $$ !! -- >> << && {{ }} (( ))
// BOBOL
