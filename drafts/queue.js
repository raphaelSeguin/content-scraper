function Queue () {
    this.queue = [];
}
Queue.prototype.add = function(fn) {
    this.queue.push(fn);
}
Queue.prototype.run = function(arg) {
    let returnedValue = arg;
    for (let i = 0; i < this.queue.length; i++) {
        let fn = this.queue[i];
        returnedValue = fn(returnedValue);
    }
    return returnedValue;
}

const ququ = new Queue();

ququ.add( () => { return setTimeout( () => {return 23} , 2000 )}) ;
ququ.add( x => x+2 );
ququ.add( x => x*3 );
ququ.add( x => 'the answer is ' + x );
ququ.add( x => x.split('').join(' ') );

//console.log( ququ.run(2) );

const callback = (arg, callback) => {
    const result = arg * arg;
    callback(result);
}

const asy = new Promise( (resolve, reject) => {
    setTimeout(function(){
        return 'blabla';
    }, 2000);
}).then(
    function(arg) {
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                return 'blabla' + arg;
            }, 2000);
    });
});

asy();
