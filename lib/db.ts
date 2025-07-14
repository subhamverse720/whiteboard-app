import mongoose from "mongoose"

const mongodb_uri = process.env.MONGODB_URI!;

if (!mongodb_uri) {
    throw new Error("MONGODB_URI is not defined");
}

let  cached = global.mongoose

if(!cached){
  cached  = {conn: null, promise: null}
}

export async function connectToDB() {
    if(cached.conn) {
        return cached.conn
    }

    if(!cached.conn){
       const opts = {
        bufferCommands : true,
        maxPoolSize :10
       }

        mongoose
        .connect(mongodb_uri, opts)
        .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.conn = null
        throw error
    }


}