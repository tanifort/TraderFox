/**
 * Created by Praktikant on 15.05.2017.
 */
var express;
express = require('express'),
app= express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);
var myport= 3000;
var numberUsers=0;

var connectedUsersIds={};
var ConnectedUser={};



var clients ={};




app.use('/public',express.static(__dirname +'/public'));
app.get('/',function(req,res){
   res.sendFile(__dirname +'/index.html');
});


server.listen(myport,'0.0.0.0',function(){
    console.log("SERVER STARTING............");
    console.log("SERVER LISTENS TO ---------->"+myport);
});

io.sockets.on('connection',function(socket){

    console.log( 'conn' )

    numberUsers++;



      clients[socket.id] ={
              x:0,
             y:0
        };

           updateList();

           // socket.broadcast.emit('new user',{userId:socket.id,numberOfUsers:numberUsers});
   //io.sockets.emit('new user',{userId:clients,SID:socket.id,numberOfUsers:numberUsers});
           // socket.emit('renderAll',clients);
          socket.emit('new user',socket.id,clients);

    console.log("--------------------------->");

        //}



    socket.on('UserCursorPositions',function(data,callback){

            clients[socket.id].x=data.x;
            clients[socket.id].y=data.y;
            clients.socketId=socket.id;

            io.sockets.emit('renderObject',clients);
            callback(true);
            console.log("HIER");
            console.log(clients);

    });

    socket.on('disconnect',function(){
           // delete ConnectedUser[socket.clients];
        delete clients[socket.id];
            numberUsers--;
            console.log(numberUsers);
        updateList();
       // io.sockets.emit('User left',{socketId:socket.id,NumberOfpresentUser:numberUsers});
        socket.broadcast.emit('User left',{socketId:socket.id,NumberOfpresentUser:numberUsers});

    });


});
function updateList(){
    io.sockets.emit('Id',Object.keys(ConnectedUser));
}
