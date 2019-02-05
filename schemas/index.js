const mongoose=require("mongoose")

const {MONGO_ID,MONGO_PASSWORD,NODE_ENV}=process.env;
const MONGO_URL="mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin";

module.exports=()=>{
    const connect=()=>{
        if(NODE_ENV!=="production"){
            mongoose.set("debug",true)
        }
        mongoose.connect(MONGO_URL,{
            dbName:"gifchat",
        },(error)=>{
            if(error){
                console.log("mongoDB initial connect error",error);
            }
            else{
                console.log("mongoDB connect sucess")
            }
        })
    }
    connect();

    mongoose.connection.on("error",(error)=>{
        console.error("mongoDB connect error",error)
    })
    mongoose.connection.on("disconnected",()=>{
        console.error("mongoDB disconnected. try reconnect")
        connect()
    })

    require("./chat")
    require("./room")
}