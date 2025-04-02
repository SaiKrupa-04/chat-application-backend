import {WebSocketServer} from "ws";
 const arr=[]
const wss=new WebSocketServer({port:8081});

wss.on("connection",(socket)=>{
    socket.on("message",(e)=>{
        
        const data=JSON.parse(e.toString());
       
   
        if(data.type==="join"){
            arr.push({
                 socket,
                 roomid:data.payload.roomid,
                 uname:data.payload.uname,
            })

        }
        if(data.type=="message"){
            for(let i=0;i<arr.length;i++){
                if(data.payload.roomid==arr[i].roomid){
                    if(socket==arr[i].socket){
                    socket.send(JSON.stringify({
                       
                        payload:{
                            type:"send",
                            uname:"",
                            message:data.payload.message,
                        }
                    }));
                }
                else{
                    arr[i].socket.send(JSON.stringify({
                        
                        payload:{
                            type:"recieved",
                            message:data.payload.message,
                            uname:data.payload.uname,
                        }
                    }));
                }
                }
            }


        }
     
        if (data.type === "leave") {
            const index = arr.findIndex(client =>
                client.uname === data.payload.uname && client.roomid === data.payload.roomid
            );

            if (index !== -1) {
                arr.splice(index, 1); 
            }
        }
    });
    socket.on("close", () => {
        const index = arr.findIndex(client => client.socket === socket);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    });
    
})            