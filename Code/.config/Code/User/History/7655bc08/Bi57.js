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