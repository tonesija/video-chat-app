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

function onIceCandidate(pc, socket){
  pc.addEventListener('icecandidate', event => {
      console.log('Got an ice candidate: ', event.candidate)
      if (event.candidate) {
          socket.emit('new-ice-candidate', event.candidate)
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

exports.makeCall = makeCall
exports.onMessageOffer = onMessageOffer
exports.onIceCandidate = onIceCandidate
exports.oneIceConnectionChange = oneIceConnectionChange
exports.onMessageIceCandidate = onMessageIceCandidate
exports.onTrack = onTrack