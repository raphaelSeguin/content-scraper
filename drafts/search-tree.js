'use strict';

const createRandomIntArray = (n) => {
    const rndArray = [];
    for (let i = 0; i < n; i++) {
        rndArray.push(Math.floor(Math.random()*(2<<32)));
    }
    return rndArray;
}

function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}

function SearchTree() {
    this.root = null;
    this.add = function(data) {
        if ( this.root === null ) {
            this.root = new Node(data);
        } else {
            function addNode(node) {
                if ( data < node.data) {
                    if ( node.left === null ) {
                        node.left = new Node(data);
                        return;
                    } else {
                        return addNode(node.left);
                    }
                } else if ( data > node.data) {
                    if ( node.right === null ) {
                        node.right = new Node(data);
                        return;
                    } else {
                        return addNode(node.right);
                    }
                } else {
                    return null;
                }
            }
            return addNode(this.root);
        }
    }
}

const tree = new SearchTree();

tree.add(12);
tree.add(22);
tree.add(42);
tree.add(2);

console.log( tree );
