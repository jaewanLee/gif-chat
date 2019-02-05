const WebSocket=require("ws")
const SocketIO=require("socket.io")
const axios=require("axios")

module.exports=(server,app,sessionMiddleware)=>{
    //socket파일 위치지정
    const io=SocketIO(server,{path:"/socket.io"})
    //router에서 io객체를 사용할 수 있도록 저장
    app.set("io",io);
    //of는 socketIO에 namespace를 부여하는 작업
    const room=io.of("/room")
    const chat=io.of("/chat")
    io.use((socket,next)=>{
        sessionMiddleware(socket.request,socket.request.res,next);
    })
    room.on("connection",(socket)=>{
        console.log("enter in room namespace")
        socket.on("disconnect",()=>{
            console.log("room namespace disconnect")
        })
    })

    chat.on("connection",(socket)=>{
        console.log("enter in chat namespace");
        const req=socket.request;
        const {headers:{referer}}=req;
        const roomId=referer
            .split("/")[referer.split("/").length-1]
            .replace(/\?.+/,``);
        socket.join(roomId);
        socket.to(roomId).emit('join',{
            user:"system",
            chat:`${req.session.color}is enter`
        })
        socket.on("disconnect",()=>{
            console.log("chat namespace disconnect")
            socket.leave(roomId);
            const currentRoom=socket.adapter.rooms[roomId]
            const userCount=currentRoom?currentRoom.length:0;
            if(userCount==0){
                axios.delete(`http://localhost:8005/room/${roomid}`)
                    .then(()=>{
                        console.log("sucess room delete")
                    })
                    .catch((error)=>{
                        console.error(error);
                    })
            }else{
                socket.to(roomId).emit(`eixt`,{
                    user:"system",
                    chat:`${req.session.color}is out`
                })
            }
        })


    })

    // io.on("connection",(socket)=>{
    //     const req=socket.request;
    //     const ip=req.headers["x-forwarded-for"]||req.connection.remoteAddress;
    //     console.log("new client connected",ip,socket.id);
    //     socket.on("disconnect",()=>{
    //         console.log("client disconnected",ip,socket.id);
    //         clearInterval(socket.interval);
    //     })
    //     socket.on("error",(error)=>{
    //         console.error(error);
    //     })
    //     socket.on("reply",(data)=>{
    //         console.log(data)
    //     })
    //     socket.interval=setInterval(()=>{
    //         socket.emit("news","hello Socket.IO");
    //     },3000)
    // })
}

//ws  사용 예시
// module.exports=(server)=>{
//     const wss=new WebSocket.Server({server});
//
//     wss.on("connection",(ws,req)=>{
//         const ip=req.headers["x-forwarded-for"]||req.connection.remoteAddress
//         console.log("new client connected",ip)
//         ws.on("message",(message)=>{
//             console.log(message)
//         })
//         ws.on("error",(error)=>{
//             console.error(error)
//         })
//         ws.on("close",()=>{
//             console.log("client disconnected",ip);
//             clearInterval(ws.interval);
//         })
//         const interval=setInterval(()=>{
//             if(ws.readyState===ws.OPEN){
//                 ws.send("server send message to client");
//             }
//         },3000)
//         ws.interval=interval;
//     })
// }