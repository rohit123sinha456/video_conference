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
    console.log(req.body.room1)
    console.log(req.body.room2)
    const var_room1 = req.body.room1
    const var_room2 =  req.body.room2
    const rooms = [var_room1,var_room2]
    console.log(typeof(rooms))
    res.render('room',{roomid : rooms })
})

io.on('connection',(socket) =>{
    console.log("user connected");
    socket.on('join-room',(roomId, userID) =>{
        console.log(roomId,userID);
        socket.join(roomId,()=>{
            io.to(roomId).emit('new-user-joined',userID)
        })
        socket.on('disconnect',()=>{
            console.log('User disconnected')
            socket.to(roomId).broadcast.emit('user-disconnected',userID)
        })
    })

})


server.listen(3030)





