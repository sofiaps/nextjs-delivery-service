import mongoose from 'mongoose'

let cached = global.mongoose

if(!cached) {
    cached = global.mongoose = { con: null, promise: null}
}

async function dbConnect () {
    if (cached.con){
        // console.log('Active DB connection')
        return cached.con
    }

    if (!cached.promise) {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI, options).then(mongoose =>{
            // console.log('DB connection started...')
            return mongoose
        })
    }
    cached.con = await cached.promise
    return cached.con
}

async function dbDisconnect(){
   await mongoose.disconnect();
   console.log('DB Verbindung beendet')
}

const mongodb = {dbConnect, dbDisconnect}
export default mongodb 
