const mongoose = require("mongoose")

const {Schema} = mongoose;
//Type값을 받아오기위한 조치, javascript에는 없는 Type,mongoose에서 사용되는 각 데이터별 ObjectID Type
const {Type: {ObejctId}} = Schema;

const chatScema = new Schema({
    room: {
        type: ObjectId,
        require: true,
        ref: "Room"
    },
    user: {
        type: String,
        require: true,
    },
    chat: String,
    gif: String,
    cratedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model("Chat",chatScema)