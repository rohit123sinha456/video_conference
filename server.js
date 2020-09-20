const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser');


const {v4: uuidv4} = require('uuid')
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:roomid',(req,res) => {
    res.render('room',{roomid: req.params.roomid})
    
})

app.get('/admin/grandmaster',(req,res)=>{
    res.render('grandmaster')
})

app.post('/admin/grandmaster-submit',(req,res)=>{
    const room1id = req.body.room1
    const room2id = req.body.room2
    console.log(room1id,room2id)
    res.render('grandmaster-submit',{room1 : room1id , room2 : room2id})
})


io.on('connection',(socket) =>{
    console.log("user connected");
    socket.on('join-room',(roomId, userID) =>{
        console.log(roomId,userID);
        if(typeof(roomId) == 'object'){
            rooms = roomId
            socket.join(rooms,()=>{
                console.log('Grandmaster joined')
                io.to(rooms[0]).to(rooms[1]).emit('new-user-joined',userID)
            })
        
            socket.on('disconnect',()=>{
                    console.log('User disconnected grandmaster call')
                    socket.to(roomId).broadcast.emit('user-disconnected',userID)
            })
        
            }
        socket.join(roomId,()=>{
            io.to(roomId).emit('new-user-joined',userID)
        })
        socket.on('disconnect',()=>{
            console.log('User disconnected groups')
            socket.to(roomId).broadcast.emit('user-disconnected',userID)
        })
    })

})


server.listen(3030)





