var socket = io('/')
var peer = new Peer();

//placing my own video
const videogrid = document.getElementById('video-grid')
const peers = {}

//New user is joining the room
peer.on('open',(id)=>{
    console.log("This si my user id"+id);
    socket.emit('join-room',ROOMID,id);
})

const myvideo = document.createElement('video');
myvideo.muted = true

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream => {
    addVideoStream(myvideo,stream)

    //answering when the others are calling
    peer.on('call',(call)=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', uservideostream =>{
            addVideoStream(video,uservideostream);
        })
    })

    //user recieving message whenever new user joins
    socket.on('new-user-joined',(userID)=>{
        connectToNewUser(userID,stream)
    })
})

socket.on('user-disconnected',(userID)=>{
    //console.log(userid)
    if(peers[userID]){peers[userID].close()}
})

function connectToNewUser(userid, stream){
    const call = peer.call(userid,stream);
    const videos = document.createElement('video')
    call.on('stream',(userstream) =>{
        addVideoStream(videos,userstream);
    })
    call.on('close',()=>{
        videos.remove();
    })

    peers[userid] = call
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video)
}