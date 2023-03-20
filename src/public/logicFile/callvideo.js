

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    addVideoStream(myVideo, stream); // display my video on screen

    const call = myPeer.call(friendID, stream); // call to friend who have friend id is friendID
    call.on('stream', userVideoStream => {
        addVideoStream(peerVideo, userVideoStream)
    })

    // myPeer.on will emitted when a remote peer attempts to call you
    myPeer.on('call', call => { // call is mediaConnection object
        console.log("hellllo");
        call.answer(stream);
        // call.on will emitted when a remote peer adds stream
        call.on('stream', stream => {
            addVideoStream(peerVideo, stream); // display remote peer video on my screen
        })
    })
})
    .catch(error => {
        console.error("Failed to get user media: ", error);
    });




function addVideoStream(video, stream) {
    video.srcObject = stream;
}