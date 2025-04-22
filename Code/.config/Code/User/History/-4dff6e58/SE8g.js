const redis = require("redis")

const client = redis.createClient({
    host: "localhost",
    port: 6379
})

// Event listener
client.on("error", (err)=>{
    console.log(err);
    
})