import mongoose from "mongoose"

const mongodb_uri = process.env.MONGODB_URI!;

if (!mongodb_uri) {
    console.log("mongodb_uri is not defined!")
    throw new Error("MONGODB_URI is not defined");
}

let  cached = global.mongoose || {conn : null, promise: null}



export async function connectToDB() {
    if(cached.conn) {
        return cached.conn
    }

    if(!cached.promise){
       cached.promise = mongoose.connect(mongodb_uri, {
        bufferCommands: true,
        maxPoolSize:10
       }).then((mongoose) => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise
        return cached.conn
    } catch (error) {
        cached.conn = null
        throw error
    }


}