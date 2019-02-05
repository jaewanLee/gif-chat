const WebSocket=require("ws")
const SocketIO=require("socket.io")


module.exports=(server)=>{
    //socket파일 위치지정
    const io=SocketIO(server,{path:"/socket.io"})

    io.on("connection",(socket)=>{
        const req=socket.request;
        const ip=req.headers["x-forwarded-for"]||req.connection.remoteAddress;
        console.log("new client connected",ip,socket.id);
        socket.on("disconnect",()=>{
            console.log("client disconnected",ip,socket.id);
            clearInterval(socket.interval);
        })
        socket.on("error",(error)=>{
            console.error(error);
        })
        socket.on("reply",(data)=>{
            console.log(data)
        })
        socket.interval=setInterval(()=>{
            socket.emit("news","hello Socket.IO");
        },3000)
    })
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