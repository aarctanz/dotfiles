// timers -> pending callbacks -> idle, prepare -> poll -> check -> close callback

const fs = require('fs')
const crypto  = require('crypto')

console.log("1 start")
setTimeout(()=>{
    console.log("2 0 sec callback (macrotask)")
}, 0)

setTimeout(()=>{
    console.log("3 0 sec callback (macrotask)")
}, 0)

setImmediate(()=>{
    console.log("4 setimm")
},0)

Promise.resolve().then(()=>{
    console.log("5 promise resolved, microtask")
})

process.nextTick(()=>{
    console.log("6 procc nt cb microtask")
})

fs.readFileSync(__filename, ()=>{
    console.log("7 file read op, IO cb")
})

crypto.pbkdf2