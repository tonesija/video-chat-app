async function makeCall(pc, socket){
  console.log('Making call')
  socket.on('message', async message => {
      if (message.answer) {
      console.log('Got an answer')
      const remoteDesc = new RTCSessionDescription(message.answer)
      await pc.setRemoteDescription(remoteDesc)
      }
  })

  var mediaConstraints = {
  'offerToReceiveAudio': true,
  'offerToReceiveVideo': true    
  };

  const offer = await pc.createOffer(mediaConstraints)
  await pc.setLocalDescription(offer)
  socket.emit('offer', offer)
}

function onMessageOffer(pc, socket){
  socket.on('message', async message => {
      if (message.offer) {
          console.log('Got an offer')
          pc.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await pc.createAnswer();
          
          await pc.setLocalDescription(answer)
          socket.emit('answer', answer)
      }
  })
}

function onIceCandidate(pc, socket, sender){
  pc.addEventListener('icecandidate', event => {
      console.log('Got an ice candidate: ', event.candidate)
      if (event.candidate) {
          socket.emit('new-ice-candidate', {candidate: event.candidate, reciver: sender})
      }
  })
}

function oneIceConnectionChange(pc){
  pc.addEventListener('iceconnectionstatechange', event => {
      console.log('Ice connection state changed: ', pc.iceConnectionState)
      if (pc.iceConnectionState === 'connected') {
          console.log('Peers connected', event)
      }
  })
}

function onMessageIceCandidate(pc, socket){
  socket.on('message', async message => {
      if (message.iceCandidate) {
          console.log('Got and ice candidate through message')
          try {
          console.log('Addin ice candidate to peer connection')
          await pc.addIceCandidate(message.iceCandidate);
          } catch (e) {
          console.error('Error adding received ice candidate', e);
          }
      }
  })
}

function onTrack(pc, remoteVideoStream){
  pc.addEventListener('track', async (event) => {
      console.log('Got a track!!!')
      remoteVideoStream.addTrack(event.track, remoteVideoStream)
  })
}

function onNegotiationNeeded(pc, reciver, socket){
  let handler = async (event) => {
    console.log('NEGOTIATION NEEDED', event)
    let newOffer = await pc.createOffer()
    await pc.setLocalDescription(newOffer)
    socket.emit('offer', {offer: newOffer, reciver: reciver})
    pc.removeEventListener('negotiationneeded', handler)
  }
  pc.addEventListener('negotiationneeded', handler)
}

function onNegotiationNeededGroup(pcs, socket, sender){
  console.log(pcs)
  for(let [username, pc] of pcs){
    console.log(username, pc)
    let handler = async (event) => {
      console.log('NEGOTIATION NEEDED', event)
      let newOffer = await pc.createOffer()
      await pc.setLocalDescription(newOffer)
      socket.emit('offer-group', {offer: newOffer, 
        reciver: username, sender: sender})
      pc.removeEventListener('negotiationneeded', handler)
    }
    console.log('neg needed for', username)
    pc.addEventListener('negotiationneeded', handler)
  }
}

function setupNewPc(pc, sender, reciver, socket){
  pc.onicecandidate = function(event){
    console.log('Got an ice candidate for: ', reciver)
    console.log('pcstop', pc.stop)
    if (event.candidate) {
        socket.emit('new-ice-candidate-group', {candidate: event.candidate,
          sender: sender, reciver: reciver})
    }
  }
}


function myOnTrack(reciver, pc, remoteVideoStreams){
  pc.addEventListener('track', async (event) => {
    console.log('Got a track from ', reciver)
    let flag = false
    remoteVideoStreams.forEach(rv => {
      if(rv.username === reciver){
        console.log('adding track to existing rv')
        rv.mediaStream.addTrack(event.track, rv.mediaStream)
        flag = true
      }
    })
    if(flag) return
    let newMediaStream = new MediaStream()
    newMediaStream.addTrack(event.track, newMediaStream)
    let remoteStream = {username: reciver, mediaStream: newMediaStream}
    remoteVideoStreams.push(remoteStream)
  })
}

function myOnConnChange(pc){
  pc.addEventListener('iceconnectionstatechange', (event) => {
    console.log('Connection changed: ', pc.iceConnectionState)
    if(pc.iceConnectionState === 'connected'){
      console.log('Peers connected!!!', event)
      pc.onicecandidate = null
    }
  })
}

function videoContains(username, remoteVideoStreams){
  for(let rvs of remoteVideoStreams){
    if(rvs.username === username) return rvs
  }
  return null
}

function setLocalStream(pc, videoStream){
    //add local stream to pc
    console.log('Setting local streams')
    videoStream.getTracks().forEach(track => {
      console.log('Adding tracks to peer connection!')
      pc.addTrack(track, videoStream)
    })
}



// ----- CONFERENCE VARIANTS -------


exports.makeCall = makeCall
exports.onMessageOffer = onMessageOffer
exports.onIceCandidate = onIceCandidate
exports.oneIceConnectionChange = oneIceConnectionChange
exports.onMessageIceCandidate = onMessageIceCandidate
exports.onTrack = onTrack
exports.onNegotiationNeeded = onNegotiationNeeded
exports.onNegotiationNeededGroup = onNegotiationNeededGroup

exports.myOnTrack = myOnTrack
exports.setupNewPc = setupNewPc
exports.setLocalStream = setLocalStream
exports.myOnConnChange = myOnConnChange

exports.videoContains = videoContains