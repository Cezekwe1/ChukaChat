var _ = require('lodash');

module.exports = function(io){
    io.on('connection', function(socket){

        socket.on('disconnect',function(){

            
        })
        socket.on('join notification channel',function(data){
            socket.join(`${data.id} channel`)
        })
        socket.on('send friend request',function(data){
            socket.join(`${data.id} channel`)
            socket.broadcast.to(`${data.id} channel`).emit("receive friend request",{})
            socket.leave(`${data.id} channel`)
        })

        socket.on('accept friend request', function(data){
            
            socket.join(`${data.id} channel`)
            socket.broadcast.to(`${data.id} channel`).emit("accept friend request",{})
            socket.leave(`${data.id} channel`)
        })

        socket.on("remove friend", function(data){
            socket.join(`${data.id} channel`)
            socket.broadcast.to(`${data.id} channel`).emit("remove friend",{})
            socket.leave(`${data.id} channel`)
        })

        socket.on('join conversation',function(data){
            socket.join(data.conversation)
        })
        socket.on('leave conversation',function(data){
            socket.leave(data.conversation)
        })
        socket.on('send message',function(data){
            socket.broadcast.to(data.conversation).emit('receive message', data);
            socket.broadcast.emit("receive notification",data)
        })
        socket.on('signal',function(data){
            let room = `conversation-${data.id}`
            let current = io.sockets.adapter.rooms[room]
            
            socket.join(room)
            socket.broadcast.to(room).emit('signal',data)
        })

        socket.on('join video channel',function(data){
            let room = `conversation-${data.id}`
            let current = io.sockets.adapter.rooms[room]
            socket.join(`conversation-${data.id}`)
            
            
        })
        socket.on('leave video channel',function(data){
            socket.leave(`conversation-${data.id}`)
        })
        socket.on('reject call',function(data){
            let room = `conversation-${data.id}`
            let current = io.sockets.adapter.rooms[room]
            if (current && !current.sockets[socket.id]){
                socket.join(room)
                socket.broadcast.to(room).emit('reject call')
                socket.leave(room)
            } else if(current){
                socket.broadcast.to(room).emit('reject call')
            }

            
            
        })

    })    
}