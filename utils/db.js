import mongoose from "mongoose";

const connection = {};

async function connect(){
    if(connection.isConnected){
        console.log("Already connected to DB");
        return;
    }

    if(mongoose.connections.length>0){
        connection.isConnected = mongoose.connections[0].readyState;
        if(connection.isConnected===1){
            console.log("Use established connection");
            return;
        }
        await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGODB_URL, {});
    
    console.log("New connection to DB.");
    connection.isConnected = db.connections[0].readyState;
}

async function disconnect(){
    if(connection.isConnected){        
        if(process.env.NODE_ENV==="production"){
            await mongoose.disconnect();
            connection.isConnected = false;
        } else {
            console.log("Disconnection ignored in non production mode.");
        }
    }
}

const db = {connect, disconnect};
export default db;

