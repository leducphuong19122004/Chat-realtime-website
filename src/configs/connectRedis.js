import redis from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisclient = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    password: process.env.REDISPASSWORD,
    url: process.env.REDIS_URL,
    legacyMode: true
});

function connectRedis() {
    (async () => {
        await redisclient.connect();
    })();

    console.log("Connecting to the Redis");

    redisclient.on("ready", () => {
        console.log("Connected!");
    });

    redisclient.on("error", (err) => {
        console.log("Error in the Connection");
    });
}



export default connectRedis;