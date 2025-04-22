const redis = require("redis")

const client = redis.createClient({
    host: "localhost",
    port: 6379
})

// Event listener
client.on("error", (err)=>{
    console.log("redis client errror", err);
    
})

async function ping() {
    try {
        await client.connect()
        console.log("Redis connected")
    } catch (error) {
        console.error(error)
    }
    finally{
        await client.quit()
    }
}
ping()