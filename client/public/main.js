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
  var totalBrodcaster = 0;
  
  var sep = '~@$';

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

        camera = $('#current-camera').val();
        microphone = $('#current-microphone').val();
        // camera = $('input[name="video-type"]:checked').val();
        // microphone = $('input[name="audio-type"]:checked').val();
      } else {
        location.href = 'pre-screen';
        console.log('Media device not found==')
        return false;
      }
    }

    console.log('camera, microphone = ', camera, microphone)

    let storeData = getCurrentUserData();
   
    console.log('storeData', storeData);

    var channel_key = storeData.sessionData.streamToken != undefined ? storeData.sessionData.streamToken : null;
     
    console.log("Init AgoraRTC client with App ID and token: " + storeData.sessionData.appId, channel_key);
    
    // create client first
    client = AgoraRTC.createClient({mode: 'live'});
    
    // initialize client
    client.init(storeData.sessionData.appId, function () {

      console.log("AgoraRTC client initialized");

      // Before join channel add user role 
      // client.setClientRole(storeData.userType == 1 ? "host" : "audience", function(err) {
      client.setClientRole("host", function(err) {

        if(err) {
          console.log("user role failed", e);
          return;
        } else {
          console.log("user role set success");

          var channelName = storeData.sessionData.channelId;

          // create and join channel
          client.join(channel_key, channelName.toString(), storeData.id, function(uid) {

            console.log("User " + uid + " join channel successfully");

            // create local stream
            localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: true, screen: false });
            
            localStream.setVideoProfile('720p_3');

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
                // localStream.muteAudio();
              } 
        
              console.log("GetUserMedia successfully");
              localStream.play('agora_local');
              
              // if(storeData.userType == 1){

              //   client.publish(localStream, function (err) {
              //     console.log("Publish local stream error: " + err);
              //   });

              //   client.on('stream-published', function (evt) {
              //     console.log("Publish local stream successfully");
              //   });

              // } else {
                publish();

              // }
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
      console.log("New stream added " + stream.getId());
      // console.log("Subscribe ", stream);
      
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });

    var count=1;
    var totalScreenUsers = 0;
    client.on('stream-subscribed', function (evt) {

      var storeData = getCurrentUserData();

      var stream = evt.stream;
      console.log("Subscribe remote stream successfully: " , stream.getId() , stream);
      // for host user
      if(storeData.userType == 1) {

        if ($('#subscribers-list #agora_remote'+stream.getId()).length === 0) {
          if(totalScreenUsers < 8){

          $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" data-dismiss="modal">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute   d-none"  id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');
          } else {
            
          }
          totalScreenUsers++;
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
        
          if(1 == getUserDataFromList(stream.getId(), 'userType')){

            if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
              
              $('#agora_host').append('<div id="agora_remote'+stream.getId()+'"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div></div>');
            }
            stream.play('agora_remote_vdo' + stream.getId());

            // checkMuteUnmute(stream.getId());
          } else {
            totalBrodcaster++;
            console.log(' @@@@@@ totalBrodcaster++ ', totalBrodcaster);
            
            if(stream.hasVideo())
              stream.muteVideo();
            
            if(stream.hasAudio())
              stream.muteAudio();
          }
        
      // for attendy user
        console.log(' @@@@@@@@@@@@ ', storeData.sessionData.id, stream.getId());
          // $.ajax({
          //     headers: { 
          //         "Content-Type": "application/json; charset=utf-8",
          //         "Authorization": storeData.token
          //     },
          //     url: '/api/v1/session/'+storeData.sessionData.id+'/'+stream.getId()+'/stream-id',
          //     dataType: 'json',
          //     type: 'GET',
          //     success: function( data, textStatus, jQxhr ){
                  
          //         let respData = data;
          //         console.log(' totalBrodcaster data===', data)
          //         if(respData.status){
          //           if(respData.type == 1){

          //             if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
                        
          //               $('#agora_host').append('<div id="agora_remote'+stream.getId()+'"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div></div>');
          //             }
          //             stream.play('agora_remote_vdo' + stream.getId());

          //             // checkMuteUnmute(stream.getId());
          //           } else {
          //             totalBrodcaster++;
          //             console.log(' @@@@@@ totalBrodcaster++ ', totalBrodcaster);
                      
          //             if(stream.hasVideo())
          //               stream.muteVideo();
                      
          //             if(stream.hasAudio())
          //               stream.muteAudio();
          //           }
          //         }
                  
          //     },
          //     error: function( jqXhr, textStatus, errorThrown ){
          //         console.log( errorThrown );
          //     }
          // });
      }
     
    });

    client.on('stream-removed', function (evt) {
      
      var storeData = getCurrentUserData();
      var stream = evt.stream;
      stream.stop();
      if(storeData.userType != 1){
        if(totalBrodcaster > 0){
          totalBrodcaster--;
        }
      }
      removeAudienceInList(stream.getId())

      // if(storeData.userType != 1){
        // $.ajax({
        //       headers: { 
        //           "Content-Type": "application/json; charset=utf-8",
        //           "Authorization": storeData.token
        //       },
        //       url: '/api/v1/session/'+storeData.sessionData.id+'/'+stream.getId()+'/stream-id',
        //       dataType: 'json',
        //       type: 'GET',
        //       success: function( data, textStatus, jQxhr ){
                  
        //           let respData = data;

        //           if(respData.status){
        //             if(respData.type != 1){
        //               if(totalBrodcaster > 0){
        //                 totalBrodcaster--;
        //               }
        //             }
        //           }
        //       },
        //       error: function( jqXhr, textStatus, errorThrown ){
        //           console.log( errorThrown );
        //       }
        //   });
      // }

      $('#agora_remote' + stream.getId()).remove();
      switchVideoSize();
      pushIntoSessionByHost();
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
        console.log(evt.uid + "===> role changed");
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

  function getTempUsers(){
    return localStorage.getItem("tempUsers") != undefined ? JSON.parse(localStorage.getItem("tempUsers")) : [];
  }    

  function convertIdToEmail(id){
    let userList = getTempUsers();
    if(userList != ''){
      
      for(let i= 0; i < userList.length; i++){
        if(parseInt(userList[i].id) == parseInt(id)){
          return userList[i].email;
        }
      }
    } else {
      console.log('Invalid access ');
      return false;
    }
  }

  function convertEmailToId(email){
    let userList = getTempUsers();
    if(userList != ''){
      
      for(let i= 0; i < userList.length; i++){
        if(userList[i].email == email){
          return userList[i].id;
        }
      }
    } else {
      console.log('Invalid access ');
      return false;
    }
  }

  function getNameById(id){
    let userList = getTempUsers();
    if(userList != ''){
      
      for(let i= 0; i < userList.length; i++){
        if(userList[i].id == id){
          return userList[i].firstName.toLowerCase() +(userList[i].lastName != null ? ' '+ userList[i].lastName.toLowerCase() : '') +', '+ (userList[i].city != null ? userList[i].city.toLowerCase() : '');
        }
      }
    } else {
      console.log('Invalid access ');
      return false;
    }
  }

  function getNameByEmail(email){
    let userList = getTempUsers();
    if(userList != ''){
      
      for(let i= 0; i < userList.length; i++){
        if(userList[i].email == email){
          return userList[i].firstName.toLowerCase() +' '+userList[i].lastName.toLowerCase();
        }
      }
    } else {
      console.log('Invalid access ');
      return false;
    }
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
    console.log('===================stream leave ===========')
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
  var channelName1 = '';
  
  function rtmJoin()
  {
    // var appId1 = '232f270a5aeb4e0097d8b5ceb8c24ab3';
    // var appId1 = '86706f65732f4988b39974feb4eed508';
    var storeData = getCurrentUserData();
    var appId1 = storeData.sessionData.rtmAppId;
    channelName1 = storeData.sessionData.rtmChannelId;

    var token=null;
    // appId1 = storeData.sessionData.channelId;
    var peer=storeData.email;
    // newclient.login({uid: peer.toString(), token});

    if(newclient == undefined){

      newclient = AgoraRTM.createInstance(appId1);
      newclient.login({ token: token, uid: peer }).then(() => {

        console.log('***********AgoraRTM client login success***********');

        if(channel == undefined){

            // Create channel
            channel = newclient.createChannel(channelName1);

            channel.join().then(() => {

              // after join channel send join channel message to host
                joinChannel();

              console.log('************channel joined successfully**********');

               // var today = new Date();
               // var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
               // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+'.'+today.getMilliseconds();
               // var dateTime = date+' '+time;
               // var text="208" +sep+ dateTime;

               //  channel.sendMessage({text}).then(() => {  
               //    console.log('-------join msg llllll--------','mssages send successfully on channel');    
               //  }).catch(error => {
               //    console.log('-------There is error in joining a channel------')
               //  });

                channel.getMembers().then(membersList => {    
                  console.log('membersList', membersList)
                    
                  channelSignalHandler(JSON.stringify({code:"208",member:membersList.length, totalmember:membersList, msgtype:"totalcount"}), storeData.userType);

                }).catch(error => {
                   console.log('*************There is an error******');
                });
         
              }).catch(error => {
                console.log('**********shiv*********There Is a problem to join a channel**********');
              });

              // channel log
              channel.on('MemberJoined', memberId => { 
               
                var massages="208"+sep+memberId+sep+"joined"+sep;        
                channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);
              })
           
              channel.on('MemberLeft', memberId => { 
          
                var massages="208"+sep+memberId+sep+"left"+sep;  
                channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
              })
           
              channel.on('ChannelMessage', (message, senderId) => {         
                var msg=message.text;
                // msg = JSON.parse(msg);
                console.log('--------emojies-----------',msg,storeData.userType);             
                channelMsgHandler(msg,senderId,storeData.userType);
              });

              newclient.on('ConnectionStateChange', (newState, reason) => {
                console.log('on connection state changed to ' + newState + ' reason: ' + reason);
              });

              newclient.on('MessageFromPeer', (message, peerId) => { 
                console.log('********vvvvvvvvvvvvv********',message.text,'********************',peerId);
                // console.log("message "+ message.text + " peerId" + peerId);

                signalHandler(peerId, message.text, storeData.userType);
              });

            } else {
              // joinChannel();
            }

        }).catch(err => {
          console.log('---------------bbbbbbbb-----client is not logedin-----');
        });
      } else {
        channel.getMembers().then(membersList => {    
                    
          channelSignalHandler(JSON.stringify({code:"208",member:membersList.length, totalmember:membersList, msgtype:"totalcount"}), storeData.userType);

        }).catch(error => {
           console.log('*************There is an error******');
        });
          // channel log
          channel.on('MemberJoined', memberId => { 
           
            var massages="208"+sep+memberId+sep+"joined"+sep;        
            channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);
          })
       
          channel.on('MemberLeft', memberId => { 
      
            var massages="208"+sep+memberId+sep+"left"+sep;  
            channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
          })
       
          channel.on('ChannelMessage', (message, senderId) => {         
            var msg=message.text;
            // msg = JSON.parse(msg);
            console.log('--------emojies-----------',msg,storeData.userType);             
            channelMsgHandler(msg,senderId,storeData.userType);
          });

          newclient.on('ConnectionStateChange', (newState, reason) => {
            console.log('on connection state changed to ' + newState + ' reason: ' + reason);
          });

          newclient.on('MessageFromPeer', (message, peerId) => { 
            console.log('********vvvvvvvvvvvvv********',message.text,'********************',peerId);
            // console.log("message "+ message.text + " peerId" + peerId);

            signalHandler(peerId, message.text, storeData.userType);
          });
      }


         

  
      }

      function rtmJoinBackup(){

          var appId1 = '232f270a5aeb4e0097d8b5ceb8c24ab3';

          var token=null;
          newclient = AgoraRTM.createInstance(appId1);
          var storeData = getCurrentUserData();
          // appId1 = storeData.sessionData.channelId;
          var peer=storeData.email;
          // newclient.login({uid: peer.toString(), token});

          newclient.on('ConnectionStateChange', (newState, reason) => {
            console.log('on connection state changed to ' + newState + ' reason: ' + reason);
          });

          newclient.login({ token: token, uid: peer }).then(() => {

          console.log('***********AgoraRTM client login success***********');

          newclient.on('MessageFromPeer', (message, peerId) => { 
            console.log('********vvvvvvvvvvvvv********',message.text,'********************',peerId);
            // console.log("message "+ message.text + " peerId" + peerId);

            signalHandler(peerId, message.text, storeData.userType);
          });

          // Create channel
          channel = newclient.createChannel(channelName1);

          channel.join().then(() => {

            // after join channel send join channel message to host
            joinChannel();

           console.log('************channel joined successfully**********');

           var today = new Date();
           var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
           var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+'.'+today.getMilliseconds();
           var dateTime = date+' '+time;
           var text="208" +sep+ dateTime;

           channel.sendMessage({text}).then(() => {  
           console.log('-------join msg llllll--------','mssages send successfully on channel');    
            }).catch(error => {
           console.log('-------There is error in joining a channel------')
            });

           channel.getMembers().then(membersList => {    
                  
             channelSignalHandler(JSON.stringify({code:"208",member:membersList.length, totalmember:membersList, msgtype:"totalcount"}), storeData.userType);

             }).catch(error => {
                 console.log('*************There is an error******');
             });

             channel.on('MemberJoined', memberId => { 
             
               var massages="208"+sep+memberId+sep+"joined"+sep;        
               channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);
              })
           
             channel.on('MemberLeft', memberId => { 
          
              var massages="208"+sep+memberId+sep+"left"+sep;  
              channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
              })
           
             channel.on('ChannelMessage', (message, senderId) => {         
              var msg=message.text;
             // msg = JSON.parse(msg);
             console.log('--------emojies-----------',msg,storeData.userType);             
              channelMsgHandler(msg,senderId,storeData.userType);
              });
       
            }).catch(error => {
              console.log('**********shiv*********There Is a problem to join a channel**********');
            });

              }).catch(err => {
                console.log('---------------bbbbbbbb-----client is not logedin-----');
              });
  
      }

      function leave_channel() {
        console.log('============= channel leave ============');
        channel.leave();
       }


      function sendMessage(peerId, text)
      {
          console.log("sendPeerMessage", text, peerId);
          newclient.sendMessageToPeer({text}, peerId);
      }

      function sendMessageToChannel(channelName1, text)
      {
          channel.sendMessage({text},channelName1);
          console.log('---------------','mssages send successfully on channel');
      }


      function getMemberList()
      {
        let memberlist='';
        channel.getMembers().then(membersList => {    
            
         // channelSignalHandler(JSON.stringify({code:"208",member:membersList.length, totalmember:membersList, msgtype:"totalcount"}), storeData.userType);
         memberlist=membersList;
          }).catch(error => {
              console.log('*************There is an error******');

          });

          return memberlist;
      }

   

      function getAudienceList()
      {
          channel.getMembers().then(membersList => {    
        
        var arr=membersList;             
        counter=membersList.length;
        counter=parseInt(counter); 
       console.log('--------counter-------------',counter);
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
        $('#guestmsg').html(html);

      }).catch(error => {
          console.log('*************There is an error******');
      });

      }

      function createString(code){
          return code + sep;
      }

  function onclickShowAsBroadcaster() {
        var selectBox = document.getElementById("opt");
        var attendiesID = selectBox.options[selectBox.selectedIndex].value;
       // alert('attendiesID', attendiesID);
        // let attendiesEmail = convertIdToEmail(attendiesID);
       //let message = createString(code)+"B";
       let message = "200"+sep+"B";
        sendMessage(attendiesID, message);
       }

    

  function onclickaudioOn(audienceID)
  {
    let audienceEmail = convertIdToEmail(audienceID);

    let vdo = $('#subscribers-list #agora_remote'+ audienceID + ' video' )[0];   
    let ado = $('#subscribers-list #agora_remote'+ audienceID + ' audio' )[0];   

    vdo.muted = true;
    ado.muted = true;

    $('#subscribers-list #agora_remote'+ audienceID).find('.hand-icon').addClass('d-none');
    $('#subscribers-list #agora_remote'+ audienceID).find('.microphone-icon').addClass('d-none');

    let massages='204'+sep
    sendMessage(audienceEmail, massages);
  }

  function onclickhandRaise(receiverId)
  {   
    let receiverEmail = convertIdToEmail(receiverId);
    $('#agora_hand_raise'+receiverId+'').addClass("d-none");
    $('#audion_on'+receiverId+'').removeClass("d-none");
    var massages="203"+sep; 
    sendMessage(receiverEmail, massages);

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
    let receiverEmail = convertIdToEmail(receiverId);
    var massages="205"+sep; 
    sendMessage(receiverEmail,massages);
  }

  function changeParticipentToAudience(receiverId)
  {
    let receiverEmail = convertIdToEmail(receiverId);
    var massages="209"+sep; 
    sendMessage(receiverEmail,massages);
  }
  // function onclickShowAsBroadcaster(attendiesID)
  // {
  //   sendMessage(attendiesID, JSON.stringify({code:"102", message:"Now You can Publish"}));
  // }
  
  function publishAfterKick(){
    let storeData = getCurrentUserData();
    if(storeData.userType != 1){

      client.publish(localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      client.on('stream-published', function (evt) {
        console.log('client ============', client);
        $('#strm-unpublish').removeClass('d-none');
        $('#strm-publish').addClass('d-none');

      });
    }
  }

  function publish() {
    let storeData = getCurrentUserData();
      
    setTimeout(function(){}, 3000);

    console.log(' @@@@@@@ totalBrodcaster @@@ ', totalBrodcaster, storeData.default.maxUserLimit);
    let checkUser = false;
    let isExists = false;
    if(storeData.userType != 1){

      let sessionTime = localStorage.getItem("pre-session-time");
      console.log('sessionTime sessionTime', sessionTime);
      if(sessionTime != null){
          sessionTime = JSON.parse(sessionTime);
          // console.log('sessionTime sessionTime ====', (sessionTime.joinTime - sessionTime.startTime));
          if((sessionTime.joinTime - sessionTime.startTime)/1000 <= storeData.default.maxJoinDuration ){
            checkUser = true;
          }
      }
      isExists = checkUserInOrder(storeData.id);
    }
    
    console.log('checkUser , isExists', checkUser , isExists)

    if(storeData.userType == 1  || (storeData.userType != 1 && checkUser && isExists && totalBrodcaster < parseInt(storeData.default.maxUserLimit)) ) {
        
      client.publish(localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      client.on('stream-published', function (evt) {
        console.log('client ============', client);
        if(storeData.userType != 1){
          $('#strm-unpublish').removeClass('d-none');
          $('#strm-publish').addClass('d-none');
        }

      });
    }
  }

  function unpublish() {
    
    client.unpublish(localStream, function (err) {
      console.log("Unpublish local stream failed == " + err);
    });

  }

  function checkUserInOrder(userId){

    let userList = getOrderUser();
    
    if(userList == '' || userList == null) return false;

    let counter = userList.length >= 8 ? 8 : userList.length;
    for(let i=0; i < counter; i++){
      if(convertEmailToId(userList[i].id) == userId){
        return true;
      }
    }
    return false;
  }

  function getOrderUser(){
    let userList = localStorage.getItem("rtm-join-order");

    if(userList == null) return '';

    userList = JSON.parse(userList);
    console.log('userListuserList',userList, typeof userList);
    userList.sort(function(a, b) { return parseInt(a.joinAt) - parseInt(b.joinAt); });

    return userList; 
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
  
  let checkMicStream = function(micId){

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
            checkMicStream(deviceId);
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

          stream1.setVideoProfile('720p_3');

          // stream1.setVideoEncoderConfiguration({
          //   // Video resolution
          //     resolution: {
          //         width: 640,
          //         height: 380
          //     }
          // });
            
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
        // checkMicStream($(this).val());
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

    // $('#media-config').modal('hide');
    // stream1.close();
    // stream2.close();
    // GoInFullscreen();
    // localClient.leave();
    totalBrodcaster = 0;
    if(channel == undefined){
      var channel;
    }
    rtmJoin();
    console.log('continueJoin =continueJoin =continueJoin 111')
    join();

    console.log('continueJoin =continueJoin =continueJoin 222')

    $(".host-script-section").height("255px");
    $(".host-section").css({"min-width": "380px", "max-width": "380px"});

    let data_res = JSON.parse(localStorage.getItem("userData"));
    if(data_res.userType == 1)
    {
      $.ajax({
        headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": data_res.token
        },
        url: '/api/v1/session/'+data_res.sessionData.id+'/joinstatus',       
        dataType: 'json',
        type: 'PUT',
        success: function( data, textStatus, jQxhr ){
            
            let respData = data;

        console.log('-------respData----------',respData);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
    }
  }

  function updateJoinSessionStatus()
  {
    let data_op = JSON.parse(localStorage.getItem("userData"));
    if(data_op.userType == 1)
    {
      $.ajax({
        headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": data_op.token
        },
        url: '/api/v1/session/'+data_op.sessionData.id+'/updatestatus',       
        dataType: 'json',
        type: 'PUT',
        success: function( data, textStatus, jQxhr ){
            
            let respData = data;

        console.log('-------respData----------',respData);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
    }
  }

  function joinChannel(){

    setTimeout(function(){}, 3000);

    showHandAtHost();

    var resp_data = JSON.parse(localStorage.getItem("userData"));
    console.log('-----------hhhhhhhhh-------------------', resp_data.userType);
    if(resp_data.userType == 1)
    {     
      var text ="222"+sep;
      sendMessageToChannel(channelName1, text);
      getMemberList();
    }
  }

  function continueJoinBkup(){

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
    console.log('-----------hhhhhhhhh--+++++++++++++++-----------------', resp_data.userType);
      if(resp_data.userType == 1)
      {     
       // $('.dis').attr("disabled", false);
     //  $('.dis[data-attr=\''+signalData.data+'\']').removeClass("d-none");
     var text ="222"+sep;
        sendMessageToChannel(channelName1, text);
        getAudienceList();
       //getMemberList();
      }
     // getOnlineMemberList();
      

    $(".host-script-section").height("255px");
    $(".host-section").css({"min-width": "380px", "max-width": "380px"});
  }

  function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {  
        document.documentElement.requestFullScreen();  
      } else if (document.documentElement.mozRequestFullScreen) {  
        document.documentElement.mozRequestFullScreen();  
      } else if (document.documentElement.webkitRequestFullScreen) {  
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
      } 
      $("#fullscreen img").attr("src", "images/exit-screen.png"); 
    } else {  
      if (document.cancelFullScreen) {  
        document.cancelFullScreen();  
      } else if (document.mozCancelFullScreen) {  
        document.mozCancelFullScreen();  
      } else if (document.webkitCancelFullScreen) {  
        document.webkitCancelFullScreen();  
      }
      
      $("#fullscreen img").attr("src", "images/full-screen.png");  
    }  
  }
  if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
  }
  function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
      $("#fullscreen img").attr("src", "images/full-screen.png");
    }
  }

  
  // function GoInFullscreen() {
  //   let element = document.documentElement

  //   if(element.requestFullscreen)
  //     element.requestFullscreen();
  //   else if(element.mozRequestFullScreen)
  //     element.mozRequestFullScreen();
  //   else if(element.webkitRequestFullscreen)
  //     element.webkitRequestFullscreen();
  //   else if(element.msRequestFullscreen)
  //     element.msRequestFullscreen();
  // }

  // function GoOutFullscreen() {
  //   if(document.exitFullscreen)
  //     document.exitFullscreen();
  //   else if(document.mozCancelFullScreen)
  //     document.mozCancelFullScreen();
  //   else if(document.webkitExitFullscreen)
  //     document.webkitExitFullscreen();
  //   else if(document.msExitFullscreen)
  //     document.msExitFullscreen();
  // }


  agoraLocal = $("#agora_local").find("video").width();
    $("#agora_local video").height(`${agoraLocal / 1.778 }px`);
function attendeeScreenHeight(){
  let attendeeHeight = $(".attend-mid-section").height();
}
function changeImage(){
  if ($(window).width() < 1024){
    $(".fitness-guest .swiper-slide img").attr("src", "images/arrow-right.png").addClass("mobile-arrow");
  }
  else {
    $(".fitness-guest .swiper-slide img").attr("src", "images/arrow-img.png").removeClass("mobile-arrow");
  }
}

  function onPageResize(){
      
    let winHeight = window.innerHeight;
    let headerHeight = $(".header.bg-gray").height();
    let hostHeight = $(".host-script-section").height();
    let sectionHeights = winHeight - (hostHeight + headerHeight);

    $("#subscribers-list").height(`${sectionHeights - 107}px`)
    
    let sub_list_y = $("#subscribers-list").height(); 
    let sub_list_x = $("#subscribers-list").width(); 
    let len_subs = $('#subscribers-list').find('video').length;
    // console.log('demo== sub_list_y, sub_list_x, len_subs = ', sub_list_y, sub_list_x, len_subs)
    if($(".show-hide-title").hasClass("d-none")){
      $(".section.attendees").addClass("mt-76");
    
    }else {
      $(".section.attendees").removeClass("mt-76");
      
    }
    
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
        // getDevices();
      }
      // GoInFullscreen();
      // rtmJoin(); 
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
    function showHideHost(){
      if($(".add-remove-round1").hasClass("top-rounded")){
               
        setTimeout(function(){
          $(".add-remove-round1").addClass("rounded").removeClass("top-rounded");
        }, 400);
      }
      else{
        $(".add-remove-round1").removeClass("rounded").addClass("top-rounded");
        setTimeout(function(){
                
         }, 500)
        
      }
    }

  function removeSession(){
    localStorage.removeItem("userData");
    localStorage.removeItem("audience-list");
    localStorage.removeItem("media-setting");
    localStorage.removeItem("tempUsers");
    localStorage.removeItem("rtm-join-order");
    localStorage.removeItem("pre-session-time");
    localStorage.removeItem("load-page");
    localStorage.removeItem("channel");
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

  function convertUnixTimestamp(t)
  {
  var dt = new Date(t*1000);
  let date = dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear();
  let time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()+'.'+dt.getMilliseconds();
  let dateTime = date+' '+time;
  return dateTime;  
  }

function signalHandler(uid, signalData, userType) {

  //signalData = JSON.parse(signalData);

  let resultant=signalData.split(sep);
     
  
  if(userType == 1) { // Host

    if(resultant[0] == '201'){

      $('#errmsg').html('Client HandRaise');
      setTimeout(function(){ $('#errmsg').html(''); }, 10000);

    } else if(signalData.code == '100') {
       $('#errmsg').html(signalData.message);
       setTimeout(function(){ $('#errmsg').html(''); }, 10000);
      $('#agora_hand_raise'+uid+'').removeClass("d-none");
      
    } else if(resultant[0] == "1001"){
        addAudienceInList(resultant);
      }

      else if(resultant[0] == '216')
      {
        console.log('********gggg************ resultant', resultant);

        let joinDateTime = convertUnixTimestamp(resultant[1]);

        console.log('********ppppp************ resultant', joinDateTime,uid);
        let message="Welcome  Host, " + getUserDataFromList(uid, 'firstName') + " has already joined   ";
        
        $('#newmsg').html(message);
       // setTimeout(function(){ $('#newmsg').html(''); }, 10000);
      }

  } else { // Attendy

    
    //let res1=msg.split("~@$");
    if(resultant[0] == '204'){     
     // console.log('********gudu************** signalData ', signalData,uid, userType); 
      $('#hostmsg').html(' MUTEP,Now You Become a Audience');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);

      // hand down and mute from channel
      // downHand()
      $('#mocrophone-off').removeClass('d-none');
      $('#mocrophone-on').addClass('d-none');

    }else if(resultant[0] == '203') {
     // console.log('********gudu************** signalData ', signalData,uid, userType); 
      $('#hostmsg').html('Now U can Speak');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);      
      //hand-icon position-absolute hand;    
    }else if(resultant[0] == '200') {    
      $('#hostmsg').html('Now You can Publish');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);   
    }
    else if(resultant[0] == '216')
    {
      console.log('********gggg************ resultant', resultant[1]);
      let joinDateTimeattendies = convertUnixTimestamp(resultant[1]);
      console.log('********ssssss************ resultant', joinDateTimeattendies);
   
      let message="Welcome  User, " + getUserDataFromList(uid, 'firstName') + " has already joined ";
      
      $('#newmsg').html(message);
     // setTimeout(function(){ $('#newmsg').html(''); }, 10000);
    }

    else if(resultant[0] == '205')
    {
     // console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#hostmsg').html('Eject');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    }else if(resultant[0] == '209')
    {
     // console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#hostmsg').html('UnMute');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    } else if(resultant[0] == '1002') {
      
      // console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#hostmsg').html('Now you are became a audience.');
      unpublish();
      $('#mocrophone-on').removeClass('d-none');
      $('#mocrophone-off').addClass('d-none');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    } else if(resultant[0] == '1003') {

      // console.log('********ggggggggggggg************** signalData ', signalData.message); 
      $('#hostmsg').html('Now you are became a broadcaster.');
      // publish();
      publishAfterKick();
      $('#mocrophone-on').addClass('d-none');
      $('#mocrophone-off').removeClass('d-none');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    }

  }

}
  

    function channelMsgHandler(msg,senderId, userType)
    {
      
      let res1=msg.split(sep);
    
      if(res1[0] == "208")
      { 
      
        // if(userType != 1)
        // {
        let message="User "+senderId+" has joined on  "+ res1[1];
        $('#newmsg').html(message);
        // setTimeout(function(){ $('#newmsg').html(''); }, 10000); 
     
      //  $('#hostmsg').html(message);
      //   setTimeout(function(){ $('#hostmsg').html(''); }, 10000);

        // }else{
        //   let message="Host has joined on   "+ res1[1];
        //   $('#newmsg').html(message);
        //   setTimeout(function(){ $('#newmsg').html(''); }, 10000); 
       
        //  $('#errmsg').html(message);
        //   setTimeout(function(){ $('#errmsg').html(''); }, 10000);
        // }



        console.log('********Deepak************** signalData ', senderId);
        let rtmJoinOrder = JSON.parse(localStorage.getItem("rtm-join-order"));
        let localUserDta= JSON.parse(localStorage.getItem("userData"));

        rtmJoinOrder.forEach(ele => {

          if(ele.id == localUserDta.email )
          {
            
            if(ele.joinAt == '' && empty(ele.joinAt))
            {
              let ts = (new Date()).getTime();
              let text ="216"+sep+ts;
            }
            let text ="216"+sep+ele.joinAt;
            // console.log('-------------text=== ', text)
             sendMessage(senderId, text);
          }

        });

      }else if(res1[0] == "222")
      {
      //  $('#continue-join').removeAttr("disabled");
        let newmsg="Now U can Join";
        $('#newmsg').html(newmsg);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000);    
      }else if(res1[0] == "202")
      {
        console.log('********Deepak************** signalData ', msg,senderId, userType);
        if(userType =='1'){
          setEmojiesAtHost(res1[1],senderId,userType);
          }else{
            setEmojiesAtClient(res1[1],senderId,userType);
          }
      }else if(res1[0] == "301")
      {
        console.log('-------------------fitscript has Started-------------');
       // $('#hostFtnsScript').trigger('click');
        $(".start span a").trigger('click');
      }else if(res1[0] == "302")
      {
       // alert('fitscript has Stopped');
        console.log('-------------------fitscript has Stopped-------------');
        $(".end span a").trigger('click');
      }else if(res1[0] == "303")
      {
        //alert('fitscript Next');
      }else if(res1[0] == "304")
      {
        $(".carousel-control-next").trigger('click');
          //alert('Winsscript Next');
      }
    
     }

     function addAudienceInList(strArray) {
      console.log('-----------------str array ',strArray)
        let audienceList = [];
        let f = true;

        if(audienceList.length > 0){
          for(let i in audienceList){
            if(audienceList[i].id == strArray[1]){
              f = false;
              break;
            }
          }
        }
        
        if(f){
          audienceList.push({
            id : strArray[1],
            firstName : strArray[2],
            email : strArray[3],
            handRaisedAt : strArray[4]
          });
          localStorage.setItem("audience-list", JSON.stringify(audienceList));
          $('#dropdownMenuButton').removeClass('d-none');
          showHandAtHost();
        }
     }

     function removeAudienceInList(id) {
      
      if(localStorage.getItem("audience-list") == null) return false;

      let audienceList = JSON.parse(localStorage.getItem("audience-list"));

      let newAudienceList = [];

      if(audienceList.length > 0){
        for(let i in audienceList){
          console.log('removeAudienceInList = ', audienceList[i].id, id);
          if(audienceList[i].id != id){
            newAudienceList[i] = audienceList[i];
          }
        }
      }

      if(newAudienceList.length == 0){
        $('#dropdownMenuButton').addClass('d-none');
      }
      
      localStorage.setItem("audience-list", JSON.stringify(newAudienceList));
    }
     

     function showHandAtHost(){
        let audienceList = JSON.parse(localStorage.getItem("audience-list"));
        // console.log('audienceList', audienceList, audienceList.length)
        if(audienceList.length > 0){
          
          let list='';
          for(let i in audienceList){
            if($('#audience-'+audienceList[i].id).length == 0){

              list += '<li id="audience-'+audienceList[i].id+'"><a class="dropdown-item media" href="javascript:;" onClick="changeUserToBroadcaster(\''+audienceList[i].id+'\')"><img src="images/avtar.png" /><div class="media-body"><span class="welcome-title">'+audienceList[i].firstName+', '+getUserDataFromList(audienceList[i].id, 'city')+'</span><span>2 min ago</span></div></a></li>';          
            }
          }
          $('#total-raised-hands').html(audienceList.length);
          $('#raised-list').append(list);
          $('#dropdownMenuButton').removeClass('d-none');
        } else {
          $('#dropdownMenuButton').addClass('d-none');
          $('#raised-list').html('');
          $('#total-raised-hands').html(0);
        }
    }


    function changeUserToBroadcaster(uId){
        $('#to-broadcast').val(uId);

        if($('#subscribers-list .video-holder').length > 0) {
          pullFromSessionByHost(1);
        } else {
          pushIntoSessionByHost();
          removeAudienceInList(uId);
        }
    }

    function checkKickRule(dataObj){
      
      let rule = false
      let id = dataObj.id;

      let vdo = $('#subscribers-list #agora_remote'+ id + ' video' )[0];  
      console.log('subscribers-list video = ', vdo.muted)

      // check current user unmute state
      if(vdo.muted){

        let selectedParticipentId = $('#selected-participent-id').val();
        if(id != selectedParticipentId){
          rule = true;
        }
      }

      return rule;
    }

    function kickUser(id){
      let text = "1002"+sep+"kicked by host";
      console.log('############### text', text)
      sendMessage( convertIdToEmail(id), text);
      removeAudienceInList(id);
    }

    function pullFromSessionByHost(limit){
      let storeData = getCurrentUserData();
      
      let userList = getOrderUser();

      console.log(' @@@@@@@ userList @@@ ', userList);
      
      if(userList == '') return false;

      let ctr = 0;
      for(let i=0; i < userList.length; i++){
        
        let id = convertEmailToId(userList[i].id);
        if( $('#agora_remote'+id).length > 0 ){

          if(ctr < limit && checkKickRule(userList[i])){
            kickUser(id);
          }
          ctr++;
        }
      }
    }

    function pushIntoSessionByHost(){
      let uid = '';

      setTimeout(function(){}, 1000);

      if($('#to-broadcast').length > 0){

        uid = $('#to-broadcast').val();
        let text = "1003"+sep+" in session";
        sendMessage(convertIdToEmail(uid), text);

        $('#audience-'+uid).remove();
        $('#to-broadcast').val('');
        
        let len = parseInt($('#total-raised-hands').html());
        $('#total-raised-hands').html(len > 0 ? (len-1) : 0);
        if(len <= 0){
          $('#dropdownMenuButton').addClass('d-none');
        }
      } else {

      }
    }



    function channelSignalHandler(signalData, userType) {

    getAudienceList();
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
      }
    }

      function incrementcountAtAttendies(signalData,userType)
      {
      
        var count3=$('#totalonline').html();

      
        count3=parseInt(count3);
        var arr;
        
      if(signalData.msgtype=='Joined')
      { 
        let localstoragedata = JSON.parse(localStorage.getItem('allloginuser'));
        let newmem=signalData.member;
        console.log('*******totallist111222*************** signalData ',signalData.member,'----mmm----', localstoragedata); 

        localstoragedata.push(newmem);
        localStorage.setItem("allloginuser", JSON.stringify(localstoragedata));
        let str=signalData.message;
        let res = str.split(sep);
        let storeData = getCurrentUserData();
         hostEmail=storeData.sessionData.hostEmail;
         //let hostEmail='deepak@test.com';
      
        if(res[1]== hostEmail)
        { 
          $('#online_state').removeClass("online-status");        
          $('#online_state').addClass("online-status");
        }
        count4=count3+1;
      
         

     
      }else if(signalData.msgtype=='left') {

        let localstoragealdata = JSON.parse(localStorage.getItem('allloginuser'));
        
        let mememail=signalData.member;
       
        let index = localstoragealdata.indexOf(mememail);
     
        if (index > -1) {
          localstoragealdata.splice(index, 1);
        }
        localStorage.setItem("allloginuser", JSON.stringify(localstoragealdata));

        let str=signalData.message;
        let res = str.split(sep);
        let storeData = getCurrentUserData();
         hostEmail=storeData.sessionData.hostEmail;
        //let hostEmail='deepak@test.com';

        if(res[1]== hostEmail)
        {          
          $('#online_state').removeClass("online-status");
        }

      
        count4=count3-1;
     
          
      }else if(signalData.msgtype=='totalcount') {
            
         arr=signalData.totalmember;  
         localStorage.setItem("allloginuser", JSON.stringify(signalData.totalmember));            
         console.log('*******totallist2222233333*************** signalData ', arr);

        count4=signalData.member;
        count4=parseInt(count4);
        count4=count4-1;
       // console.log('*******totallist*************** signalData ', count4);
       //arr.shift();
   
      }

      let storeData = getCurrentUserData();    
        hostEmail=storeData.sessionData.hostEmail;
      //  let hostEmail='deepak@test.com';

      let arrayToDispaly = JSON.parse(localStorage.getItem('allloginuser'));
      console.log('arrayToDispaly', arrayToDispaly)
      $('#all_joined_member_list').html('');
      arrayToDispaly.forEach(element => {
        console.log('arrayToDispaly', element)
        memberID=convertEmailToId(element);

       let userName = getUserDataFromList(element, 'firstName');
         
       console.log('*******element*************** element ', element,'-----memberID-----',memberID);

        // if(element == hostEmail)
        // { 
            
        //   $('#online_state').removeClass("online-status");        
        //   $('#online_state').addClass("online-status");
        // }
       // $('#all_joined_member_list').append('<div className="attendee-list"><img src="images/attendee.png" /><span class="title">'+element+'</span><div className="vid-icons"> <span class="icon-appearance d-none"  id="emojies_app'+memberID+'"  data-attr="emojies'+memberID+'"></span><span class="icon-aroma d-none" id="emojies_ar'+memberID+'" data-attr="emojies'+memberID+'"></span><span class="icon-palate d-none"  id="emojies_pal'+memberID+'"  data-attr="emojies'+memberID+'"></span><span class="icon-score d-none"  id="emojies_sc'+memberID+'"  data-attr="emojies'+memberID+'"></span></div></div>');
        $('#all_joined_member_list').append('<div class="attendee-list"><img src="images/attendee.png" /><span class="title">'+userName+'</span><div class="vid-icons"> <span class="icon-appearance d-none"  id="emojies_app'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-aroma d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-palate d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-score d-none"  id="emojies_sc'+memberID+'"  data-attr="'+memberID+'"></span></div></div>');
      }); 
      
      $('#totalonline').empty(); 
      $('#totalonline').html(count4);
    
        $('#joined_users_at_client').empty(); 
        $('#joined_users_at_client').html(count4); 
    
      }


      function incrementcountAtHost(signalData,userType)
      {  
        console.log('********munmunHost************** signalData ', signalData, userType);
        var count=$('#totalonline').html();

      console.log('********munmunHost************** signalData ', signalData);
        count=parseInt(count);

        let storeData = getCurrentUserData();
        let hostid=storeData.sessionData.hostId;
        let clientid=storeData.sessionData.id;
        let TypeOfUser=storeData.userType;
        // if(hostid == clientid)
        // {
        //   $('#online_state').removeClass("online-status");        
        //   $('#online_state').addClass("online-status");
        // }

        if(TypeOfUser == 1)
        {
          $('#online_state').removeClass("online-status");        
          $('#online_state').addClass("online-status");
        }

      if(signalData.msgtype=='Joined')
      {     
        console.log('********guduHost************** signalData ', signalData, userType);
        count1=count+1;

       
         // console.log('*********lllllllll************* signalData ', signalData.message);
          $('#totalonline').empty(); 
          $('#totalonline').html(count1);  
        
            $('#joined_users').empty(); 
            $('#joined_users').html(count1);
       

      //   var peerId=signalData.member;

       
      //   let text ="216"+sep+"Hi, welcome to your first virtual studio session as A";
      //   if(count1 <= 8)
      //   {
      //     text ="216"+sep+"Hi,welcome to your first virtual studio session as B";
      //   }
      //  // console.log('-------------text=== ', text)
      //   sendMessage(peerId, text);

      }else if(signalData.msgtype=='left') {

        
        count1=count-1; 

       
          $('#totalonline').empty(); 
          $('#totalonline').html(count1);  
          // $('#newmsg').html(signalData.message);
          // setTimeout(function(){ $('#newmsg').html(''); }, 10000); 
        
            $('#joined_users').empty(); 
            $('#joined_users').html(count1);
        

 

      }else if(signalData.msgtype=='totalcount') {
        var arr=signalData.totalmember;
           //  console.log('---------alllist----------',arr)
        count1=signalData.member;
        count1=parseInt(count1); 
        count1=count1-1;
      
        $('#totalonline').empty(); 
        $('#totalonline').html(count1);  
     
          $('#joined_users').empty(); 
          $('#joined_users').html(count1);
       
      }


      }
     
      function setEmojiesAtHost(signalData,senderId,userType)
      {
        newSenderID=convertEmailToId(senderId);
        console.log('********guduuuuuuuuu************** signalData ', signalData,senderId,userType); 
        if(signalData == "appearence")
        {
        $('.icon-appearance[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "aroma")
        {
          $('.icon-aroma[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate")
        {
          $('.icon-palate[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "score")
        {
          $('.icon-score[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
      
      }

      function setEmojiesAtClient(signalData,senderId,userType)
      {
        newSenderID=convertEmailToId(senderId);
     
        console.log('*******Emojiesdata************** signalData ',newSenderID, signalData,senderId,userType); 
        if(signalData == "appearence")
        {
          console.log('*******Emojiesnewdata************** signalData ',newSenderID, signalData,senderId,userType);
        $('#emojies_app'+newSenderID+'').removeClass("d-none");
       console.log('-------',$('.icon-appearance[data-attr=\''+newSenderID+'\']').length)
       // $('.icon-appearance[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "aroma")
        {
          $('.icon-aroma[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        //  $('#emojies_ar'+newSenderID+'').removeClass("d-none");
        }else if(signalData == "palate")
        {
          $('.icon-palate[data-attr=\''+newSenderID+'\']').removeClass("d-none");
         // $('#emojies_pal'+newSenderID+'').removeClass("d-none");
        }else if(signalData == "score")
        {
          $('.icon-score[data-attr=\''+newSenderID+'\']').removeClass("d-none");
         // $('#emojies_sc'+newSenderID+'').removeClass("d-none");
        }
       // console.log('********Rammmmmmmmmmmmm************** signalData ', signalData, userType);
      }

      function leaveLogout(){
          // localStream.stop();
          leave_channel();
          removeSession();
          location.href  = '/login';
      }
      var upDown = function(){ 
        //var final_state = $("$(".host-show-hide")").is(':hidden') ? 'hidden' : 'visible'; 
        if($(this).is(':hidden') && $(".host-show-hide").is(':hidden')){
          $(".script-section").css("display", "block");
          $(".host-show-hide").css("display", "block");
        }
        else if ($(this).is(':visible') && $(".host-show-hide").is(':hidden')){
          $(".script-section").css("display", "none");
          $(".host-show-hide").css("display", "none");
        }
        else if ($(this).is(':hidden') && $(".host-show-hide").is(':visible')){
          $(".host-show-hide").css("display", "none");
          $(".script-section").css("display", "none");
        }
        else if ($(this).is(':visible') && $(".host-show-hide").is(':visible')){
          $(".script-section").css("display", "none");
          $(".host-show-hide").css("display", "none");
        }
      }
      function pullFromSession(){
        unpublish();
      }

      function pushIntoSession(){
        publish();
      }

      function checkUserRole(){
        console.log('client === ', client.hasPublished)
        
        // 0=broadcaster , 1=Audience
        return client && client.hasPublished ? 1 : 0;
        // if(client && client.hasPublished){
        //   return
        //   console.log(' User is Broadcaster.');
        // } else {
        //   console.log(' User is Audience.');
        // }
      }

      // Get user specific data
      function getUserDataFromList(id, key){
        let userList = getTempUsers();
        if(userList != ''){
          
          for(let i= 0; i < userList.length; i++){
            if(id == userList[i].id && userList[i].hasOwnProperty(key)){
              return userList[i][key];
            } else if(id == userList[i].email && userList[i].hasOwnProperty(key)){
              return userList[i][key];
            }
          }
        }
        return '';
      }


      $(document).ready(function(){
        
        let heightScript = $(".host-script-section").height();
            
        $(".item-description.script-section").height(`${heightScript - 37 }px`);
        //$(".host-local").height(`${heightScript}px`);
        $(".host-show-hide").height(`${heightScript - 30 }px`);
        $(".host-show-hide .video-streams").height("100%");


        $('#dropdownMenuButton').on('show.bs.modal', function (e) {
          // alert('===')
            showHandAtHost();
        });
        onPageResize();
        changeImage();

      
        $(".script-info .carousel-inner .carousel-item:first").addClass("active");
       
        $(document).on("click", ".start span a", function(){
          
          $(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
          $(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
          $(".swiper-slide.start a").prop('disabled', true);
          $(".swiper-btn-next").css("display", "block")
          countDown();
        })

        // $(document).on("click", "#winscript", function(){
          
        //   $(".swiper-slide:nth-child(1)").removeClass("swiper-slide-next");
        //   $(".swiper-slide:nth-child(2)").addClass("swiper-slide-next");
        //   $(".swiper-slide.start a").prop('disabled', true);
        //   $(".swiper-btn-next").css("display", "block")
        //   countDown();
        // })
         
         $(document).on("click", ".swiper-btns .swiper-btn-next", function(e){
           e.preventDefault();
           clearInterval(resetCount);
           // Now you can use all slider methods like
           mySwiper.slideNext();
           $(".swiper-wrapper .swiper-slide:nth-last-child(2)").hasClass("swiper-slide-next") ? $(".swiper-btn-next").css("display", "none") : $(".swiper-btn-next").css("display", "block");
           countDown();
         })

  
         


    let agoraLocal = $("#agora_local").find("video").width();
    $("#agora_local video").height(`${agoraLocal / 1.778 }px`);


    $("body, div").bind('mousewheel', function() {
      return false
    });

    $(document).on('click', ".eject-popup button", function(){
      $(this).closest(".video-holder").removeClass("popup-added");
    });

    $(".show-hide-script").click(function(){
      
      //$(this).text($(this).text() == '"Hide Script"' ? '"Show Script"' : '"Hide Script"');
      showHideScript();
      //$(".add-remove-flex").removeClass( ? '" "' : '"flex-grow-1"');
      
      $(".script-section").slideToggle();
      
    });

    $(".host-script-section").height("255px");
    $(".host-section").css({"min-width": "380px", "max-width": "380px"});
    
    $(".fullscreen, .back-btn").click(function(){
      $(".host-script-section").height() < 255 ? $(".host-script-section").height("255px") : $(".host-script-section").height("auto");
      
      $(".show-hide-v").hasClass("d-none") ? $(".show-hide-v").removeClass("d-none").addClass("d-block") : $(".show-hide-v").addClass("d-none").removeClass("d-block");
      
      if($(".show-hide-title").hasClass("d-block")){
        $(".show-hide-title").addClass("d-none").removeClass("d-block");
        $(".header").height("auto");
        $(".countdown-logo").hide();
        $(".section.attendees").css("margin-top", "77px !important" );
        $("#fullscreen img").attr("src", "images/exit-screen.png"); 
      }
      else{
        $(".show-hide-title").addClass("d-block").removeClass("d-none");
        $(".header").height("85px");
        $(".countdown-logo").show();
        $(".section.attendees").css("margin-top", "105px !important" );
        $("#fullscreen img").attr("src", "images/full-screen.png"); 
        
      }
      //$(".host-script-section").css({'max-height:55px'});
      showHideScript();
      showHideHost();
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
     // $(this).text($(this).text() == '"Show Attendees"' ? '"Hide Attendees"' : '"Show Attendees"');
      

      $(".host-show-hide").slideToggle();
      $(".script-section").slideToggle();
      



    });

    
    window.onresize = onPageResize;
    //window.onload = changeImage;
    window.onresize = changeImage;
   
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
      // if($('#media-config').length > 0){

        // networkBandwidth();
        // $('#media-config').modal({
        //   backdrop : "static",
        //   keyboard: false
        // });

        // $('#media-config').on('hidden.bs.modal', function (e) {
        //   console.log('close event')
        // })
        // getDevices();
        // rtmJoin(); 
        continueJoin()
      // }
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
      // raiseHand();
      $('#mocrophone-on').removeClass('d-none');
      $('#mocrophone-off').addClass('d-none');
    })

    $(document).on('click', '#mocrophone-on', function(){
      // downHand()
      $('#mocrophone-off').removeClass('d-none');
      $('#mocrophone-on').addClass('d-none');
    })

    // attendy
    $("#minimize-others").click(function(){
      
      $(".slide-right-left").css({"width": "72px", "float": "right"});
      $("#minimize-others, .right-sidebar .title").addClass('d-none');
      $("#show-everyone").removeClass('d-none');
      //$(".attendee-list").css("background", "transparent");
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
        let role = checkUserRole();
        let storeData = getCurrentUserData();
        //alert(storeData.rtm.welcome.code);return false;
        let userType=storeData.userType;
        let attendiesName=storeData.name;
        let attendieID=storeData.name;
        let hostid = storeData.sessionData.hostId;
        let hostname = storeData.sessionData.hostName;
        console.log('storeData hostid', storeData, hostid );
       // alert(hostname);return false;      
        //var massages="201~@$"+attendieID+"~@$clientHandRaise~@$"+attendiesName; 
        let hostEmail = convertIdToEmail(hostid);
        //console.log('hostEmail', hostEmail)	
        let handraiseCode=storeData.rtm.handRaise.code;
        var massages=handraiseCode+sep;
        
        // 1=audiencs

        if(role == 0){
          massages="1001" +sep+ storeData.id +sep+ storeData.firstName +sep+ storeData.email +sep+ (new Date()).getTime();// +sep+ storeData.image;
        }       
        sendMessage(hostEmail, massages);

      });

      $('#logout_button').click(function(){
        // localStream.stop();
        updateJoinSessionStatus();
        leave_channel();
        leave();
        removeSession();       
        location.href  = '/login';
        // location.reload();
      });

      $( '#appearence_button' ).bind( "click", function(event) {
        var attendiesEmail=$( '#appearence_button' ).val();
        //alert(attendiesEmail);return false;

       messages="202"+sep+"appearence"; 
     //  sendMessageToChannel(channelName, JSON.stringify({code:"110",data:attendiesEmail, message:"appearence"}));
       sendMessageToChannel(channelName1,messages);
      });

      $( '#aroma_button' ).bind( "click", function(event) {
        var attendiesID=$( '#aroma_button' ).val();

        messages="202"+sep+"aroma"; 
        //sendMessage(channelName, JSON.stringify({code:"110",data:attendiesID, message:"aroma"}));
        sendMessageToChannel(channelName1,messages);
      });

      $( '#palate_button' ).bind( "click", function(event) {
        var attendiesID=$( '#palate_button' ).val();
 
       messages="202"+sep+"palate";
        //sendMessage(channelName, JSON.stringify({code:"110",data:attendiesID, message:"palate"}));
        sendMessageToChannel(channelName1,messages);
      });

      $( '#score_button' ).bind( "click", function(event) {
        var attendiesID=$( '#score_button' ).val();             
        messages="202"+sep+"score";
        //sendMessage(channelName, JSON.stringify({code:"110",data:attendiesID, message:"score"}));
        sendMessageToChannel(channelName1,messages);
      });

      $('#ftnsStart').bind( "click", function(event) {

        let storeData = getCurrentUserData();
     
        let ftnsStartCode=storeData.rtm.ftnsStart.code;                  
        messages=ftnsStartCode+sep;        
        sendMessageToChannel(channelName1,messages);
      });

      $('#ftnsStop').bind( "click", function(event) {

        let storeData = getCurrentUserData();
     
        let ftnsStopCode=storeData.rtm.ftnsStop.code;                  
        messages=ftnsStopCode+sep;        
        sendMessageToChannel(channelName1,messages);
      });

      $('#wineNext_button').bind( "click", function(event) {

        let storeData = getCurrentUserData();
     
        let WinsNextCode=storeData.rtm.WinsNext.code;                  
        messages=WinsNextCode+sep;        
        sendMessageToChannel(channelName1,messages);
      });
   
      //$(document).on('click', '#fullscreen', function(){
        //GoInFullscreen();
        //toggleFullScreen();
      //})

      $(document).on('click', '.eject-session', function(){
        let strmId = $(this).closest('.video-holder').attr('id');
        console.log('strmId ', strmId);
        sendMessage(strmId, JSON.stringify({code:'101'}));
      });
    
    //
    $(document).on('click', '#subscribers-list .video-holder', function(){

      let id = $(this).attr('id');
      if($(this).find('video').hasClass('video-selected')){
        $('#selected-participent-id').val('');
        $(this).find('video').removeClass('video-selected');
      } else {
        $('#selected-participent-id').val( id );
        $(this).find('video').addClass('video-selected');
      }
    })
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