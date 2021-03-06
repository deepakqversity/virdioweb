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

  // var client, camera, microphone;
  var totalBrodcaster = 0;
  var sep = '~@$';
  var newArr121 = [];
  var newArr122 = [];

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
      return 0;
    } else {
      console.log('Invalid access ');
      return 0;
    }
  }

  function newDateFormat(dtTm){
    if(dtTm == '') return '';

    let tmpDt = dtTm.split(' ');
    let dt = tmpDt[0].split('/');
    let tm = tmpDt[1].split(':');
    let ms = tm[2].split('.');

    console.log('newDate =========', ms, tm[2]);
    //new Date(2016, 6, 27, 13, 30, 0);
    let newDate = new Date(dt[2], dt[1]-1, dt[0], tm[0], tm[1], tm[2], ms[1]).getTime();
    // console.log('newDate =========', newDate.getTime());
    return newDate;
  }

  function addRtmJoinOrder(userId, time){

    let strArray = localStorage.getItem("rtm-join-order");
    console.log('userId, time =========== strArray', userId, time, strArray)
    let orderList = [];
    let f = 0;
    if(strArray != null){
      strArray = JSON.parse(strArray);
      for(let i in strArray){
        if(strArray[i].id == userId){
          f = 1;
        }
      }
      orderList = strArray;
    }

    if(f == 0){
      orderList.push({ id:userId, joinAt:time });  
    }
      
    localStorage.setItem("rtm-join-order", JSON.stringify(orderList));
  }

  function removeFromRtmOrder(memberId){

      let strArray = localStorage.getItem("rtm-join-order");
      let orderList = [];
      if(strArray != null){
        strArray = JSON.parse(strArray);
        for(let i in strArray){
          if(strArray[i].id != memberId){
            orderList.push(strArray[i]);
          }
        }
      }

      localStorage.setItem("rtm-join-order", JSON.stringify(orderList));
  }

  //var currentSession = getCurrentSession(); 
  var newclient; 
  var channel;
  var channelName1;
  var retryCounter = 0;

  function rtmJoin()
  {
    // var appId1 = '232f270a5aeb4e0097d8b5ceb8c24ab3';
    var storeData = getCurrentUserData();
    var appId1 = storeData.sessionData.rtmAppId;
    channelName1 = storeData.sessionData.rtmChannelId;
    var token=null;
    newclient = AgoraRTM.createInstance(appId1);
    // appId1 = storeData.sessionData.appId;
    var peer=storeData.email;
    // newclient.login({uid: peer.toString(), token});

    newclient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);

        if ((newState == 'ABORTED' || newState == 'DISCONNECTED') && (reason == 'LOGIN_TIMEOUT' || reason == 'INTERRUPTED' || reason == 'REMOTE_LOGIN' || reason == 'LOGIN_FAILURE')) {
                    
            console.log('connection state changed. Trying to reconnect');

            newclient.logout();

            newclient.login({ token: token, uid: peer }).then(() => {
                
                // Create channel
                channel = newclient.createChannel(channelName1);
                console.log('rtm channel instance==', channel);
                channel.join().then(() => {

                    if (storeData.userType == 2) {
                        let message = "1000" + sep + storeData.id;
                        sendConnectedAgainMessage(storeData.sessionData.hostEmail, message);
                    }
                });
            });
        }
    });

    console.log('uidpeer', peer)

    newclient.login({ token: token, uid: peer }).then(() => {

    console.log('****shiv*******AgoraRTM client login success***********');

    newclient.on('MessageFromPeer', (message, peerId) => { 
      var msg=message.text;
      console.log('********vvvvvvvvvvvvv********',msg,'********************',peerId);
     // console.log("message "+ message.text + " peerId" + peerId);

      signalHandler(peerId, msg, storeData.userType);


    });

      channel = newclient.createChannel(channelName1);
      channel.join().then(() => {

      //addUserAttribute(convertEmailToId(peer), 'currentStatus', 1);

      if(storeData.userType == 1){
        recentlyJoinedChannelUser();
      }
      setTimeout(function(){}, 1000);
      console.log('**********shiv*********channel joined successfully**********');

      var text = "208" + sep + storeData.serverTimestamp;

      // when user join
      addRtmJoinOrder(peer, storeData.serverTimestamp);

      if(storeData.userType == 2){
        let userList = getTempUsers();
        let firstName = '';

        if(userList != ''){
          
          for(let i= 0; i < userList.length; i++){
              if (userList[i].userType == 1) {
                  firstName = userList[i].firstName;
                  break;
              }
          }
        }

        let welcomeMessage = "Hi " + storeData.firstName + ", this is "  + firstName + ", welcome to your 1st virtual session with us";
        $('#newmsg').html(welcomeMessage);
      }

      channel.sendMessage({text}).then(() => {  
        console.log('-------join msg llllll--------','mssages send successfully on channel');    
      }).catch(error => {
        displayError(error);
        console.log('-------There is error in joining a channel------', error)
      });

      channel.on('MemberJoined', memberId => { 

        console.log('MemberJoined ================MemberJoined ', memberId);

        if (storeData.userType == 2) {
            addUserAttribute(convertEmailToId(memberId), 'currentStatus', 1);
        }

        $('#online-user-row-'+convertEmailToId(memberId)).find('.user-status').attr('src', '/images/online.png');
        $('#online-user-row-'+convertEmailToId(memberId)).find('.user-online-status').html('online');

        $('#user-green-status-'+convertEmailToId(memberId)).removeClass('d-none');
        $('#user-red-status-'+convertEmailToId(memberId)).addClass('d-none');

        let userList = getOrderUser()

        if(userList != ''){
          for(let j in userList){
            if(userList[j].id == memberId){

                $('#online-user-row-'+convertEmailToId(memberId)).attr('data-position', userList[j].joinAt );
                break;
            }
          }
        }

        function sort_li(a, b) {
          return parseInt($(b).attr('data-position')) < parseInt($(a).attr('data-position')) ? 1 : -1;
        }
        
        $('#online-user-list tr').sort(sort_li).appendTo('#online-user-list');

        console.log('memberId============', memberId)

        let remoteUser = memberId.includes("RM-");

        if(storeData.userType == 1 && remoteUser == false){
          if( $('#joinee-' + convertEmailToId(memberId)).length == 0 ){

            let joinerName = getUserDataFromList(memberId, 'firstName')+' '+(getUserDataFromList(memberId, 'lastName') != null?getUserDataFromList(memberId, 'lastName'):'');
            removeFromFirst(joinerName);
            $('#joiners').append('<span class="welcome-title" id="joinee-'+convertEmailToId(memberId)+'">'+joinerName+'</span>');
            totalChannelMembers();
          }
        }
        /*
        <span class="welcome-title"><img src="images/avtar.png" />Richard, LA</span>
         */
        console.log('--------lalitmemjoined---------------')        
        var massages="208"+sep+memberId+sep+"joined"+sep;        
        channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);
      })
     
       channel.on('MemberLeft', memberId => { 

        console.log('--------lalitmemleft---------------', memberId)

        removeFromRtmOrder(memberId);

        var massages = "208"+sep+memberId+sep+"left"+sep;  
        channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
      
        if(storeData.userType == 1){
          if( $('#joinee-' + convertEmailToId(memberId)).length != 0 ){
            $('#joiners').find("#joinee-"+convertEmailToId(memberId)).remove();

            addNewAfterRemove(memberId);           
          }
        }

        if (storeData.userType == 2) {
            removeUserAttribute(convertEmailToId(memberId), 'currentStatus');
        }

        $('#online-user-row-'+convertEmailToId(memberId)).find('.user-status').attr('src', '/images/offline.png');
        $('#online-user-row-'+convertEmailToId(memberId)).find('.user-online-status').html('offline');
        $('#user-green-status-'+convertEmailToId(memberId)).addClass('d-none');
        $('#user-red-status-'+convertEmailToId(memberId)).removeClass('d-none');

      })
     
        channel.on('ChannelMessage', (message, senderId) => {         
          var msg=message.text;
          console.log('msggggggggggggggggggg', msg)
          // msg = JSON.parse(msg);  
          channelMsgHandler(msg, senderId,storeData.userType);

          let remoteUser = senderId.includes("RM-");

          if(storeData.userType == 1 && remoteUser == false){
            if( $('#joinee-' + convertEmailToId(senderId)).length == 0 ){

              let joinerName = getUserDataFromList(senderId, 'firstName')+' '+(getUserDataFromList(senderId, 'lastName') != null?getUserDataFromList(senderId, 'lastName'):'');
              removeFromFirst(joinerName);
              $('#joiners').append('<span class="welcome-title" id="joinee-'+convertEmailToId(senderId)+'">'+joinerName+'</span>');
              totalChannelMembers()
            }
          }
        });
 
      }).catch(error => {
        displayError(error);
        console.log('**********shiv*********There Is a problem to join a channel**********');
      });

        }).catch(err => {
          displayError(err);
          console.log('---------------bbbbbbbb-----client is not logedin-----');
        });
  
      }

      function leave_channel() {
        channel.leave();
       }


      function sendMessage(peerId, text)
      {
          console.log("sendPeerMessage", text, peerId);
          newclient.sendMessageToPeer({text}, peerId).then(sendResult => {
            console.log('sendResult---', sendResult, peerId);
            if (sendResult.hasPeerReceived) {
                /* Your code for handling the event that the remote user receives the message. */

                console.log('retryCounter====', retryCounter);

                retryCounter = 0;
            } else {
                /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
                
                if (retryCounter <= 3) {
                    retryCounter++;

                    setTimeout(function(){
                        sendMessage(peerId, text);
                    }, 500);
                } else {
                    console.log('retryCounter====limit exceeded', retryCounter);
                    retryCounter = 0;
                }
            }
          }).catch(error => {
              console.log('peererror=======', error);
              retryCounter = 0;
          });
      }

      function sendMessageToChannel(channelName1, text)
      {
          channel.sendMessage({text},channelName1).then(() => {
              console.log('---------------','mssages send successfully on channel');
              retryCounter = 0;
          }).catch(error => {
            console.log('channel message failed----', error);

            if (retryCounter <= 3) {
                retryCounter++;

                setTimeout(function(){
                    sendMessageToChannel(channelName1, text);
                }, 1000);
            } else {
                console.log('retryCounter====limit exceeded', retryCounter);
                retryCounter = 0;
            }
          });
      }

      function joinChannel() {

        var resp_data = JSON.parse(localStorage.getItem("userData"));
        console.log('-----------hhhhhhhhh-------------------', channelName1, resp_data.userType);
        if(resp_data.userType == 1)
        {     
            var text = "222" + sep;
            sendMessageToChannel(channelName1, text);
        }
      }


      /*function getMemberList()
      {
          channel.getMembers().then(membersList => {    
          
       
        var arr=membersList;             
        counter=membersList.length;
        counter=parseInt(counter); 
       
        var html = '';
        var optionbox='';
        optionbox +='<option value="select">select</option>';
        arr.forEach(function (value, i) {
          console.log("--------totalvalueold--------------", i, value);
          if(i >= 0 && value == 2)
          {   
            console.log("--------totalvaluenew--------------", i, value);     
                                  
          optionbox +='<option value=' + value + '>' + value + '</option>';
   
          }
        });
        html += '<select id="opt" onchange="onclickShowAsBroadcaster();">'+optionbox+'</select>';
        $('#guestmsg').append(html);

      }).catch(error => {
        displayError(error);
          console.log('*************There is an error******');
      });

      }*/

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
  
  var localClient = '';
  function networkBandwidth() {

    var localClient = '';
    let storeData = getCurrentUserData();

    localClient = AgoraRTC.createClient({ mode: 'live', codec:'h264' });
    // Initialize the client and join the channel.
    console.log('-------------------------------------------ooo')
    // initialize client
    let channelId2 = 9999999999 + '' + storeData.sessionData.channelId + '' + storeData.id;
    console.log('channelId2======', channelId2);
    localClient.init(storeData.sessionData.appId, function () {
    console.log('-------------------------------------------HHH')
          // create and join channel
      //localClient.join(storeData.sessionData.streamToken, storeData.sessionData.channelId.toString(), storeData.id, function(uid) {
         //localClient.join(storeData.sessionData.streamToken, channelId2.toString(), storeData.id, function(uid) {
          localClient.join(storeData.sessionData.streamDummyToken, channelId2.toString(), storeData.id, function(uid) {
        // localClient.join(null, '900001', storeData.email, function(uid) {
        console.log('-------------------------------------------uid', uid);
          // create local stream
            let localStream1 = AgoraRTC.createStream({streamID: uid, audio: true, video: true, screen: false });

            localStream1.init(function() {

              localClient.publish(localStream1, function (err) {
                console.log("Publish local stream error: " + err);
              });
              
              localStorage.setItem('mediaAccessAllowed', true);
              $('#set-media-access').click();
            }, function (err) {
              //alert('err media=='+err.type+'===='+err.msg+'====='+err.info);
              localStorage.setItem('mediaAccessAllowed', false);
              console.log("getUserMedia failed", err);

              if (err.type == 'error' && (err.msg === 'NotAllowedError' || err.msg === 'NotFoundError' || err.msg === 'NotReadableError')) {
              // if (err.type == 'error' && err.msg === 'NotAllowedError') {
                  // $('#media-access-alert').modal('show');
                  $('#media-access-alert').removeClass('d-none');
              }
            });
      }, function(err) {
        console.log("Join channel failed", err);
      });

    }, function (err) {
      console.log("AgoraRTC client init failed", err);
    });

    let counter = 0;
    let k = -1;
    let j = 1;
    var networkRef = setInterval(function(){  

      if(counter >= 3000){

        localClient.getTransportStats((stats) => {
           
          clearInterval(networkRef);
          
          console.log(`Current Transport RTT: ${stats.RTT}`);
          console.log(`Current Network Type: ${stats.networkType}`);
          console.log(`Current Transport OutgoingAvailableBandwidth: ${stats.OutgoingAvailableBandwidth}`);
          
          if(stats.OutgoingAvailableBandwidth != undefined && stats.OutgoingAvailableBandwidth > 0){

            localClient.leave(function () {

                var resolution = checkBandwidthRule(storeData.userType, stats.OutgoingAvailableBandwidth);
                //var resolution = false; 
                if (false === resolution) {
                    $('#bandwidth-low-alert').modal('show');
                    
                    setTimeout(function(){
                        $('#logout_button').click();
                    }, 4000);
                }
                console.log("Leave channel successfully");
            }, function (err) {
              console.log("Leave channel failed");
            });
          } else {
            localClient.leave(function () {

                localStorage.setItem("video-resolution", '360p_4');

                $('.fill-wifi').addClass('waveStrength-1');
                $('.fill-wifi').removeClass('waveStrength-0');

                console.log("Leavel channel successfully");
            }, function (err) {
              console.log("Leave channel failed");
            });
          }
        });
      } else {
        k = k > 4 ? 0 : k ;
        
        if($('.fill-wifi.waveStrength-'+(k-1)).length > 0){
          $('.fill-wifi').removeClass('waveStrength-'+(k-1));
        }

        if(k<4)
          $('.fill-wifi').addClass('waveStrength-'+k);

        k++;
      } 

      counter += 100;   
          
    }, 100);   
    
  }
  
  var checkMic = function(micId){

      stream2 = AgoraRTC.createStream({
          streamID: Math.floor(Math.random()*1000000),
          // Set audio to true if testing the microphone.
          video: false,
          audio: true,
          microphoneId: micId
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

  function cropDeviceName(str){
    // if(str.indexOf('(') !== -1){
      str = str.replace(/\(.*\)/i,'');
      str = str.replace(/\s+/i,' ')
    // }
    return str;
  }
 // console.log('============', cropDeviceName('hello (world) oooo'))
  var stream2 = null;
  var stream1 = [];
  function getDevices() {
    
    AgoraRTC.getDevices(function (devices) {
      let vdoMediaHtml = '';
      let adoMediaHtml = '';
      console.log('devices====', devices)
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

      $('#video-media-content').html('');
      
      let device = '';
      let deviceId = '';
      let deviceArray = [];
      var d = [];
      var l = 0;
      for (var i = 0, ctr = 0, ctr1 = 0; i !== devices.length; ++i) {

        if(!devices[i] || devices[i] == undefined) continue;

        // console.log('cameraId devices[i] = ', devices[i])
        device = devices[i];
        deviceId = device.deviceId;

        if(deviceArray.includes(deviceId)) continue;

        defaultSetting = '';
        deviceArray.push(deviceId);
        
        if (device.kind === 'audioinput') {
          // if(device.label.indexOf('Built-in') !== -1 || (device.label.indexOf('Internal') !== -1 && device.label.indexOf('Default') === -1)){
          // if(device.label.indexOf('Internal') !== -1 && device.label.indexOf('Default') === -1){
          //   continue;
          // }
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

          adoMediaHtml = '<div class="" id="ado-'+deviceId+'"><input class="form-radio" type="radio" name="audio-type" id="lbl-'+deviceId+'" value="'+deviceId+'" '+ defaultSetting +'> <label for="lbl-'+deviceId+'"> '+ cropDeviceName(device.label) +'</label> </div>';

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

          vdoMediaHtml = '<div class="col-md-3" id="vdo-'+deviceId+'"><div id="local-media-'+deviceId+'" ></div><div class="check-camera"><input type="radio" class="form-radio" name="video-type" id="lbl-'+deviceId+'" value="'+deviceId+'" '+ defaultSetting +'><label for="lbl-'+deviceId+'"> '+ cropDeviceName(device.label) +'</label></div></div>';

          $('#video-media-content').append(vdoMediaHtml)

          d[l] = deviceId;
          stream1[l] = AgoraRTC.createStream({
              streamID: Math.floor(Math.random()*1000000),
              // Set audio to true if testing the microphone.
              video: true,
              audio: false,
              cameraId: d[l],
          });

          stream1[l].on("accessAllowed", function() {
            console.log("video accessAllowed");
          });

          stream1[l].on("accessDenied", function() {
            console.log("video accessDenied");
          });

          l++;
        }
      }
      if(stream1 != null){
        for(let l in stream1){
          stream1[l].setVideoProfile('720p_3');
          // Initialize the stream.
          stream1[l].init(function(){
              stream1[l].play('local-media-' + d[l]);
              stream1[l].muteAudio();
          })
        }
      }
      console.log('cameraId = ',stream1)
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

  function removePreScreenSession(){
    if(stream1 != undefined && stream1 != null){
      // stream1.close();
      if(stream1.length > 0){
        for(let l in stream1){

            stream1[l].close();
        }
      }
    }
    if(stream2 != undefined && stream2 != null)
      stream2.close();
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


  var agoraLocal = $("#agora_local").find("video").width();
    $("#agora_local video").height(`${agoraLocal / 1.778 }px`);
function attendeeScreenHeight(){
  let attendeeHeight = $(".attend-mid-section").height();
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
    localStorage.removeItem("allloginuser");
    localStorage.removeItem("video-resolution");
    localStorage.removeItem("swap-subscriber-id");
    localStorage.removeItem("hostStreamMuted");
    localStorage.removeItem("mediaAccessAllowed");
    localStorage.removeItem("set_host_online_state");
    localStorage.removeItem("handraise-swap_auto-subscriber-id");
    localStorage.removeItem("handraise-swap-subscriber-id");
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
  let localDta= JSON.parse(localStorage.getItem("userData"));

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
      }else if(resultant[0] == '216')
      {
        console.log('********gggg************ resultant', resultant);

        let joinDateTime = convertUnixTimestamp(resultant[1]);

       // incrementcountOnPreStreming(uid, "welcome");

        incrementcountAtHost(uid, "welcome");
        
        addRtmJoinOrder(uid, resultant[1]);
        //addUserAttribute(convertEmailToId(uid), 'currentStatus', 1);
      }else if(resultant[0] == "237")
      {
        console.log('---------237---------------')
        let num=resultant[1]-1;
        // let scrnId = $(".check-camera.form-radio:eq("+num+")").attr('id');
        // console.log('=====================rtmAction',scrnId)
        // rtmAction(scrnId);
        $(".check-camera.form-radio:eq("+num+")").trigger('click');
      }
  } else { // Attendy

    
    //let res1=msg.split("~@$");
    if(resultant[0] == '204'){     
     // console.log('********gudu************** signalData ', signalData,uid, userType); 
      $('#hostmsg').html(' MUTEP,Now You Become a Audience');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);

      // hand down and mute from channel
      downHand()
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

      incrementcountAtAttendies(uid, "welcome");

      if(getUserDataFromList(uid, 'userType') == 1){        

        $('#online_state').removeClass('d-none');

        localStorage.setItem("set_host_online_state",1);

        /*let message="Hi " +localDta.firstName+ ", this is "  + getUserDataFromList(uid, 'firstName') + ", welcome to your 1st virtual session with us  ";
        
        console.log('********ssssss************ resultant', message);
        
        $('#newmsg').html(message);*/
      }

      console.log(' uid =================== time', uid, resultant);

      addRtmJoinOrder(uid, resultant[1]);

      if (resultant[2] == 1) {
          let storeData = getCurrentUserData();
          
          var bandwidthCheckCounter = setInterval(function() {

            if(localStorage.getItem("video-resolution") != null && localStorage.getItem('mediaAccessAllowed')  !== null && localStorage.getItem('mediaAccessAllowed')  == "true") {

                console.log('inside 216--');
                console.log('inside 216 video count --', $('#video-media-content .col-md-3').length);
                console.log('inside 216 audio count --', $('#audio-media-content div').length);

                clearInterval(bandwidthCheckCounter);

                if($('#video-media-content .col-md-3').length > 1 || $('#audio-media-content div').length > 1) {
                    multimediaAccessAlert();
                } else {
                    $('#participent-stream-redirect-alert').modal('show');
                    $('#set-temp-sesstion').click();

                    let duration = parseInt(storeData.default.streamRedirectDuration);

                    let ref2 = setInterval( function() {
                        $('#stream-rem-join-timer').html(duration < 0 ? 0 : duration);
                        if(duration <= 0){
                          clearInterval(ref2);
                          $('#continue-join').click();
                        }
                        duration--;
                    }, 1000 );
                }
            }
          }, 1000);
      }
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
    }

  }

}
  

    function channelMsgHandler(msg, senderId, userType)
    {
      let storeData = getCurrentUserData();
      
      let res1=msg.split(sep);
   
      if(res1[0] == "208")
      { 
      
        console.log('rtm join sender---', senderId, res1[1]);
        // if(userType != 1)
        // {
        // if(getUserDataFromList(senderId, 'userType') != 1){
          //addRtmJoinOrder(senderId, newDateFormat(res1[1]));
          addRtmJoinOrder(senderId, res1[1]);
        // }
        let message="User " + getUserDataFromList(senderId, 'firstName') + " has joined on  "+ res1[1];
        //$('#newmsg').html(message);
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

        //let peerId=senderId;

        console.log('********Deepak************** signalData ', senderId);
        //let rtmJoinOrder = JSON.parse(localStorage.getItem("rtm-join-order"));
        let localUserDta= JSON.parse(localStorage.getItem("userData"));

        /*rtmJoinOrder.forEach(ele => {

          if(ele.id == localUserDta.email )
          {
            
            if(ele.joinAt == '' && empty(ele.joinAt))
            {
              let ts = (new Date()).getTime();
              let text ="216"+sep+ts;
            }
            let text = "216"+sep+ele.joinAt+sep+0;
            // console.log('-------------text=== ', text)
             sendMessage(senderId, text);
          }

        });*/

        let text = "216" + sep + localUserDta.serverTimestamp + sep + 0;
        sendMessage(senderId, text);

        if(getUserDataFromList(convertEmailToId(senderId), 'userType') == 1){
          $('#online_state').removeClass('d-none');
          localStorage.setItem("set_host_online_state",1);
        }

      }else if(res1[0] == "222")
      {

// alert('get 222');
// alert('video reso--'+localStorage.getItem("video-resolution"));
// alert('media access---'+localStorage.getItem('mediaAccessAllowed'));

        let userList = getOrderUser();
        let storeData = getCurrentUserData();

        if(userList != ''){

          let ct = 0;
          for(let i=0; i < userList.length; i++){

            console.log('---222===storedata', storeData.id);
            console.log('---222===userlist', convertEmailToId(userList[i].id));


            //alert('user id----'+storeData.id);
            //alert('loop user id---'+userList[i].id +'====='+ convertEmailToId(userList[i].id));

            let uTyp = getUserDataFromList(userList[i].id, 'userType');

//alert('usertype=='+uTyp+'==='+userList[i].id);

            if (uTyp == 2 && storeData.id == convertEmailToId(userList[i].id)) {
              //alert(userList[i].id);
                
                var bandwidthCheckCounter = setInterval(function() {

                  //if(localStorage.getItem("video-resolution") != null &&  $('#media-access-alert').hasClass('show') === false) {
                  if(localStorage.getItem("video-resolution") != null && localStorage.getItem('mediaAccessAllowed') !== null && localStorage.getItem('mediaAccessAllowed') == "true") {
                      
                      console.log('inside 222--');
                      console.log('inside 222 video count --', $('#video-media-content .col-md-3').length);
                      console.log('inside 222 audio count --', $('#audio-media-content div').length);
                      console.log('inside 222--current user id', storeData.id);
                      console.log('inside 222--list user id', userList[i].id, convertEmailToId(userList[i].id));

                      clearInterval(bandwidthCheckCounter);

                      if($('#video-media-content .col-md-3').length > 1 || $('#audio-media-content div').length > 1) {
                          multimediaAccessAlert();
                      } else {
                          $('#participent-stream-redirect-alert').modal('show');
                          $('#set-temp-sesstion').click();

                          let duration = parseInt(storeData.default.streamRedirectDuration);

                          let ref2 = setInterval( function() {
                              $('#stream-rem-join-timer').html(duration < 0 ? 0 : duration);
                              if(duration <= 0){
                                clearInterval(ref2);
                                $('#continue-join').click();
                              }
                              duration--;
                          }, 1000 );
                      }
                    }
                }, 1000);

                // let currentUId = convertEmailToId(userList[i].id);

                // if(storeData.id == currentUId) {
                  
                //     let sessionTime = {};
                //     sessionTime['startTime'] = (new Date()).getTime();
                //     sessionTime['joinTime'] = ''
                //     localStorage.setItem("pre-session-time", JSON.stringify(sessionTime));

                //     $('#continue-join').removeAttr('disabled');
                //     $('#set-temp-sesstion').click();

                //     break;
                // }
            }

            //console.log('22222222222 000000000000----------',storeData.id, userList[i].id, uTyp, ct)
            /*if(ct < parseInt(storeData.default.maxUserLimit) && uTyp == 2){
              let currentUId = convertEmailToId(userList[i].id);
//console.log('22222222222 111111111----------',storeData.id , userList[i])
              if(storeData.id == currentUId) {
                //console.log('22222222222 ======', userList[i]);
                  let sessionTime = {};
                  sessionTime['startTime'] = (new Date()).getTime();
                  sessionTime['joinTime'] = ''
                  localStorage.setItem("pre-session-time", JSON.stringify(sessionTime));

                  if($('#participent-timer-alert').length > 0){

                    $('#participent-timer-alert').modal('show');
                    $('#continue-join').removeAttr('disabled');
                    $('#set-temp-sesstion').click();

                    let duration = parseInt(storeData.default.maxJoinDuration);

                    let ref2 = setInterval( function() {
                        $('#rem-join-timer').html(duration < 0 ? 0 : duration);
                        if(duration <= 0){
                          clearInterval(ref2);
                          $('#continue-join').click();
                        }
                        duration--;
                    }, 1000 );
                  }
                  break;
              }
              ct++;
            } else if (uTyp == 2) {
                let currentUId = convertEmailToId(userList[i].id);

                if(storeData.id == currentUId) {
                  
                    let sessionTime = {};
                    sessionTime['startTime'] = (new Date()).getTime();
                    sessionTime['joinTime'] = ''
                    localStorage.setItem("pre-session-time", JSON.stringify(sessionTime));

                    $('#continue-join').removeAttr('disabled');
                    $('#set-temp-sesstion').click();

                    break;
                }
            }*/
          }
        }

        updateHostSessionStatus(1);

        let newmsg="Now U can Join";
        setTimeout(function(){ $('#newmsg').html(''); }, 10000);    
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
            image : strArray[4]
          });
          localStorage.setItem("audience-list", JSON.stringify(audienceList));
          $('#dropdownMenuButton').removeClass('d-none');
          showHandAtHost();
        }
     }
     
     function showHandAtHost(){
        let audienceList = JSON.parse(localStorage.getItem("audience-list"));
        console.log('audienceList', audienceList);
        let list='';
        for(let i in audienceList){
          list += '<li><a class="dropdown-item media" href="#"><img src="images/avtar.png" /><div  class="media-body"><span>'+audienceList[i].firstName+', LA</span><span>2 min ago</span></div></a></li>';          
          /*
          <li><a class="dropdown-item media" href="#"><img src="images/avtar.png" /> 
                  <div  class="media-body">
                    <span>Amanda P, LA</span>
                    <span>2 min ago</span>
                  </div>
                  </a></li>
           */
        }
        $('#total-raised-hands').html(audienceList.length);
        $('#raised-list').append(list);
        $('#dropdownMenuButton').removeClass('d-none');
     }

    function channelSignalHandler(signalData, userType) {

   console.log('********atulorigin************** signalData ', signalData, userType);
    signalData = JSON.parse(signalData);
    console.log('---------atulorigin123----------------',signalData.code)
    if(signalData.code == '208'){
    if(userType =='1'){  

      //console.log('---------incrementcountAtHost----------------',signalData)

      incrementcountAtHost(signalData,userType);        
      }else{

       // console.log('---------incrementcountAtAttendies----------------',signalData)

          incrementcountAtAttendies(signalData,userType);    
      }
    }

    }

    function incrementcountAtAttendies(signalData, userType) {

      if (userType == "welcome") {

               
        let prestrecount = $("#totalonline").html();
    
        prestrecount = parseInt(prestrecount);

        console.log("------------prestrecount1111----------------", prestrecount);

        let substring="RM-";
       let output= signalData.includes(substring);

    console.log("------------output----------------", output);

    memberID=convertEmailToId(signalData);

    if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
      {
        newArr121.push(signalData);

        var unique = newArr121.filter(function(itm, i, a) {
          return i == newArr121.indexOf(itm);
      });
      console.log('---------unique---------',unique);     
      uuCount= unique.length+1;
       //uuCount++;
       // prestrecount = prestrecount + 1;
      }else{
       uuCount=prestrecount;
      }

      console.log("------------newArr1111----------------",uuCount);


        if (uuCount < 1) {
          uuCount = 0;
        }
        $("#totalonline").empty();
    
        console.log("------------uuCount11----------------", uuCount);
    
        $("#totalonline").html(uuCount);
      }

    else{

      var count3 = $("#totalonline").html();
    
      console.log('--------------signalData123456----------',signalData)

      count3 = parseInt(count3);
    
      if (signalData.msgtype == "Joined") {
        let str = signalData.message;
        let res = str.split(sep);
        let storeData = getCurrentUserData();
        let hostEmail = storeData.sessionData.hostEmail;
    
        console.log("----------res[1]---------------", res[1]);
    
        if (res[1] == hostEmail) {
          $("#online_state").removeClass("online-status");
          $("#online_state").addClass("online-status");
        }



        let substring="RM-";
        let output= signalData.member.includes(substring);
 
     console.log("------------output----------------", output);
 
     memberID=convertEmailToId(signalData.member);
 
     if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
       {
        //count4 = count3 + 1;

        newArr121.push(signalData.member);
        var unique1 = newArr121.filter(function(itm, i, a) {
          return i == newArr121.indexOf(itm);
      });
      console.log('---------unique---------',unique1);     
      count4= unique1.length+1;
      console.log('---------unique12---------',count4); 
       //count4++;
       console.log('---------unique11---------',count4); 
       }else{
        count4 = count3;
       }
 
        console.log('--------count4joined--------',count4)
    
        $("#totalonline").empty();
        $("#totalonline").html(count4);
      } else if (signalData.msgtype == "left") {
        let str = signalData.message;
        let res = str.split(sep);
        let storeData = getCurrentUserData();
        let hostEmail = storeData.sessionData.hostEmail;
    
        if (res[1] == hostEmail) {
          $("#online_state").removeClass("online-status");
        }
    
       // count4 = count3 > 0 ? count3 - 1 : 0;

        let substring="RM-";
        let output= signalData.member.includes(substring);
 
     console.log("------------output----------------", output);
 
     memberID=convertEmailToId(signalData.member);

 
 
     if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
       {

        //count4 = count3 > 0 ? count3 - 1 : 0;
        newArr121 = newArr121.filter(item => !signalData.member.includes(item))
 
      let unique12 = newArr121.filter(function(itm, i, a) {
          return i == newArr121.indexOf(itm);
          });

      console.log('---------unique---------',unique12);     
        count4= unique12.length+1;
       console.log('---------count4---------',count4);
       //count4++; 
       }else{
      // let count31= newArr121.length+1;
        count4 = count3 > 0 ? count3 : 0;
       }
    
        $("#totalonline").empty();
        $("#totalonline").html(count4);
      } else if (signalData.msgtype == "totalcount") {
        let storeData = getCurrentUserData();
        let hostEmail = storeData.sessionData.hostEmail;
    
        var arr = signalData.totalmember;
    
        count4 = signalData.member;
        count4 = parseInt(count4);
    
        // console.log('*******totallist*************** signalData ', count4);
        arr.shift();
        arr.forEach(element => {
          //let n = element.includes("RM-");
    
          if (element == hostEmail) {
            $("#online_state").removeClass("online-status");
            $("#online_state").addClass("online-status");
          }
        });
    
        count4 = count4 > 0 ? count4 - 1 : 0;
      }
    
      // $('#totalonline').empty();
      // $('#totalonline').html(count4);
    
      // $('#joined_users_at_client').empty();
      // $('#joined_users_at_client').html(count4);

    }
    }
    
    // function incrementcountOnPreStreming(signalData, type) {
    //   if (type == "welcome") {

    //     var newArr121 = [];
        
    //     let prestrecount = $("#totalonline").html();

    //     newArr121.push(signalData);

    //     var unique = newArr121.filter(function(itm, i, a) {
    //       return i == newArr121.indexOf(itm);
    //   });
    //   console.log('---------unique---------',unique);     
    //    var uuCount= unique.length;
    
    //     prestrecount = parseInt(prestrecount);

    //     console.log("------------prestrecount1111----------------", prestrecount);

    //     let substring="RM-";
    //    let output= signalData.includes(substring);

    // console.log("------------output----------------", output);

    // memberID=convertEmailToId(signalData);

    // if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
    //   {

    //    uuCount++;
    //   }

    //   console.log("------------newArr1111----------------",uuCount);


    //   // if(getUserDataFromList(memberID, 'userType') == 2){

    //   //   prestrecount = prestrecount + 1;
    //   // }

    //     if (uuCount < 1) {
    //       uuCount = 0;
    //     }
    //     $("#totalonline").empty();
    
    //     console.log("------------uuCount11----------------", uuCount);
    
    //     $("#totalonline").html(uuCount);
    //   }
    // }

    function incrementcountAtHost(signalData, userType) {

      if (userType == "welcome") {

               
        let prestrecount = $("#totalonline").html();


    
        prestrecount = parseInt(prestrecount);

        console.log("------------prestrecount1111----------------", prestrecount);

        let substring="RM-";
       let output= signalData.includes(substring);

    console.log("------------output----------------", output);

    memberID=convertEmailToId(signalData);

    if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
      {

        newArr122.push(signalData);

        var unique = newArr122.filter(function(itm, i, a) {
          return i == newArr122.indexOf(itm);
      });
      console.log('---------unique---------',unique);     
        uuCount= unique.length;
       // prestrecount = prestrecount + 1;
      }else{
         uuCount= prestrecount;
      }

      console.log("------------newArr122----------------",uuCount);


        if (uuCount < 1) {
          uuCount = 0;
        }
        $("#totalonline").empty();
    
        console.log("------------uuCount11----------------", uuCount);
    
        $("#totalonline").html(uuCount);
      }


      else{

      var count = $("#totalonline").html();
    
      count = parseInt(count);
    
      let storeData = getCurrentUserData();
      let hostEmail = storeData.sessionData.hostEmail;
      var clientid = storeData.sessionData.id;
      if (storeData.userType == 1) {
        $("#online_state").removeClass("online-status");
        $("#online_state").addClass("online-status");
      }
    
      if (signalData.msgtype == "Joined") {
        console.log(
          "********guduHost************** signalData ", signalData,userType
        );
    
        let str = signalData.message;
        let res2 = str.split(sep);

        let substring="RM-";
        let output= signalData.member.includes(substring);
 
     console.log("------------output----------------", output);
 
     memberID=convertEmailToId(signalData.member);
 
     if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
       {
 
         newArr122.push(signalData.member);
 
         let unique = newArr122.filter(function(itm, i, a) {
           return i == newArr122.indexOf(itm);
       });
       console.log('---------unique---------',unique);     
         count1= unique.length;
        // prestrecount = prestrecount + 1;
       }else{
        count1 = count;
       }
    
       // count1 = count + 1;
    
        $("#totalonline").empty();
        $("#totalonline").html(count1);
      } else if (signalData.msgtype == "left") {
        let str = signalData.message;
        let res2 = str.split(sep);
    
       // count1 = count > 0 ? count - 1 : 0;


        let substring="RM-";
        let output= signalData.member.includes(substring);
 
     console.log("------------output----------------", output);
 
     memberID=convertEmailToId(signalData.member);

    
 
     if(output != true  && getUserDataFromList(memberID, 'userType') == 2)
       {
        console.log('---------newArr122---------',newArr122); 

        newArr122 = newArr122.filter(item => !signalData.member.includes(item))

        let unique45 = newArr122.filter(function(itm, i, a) {
          return i == newArr122.indexOf(itm);
          });

        console.log('---------unique1---------',unique45); 
            
        count1= unique45.length;

        count1 = count1 > 0 ? count1 : 0;
        // count4;
         console.log('---------count1---------',count1);
        // prestrecount = prestrecount + 1;
       }else{
        count1 = count > 0 ? count  : 0;
       }
   
        $("#totalonline").empty();
        $("#totalonline").html(count1);
      } else if (signalData.msgtype == "totalcount") {
        let arr = signalData.totalmember;
    
        count1 = signalData.member;
        count1 = parseInt(count1);
    
        count1 = count1 > 0 ? count1 - 1 : 0;
    
        // $('#totalonline').empty();
        // $('#totalonline').html(count1);
      }

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
       // console.log('********Rammmmmmmmmmmmm************** signalData ', signalData, userType);
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

      function leaveLogout(){
          //updateJoinSessionStatus();
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

      function pullFromSessionByHost(){
      }

      function pushIntoSessionByHost(){
      }

      function checkUserRole(){
        // console.log('client === ', client.hasPublished)
        
        // 0=broadcaster , 1=Audience
        // return client && client.hasPublished ? 1 : 0;
       
        // if(client && client.hasPublished){
        //   return
        //   console.log(' User is Broadcaster.');
        // } else {
        //   console.log(' User is Audience.');
        // }
      }

      function getUniqueMembers(membersList) {
          if (membersList.length > 0) {
              var uniqueCount = 0;

              $.each(membersList, function (index, value) {
                // alert(value)
                // alert(value.includes("RM-"));
                if (value.includes("RM-") === false) {
                    uniqueCount++;
                }

              });

              return uniqueCount;
          }
      }

      function totalChannelMembers(){
        /*console.log('%%%%%%%%%%%%%%%%%%%%%%',channel.getMembers());
        let localData = getCurrentUserData();
        channel.getMembers().then(membersList => {
            console.log('totMemberjagat-----------', membersList)
            //let totMember = membersList.length -1;

            let totMember = getUniqueMembers(membersList) - 1;
            //console.log('totMember-----------', totMember)
            let maxUserLimit = localData.default.preScreenUserLimit;
            console.log('totMember-----------', totMember,maxUserLimit)
            $('#total-joinees').html(totMember > maxUserLimit ? `+${totMember - maxUserLimit} more` : '');
            
          }).catch(error => {
            console.log('*************There is an error******');
          });*/
      }

      function recentlyJoinedChannelUser(){
        console.log('----------recentlyJoinedChannelUser---------------');

        let localData = getCurrentUserData();
        //let strArray = JSON.parse(localStorage.getItem("rtm-join-order"));
        let strArray = getTempUsers();
        
        console.log('---------strArray---------',strArray);

        channel.getMembers().then(membersList => {
            //let totMember = membersList.length;
            let totMember = getUniqueMembers(membersList);

            console.log('---------totMemberlalit---------', membersList);
            let maxUserLimit = localData.default.preScreenUserLimit;
            console.log('totMember maxUserLimit', totMember, maxUserLimit);
            
            let ctr = 1;


            //for(let j=0; j < strArray.length; j++){

            $.each(strArray, function( key, value ) {
              console.log('---------totMember4444---------', value.id);
              //console.log('---------totMember123---------', strArray.length);
              for(let i= totMember-1; i >= 0 ; i--){
                console.log('---------totMember555---------', value.id);
                //console.log('---------totMember2222---------', totMember);
                //if(membersList[i].id == strArray[j].id && getUserDataFromList(membersList[i], 'userType') == 2){
                if(membersList[i] == value.email && getUserDataFromList(membersList[i], 'userType') == 2){
                  //console.log('---------totMember33333---------', membersList[i],strArray[j].id);
                  console.log('---------totMember33333---------', membersList[i], value.email);
                  if(ctr++ <= maxUserLimit){
                    //console.log('---------totMember4444---------', maxUserLimit);
                    if( $('#joinee-' + convertEmailToId(membersList[i])).length == 0 ){
                      //console.log('---------totMember5555---------', membersList[i]);
                      $('#joiners').append('<span class="welcome-title" id="joinee-'+convertEmailToId(membersList[i])+'">'+getUserDataFromList(membersList[i], 'firstName')+' '+(getUserDataFromList(membersList[i], 'lastName') != null?getUserDataFromList(membersList[i], 'lastName'):'')+'</span>');
                    }
                  } else {
                    console.log('----remove first--------');
                    if( $('#joinee-' + convertEmailToId(membersList[i])).length == 0 ){
                      
                      let joinerName = getUserDataFromList(membersList[i], 'firstName')+' '+(getUserDataFromList(membersList[i], 'lastName') != null?getUserDataFromList(membersList[i], 'lastName'):'');
                      removeFromFirst(joinerName);

                      $('#joiners').append('<span class="welcome-title" id="joinee-'+convertEmailToId(membersList[i])+'">'+joinerName+'</span>');
                    }
                  }
                }                
              }
            });
            //console.log('totMember maxUserLimit ===', totMember, maxUserLimit);

            //totMember = totMember-1;
            //$('#total-joinees').html(totMember > maxUserLimit ? `+${totMember - maxUserLimit} more` : '');
            
          }).catch(error => {
            console.log('*************There is an error******');
          });
      }

      function addNewAfterRemove(id){
        setTimeout(()=>{}, 2000);
        let localData = getCurrentUserData();
        channel.getMembers().then(membersList => {
            console.log('---afterremovemembrlist------', membersList);
            //let totMember = membersList.length;
            let totMember = getUniqueMembers(membersList);
            for(let i= totMember-1; i >= 0 ; i--){
              if(getUserDataFromList(membersList[i], 'userType') == 2){
                if(membersList[i] != id && $('#joinee-' + convertEmailToId(membersList[i])).length == 0 ){
                  $('#joiners').append('<span class="welcome-title" id="joinee-'+convertEmailToId(membersList[i])+'">'+getUserDataFromList(membersList[i], 'firstName')+' '+(getUserDataFromList(membersList[i], 'lastName') != null?getUserDataFromList(membersList[i], 'lastName'):'')+'</span>');
                  break;
                }
              }
            }
            //let maxUserLimit = localData.default.preScreenUserLimit;
            //$('#total-joinees').html(totMember-1 > maxUserLimit ? `+${(totMember-1) - maxUserLimit} more` : '');
            
          }).catch(error => {
            console.log('*************There is an error******');
          });
      }

      function removeFromFirst(joinerName) {
          let localData = getCurrentUserData();
          let maxUserLimit = localData.default.preScreenUserLimit;
          //alert('window width------'+$( window ).width());
          //alert('joiner class width------'+$('.joiners').width());
          //alert('joiner id width------'+$('#joiners').width());

          $('#joiner-name-width').text(joinerName);
          //alert($('#joiner-name-width').width());
          if(($('#joiners').width() + $('#joiner-name-width').width()) > $('.joiners').width()){
            $( "#joiners").find('span').first().remove();
          }

          $('#joiner-name-width').text('');

          /*if($('#joiners').find('span').length >= maxUserLimit){
            $( "#joiners").find('span').first().remove();
          }*/
      }


      function timerAlert(){
        if($('#timer-alert').length > 0){

          $('#timer-alert').modal('show');
        }
      }

   
      function participentTimerAlert(){
        if($('#participent-timer-alert').length > 0){

          $('#participent-timer-alert').modal('show');
        }
      }

      function multimediaAccessAlert(){
          $('#multi-media-access-alert').modal('show');
      }

      function participentTimerAlertClose(){
        if($('#participent-timer-alert').length > 0){

          $('#participent-timer-alert').modal('hide');
        }
      }

      function participentStreamTimerAlertClose() {
          $('#participent-stream-redirect-alert').modal('hide');
      }

      // Get user specific data
      function getUserDataFromList(id, key){
        let userList = getTempUsers();
        if(userList != ''){
          
          for(let i= 0; i < userList.length; i++){
            if(userList[i].hasOwnProperty(key) && id == userList[i].id){
              return userList[i][key];
            } else if(userList[i].hasOwnProperty(key) && id == userList[i].email){
              return userList[i][key];
            }
          }
        }
        return '';
      }

    function getOrderUser(){
      let userList = localStorage.getItem("rtm-join-order");

      if(userList == null) return '';

      userList = JSON.parse(userList);
      console.log('userListuserList',userList, typeof userList);
      userList.sort(function(a, b) { return parseInt(a.joinAt) - parseInt(b.joinAt); });

      return userList; 
    }

    // function getTotalParticipants(){
    //   let userList = getTempUsers();

    //   if(userList == null) return 0;

    //   userList = JSON.parse(userList);
    //   // console.log('userListuserList',userList, typeof userList);
    //   // userList.sort(function(a, b) { return parseInt(a.joinAt) - parseInt(b.joinAt); });
    //   userList.filter(function(value) {
    //       return value.userType == 2; // Get only elements, which have such a key
    //   }).shift();
      
    //   return userList; 
    // }

  function addUserAttribute(id, key, value){
      
    let tempUsers = getTempUsers();
    console.log('tempUsers =========== tempUsers', tempUsers, id, key, value)

    if(tempUsers != null){
      // tempUsers = JSON.parse(tempUsers);
      for(let i in tempUsers){
        //tempUsers[i].hasOwnProperty(key)
        if(tempUsers[i].id == id){
          tempUsers[i][key] = value;
        }
      }
    }
      
    localStorage.setItem("tempUsers", JSON.stringify(tempUsers));
  }

  function getAllAudience(){
    let tempUsers = getTempUsers();
    // console.log('tempUsers =========== tempUsers ======', tempUsers);
    let audience = [];
    if(tempUsers != null){
      
      for(let i in tempUsers){
        if(tempUsers[i].hasOwnProperty('isSubscribe') && tempUsers[i].isSubscribe == 2){
          audience.push(tempUsers[i]);          
        }
      }
      audience.sort(function(a, b) { return parseInt(a.subscribeTime) - parseInt(b.subscribeTime); });
    }
    console.log('audience =========== audience ======', audience);
    return audience;      
  }

  function getAllBroadcster(){
    let tempUsers = getTempUsers();
    // console.log('tempUsers =========== tempUsers ======', tempUsers);
    let broadcasters = [];
    if(tempUsers != null){
      
      for(let i in tempUsers){
        if(tempUsers[i].hasOwnProperty('isSubscribe') && tempUsers[i].isSubscribe == 1){
          broadcasters.push(tempUsers[i]);          
        }
      }
      broadcasters.sort(function(a, b) { return parseInt(a.subscribeTime) - parseInt(b.subscribeTime); });
    }
    console.log('broadcasters =========== broadcasters ======', broadcasters);
    return broadcasters;      
  }

  function updateHostSessionStatus(status){
    let tempUsers = getTempUsers();
    // console.log('tempUsers =========== tempUsers ======', tempUsers);
    
    if(tempUsers != null){
      for(let i in tempUsers){
        if(tempUsers[i].userType == 1){

          tempUsers[i].sessionStatus = status;          
        }
      }
      localStorage.setItem("tempUsers", JSON.stringify(tempUsers));
    }
  }
  
  function displayError(err){
    $('#exptn-errors').html('<pre>'+err+'</pre>');
  }

  function removeUserAttribute(id, key){

      let tempUsers = getTempUsers();

      if(tempUsers != null){
        for(let i in tempUsers){
          if(tempUsers[i].hasOwnProperty(key) && tempUsers[i].id == id){
            delete tempUsers[i][key];
          }
        }
      }
        
      localStorage.setItem("tempUsers", JSON.stringify(tempUsers));
  }

  function sendConnectedAgainMessage(peerId, text) {
      console.log('in pre-main sendConnectedAgainMessage---');
  }

  $(document).ready(function(){

    let localstoragedata12345 = JSON.parse(localStorage.getItem('userData'));
    if(localstoragedata12345.userType !=1)
    {
    $('#totalonline').html('1');
    }

    function sort_li(a, b) {
      return parseInt($(b).attr('data-position')) < parseInt($(a).attr('data-position')) ? 1 : -1;
    }
    $('#online-user-list tr').sort(sort_li).appendTo('#online-user-list');

    // $("body, div").bind('mousewheel', function() {
    //   return false
    // });
    onPageResize();
    window.onresize = onPageResize;

    networkBandwidth();
    // check devices
    getDevices();
    rtmJoin(); 

      $('#logout_button').click(function(){
        //updateJoinSessionStatus();
        leave_channel();
        removeSession();
        location.href  = '/login';
        // location.reload();
      });
   
      $(document).on('click', '#fullscreen', function(){
        //GoInFullscreen();
        //toggleFullScreen();
      })

      $('#attendy-list').on('shown.bs.modal', function () {
          
          channel.getMembers().then(membersList => {

            let localData = getCurrentUserData();
          // let maxUserLimit = localData.default.maxUserLimit;

            let userList = getOrderUser();
            $('#attendy-list').find('.user-status').attr('src', '/images/offline.png');
            $('#attendy-list').find('.user-online-status').html('offline');
            $('#attendy-list').find('.fa-check').addClass('d-none');
            $('#attendy-list').find('.fa-times').removeClass('d-none');

            //$('#attendy-list').find('.visible-status .fa').addClass('fa-times').addClass('text-red').removeClass('fa-check').removeClass('text-green');
            // let memCtr = 0;
            for(let i= 0; i < membersList.length; i++){
              let eleId = convertEmailToId(membersList[i]);
              $('#online-user-row-'+eleId).find('.user-status').attr('src', '/images/online.png');
              $('#online-user-row-'+eleId).find('.user-online-status').html('online');
              //$('#online-user-row-'+eleId).find('.visible-status .fa').addClass('fa-check').addClass('text-green').removeClass('fa-times').removeClass('text-red');

              $('#user-green-status-'+eleId).removeClass('d-none');
              $('#user-red-status-'+eleId).addClass('d-none');

              if(userList != ''){
                for(let j in userList){
                  if(userList[j].id == membersList[i]){
                      // if(memCtr < localData.default.maxUserLimit){
                      // }
                      $('#online-user-row-'+eleId).attr('data-position', userList[j].joinAt );
                      break;
                  }
                }
              }
              // memCtr++;
              $('#online-user-list tr').sort(sort_li).appendTo('#online-user-list');
              
            }
          }).catch(error => {
            console.log('*************There is an error******=============', error);
          });
      })

      $('#proceed').on('click', function(){
          $('#multi-media-access-alert').modal('hide');
          $('#continue-join').click();
      });

      $('#change-setting').on('click', function(){
          $('#multi-media-access-alert').modal('hide');
          $('#continue-join').removeClass('d-none');

          let storeData = getCurrentUserData();
          let duration = parseInt(storeData.default.changeMediaTimer);

          $('#change-setting-timer').text(duration);
          $('#change-setting-timer').removeClass('d-none');

          let ref2 = setInterval( function() {
              $('#change-setting-timer').html(duration < 0 ? 0 : duration);
              if(duration <= 0){
                clearInterval(ref2);
                $('#continue-join').click();
              }
              duration--;
          }, 1000 );
      });
  });
 
