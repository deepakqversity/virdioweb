if(!AgoraRTC.checkSystemRequirements()) {
    alert("Your browser does not support WebRTC!");
  }

  /* select Log type */
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE);
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.WARNING);
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);  
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);

  /* simulated data to proof setLogLevel() */
  AgoraRTC.Logger.error('this is error');
  AgoraRTC.Logger.warning('this is warning');
  AgoraRTC.Logger.info('this is info');
  AgoraRTC.Logger.debug('this is debug');

  var client, localStream, camera, microphone;

  //var appId = '748f9639fa864651bef8419d5870ec50';// provided by arjun 

   //var appId = '232f270a5aeb4e0097d8b5ceb8c24ab3';
  var appId = '';

  function join() {

    let camera = microphone= null;
    let mediaIds = localStorage.getItem("media-setting");
      
    if(mediaIds != undefined) {
      
      mediaIds = JSON.parse(mediaIds);
      
      if(mediaIds.camera != null && mediaIds.microphone != null) {

        camera = mediaIds.camera;
        microphone = mediaIds.microphone;
      } else {
        console.log('something went wrong')
        return false;
      }

    } else {
      if($('input[name="video-type"]').length > 0 && $('input[name="audio-type"]').length > 0){

        camera = $('input[name="video-type"]:checked').val();
        microphone = $('input[name="audio-type"]:checked').val();
      } else {
        console.log('Media device not found==')
        return false;
      }

    }

    console.log('camera, microphone = ', camera, microphone)

    let storeData = getCurrentUserData();
   
    console.log('-****  channel, utype', storeData.sessionData.channelId, storeData.userType);

    var channel_key = storeData.sessionData.streamToken != undefined ? storeData.sessionData.streamToken : null;
     
    console.log("Init AgoraRTC client with App ID and token: " + storeData.sessionData.appId, channel_key);
    
    // create client first
    client = AgoraRTC.createClient({mode: 'live'});
    
    // initialize client
    client.init(storeData.sessionData.appId, function () {

      console.log("AgoraRTC client initialized");

      // Before join channel add user role 
      client.setClientRole(storeData.userType == 1 ? "host" : "audience", function(err) {

        if(err) {
          console.log("user role failed", e);
          return;
        } else {
          console.log("user role set success");

          var channelName = storeData.sessionData.channelId;

          // create and join channel
         client.join(channel_key, channelName.toString(), storeData.id, function(uid) {
          // client.join(channel_key, channelName, storeData.email, function(uid) {

            console.log("User***********Lalit******* " + uid + " join channel successfully");

            let sessionState = true;

            // create local stream
            localStream = AgoraRTC.createStream({streamID: uid, audio: storeData.userType == 1 ? true : true, cameraId: camera, microphoneId: microphone, video: sessionState, screen: false });
            

            if (sessionState) {
              localStream.setVideoProfile('720p_3');
            }

            // localStream.setVideoEncoderConfiguration({
            //     // Video resolution
            //     resolution: {
            //         width: 640,// 1280
            //         height: 380 // 
            //     }
            // });

            // The user has granted access to the camera and mic.
            localStream.on("accessAllowed", function() {
              console.log("accessAllowed");
            });

            // The user has denied access to the camera and mic.
            localStream.on("accessDenied", function() {
              console.log("accessDenied");
            });
        
            localStream.init(function() {

                if(storeData.userType != 1){
                  localStream.muteAudio();
                } 
          
                console.log("getUserMedia successfully", storeData.sessionData.id, storeData.id);
                localStream.play('agora_local');
                
                // $.ajax({
                //     headers: { 
                //         "Content-Type": "application/json; charset=utf-8",
                //         "Authorization": storeData.token
                //     },
                //     url: '/api/v1/session/'+storeData.sessionData.id+'/stream-id',
                //     dataType: 'json',
                //     type: 'PUT',
                //     contentType: 'application/json',
                //     data: JSON.stringify({ "streamId": uid, "userType": parseInt(storeData.userType) }),
                //     success: function( data, textStatus, jQxhr ){
                        
                        if(storeData.userType == 1){

                          client.publish(localStream, function (err) {
                            console.log("Publish local stream error: " + err);
                          });

                          client.on('stream-published', function (evt) {
                            console.log("Publish local stream successfully");
                            // console.log('localStream ==========================*******************', localStream)
                            console.log('client ------------', client)
                          });

                        } else {
                          // publish();
                        }
                //     },
                //     error: function( jqXhr, textStatus, errorThrown ){
                //         console.log( errorThrown );
                //     }
                // });
           
            }, function (err) {
              console.log("getUserMedia failed", err);
            });
            
          }, function(err) {
            console.log("Join channel failed", err);
          });
        }
      });// client as host/ audience

    }, function (err) {
      console.log("AgoraRTC client init failed", err);
    });
  


    channelKey = "";
    client.on('error', function(err) {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        client.renewChannelKey(channelKey, function(){
          console.log("Renew channel key successfully");
        }, function(err){
          console.log("Renew channel key failed: ", err);
        });
      }
    });


    client.on('stream-added', function (evt) {
      var stream = evt.stream;
      console.log("New stream added:=========== " + stream.getId());
      console.log("Subscribe ", stream);
      
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });

    var count=1;
    client.on('stream-subscribed', function (evt) {

      var storeData = getCurrentUserData();

      var stream = evt.stream;
      console.log("Subscribe remote stream successfully: " , stream.getId() , stream);
      // for host user
      if(storeData.userType == 1) {

        if ($('#subscribers-list #agora_remote'+stream.getId()).length === 0) {
        
          $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" data-dismiss="modal">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute   d-none"  id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><div class="att-details"><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div> <span class="att-name">James K, TX</span><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');
        }
        stream.play('agora_remote_vdo' + stream.getId());

        switchVideoSize();

        checkMuteUnmute(stream.getId());

        $('#subscribers-list #agora_remote'+stream.getId()).removeClass('d-none');

        // onPageResize();

        let ref = setInterval(function(){
          if($('#subscribers-list #agora_remote'+stream.getId()).hasClass('d-none') == false){
            onPageResize();
            clearInterval(ref);
          }
        }, 10);

      } else {
      // for attendy user
        console.log('###################', storeData.sessionData.id, stream.getId());
          $.ajax({
              headers: { 
                  "Content-Type": "application/json; charset=utf-8",
                  "Authorization": storeData.token
              },
              url: '/api/v1/session/'+storeData.sessionData.id+'/'+stream.getId()+'/stream-id',
              dataType: 'json',
              type: 'GET',
              success: function( data, textStatus, jQxhr ){
                  
                  let respData = data;

                  if(respData.status){
                    if(respData.type == 1){

                      if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
                        
                        $('#agora_host').append('<div id="agora_remote'+stream.getId()+'"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div></div>');
                      }
                      stream.play('agora_remote_vdo' + stream.getId());

                      // checkMuteUnmute(stream.getId());
                    } else {
                      // console.log(' check video = ', stream.hasVideo())
                      // console.log(' check audio = ', stream.hasAudio())
                      
                      // $('#agora_host').append('<div id="agora_remote'+stream.getId()+'"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div></div>');
                      // stream.play('agora_remote_vdo' + stream.getId());
                      // checkMuteUnmute(stream.getId());
                      if(stream.hasVideo())
                        stream.muteVideo();
                      
                      if(stream.hasAudio())
                        stream.muteAudio();
                    }
                  }
                  
              },
              error: function( jqXhr, textStatus, errorThrown ){
                  console.log( errorThrown );
              }
          });
      }
     
    });

    client.on('stream-removed', function (evt) {
      var stream = evt.stream;
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      switchVideoSize();
      console.log("Remote stream is removed " + stream.getId());
    });

    client.on('peer-leave', function (evt) {
      console.log('peer-leave = ', evt)
      var stream = evt.stream;
      if (stream) {
        stream.stop();
        $('#agora_remote' + stream.getId()).remove();
        switchVideoSize();
        console.log(evt.uid + " leaved from this channel");
      }
    });

    client.on('mute-audio', function (evt) {
      if ($('#subscribers-list #agora_remote'+evt.uid).length > 0){
        $('#subscribers-list #agora_remote'+evt.uid).find('.hand').addClass('d-none')
      }
    });

    client.on('unmute-audio', function (evt) {

      if ($('#subscribers-list #agora_remote'+evt.uid).length > 0){
        $('#subscribers-list #agora_remote'+evt.uid).find('.hand').removeClass('d-none')
      }
      
    });

    client.on('active-speaker', function(evt) {
       var uid = evt.uid;
       console.log("update active speaker: client " + uid);
    });

   /* client.on('peer-online', function(evt) {
      console.log('peer-online', evt.uid);
    });
    
    client.on("connection-state-change", function(evt) {
      console.log('******lalit****',evt);
      console.log(evt.prevState, evt.curState);
    })*/

    // client.on("volume-indicator", function(evt){
    //   evt.attr.forEach(function(volume, index){
    //     console.log(`#{index} UID ${volume.uid} Level ${volume.level}`);
    //   });
    // });


    // client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
    // client.on("volume-indicator", function(evt){
    //     evt.attr.forEach(function(volume, index){
    // console.log(#{index} UID ${volume.uid} Level ${volume.level});
    //             console.log(`#{index} UID= ${volume.uid} Level ${volume.level}`);
    //     });
    // });

    client.getRemoteAudioStats((remoteAudioStatsMap) => {
        for(var uid in remoteAudioStatsMap){
             console.log(`Audio CodecType from ${uid}: ${remoteAudioStatsMap[uid].CodecType}`);
             console.log(`Audio End2EndDelay from ${uid}: ${remoteAudioStatsMap[uid].End2EndDelay}`);
             console.log(`Audio MuteState from ${uid}: ${remoteAudioStatsMap[uid].MuteState}`);
             console.log(`Audio PacketLossRate from ${uid}: ${remoteAudioStatsMap[uid].PacketLossRate}`);
             console.log(`Audio RecvBitrate from ${uid}: ${remoteAudioStatsMap[uid].RecvBitrate}`);
             console.log(`Audio RecvLevel from ${uid}: ${remoteAudioStatsMap[uid].RecvLevel}`);
             console.log(`Audio TotalFreezeTime from ${uid}: ${remoteAudioStatsMap[uid].TotalFreezeTime}`);
             console.log(`Audio TotalPlayDuration from ${uid}: ${remoteAudioStatsMap[uid].TotalPlayDuration}`);
             console.log(`Audio TransportDelay from ${uid}: ${remoteAudioStatsMap[uid].TransportDelay}`);
        }
    });

    client.on("client-role-changed", function (evt) {
      console.log('client-role-changed = ', evt)
      var stream = evt.stream;
      if (stream) {
        console.log(evt.uid + " ===> role changed");
      }
    });

    client.on("peer-online", function (evt) {
      console.log('peer-online = ', evt)
      // var stream = evt.stream;
      // if (stream) {
      //   console.log(evt.uid + " ===> peer online");
      // }
    });

  }

  function getCurrentUserData(){
    return JSON.parse(localStorage.getItem("userData"));
  }    

  function switchVideoSize(){
    let len = $('#subscribers-list .newcss').length;

    if(len == 0) return false;

    let vdoSize = '';
    if(len == 1){
      vdoSize = 'one mx-auto';
    } else if(len == 2) {
      vdoSize = 'two';
    } else if(len == 3) {
      vdoSize = 'three';
    } else if(len == 4) {
      vdoSize = 'four';
    } else {
      vdoSize = 'five';
    }

    // javascript each
    $('#subscribers-list .newcss').each(function (index, value) {
      
      $(this).removeClass('col-md-6')
        .removeClass('col-md-4')
        .removeClass('one')
        .removeClass('two')
        .removeClass('three')
        .removeClass('four')
        .removeClass('five')
        .removeClass('col-lg-8')
        .removeClass('col-md-4')
        .removeClass('col-lg-6')
        .removeClass('col-lg-5')
        .removeClass('col-lg-4')
        .removeClass('col-lg-3')
        .removeClass('col-sm-6')
        .removeClass('col-sm-4')
        .removeClass('col-sm-3')
        .removeClass('col-6')
        .removeClass('col-12')
        .removeClass('mx-auto');

      $(this).addClass(vdoSize);

    });
  }

  function leave() {
   // document.getElementById("leave").disabled = true;
    client.leave(function () {
      $('#subscribers-list').html('');
      console.log("Leavel channel successfully");
    }, function (err) {
      console.log("Leave channel failed");
    });
  }

  //var currentSession = getCurrentSession(); 
  var newclient; 
  var channel;
  var channelName1 = '1440';
  function rtmJoin()
  {
   var appId1 = '232f270a5aeb4e0097d8b5ceb8c24ab3';
   var channelName1 = '1440';

  var token=null;
    newclient = AgoraRTM.createInstance(appId1);
   var storeData = getCurrentUserData();
   var peer=storeData.id;
  // newclient.login({uid: peer.toString(), token});

  newclient.on('ConnectionStateChange', (newState, reason) => {
    console.log('on connection state changed to ' + newState + ' reason: ' + reason);
  });

   newclient.login({ token: token, uid: peer.toString() }).then(() => {

    console.log('****shiv*******AgoraRTM client login success***********');

    newclient.on('MessageFromPeer', (message, peerId) => { 
      var msg=message.text;
      console.log('********vvvvvvvvvvvvv********',msg,'********************',peerId);
     // console.log("message "+ message.text + " peerId" + peerId);
     var  pagetype="1";
      signalHandler(peerId, msg, storeData.userType);
      });

     channel = newclient.createChannel(channelName1);
    channel.join().then(() => {
     console.log('**********shiv*********channel joined successfully**********');
    
 
     channel.getMembers().then(membersList => {    
       console.log('*************Total Number Of Userkkkkkkkkkkkkkkkkkk******',membersList.length);
      
       channelSignalHandler(JSON.stringify({code:"208",member:membersList.length, totalmember:membersList, msgtype:"totalcount"}), storeData.userType);

       }).catch(error => {
           console.log('*************There is an error******');
       });

       channel.on('MemberJoined', memberId => { 
        console.log('This********lalit',memberId,'has joined channel successfully');
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var massages="208~@$"+memberId+"~@$joined~@$"+dateTime;        
        channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);
        })
     

       channel.on('MemberLeft', memberId => { 
        console.log('This*********munmun',memberId,'has left successfully');
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var massages="208~@$"+memberId+"~@$left~@$"+dateTime;  
        channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
        })
     
       channel.on('ChannelMessage', (message, senderId) => {         
        var msg=message.text;
       // msg = JSON.parse(msg);      
        console.log('*****shivammmm********',msg.message,'********************',storeData.userType)
      var  pagetype="1";
        channelSignalHandler(msg, storeData.userType);
        });
 
      }).catch(error => {
        console.log('**********shiv*********There Is a problem to join a channel**********');
      });

        }).catch(err => {
          console.log('---------------bbbbbbbb-----client is not logedin-----');
        });
  
      }

      function leave_channel() {
        channel.leave();
       }


      function sendMessage(peerId, text)
      {
          console.log("sendPeerMessage", text, peerId);
          newclient.sendMessageToPeer({text}, peerId.toString());
      }

      function sendMessageToChannel(channelName1, text)
      {
          channel.sendMessage({text},channelName1);
          console.log('---------------','mssages send successfully on channel');
      }



      function getMemberList()
      {
          channel.getMembers().then(membersList => {    
          console.log('*************Total Number Of User******',membersList[1]);
       
        var arr=membersList;             
        counter=membersList.length;
        counter=parseInt(counter); 
        console.log('********mmmwhello************** signalData ', counter);
        var html = '';
        var optionbox='';
        optionbox +='<option value="select">select</option>';
        arr.forEach(function (value, i) {
          console.log("--------totalvalueold--------------", i, value);
          if(i >= 0 && value != 1)
          {   
            console.log("--------totalvaluenew--------------", i, value);     
                                  
          optionbox +='<option value=' + value + '>' + value + '</option>';
   
          }
        });
        html += '<select id="opt" onchange="onclickShowAsBroadcaster();">'+optionbox+'</select>';
        $('#guestmsg').append(html);

      }).catch(error => {
          console.log('*************There is an error******');
      });

      }

  
      function onclickShowAsBroadcaster() {
        var selectBox = document.getElementById("opt");
        var attendiesID = selectBox.options[selectBox.selectedIndex].value;
       // alert(selectedValue);
        sendMessage(attendiesID, JSON.stringify({code:"200", message:"Now You can Publish"}));

       }

    

  function onclickaudioOn(audienceID)
  {
    // let allVdo = $('#subscribers-list video');   
    // let allAdo = $('#subscribers-list audio');   

    let vdo = $('#subscribers-list #agora_remote'+ audienceID + ' video' )[0];   
    let ado = $('#subscribers-list #agora_remote'+ audienceID + ' audio' )[0];   

    // $.each(allVdo, function (index, value) {
    //   allVdo[index].muted = true;
    //   allAdo[index].muted = true;
    // });

    let massages = '';
    let codes='';
    if(vdo.muted || ado.muted){
      console.log('unmute successfully')
      vdo.muted = false;
      ado.muted = false;
      $('#subscribers-list #agora_remote'+ audienceID).find('.microphone-icon').removeClass('microphone-icon-mute');
      massages="209~@$UNMUTE,Now You Become a Broadcaster"; 
      codes="209";
    } else {
      vdo.muted = true;
      ado.muted = true;
      $('#subscribers-list #agora_remote'+ audienceID).find('.microphone-icon').addClass('microphone-icon-mute');
      massages="204~@$MUTEP,Now You Become a Audience";
      codes="204";
    }

    sendMessage(audienceID, JSON.stringify({code:codes, message:massages}));
  }

  function onclickhandRaise(receiverId)
  {   
    $('#agora_hand_raise'+receiverId+'').addClass("d-none");
    $('#audion_on'+receiverId+'').removeClass("d-none");
    var massages="203~@$ASKQ"; 
    sendMessage(receiverId, JSON.stringify({code:"203", message:massages}));

    let allVdo = $('#subscribers-list video');   
    let allAdo = $('#subscribers-list audio');   

    let vdo = $('#subscribers-list #agora_remote'+ receiverId + ' video' )[0];   
    let ado = $('#subscribers-list #agora_remote'+ receiverId + ' audio' )[0];   

    $.each(allVdo, function (index, value) {
      allVdo[index].muted = true;
      allAdo[index].muted = true;
    });

    if(vdo.muted || ado.muted){
      console.log('unmute successfully')
      vdo.muted = false;
      ado.muted = false;
    }


  }

  function eject_participent(receiverId)
  {
    var massages="205~@$EJECT"; 
    sendMessage(receiverId, JSON.stringify({code:"205", message:massages}));
  }

  function changeParticipentToAudience(receiverId)
  {
    var massages="209~@$Change To Audience"; 
    sendMessage(receiverId, JSON.stringify({code:"209", message:massages}));
  }
  // function onclickShowAsBroadcaster(attendiesID)
  // {
  //   sendMessage(attendiesID, JSON.stringify({code:"102", message:"Now You can Publish"}));
  // }
  

  function publish() {

    client.publish(localStream, function (err) {
      console.log("Publish local stream error: " + err);
    });
    client.on('stream-published', function (evt) {
      console.log('client ============', client)
    });
  }

  function unpublish() {
    
    client.unpublish(localStream, function (err) {
      console.log("Unpublish local stream failed == " + err);
    });

  }

  var localClient = '';
  function networkBandwidth() {

    let storeData = getCurrentUserData();

    localClient = AgoraRTC.createClient({ mode: 'live', codec:'h264' });
    // Initialize the client and join the channel.
    console.log('-------------------------------------------ooo')
    // initialize client
    localClient.init(storeData.sessionData.appId, function () {
    console.log('-------------------------------------------HHH')
          // create and join channel
      localClient.join(storeData.sessionData.streamToken, storeData.sessionData.channelId.toString(), storeData.id, function(uid) {
        // localClient.join(null, '900001', storeData.email, function(uid) {
        console.log('-------------------------------------------uid')
          // create local stream
            let localStream1 = AgoraRTC.createStream({streamID: uid, audio: true, video: true, screen: false });
          
            localStream1.init(function() {

                          localClient.publish(localStream1, function (err) {
                            console.log("Publish local stream error: " + err);
                          });

                          


           
            }, function (err) {
              console.log("getUserMedia failed", err);
            });
      }, function(err) {
        console.log("Join channel failed", err);
      });

    }, function (err) {
      console.log("AgoraRTC client init failed", err);
    });

    setInterval(function(){      
      localClient.getTransportStats((stats) => {
          console.log(`Current Transport RTT: ${stats.RTT}`);
          console.log(`Current Network Type: ${stats.networkType}`);
          console.log(`Current Transport OutgoingAvailableBandwidth: ${stats.OutgoingAvailableBandwidth}`);
      });
    }, 3000);   
    
  }

  function raiseHand(){
      localStream.unmuteAudio(); 
  }

  function downHand(){
      localStream.muteAudio();  
  }
  
  let checkMic = function(micId){

      stream2 = AgoraRTC.createStream({
          streamID: Math.floor(Math.random()*1000000),
          // Set audio to true if testing the microphone.
          video: false,
          audio: true,
          microphoneId: micId,
      });
      // console.log('----------', micId)

      // The user has granted access to the camera and mic.
        stream2.on("accessAllowed", function() {
          console.log("accessAllowed");

          $('#audio-media-content').find('.fa-microphone').removeClass('text-success');
          $("#ado-"+micId).find('.fa-microphone').addClass('text-success');
        });

        // The user has denied access to the camera and mic.
        stream2.on("accessDenied", function() {
          $('#audio-media-content').find('.fa-microphone').removeClass('text-success');
          console.log("accessDenied");

        });

      // Initialize the stream.
      stream2.init(function(){
          // stream2.play('local-audio-media');
          // setInterval(function(){
          // // should be greater than 0
          //     console.log(`Local Stream Audio Level ${stream2.getAudioLevel()}`);
          // }, 1000);
      })
  };

  var stream1 = stream2 = null;

  function getDevices() {
    
    AgoraRTC.getDevices(function (devices) {
      let vdoMediaHtml = '';
      let adoMediaHtml = '';
      
      let cameraId = microphoneId = null;
      let mediaIds = localStorage.getItem("media-setting");

      if(mediaIds != undefined) {
          mediaIds = JSON.parse(mediaIds);
        if(mediaIds.camera != null && mediaIds.microphone != null) {

          cameraId = mediaIds.camera;
          microphoneId = mediaIds.microphone;

          $('#set-default').prop('checked', true);

        } else {
          console.log('something went wrong')
          return false;
        }

      }
      
      let device = '';
      let deviceId = '';
      let deviceArray = [];
      for (var i = 0, ctr = 0, ctr1 = 0; i !== devices.length; ++i) {

        if(!devices[i] || devices[i] == undefined) continue;

        // console.log('devices[i] = ', devices[i])
        device = devices[i];
        deviceId = device.deviceId;

        if(deviceArray.includes(deviceId)) continue;

        defaultSetting = '';
        deviceArray.push(deviceId);
        
        if (device.kind === 'audioinput') {
          
          // console.log('deviceId,,,,,,,,,,,, ', deviceId)

          if(microphoneId == null) {
            if(ctr1 == 0)
              defaultSetting = 'checked';
          } else {
            if(microphoneId == deviceId) {
                defaultSetting = 'checked';
            }
          }
          console.log('---------- microphoneId == deviceId - ', microphoneId, deviceId, ctr1)

          ++ctr1;

          adoMediaHtml = '<div class="" id="ado-'+deviceId+'"><input class="form-radio" type="radio" name="audio-type" id="lbl-'+deviceId+'" value="'+deviceId+'" '+ defaultSetting +'> <label for="lbl-'+deviceId+'"> '+ device.label +'</label> </div>';

          $('#audio-media-content').append(adoMediaHtml)

          if(defaultSetting == 'checked'){
            // console.log('current =============', deviceId)
            checkMic(deviceId);
          }
        } else if (device.kind === 'videoinput') {

          if(cameraId == null) {
            if(ctr == 0)
              defaultSetting = 'checked';
          } else {
            if(cameraId == deviceId) {
                defaultSetting = 'checked';
            } else {
              if(ctr == 0)
                defaultSetting = 'checked';
            }
          }
          // console.log('---------- cameraId == deviceId - ', cameraId , deviceId,  defaultSetting)

          vdoMediaHtml = '<div class="col-12 col-md-3" id="vdo-'+deviceId+'"><div id="local-media-'+deviceId+'" ></div><div class="check-camera"><input type="radio" class="form-radio" name="video-type" id="lbl-'+deviceId+'" value="'+deviceId+'" '+ defaultSetting +'><label for="lbl-'+deviceId+'">'+ device.label +'</label></div></div>';

          $('#video-media-content').append(vdoMediaHtml)

          stream1 = AgoraRTC.createStream({
              // streamID: Math.floor(Math.random()*1000000),
              // Set audio to true if testing the microphone.
              video: true,
              audio: false,
              cameraId: deviceId,
          });
          d = deviceId;

          stream1.setVideoEncoderConfiguration({
            // Video resolution
              resolution: {
                  width: 640,
                  height: 380
              }
          });
            
          // Initialize the stream.
          stream1.init(function(){
              stream1.play('local-media-' + d);
              // stream1.muteAudio();
          })
        }
      }

    });

    $(document).on('click', 'input[name="audio-type"]', function(){
        console.log($(this).val());
        checkMic($(this).val());
    });
  }

  function speakerOnOff(id){

      let vdo = $('#video'+ id)[0];   
      let ado = $('#audio'+ id)[0]; 

      if(vdo.muted || ado.muted){
        vdo.muted = false;
        ado.muted = false;
      }
      else {
        vdo.muted = true;
        ado.muted = true;
      }
  }

   function continueJoin(){

    let mediaSetting = {};
    if($('#set-default').prop('checked')){

      mediaSetting['camera'] = $('input[name="video-type"]').length > 0 ? $('input[name="video-type"]:checked').val():null;
      mediaSetting['microphone'] = $('input[name="audio-type"]').length > 0 ? $('input[name="audio-type"]:checked').val():null;
      localStorage.setItem("media-setting", JSON.stringify(mediaSetting));
    } else {
      localStorage.removeItem("media-setting");
    }
    $('#media-config').modal('hide');
    stream1.close();
    stream2.close();
    // GoInFullscreen();
    // localClient.leave();
    join();
    var resp_data = JSON.parse(localStorage.getItem("userData"));
    console.log('-----------hhhhhhhhh-------------------', resp_data.userType);
      if(resp_data.userType == 1)
      {
        sendMessageToChannel(channelName1, JSON.stringify({code:"222", message:"Now U can Join"}));
        getMemberList();
      }
     // getOnlineMemberList();
      

    $(".host-script-section").height("255px");
    $(".host-section").css({"min-width": "380px", "max-width": "380px"});
  }

  function GoInFullscreen() {
    let element = document.documentElement

    if(element.requestFullscreen)
      element.requestFullscreen();
    else if(element.mozRequestFullScreen)
      element.mozRequestFullScreen();
    else if(element.webkitRequestFullscreen)
      element.webkitRequestFullscreen();
    else if(element.msRequestFullscreen)
      element.msRequestFullscreen();
  }

  function GoOutFullscreen() {
    if(document.exitFullscreen)
      document.exitFullscreen();
    else if(document.mozCancelFullScreen)
      document.mozCancelFullScreen();
    else if(document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    else if(document.msExitFullscreen)
      document.msExitFullscreen();
  }


  let agoraLocal = $("#agora_local").find("video").width();
    $("#agora_local video").height(`${agoraLocal / 1.778 }px`);
function attendeeScreenHeight(){
  let attendeeHeight = $(".attend-mid-section").height();
}


  function onPageResize(){
      
    let winHeight = window.innerHeight;
    let headerHeight = $(".header.bg-gray").height();
    let hostHeight = $(".host-script-section").height();
    let sectionHeights = winHeight - (hostHeight + headerHeight);

    $("#subscribers-list").height(`${sectionHeights - 111}px`)
    
    let sub_list_y = $("#subscribers-list").height(); 
    let sub_list_x = $("#subscribers-list").width(); 
    let len_subs = $('#subscribers-list').find('video').length;
    // console.log('demo== sub_list_y, sub_list_x, len_subs = ', sub_list_y, sub_list_x, len_subs)

    if(sub_list_x <= 992){
      if(len_subs>2) {
        $("#subscribers-list")
        .addClass("display-grid-auto-2");
      }
    } else {
      if(len_subs>4) {
        $("#subscribers-list")
        .addClass("display-grid-auto-4");
      }
    }
    setTimeout(function(){

      let newHt = sub_list_y;
      if(sub_list_x <= 992){
        if(len_subs > 2) {
          
          let rem = len_subs % 2;

          // get num of rows of vdos
          let numVdoRw = parseInt(len_subs / 2) + ( rem == 0 ? 0 : 1 );

          newHt = sub_list_y / numVdoRw;
        }
      }
      else{
        if(len_subs > 4) {
          newHt = sub_list_y / 2;
        }
      }
      let newWt = newHt * 1.778;
      // console.log('demo== newHt, newWt ***', newHt, newWt)
      
      if(sub_list_x <= 992){

        if(len_subs >= 2 ){

          if(len_subs>2)
            len_subs = 2;

          if(newWt * len_subs > sub_list_x) {
            let tmpWt = newWt * len_subs - sub_list_x;
            tmpWt = tmpWt / len_subs;
            newWt = newWt - tmpWt;
            newHt = newWt / 1.778; 
            //newHt = newHt - 10;
            //newWt = newHt * 1.778;
          }
        }

      } else {

        if(len_subs >= 2 ){

          if(len_subs>4)
            len_subs = 4

          if(newWt * len_subs > sub_list_x) {
            let tmpWt = newWt * len_subs - sub_list_x;
            tmpWt = tmpWt / len_subs;
            newWt = newWt - tmpWt;
            newHt = newWt / 1.778; 
            //newHt = newHt - 10;
            //newWt = newHt * 1.778;
          }
        }
      }
      
      $(".newcss.one, .newcss.two, .newcss.three, .newcss.four, .newcss.five").height(`${newHt - 2 }px`);
      $(".newcss.one, .newcss.two, .newcss.three, .newcss.four, .newcss.five").width(`${newWt - 2 }px`);
      
     }, 100)
  }

  // var countdownNumberEl = document.getElementById('countdown-number');
  // var countdownNumberEl2 = document.getElementById('countdown-number2');
  // var countdown = 30;
  
  // countdownNumberEl.textContent = countdown;
  // countdownNumberEl2.textContent = countdown;
  
  // setInterval(function() {
  //   countdown = --countdown <= 0 ? 30 : countdown;
  
  //   countdownNumberEl.textContent = `${countdown} \
  //   SEC`;
  // }, 1000);

  


  function loadPopup(){

    // if($('#conf-page').length > 0){
      // networkBandwidth();
      if($('#media-config').length > 0){

        $('#media-config').modal({
          backdrop : "static",
          keyboard: false
        });

        $('#media-config').on('hidden.bs.modal', function (e) {
          console.log('close event')
        })
        getDevices();
      }
      // GoInFullscreen();
      rtmJoin(); 
    // }

   // $(".host-script-section").height("305px"); 
   // $(".test-script").addClass("w-866");
   // $(".host-section").css({"min-width": "524px", "max-width": "524px"});    
  }

  function showHideScript(){
      if($(".add-remove-round").hasClass("top-rounded")){
               
        setTimeout(function(){
          $(".add-remove-round").addClass("rounded").removeClass("top-rounded");
        }, 400);
      }
      else{
        $(".add-remove-round").removeClass("rounded").addClass("top-rounded");
        setTimeout(function(){
                
         }, 500)
        
      }
    }

  function removeSession(){
    localStorage.removeItem("userData");
    // localStorage.removeItem("sessionId");
    localStorage.removeItem("load-page");
  }
  var resetCount = '';

  function countDown(){
    let activeEle = $('.swiper-slide.swiper-slide-next');
    var countdownNumberEl = activeEle.find('.countdown-number');
    
    // var countdown = 30;
    var countdown = parseInt(countdownNumberEl.html());
    activeEle.find('.count-box svg circle').attr("style","animation-duration:"+countdown+"s !important");

    countdownNumberEl.html(countdown + '\ SEC') ;
    
    resetCount = setInterval(function() {
      countdown = --countdown < 0 ? countdown : countdown;
    
      countdownNumberEl.html(countdown + '\ SEC') ;
      if(countdown <= 0){
        
        activeEle.find('.count-box svg circle').removeAttr("style");
        clearInterval(resetCount);
        // Now you can use all slider methods like
        mySwiper.slideNext();
        countDown();
      }
    }, 1000);
  }

function signalHandler(uid, signalData, userType) {

  signalData = JSON.parse(signalData);
     
  console.log('*******bbbbbbb************** signalData ', signalData,uid, userType);
  if(userType == 1) { // Host

    if(signalData.code == '201'){

      $('#errmsg').html(signalData.message);
      setTimeout(function(){ $('#errmsg').html(''); }, 10000);

    } else if(signalData.code == '100') {
       $('#errmsg').html(signalData.message);
       setTimeout(function(){ $('#errmsg').html(''); }, 10000);
      $('#agora_hand_raise'+uid+'').removeClass("d-none");
      
    }

  } else { // Attendy

    console.log('******************** signalData ', signalData,uid, userType);

    if(signalData.code == '204'){

     // console.log('********gudu************** signalData ', signalData,uid, userType); 
      $('#hostmsg').html(signalData.message);
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);

    }else if(signalData.code == '209'){

      // console.log('********gudu************** signalData ', signalData,uid, userType); 
       $('#hostmsg').html(signalData.message);
       setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
 
     }
     else if(signalData.code == '203') {
      console.log('********gudu************** signalData ', signalData,uid, userType); 
      $('#hostmsg').html(signalData.message);
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);      
      //hand-icon position-absolute hand;    
    }else if(signalData.code == '200') {
     // console.log('********gudu************** signalData ', signalData,uid, userType); 
      $('#hostmsg').html(signalData.message);
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);   
    }
     else if(signalData.code == '216')
    {
      console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#newmsg').html(signalData.message);
      setTimeout(function(){ $('#newmsg').html(''); }, 10000);
    }

    else if(signalData.code == '205')
    {
      console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#hostmsg').html(signalData.message);
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    }else if(signalData.code == '209')
    {
      console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#hostmsg').html(signalData.message);
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    }

  }

}

    function channelSignalHandler(signalData, userType) {

      console.log('********guduorigin************** signalData ', signalData, userType);
    signalData = JSON.parse(signalData);
    if(signalData.code == '208'){
    if(userType =='1'){  

      incrementcountAtHost(signalData,userType);        
      }else{
          incrementcountAtAttendies(signalData,userType);    
      }
    }else if(signalData.code == '110')
    {
      if(userType =='1'){
      setEmojiesAtHost(signalData, userType);
      }else{
        setEmojiesAtClient(signalData, userType);
      }
      }else if(signalData.code == '222')
      {
        $('#newmsg').html(signalData.message);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000);
      }
    }

      function incrementcountAtAttendies(signalData,userType)
      {
      

        var count3=$('#totalonline').html();

        console.log('********hhhhhAtt************** signalData ', count3);
       
    
        console.log('********sssssA1111111************** signalData ', signalData, userType);
  

        count3=parseInt(count3);
        
      if(signalData.msgtype=='Joined')
      { 
        
        let str=signalData.message;
        let res = str.split("~@$");
        let storeData = getCurrentUserData();
        var hostid=storeData.sessionData.hostId;
      
        if(res[1]== hostid)
        { 
          $('#online_state').removeClass("online-status");        
          $('#online_state').addClass("online-status");
        }
        count4=count3+1;
      
          console.log('*********sssssssss************* signalData ', signalData.message);
        $('#newmsg').html(signalData.message);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000); 
     
          $('#hostmsg').html(signalData.message);
        setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
     
      }else if(signalData.msgtype=='left') {

        let str=signalData.message;
        let res = str.split("~@$");
        let storeData = getCurrentUserData();
        var hostid=storeData.sessionData.hostId;

        if(res[1]== hostid)
        {          
          $('#online_state').removeClass("online-status");
        }

        console.log('*********hello************* signalData ', count3);
        count4=count3-1;
     
        $('#newmsg').html(signalData.message);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000);
     
          $('#hostmsg').html(signalData.message);
        setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
           
      }else if(signalData.msgtype=='totalcount') {
        
        let storeData = getCurrentUserData();
        let hostid=storeData.sessionData.hostId;
     
        var arr=signalData.totalmember;
        console.log('*******totallist111111111111*************** signalData ', arr);
        // if($.inArray(hostid, arr) >= 0)
        // {
        //   $('#online_state').html('ONLINE');
        //   $('#online_state').addClass("online-status");
        // }
        
        count4=signalData.member;
        count4=parseInt(count4);
        count4=count4-1;
       // console.log('*******totallist*************** signalData ', count4);
       arr.shift();
        arr.forEach(element => {

          if(element == hostid)
          {  
            
          $('#online_state').removeClass("online-status");        
            $('#online_state').addClass("online-status");
          }
          $('#all_joined_member_list').append('<div className="attendee-list"><img src="images/attendee.png" /><span class="title">'+element+'</span><div className="vid-icons"><span className="icon1"></span><span className="icon2"></span></div></div>');
        });    
      }
      
      $('#totalonline').empty(); 
      $('#totalonline').html(count4);
    
        $('#joined_users_at_client').empty(); 
        $('#joined_users_at_client').html(count4); 
    
      }


      function incrementcountAtHost(signalData,userType)
      {  
        //console.log('********munmunHost************** signalData ', signalData, userType);
        var count=$('#totalonline').html();

      console.log('********munmunHost************** signalData ', count);
        count=parseInt(count);

        let storeData = getCurrentUserData();
        var hostid=storeData.sessionData.hostId;
        var clientid=storeData.sessionData.id;
        if(hostid == clientid)
        {
          $('#online_state').removeClass("online-status");        
          $('#online_state').addClass("online-status");
        }

      if(signalData.msgtype=='Joined')
      {     
        console.log('********guduHost************** signalData ', signalData, userType);
        count1=count+1;

       
          console.log('*********lllllllll************* signalData ', signalData.message);
          $('#totalonline').empty(); 
          $('#totalonline').html(count1);  
        
            $('#joined_users').empty(); 
            $('#joined_users').html(count1);
       

        var peerId=signalData.member;

        $('#newmsg').html(signalData.message);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000); 
       
        if(count1 <= 8)
        
      var text =JSON.stringify({code:"216", message:"216~@$ welcom, You joined as a broadCaster"});
      else{
        var text =JSON.stringify({code:"216", message:"216~@$ welcom, You joined as a audience"});
        }
        sendMessage(peerId, text);

        $('#newmsg').html(signalData.message);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000);

      }else if(signalData.msgtype=='left') {

        console.log('********swapHost************** signalData ', count);
        count1=count-1; 

       
          $('#totalonline').empty(); 
          $('#totalonline').html(count1);  
          $('#newmsg').html(signalData.message);
          setTimeout(function(){ $('#newmsg').html(''); }, 10000); 
        
            $('#joined_users').empty(); 
            $('#joined_users').html(count1);
        

 

      }else if(signalData.msgtype=='totalcount') {
        var arr=signalData.totalmember;
             console.log('---------alllist----------',arr)
        count1=signalData.member;
        count1=parseInt(count1); 
        count1=count1-1;
      
        $('#totalonline').empty(); 
        $('#totalonline').html(count1);  
     
          $('#joined_users').empty(); 
          $('#joined_users').html(count1);
       
      }


      }

      function setEmojiesAtHost(signalData, userType)
      {
        //console.log('********guduuuuuuuuu************** signalData ', signalData, userType); 
        if(signalData.message=="appearence")
        {
        $('.icon-appearance[data-attr=\''+signalData.data+'\']').removeClass("d-none");
        }
        else if(signalData.message=="aroma")
        {
          $('.icon-aroma[data-attr=\''+signalData.data+'\']').removeClass("d-none");
        }else if(signalData.message=="palate")
        {
          $('.icon-palate[data-attr=\''+signalData.data+'\']').removeClass("d-none");
        }else if(signalData.message=="score")
        {
          $('.icon-score[data-attr=\''+signalData.data+'\']').removeClass("d-none");
        }
      
      }

      function setEmojiesAtClient(signalData, userType)
      {
        console.log('********Rammmmmmmmmmmmm************** signalData ', signalData, userType);
      }

      $(document).ready(function(){
      
        $(document).on("click", ".start span a", function(){
         $(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
         $(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
         countDown();
        })
         
         $(document).on("click", ".swiper-btns .swiper-btn-next", function(e){
           e.preventDefault();
           clearInterval(resetCount);
           // Now you can use all slider methods like
           mySwiper.slideNext();
           countDown();
         })

    setTimeout(function(){ countDown(); }, 10);
    // leaveRtm();
     // rtmJoin();
    
    
    // recieveMessage();
    // recieveChannelmassages();
    // getMemberList();

    // var countdownNumberEl = document.getElementById('countdown-number');
    // var countdownNumberEl2 = document.getElementById('countdown-number2');
    // var countdown = 30;
    
    // countdownNumberEl.textContent = countdown;
    // countdownNumberEl2.textContent = countdown;
    
    // setInterval(function() {
    //   countdown = --countdown <= 0 ? 30 : countdown;
    


    let agoraLocal = $("#agora_local").find("video").width();
    $("#agora_local video").height(`${agoraLocal / 1.778 }px`);


    $("body, div").bind('mousewheel', function() {
      return false
    });
    // $(document).on('click', ".hand-icon", function(){

    //   if($(this).closest(".video-holder").hasClass("popup-added") == false){
    //     $(this).closest(".video-holder").addClass("popup-added");
        
    //     if($(".video-streams").hasClass("popup-overlay")){
    //       $(".guest-video-footer").show();
    //     }
    //   }
    //   else {
    //     $(this).closest(".video-holder").removeClass("popup-added");
    //   }
      
      
    // });

    $(document).on('click', ".eject-popup button", function(){
      $(this).closest(".video-holder").removeClass("popup-added");
    });

    $(".show-hide-script").click(function(){
      
      $(this).text($(this).text() == '"Hide Script"' ? '"Show Script"' : '"Hide Script"');
      showHideScript();
      //$(".add-remove-flex").removeClass( ? '" "' : '"flex-grow-1"');
      
      $(".script-section").slideToggle();
      
    });

    $(".host-script-section").height("255px");
    $(".host-section").css({"min-width": "380px", "max-width": "380px"});

    

    $(".show-hide-footer-panel").click(function(){
      $(".host-script-section").height() < 255 ? $(".host-script-section").height("255px") : $(".host-script-section").height("auto");
      
      
       
      //$(".host-script-section").css({'max-height:55px'});
      showHideScript();
      setTimeout(function(){
       onPageResize();
      }, 500);
      if($(".add-remove-height").hasClass("height-53")){
        $(".add-remove-height").removeClass("height-53");
        $(".add-remove-height").addClass("h53");
      }
      else{
        $(".add-remove-height").addClass("height-53");
        $(".add-remove-height").removeClass("h53");
      }
      $(this).text($(this).text() == '"Show Attendees"' ? '"Hide Attendees"' : '"Show Attendees"');
      
      $(".host-show-hide").slideToggle();
      $(".script-section").slideToggle();
    });

    
    window.onresize = onPageResize;

    $(document).on('click', '#continue-join', function(){
      continueJoin();
    });

    // $(document).on('click', '#subscribers-list .hand', function(){
    //   $('#guest-video').modal('show');
    // });

    $(document).on('click', '#subscribers-list .mute-unmute' ,function(){

      let vdo = $('#video'+ $(this).attr('data-id') )[0];   
      let ado = $('#audio'+ $(this).attr('data-id') )[0]; 

      console.log('Id = ', $(this).attr('data-id'))
      console.log('video = ', vdo.muted)
      console.log('Audio = ', ado.muted)

      if(vdo.muted || ado.muted){
        vdo.muted = false;
        ado.muted = false;
        $(this).find('.fa').removeClass('fa-volume-off');
        $(this).find('.fa').addClass('fa-volume-up');
      }
      else {
        vdo.muted = true;
        ado.muted = true;
        $(this).find('.fa').removeClass('fa-volume-up');
        $(this).find('.fa').addClass('fa-volume-off');
      }
    });

    // if($('#conf-page').length > 0){
      if($('#media-config').length > 0){

        // networkBandwidth();
        $('#media-config').modal({
          backdrop : "static",
          keyboard: false
        });

        $('#media-config').on('hidden.bs.modal', function (e) {
          console.log('close event')
        })
        getDevices();
        rtmJoin(); 
      }
      // GoInFullscreen();

    // }
    
    $(document).on('click', '#join', function(){
      join();
    })
   
    $(document).on('click', '#leave', function(){
      leave();
    })
   
    $(document).on('click', '#publish', function(){
      publish();
      $('#publish').addClass('d-none');
      $('#unpublish').removeClass('d-none');
    })
   
    $(document).on('click', '#unpublish', function(){
      unpublish();
      $('#publish').removeClass('d-none');
      $('#unpublish').addClass('d-none');
    })

    $(document).on('click', '#strm-publish', function(){
      publish();
       $('#strm-publish').addClass('d-none');
      $('#strm-unpublish').removeClass('d-none');
    })
   
    $(document).on('click', '#strm-unpublish', function(){
      unpublish();
      $('#strm-publish').removeClass('d-none');
      $('#strm-unpublish').addClass('d-none');
    })

    $(document).on('click', '#mocrophone-off', function(){
      raiseHand();
      $('#mocrophone-on').removeClass('d-none');
      $('#mocrophone-off').addClass('d-none');
    })

    $(document).on('click', '#mocrophone-on', function(){
      downHand()
      $('#mocrophone-off').removeClass('d-none');
      $('#mocrophone-on').addClass('d-none');
    })

    // attendy
    $("#minimize-others").click(function(){
      
      $(".slide-right-left").css({"width": "72px", "float": "right"});
      $("#minimize-others, .right-sidebar .title").addClass('d-none');
      $("#show-everyone").removeClass('d-none');
      $(".attendee-list").css("background", "transparent");
      $(".slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").hide();
        
        
      })
        
        $(".attendee-list").css("background", "transparent");
        $(".slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").hide();


      $("#show-everyone").click(function(){
        $(".slide-right-left").css({"width": "100%", "float": "right"});
        //$(".joined-attendees").removeAttr("style");
        
        $("#show-everyone").addClass('d-none');
        setTimeout(function(){
          $("#minimize-others").removeClass('d-none');
          $(".right-sidebar .title").removeClass('d-none');
          $(".attendee-list").css("background", "#000");
        $(".slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").fadeIn(500);
        }, 200)
      })
      

      $(".close-model-btn").click(function(){
      
        $("#show-details").removeClass("show").hide();
        $("body").removeClass("modal-open");
        $(".modal-backdrop").hide();
        //alert("hllo");
      });
      $(".show-details-btn").click(function(){
        $("#show-details").addClass("show").show();
        $("body").addClass("modal-open");
        $(".modal-backdrop").show();
      })
      
      $('#handRaise_button').click(function(){       
        var storeData = getCurrentUserData();
        var userType=storeData.userType;
        var clientaccount=storeData.name;
        var receiver="host";
        if(storeData.userType == 2) {

          sendsignal(receiver,clientaccount);
        }
         
      });

      $('#handRaiseClient_button').click(function(){       
        var storeData = getCurrentUserData();
        var userType=storeData.userType;
        var attendiesName=storeData.name;
        var attendieID=storeData.name;
        var hostid=storeData.sessionData.hostId;
        var hostname=storeData.sessionData.hostName;
       // alert(hostname);return false;      
        var massages="201~@$"+attendieID+"~@$clientHandRaise~@$"+attendiesName; 
        var text =JSON.stringify({code:"201", message:massages}); 
          sendMessage(hostid, text);

      });

      $('#logout_button').click(function(){
        // localStream.stop();
        leave();
        leave_channel();
        removeSession();
        location.href  = '/login';
        // location.reload();
      });

   
      $(document).on('click', '#fullscreen', function(){
        GoInFullscreen();
      })

      $(document).on('click', '.eject-session', function(){
        let strmId = $(this).closest('.video-holder').attr('id');
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ strmId ', strmId);
        sendMessage(strmId, JSON.stringify({code:'101'}));
      });
    

  });
 
    

    /*function onPageResize(){
      
      let winHeight = window.innerHeight;
      let headerHeight = $(".header.bg-gray").height()+20;
      let hostHeight = $(".host-script-section").height();
      let sectionHeight = winHeight - (hostHeight+headerHeight);
      $(".section.attendees").height(`${sectionHeight - 6}px`);
      $("#subscribers-list").height(`${sectionHeight - 100}px`)
      let sub_list_y = $("#subscribers-list").height(); 
      let sub_list_x = $("#subscribers-list").width(); 
      let len_subs = $('#subscribers-list .newcss').length;
      if(len_subs>4){
        $("#subscribers-list")
        .removeClass("justify-content-center")
        .addClass("justify-content-between display-grid-auto-4");
      }
      else if(len_subs<=4){
        $("#subscribers-list")
        .addClass("justify-content-center")
        .removeClass("justify-content-between display-grid-auto-4");
      }
      setTimeout(function(){
        $(".newcss.two").width(`${sub_list_x / 2.8}`);
        $(".newcss.three").width(`${sub_list_x / 3}`);
        $(".newcss.four").width(`${sub_list_x / 4}`);
        $(".newcss.five").width(`${sub_list_x / 6}`);
        $(".newcss.two, .newcss.three").parent().addClass("justify-content-center");
         
         if(sub_list_x > 1400){
           $(".newcss.one").width(`${sub_list_x / 3 }px`);
         }
         else if(sub_list_x > 1600){
          $(".newcss.one").width(`${sub_list_x }px`);
        }
         else{
           $(".newcss.one").width(`${sub_list_x / 4 }px`);
         }
       }, 600)


      //console.log(`${sectionHeight}px`);
      //let vid_y = $("#subscribers-list video").height();
      //let vid_x = $("#subscribers-list video").width();
    }*/



  function checkMuteUnmute(id) {

      let vdo = $('#video'+ id )[0];   
      let ado = $('#audio'+ id )[0];   

      vdo.muted = true;
      ado.muted = true;

      // $('#agora_remote'+id).find('.mute-unmute').addClass('mute');
      $('#agora_remote'+id).find('.mute-unmute .fa').addClass('fa-volume-off');

  }