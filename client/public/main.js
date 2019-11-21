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
  var currentPublishedUser = [];
  var changedRole = 'audience';
  var retryCounter = 0;

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

    } 
    // else {
    //   if($('input[name="video-type"]').length > 0 && $('input[name="audio-type"]').length > 0){

    //     camera = $('#current-camera').val();
    //     microphone = $('#current-microphone').val();
    //     // camera = $('input[name="video-type"]:checked').val();
    //     // microphone = $('input[name="audio-type"]:checked').val();
    //   } else {
    //     location.href = 'pre-screen';
    //     console.log('Media device not found==')
    //     return false;
    //   }
    // }

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
      client.setClientRole("audience", function(err) {

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
            
            console.log('video-resolution-----', localStorage.getItem("video-resolution"));
            //localStream.setVideoProfile('720p_3');
            localStream.setVideoProfile(localStorage.getItem("video-resolution"));

            // The user has granted access to the camera and mic.
            localStream.on("accessAllowed", function() {
              console.log("accessAllowed");
            });

            // The user has denied access to the camera and mic.
            localStream.on("accessDenied", function() {
              console.log("accessDenied");
            });


            localStream.init(function() {
              
              if(storeData.userType == 2){
                // localStream.muteAudio();
              } 
        
              console.log("GetUserMedia successfully");
              localStream.play('agora_local');
              
              // call publish
              publish();

              
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
console.log('======jagattotalBrodcaster====', totalBrodcaster, evt.stream.getId());
      if (totalBrodcaster < storeData.default.maxUserLimit) {
          var stream = evt.stream;
          console.log("New stream added " + stream.getId());
          if(getUserDataFromList(stream.getId(), 'userType') == 2){
            totalBrodcaster++;
            // remove id when unpublished
            currentPublishedUser.push(stream.getId());
            console.log(' @@@@@@ totalBrodcaster++ ', totalBrodcaster);
            
          }
          // add as a audience
          addUserAttribute(stream.getId(), 'subscribeTime', (new Date()).getTime());
          addUserAttribute(stream.getId(), 'isSubscribe', 1);
          
          // console.log("Subscribe ", stream);
          
          client.subscribe(stream, function (err) {
            console.log("Subscribe stream failed", err);
          });
      }
    });

    var count=1;
    // var totalScreenUsers = 0;
    client.on('stream-subscribed', function (evt) {

      var storeData = getCurrentUserData();

      var stream = evt.stream;

      console.log("Subscribe remote stream successfully: " , stream.getId() , stream);
      
      // for host user
      if(storeData.userType == 1) {

        let prevDivId = '';
        let len = $('#subscribers-list .newcss').length;

        if (len > 1) {
          $('#subscribers-list .newcss').each(function (index, value) {
            
              if($(this).hasClass('removeBroadcaster') && index === 0 && len == 1) {
                prevDivId = '';
                return false;
              } else if($(this).hasClass('removeBroadcaster') && index === 0) {
                prevDivId = '';
                return false;
              } else if($(this).hasClass('removeBroadcaster')) {
                return false;
              }  else {
                prevDivId = $(this).attr('id');
              }
          });
        }
        
        //setTimeout(function(){
        //if ($('#subscribers-list #agora_remote'+stream.getId()).length === 0 && localStorage.getItem("u-subscriber-id") !== stream.getId()) {
        if ($('#subscribers-list #agora_remote'+stream.getId()).length === 0) {
          // if(totalScreenUsers < totalBrodcaster, storeData.default.maxUserLimit){
console.log('prevDivId------', prevDivId);
            //localStorage.setItem("u-subscriber-id", stream.getId());

          if (prevDivId === '') {
console.log('in-- if===', stream.getId());
              /*if (localStorage.getItem("swap-subscriber-id") !== '') {
                $('#agora_remote' + localStorage.getItem("swap-subscriber-id")).remove();  
              }
              
              if (len == 1) {
                $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');  
              } else {
                $('#subscribers-list').prepend('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');
              }*/


              if (localStorage.getItem("swap-subscriber-id") !== null && localStorage.getItem("swap-subscriber-id") !== '') {
                console.log('if swap-subscriber-id=====', localStorage.getItem("swap-subscriber-id"));
                //$('#agora_remote' + localStorage.getItem("swap-subscriber-id")).remove();  

                  $('#agora_remote' + localStorage.getItem("swap-subscriber-id")).attr('id', 'agora_remote'+stream.getId());
                  let newStreamer = '<div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon d-none" data-attr="'+stream.getId()+'><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div>';
                  $('#agora_remote' + stream.getId()).html(newStreamer);
              } else {
                  console.log('else swap-subscriber-id=====', localStorage.getItem("swap-subscriber-id"));
                  $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon d-none" data-attr="'+stream.getId()+'"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');
              }              
          } else {
              console.log('in-- else===', stream.getId());
              if (localStorage.getItem("swap-subscriber-id") !== '') {
                //$('#agora_remote' + localStorage.getItem("swap-subscriber-id")).remove();  

                  $('#agora_remote' + localStorage.getItem("swap-subscriber-id")).attr('id', 'agora_remote'+stream.getId());
                  let newStreamer = '<div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon d-none" data-attr="'+stream.getId()+'"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div>';
                  $('#agora_remote' + stream.getId()).html(newStreamer);
              } else {
                  $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon d-none" data-attr="'+stream.getId()+'"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');
              }
              
              //$('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>');  
              //$('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6 newcss popup-removed"><div id="'+stream.getId()+'" class="video-holder position-relative"><div class="eject-popup"><button type="button" class="close-model-btn close float-left" onclick="zoomVideo(\''+stream.getId()+'\')">&times;</button><a href="#" class="eject-this eject-session" id="">Eject from Session <img src="images/eject.png" /></a></div><div class="zoom-box"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div><span class="hand-icon position-absolute hand d-none" onclick="onclickhandRaise(\''+stream.getId()+'\')"></span><span class="microphone-icon position-absolute d-none" id="audion_on'+stream.getId()+'"  onclick="onclickaudioOn(\''+stream.getId()+'\')"></span><small class="click-zoom d-none" onclick="zoomVideo(\''+stream.getId()+'\')"><i class="fa fa-search-plus" aria-hidden="true"></i></small><div class="col-lg-8 col-12 col-sm-12"><div class="kick-out"><div class="row"><div class="col-lg-8 col-sm-12"><span>Kicking out</span><span>Sarah P from the session. Are you sure?</span></div> <div class="col-lg-4 col-sm-12 d-flex justify-content-between align-items-center"><a href="#" class="btn py-3 px-4 rounded btn-primary">YES</a><a href="#" class="btn py-3 px-4 btn-outline-secondary rounded">NO</a></div>  </div></div></div><div class="heart-rate-icon"><img src="images/red-heart.png" /><span class="heart-icon" data-attr="'+stream.getId()+'">80</span></div><div class="att-details"><marquee behavior="slide"><span class="att-name welcome-title">'+getNameById(stream.getId())+'</span></marquee><div class="vid-icons"  data-attr="'+stream.getId()+'" ><span class="icon-appearance d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-appearance4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-aroma4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate1 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate2 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate3 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-palate4 d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-like d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-dislike d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-easy d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-too-hard d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-perfect d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-awesome d-none"  data-attr="'+stream.getId()+'"></span><span class="icon-score d-none"  data-attr="'+stream.getId()+'"></span></div></div></div><div class="guest-video-footer"><div class="conversations"><a href="#"><img src="images/private-conversation.png" />Public Conversation</a><a href="#"><img src="images/private-conversation.png" />Private Conversation</a><a href="#" class="float-right mr-0">Emotions <img class="ml-3" src="images/quote-circular-button.png" /></a></div></div></div></div>').insertAfter("#"+prevDivId);
              
          }

          localStorage.setItem("swap-subscriber-id", '');
        }

        if ($('#subscribers-list #agora_remote'+stream.getId()).length === 1) {
          console.log('i am in streamer----');
          stream.play('agora_remote_vdo' + stream.getId(), {muted:true});


          switchVideoSize();

          //checkMuteUnmute(stream.getId());
        }

        addUserAttribute(stream.getId(), 'subscribeTime', (new Date()).getTime());
        addUserAttribute(stream.getId(), 'isSubscribe', 1);

        removeAudienceInList(stream.getId())

        $('#subscribers-list #agora_remote'+stream.getId()).removeClass('d-none');

        // onPageResize();

        let ref = setInterval(function(){
          if($('#subscribers-list #agora_remote'+stream.getId()).hasClass('d-none') == false){
            onPageResize();
            clearInterval(ref);
          }
        }, 10);
        countCurrentSubscribers();
        //}, 1000);
      } else {
          let subscribeUserId = getUserDataFromList(stream.getId(), 'userType');
          if(1 == subscribeUserId){

            if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
              
              $('#agora_host').append('<div id="agora_remote'+stream.getId()+'"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div></div>');

            }
            stream.play('agora_remote_vdo' + stream.getId());

            if(checkUserRole() == 1){

              massages="1000" + sep + storeData.id;
              sendMessage(storeData.sessionData.hostEmail, massages);
            }

            // checkMuteUnmute(stream.getId());
          } else {
            // totalBrodcaster++;
            // console.log(' @@@@@@ totalBrodcaster++ ', totalBrodcaster);
            
            if(stream.hasVideo())
              stream.muteVideo();
            
            if(stream.hasAudio())
              stream.muteAudio();
          }
        // for attendy user
        console.log(' @@@@@@@@@@@@ ', storeData.sessionData.id, stream.getId());
      }
     
    });

    client.on('stream-removed', function (evt) {
      
      var storeData = getCurrentUserData();
      var stream = evt.stream;
      
      console.log('Peer leave = stream removed');
      console.log('Peer leave = isPlaying', stream.isPlaying);
      console.log('Peer leave = getId()', stream.getId());

      if (stream.isPlaying === true) {
          console.log('stream stopped===', stream.getId());
          stream.stop();
      }

      // check user role and decrease number
      if(getUserDataFromList(stream.getId(), 'userType') == 2){
        if(totalBrodcaster > 0){
          totalBrodcaster--;
          // remove id when unpublished
          // currentPublishedUser.splice(currentPublishedUser.indexOf(stream.getId()), 1); 
        }
        // remove from audience list
        removeAudienceInList(stream.getId())
      }

      addUserAttribute(stream.getId(), 'subscribeTime', (new Date()).getTime());
      addUserAttribute(stream.getId(), 'isSubscribe', 0);
      
      if(storeData.userType == 1){
        // add stream after leaving current stream on hand raise event
        pushIntoSessionByHost();
        
        // switch user every specific time duration
        switchAudienceToBroadcaster();
      }

      //$('#agora_remote' + stream.getId()).remove();
      //$('#subscribers-list #agora_remote'+stream.getId()).find('.welcome-title').text('');

      //prev working
      /*localStorage.setItem("swap-subscriber-id", stream.getId());
      $('#agora_remote' + stream.getId()).find('.heart-rate-icon').remove();
      $('#agora_remote' + stream.getId()).find('.att-details').remove();
      $('#agora_remote' + stream.getId()).addClass('removeBroadcaster');*/
      
      //new code     
      if (localStorage.getItem("swap-subscriber-id") != null && localStorage.getItem("swap-subscriber-id") != '') {
          $('#agora_remote' + stream.getId()).find('.heart-rate-icon').remove();
          $('#agora_remote' + stream.getId()).find('.att-details').remove();
          $('#agora_remote' + stream.getId()).addClass('removeBroadcaster');
      } else {
          $('#agora_remote' + stream.getId()).remove();
      }


      countCurrentSubscribers();

      switchVideoSize();
      
      console.log("Remote stream is removed " + stream.getId());
    });

    client.on('peer-leave', function (evt) {
      console.log('Peer leave = ', evt)
      var stream = evt.stream;
      if (stream) {

        console.log('Peer leave = isPlaying', stream.isPlaying);
        console.log('Peer leave = getId()', stream.getId());

        if (stream.isPlaying === true) {
            stream.stop();
        }
        
        $('#online-users').text(parseInt($('#online-users').text())-1);

        removeUserAttribute(stream.getId(), 'subscribeTime');
        removeUserAttribute(stream.getId(), 'isSubscribe');
        
        $('#agora_remote' + stream.getId()).remove();
        localStorage.removeItem("swap-subscriber-id");

        switchVideoSize();
        console.log(evt.uid + " leaved from this channel");

        if(storeData.userType == 1){
          // // add stream after leaving current stream on hand raise event
          // pushIntoSessionByHost();
          // switch user every specific time duration
          switchAudienceToBroadcaster();
        }
      }
    });

    client.on('mute-audio', function (evt) {
      console.log('audio muted for user-----', evt.uid);
      if ($('#subscribers-list #agora_remote'+evt.uid).length > 0){
        $('#subscribers-list #agora_remote'+evt.uid).find('.hand').addClass('d-none')
      }
    });

    client.on('unmute-audio', function (evt) {
      console.log('audio un-muted for user-----', evt.uid);
      if ($('#subscribers-list #agora_remote'+evt.uid).length > 0){
        //$('#subscribers-list #agora_remote'+evt.uid).find('.hand').removeClass('d-none')
      }      
    });

    /* client.on('active-speaker', function(evt) {
        console.log('audio active speaker for user-----', evt.uid);
        var uid = evt.uid;
        console.log("update active speaker: client " + uid);
    });

    client.on('peer-online', function(evt) {
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
      changedRole = evt.role;
      // var stream = evt.stream;
      // if (stream) {

      //   console.log(evt.uid + "===> role changed");
      // }
    });

    client.on("peer-online", function (evt) {
      console.log('peer-online = ', evt)
      // var stream = evt.stream;
      // if (stream) {
      //   console.log(evt.uid + " ===> peer online");
      // }
    });

  }

  function countCurrentSubscribers()
  {
    $("#joined_users").html($('.video-holder').length)
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
      
      /*$(this).removeClass('col-md-6')
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
        .removeClass('mx-auto');*/

      $(this).removeClass('col-md-6 col-md-4 one two three four five ol-lg-8 col-md-4 col-lg-6 col-lg-5 col-lg-4 col-lg-3 col-sm-6 col-sm-4 col-sm-3 col-6 col-12 mx-auto');

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
//  function demo(){
//   let message = "206"+sep+"130";
//  // let channelName1='arjun.rishi@virdio.co'
//   console.log('--------newhtt-----------------',channelName1)
//   sendMessageToChannel(channelName1, message);
//  }
  //var currentSession = getCurrentSession(); 
  var newclient; 
  var channel;
  var channelName1;
  
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
    console.log('newclient , channel =========== ', newclient , channel)
    if(newclient == undefined || channel == undefined){

     
      newclient = AgoraRTM.createInstance(appId1);
      newclient.login({ token: token, uid: peer }).then(() => {

            // Create channel
            channel = newclient.createChannel(channelName1);

            channel.join().then(() => {


              console.log('***********AgoraRTMlalit***********');

            // after join channel send join channel message to host
            joinChannel();          

            console.log('************channeljoined111111**********');

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

                if (storeData.userType == 1) {
                  let onlineUserCount = 0;

                  if (membersList.length > 0) {
                      for(let i= 0; i < membersList.length; i++){
                        console.log('membersList[i]', membersList[i]);
                        if(getUserDataFromList(convertEmailToId(membersList[i]), 'userType') == 2){
                          onlineUserCount++;
                        }
                      }
                  }
                  
                  $('#online-users').text(onlineUserCount);
                }
              }).catch(error => {
                displayError(error);
                console.log('**********shiv*********There Is a problem to join a channel**********');
              });

              // channel log
              channel.on('MemberJoined', memberId => { 

                console.log('------------memberjoineddeepak-------',memberId);
               
                var massages="208"+sep+memberId+sep+"joined"+sep;        
                channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);

                console.log('------------memberafterjoineddeepak-------',memberId);

                // get online members list
                channel.getMembers().then(membersList => {
                  console.log('membersList after member joined', membersList)

                  if (storeData.userType == 1) {
                    let onlineUserCount = 0;

                    if (membersList.length > 0) {
                        for(let i= 0; i < membersList.length; i++){
                          console.log('membersList[i]', membersList[i]);
                          if(getUserDataFromList(convertEmailToId(membersList[i]), 'userType') == 2){
                            onlineUserCount++;
                          }
                        }
                    }
                    
                    $('#online-users').text(onlineUserCount);
                  }
                }).catch(error => {
                  console.log('******************There Is a problem to get channel members**********', error);
                });
              })
           
              channel.on('MemberLeft', memberId => { 
console.log('rtm remove====', memberId);
                //removeFromRtmOrder(memberId);
          
                // get online members list
                channel.getMembers().then(membersList => {
                  console.log('membersList after member joined', membersList)

                  if (storeData.userType == 1) {
                    let onlineUserCount = 0;

                    if (membersList.length > 0) {
                        for(let i= 0; i < membersList.length; i++){
                          console.log('membersList[i]', membersList[i]);
                          if(getUserDataFromList(convertEmailToId(membersList[i]), 'userType') == 2){
                            onlineUserCount++;
                          }
                        }
                    }
                    
                    $('#online-users').text(onlineUserCount);
                  }
                }).catch(error => {
                  console.log('******************There Is a problem to get channel members**********', error);
                });

                var massages="208"+sep+memberId+sep+"left"+sep;  
                channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
              })
           
              channel.on('ChannelMessage', (message, senderId) => {         
                var msg=message.text;
                // msg = JSON.parse(msg);
                          console.log('------channelMsgHandler---------',msg,senderId,storeData.userType)   
                channelMsgHandler(msg,senderId,storeData.userType);
              });
       
            }).catch(error => {
              displayError(error);
              console.log('**********shiv*********There Is a problem to join a channel**********');
            });

            // channel log
            // channel.on('MemberJoined', memberId => { 
             
            //   var massages="208"+sep+memberId+sep+"joined"+sep;        
            //   channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"Joined"}), storeData.userType);
            // })
         
            // channel.on('MemberLeft', memberId => { 
        
            //   var massages="208"+sep+memberId+sep+"left"+sep;  
            //   channelSignalHandler(JSON.stringify({code:"208",member:memberId, message:massages,msgtype:"left"}), storeData.userType);
            // })
         
            // channel.on('ChannelMessage', (message, senderId) => {         
            //   var msg=message.text;
            //   // msg = JSON.parse(msg);
            //   console.log('--------emojies-----------',msg,storeData.userType);             
            //   channelMsgHandler(msg,senderId,storeData.userType);
            // });

            newclient.on('ConnectionStateChanged', (newState, reason) => {//alert('state=='+newState+"==reason=="+reason);
                console.log('on connection state changed to ' + newState + ' reason: ' + reason);

                if ((newState == 'ABORTED' || newState == 'DISCONNECTED') && (reason == 'LOGIN_TIMEOUT' || reason == 'INTERRUPTED' || reason == 'REMOTE_LOGIN')) {
                    
                    console.log('connection state changed. Trying to reconnect');

                    newclient.logout();

                    newclient.login({ token: token, uid: peer }).then(() => {
                        
                        // Create channel
                        channel = newclient.createChannel(channelName1);
                        console.log('rtm channel instance==', channel);
                        channel.join().then(() => {
                            //@todo
                        });
                    });
                }
            });

            newclient.on('MessageFromPeer', (message, peerId) => { 
              console.log('********vvvvvvvvvvvvv********',message.text,'********************',peerId);
              // console.log("message "+ message.text + " peerId" + peerId);

              signalHandler(peerId, message.text, storeData.userType);
            });

        }).catch(err => {
          displayError(err);
          console.log('---------------bbbbbbbb-----client is not logedin-----');
        });
      } else {
       
        channel.getMembers().then(membersList => {    
          console.log('------------membersListlalit-------',membersList);  

          if (storeData.userType == 1) {
            let onlineUserCount = 0;

            if (membersList.length > 0) {
                for(let i= 0; i < membersList.length; i++){
                  console.log('membersList[i]', membersList[i]);
                  if(getUserDataFromList(convertEmailToId(membersList[i]), 'userType') == 2){
                    onlineUserCount++;
                  }
                }
            }
            
            $('#online-users').text(onlineUserCount);
          }

          channelSignalHandler(JSON.stringify({code:"208",member:membersList.length, totalmember:membersList, msgtype:"totalcount"}), storeData.userType);
        
        }).catch(error => {
          displayError(error);
           console.log('*************There is an errorkkkkkkkkkk******');
        });
        }
  
      }

      function leave_channel() {
        console.log('============= channel leave ============');
        if(channel)
          channel.leave();
       }


      function sendMessage(peerId, text)
      {
          console.log("sendPeerMessage", text, peerId);
          newclient.sendMessageToPeer({text}, peerId).then(sendResult => {
            console.log('sendResult---', sendResult, peerId);
            if (sendResult.hasPeerReceived) {
                /* Your code for handling the event that the remote user receives the message. */

                console.log('retryCounter====', retryCounter, peerId);

                retryCounter = 0;
            } else {
                /* Your code for handling the event that the message is received by the server but the remote user cannot be reached. */
                
                console.log('retryCounter====', retryCounter, peerId);                
                if (retryCounter <= 3) {
                    retryCounter++;

                    setTimeout(function(){
                        sendMessage(peerId, text);
                    }, 500);
                } else {
                    console.log('retryCounter====limit exceeded', retryCounter, peerId);
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
          console.log('---------------','mssages send successfully on channel', channelName1, text);
          channel.sendMessage({text},channelName1).then(() => {
              console.log('---------------','mssages send successfully on channel');
              retryCounter = 0;
          }).catch(error => {
            console.log('channel message failed----', error);

            if (retryCounter <= 3) {
                retryCounter++;

                setTimeout(function(){
                    sendMessageToChannel(channelName1, text);
                }, 500);
            } else {
                console.log('retryCounter====limit exceeded', retryCounter);
                retryCounter = 0;
            }
          });
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
          if(i >= 0 && value == 2)
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
    $('#subscribers-list #agora_hand_raise'+receiverId).addClass("d-none");
    $('#subscribers-list #audion_on'+receiverId).removeClass("d-none");
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
    if(storeData.userType == 2){

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

    setTimeout(function(){ console.log('%%%%%%%%%%%%%%%%%%%%');}, 1000);

    console.log(' @@@@@@@ totalBrodcaster @@@@@@@ ', totalBrodcaster, storeData.default.maxUserLimit);
    let checkUserTime = false;
    let isUserExists = false;

    if(storeData.userType == 2){
console.log('checuser-----');
      // check time duration to be first screen users 
      /*let sessionTime = localStorage.getItem("pre-session-time");
      console.log('sessionTime sessionTime', sessionTime);
      if(sessionTime != null){
        sessionTime = JSON.parse(sessionTime);
        // console.log('sessionTime sessionTime ====', (sessionTime.joinTime - sessionTime.startTime));
        if((sessionTime.joinTime - sessionTime.startTime)/1000 <= storeData.default.maxJoinDuration ){
          checkUserTime = true;
        }
      }*/

      // check user exists in list of first order
      isUserExists = checkUserInOrder(storeData);
      if(isUserExists && totalBrodcaster < parseInt(storeData.default.maxUserLimit)){
        checkUserTime = true;
      }
    }
    console.log('checkUserTime , isUserExists', checkUserTime , isUserExists)    

    // host publish their stream always. check for particiepant
    if(storeData.userType == 1  || (storeData.userType == 2 && checkUserTime && isUserExists && totalBrodcaster < parseInt(storeData.default.maxUserLimit)) ) {
        
      client.publish(localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      client.on('stream-published', function (evt) {
        console.log('client ============', client);
        if(storeData.userType == 2){
          $('#strm-unpublish').removeClass('d-none');
          $('#strm-publish').addClass('d-none');
        }

      });
    }
  }

  function unpublish() {
    console.log('============unpublish stream=====', localStream)
    if(localStream != undefined){

      client.unpublish(localStream, function (err) {
          console.log("Unpublish local stream failed == " + err);
      });

    }
  }

  function checkUserInOrder(storeData){

    let userList = getOrderUser();
    console.log('rtm userListuserList====', userList);
    if(userList == '' || userList == null) return false;

    // let counter = userList.length >= storeData.default.maxUserLimit ? storeData.default.maxUserLimit : userList.length;
    let ctr = 0;
    for(let i=0; i < userList.length; i++){
console.log('rtm order======', userList[i].id);
      if(getUserDataFromList(userList[i].id, 'userType') == 2){

        if(ctr < storeData.default.maxUserLimit && convertEmailToId(userList[i].id) == storeData.id){
          return true;
        }
        ctr++;
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

  function networkBandwidth() {

    var localClient = '';
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

    let counter = 0;
    let k = -1;
    let j = 1;
    var networkRef = setInterval(function(){  

      if(counter >= 3000){

        localClient.getTransportStats((stats) => {
            console.log(`Current Transport RTT: ${stats.RTT}`);
            console.log(`Current Network Type: ${stats.networkType}`);
            console.log(`Current Transport OutgoingAvailableBandwidth: ${stats.OutgoingAvailableBandwidth}`);
            
            if(stats.OutgoingAvailableBandwidth != undefined && stats.OutgoingAvailableBandwidth > 0){

              clearInterval(networkRef);

              localClient.leave(function () {

                if($('.fill-wifi.waveStrength-3').length > 0){
                  $('.fill-wifi').removeClass('waveStrength-3');
                }
                $('.fill-wifi').addClass('waveStrength-4');

                console.log("Leavel channel successfully");
              }, function (err) {
                console.log("Leave channel failed");
              });
            }
        });
      } else {

        k = k > 4 ? 0 : k ;
        k++;
        console.log('kkkkkkkkkkkkkk', k);
        if($('.fill-wifi.waveStrength-'+(k-1)).length > 0){
          $('.fill-wifi').removeClass('waveStrength-'+(k-1));
        }
        $('.fill-wifi').addClass('waveStrength-'+k);
      } 

      counter += 100;   
          
    }, 100);   
    
  }

  function raiseHand(){
      localStream.unmuteAudio(); 
  }

  function downHand(){
      localStream.muteAudio();  
  }
  
  var checkMicStream = function(micId){

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

  var stream1 = [];
  var stream2 = null;

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

          // $('#set-default').prop('checked', true);

        } else {
          console.log('something went wrong')
          return false;
        }

      }
      $('#video-media-content').html('')
      
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

          // if(microphoneId == null) {
          //   if(ctr1 == 0)
          //     defaultSetting = 'checked';
          // } else {
          //   if(microphoneId == deviceId) {
          //       defaultSetting = 'checked';
          //   }
          // }
          // console.log('---------- microphoneId == deviceId - ', microphoneId, deviceId, ctr1)

          // ++ctr1;

          // adoMediaHtml = '<div class="" id="ado-'+deviceId+'"><input class="form-radio" type="radio" name="audio-type" id="lbl-'+deviceId+'" value="'+deviceId+'" '+ defaultSetting +'> <label for="lbl-'+deviceId+'"> '+ cropDeviceName(device.label) +'</label> </div>';

          // $('#audio-media-content').append(adoMediaHtml)

          // if(defaultSetting == 'checked'){
          //   // console.log('current =============', deviceId)
          //   checkMicStream(deviceId);
          // }
        } else if (device.kind === 'videoinput') {
          
          if(cameraId == deviceId) {
              defaultSetting = 'checked';
          }
          
          vdoMediaHtml = '<div class="col-md-3 mx-auto" id="vdo-'+deviceId+'"><div id="local-media-'+deviceId+'" ></div><div class="check-camera"><input type="radio" class="form-radio" name="video-type" id="lbl-'+deviceId+'" value="'+deviceId+'" '+ defaultSetting +'><label for="lbl-'+deviceId+'"> '+ cropDeviceName(device.label) +'</label></div></div>';

          $('#video-media-content').append(vdoMediaHtml)

          d[l] = deviceId;
          stream1[l] = AgoraRTC.createStream({
              streamID: Math.floor(Math.random()*1000000),
              // Set audio to true if testing the microphone.
              video: true,
              audio: false,
              cameraId: d[l],
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

  function cropDeviceName(str){
    // if(str.indexOf('(') !== -1){
      str = str.replace(/\(.*\)/i,'');
      str = str.replace(/\s+/i,' ')
    // }
    return str;
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

    $(".host-script-section").height("40%");
    $(".host-section").css({"min-width": "30%", "max-width": "30%"});

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

    return false;
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
    $(".fitness-guest .swiper-slide img.arrow-image").attr("src", "images/arrow-right.png").addClass("mobile-arrow");
  }
  else {
    $(".fitness-guest .swiper-slide img.arrow-image").attr("src", "images/arrow-img.png").removeClass("mobile-arrow");
  }
}

  function onPageResize(){

    let leftHeight = $(".right-sidebar").height();
    

    let winHeight = $( window ).height();
    let headerHeight = $(".header.bg-gray").height();
    let hostHeight = $(".host-script-section").height();
    let sectionHeights = winHeight - (hostHeight + headerHeight);

   
      if ($(window).width() > 1500) {
        $(".script-info .carousel-inner.guest-left-wine").css("max-height", `${winHeight - 350}px`);
      }
      else{
        $(".script-info .carousel-inner.guest-left-wine").css("max-height", `${winHeight - 270}px`);
      }
  
    
    // $(".guest-left-wine").css("max-height", "leftHeight");
    // let guestLeftWine = $(".script-info .carousel-inner.guest-left-wine").height();
    // $(".joined-member-list").css({"max-height": `${guestLeftWine}px`, "height": guestLeftWine});

    $("#subscribers-list").height(`${sectionHeights - 115}px`);
    $(".section.attendees").css("margin-top", `${headerHeight+40}px`);
    
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
      if($(".add-remove-round").hasClass("top-rounded") && $(".script-section").hasClass("d-none")){
               
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
    //localStorage.removeItem("u-subscriber-id");
    localStorage.removeItem("swap-subscriber-id");
  }

  function sessionTimer(){
    
    let storeData = getCurrentUserData();
    
    let countdown = storeData.sessionData.duration * 60;
    //let countdown = 1 * 60;
    $('.header svg circle').attr("style","animation-duration:"+countdown+"s !important");
    // console.log('countdown ======= countdown start ----', countdown)
    
    var resetCount1 = setInterval(function() {
      if(countdown <= 0){
        // console.log('=========== **********', countdown)
        $('.header svg circle').removeAttr("style");
        clearInterval(resetCount1);
      }
      countdown--;
    }, 1000);
   
  }
  

  function convertUnixTimestamp(t){
  var dt = new Date(t*1000);
  let date = dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear();
  let time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()+'.'+dt.getMilliseconds();
  let dateTime = date+' '+time;
  return dateTime;  
  }

function signalHandler(uid, signalData, userType) {


  let resultant=signalData.split(sep);
     
  let nlocalDta= JSON.parse(localStorage.getItem("userData"));

  if(userType == 1) { // Host

    if(resultant[0] == '201'){

      $('#agora_remote'+ convertEmailToId(uid) + ' .hand-icon').removeClass("d-none");
      $('#errmsg').html('Client HandRaise');
      setTimeout(function(){ $('#errmsg').html(''); }, 10000);

      $('#selected-participent-id').val( convertEmailToId(uid) );
      $('#subscribers-list #agora_remote'+convertEmailToId(uid)).find('video').addClass('video-selected');
      $('#subscribers-list #agora_remote'+convertEmailToId(uid)).find(".click-zoom").addClass("d-block").removeClass("d-none");

    } else if(signalData.code == '100') {
       $('#errmsg').html(signalData.message);
       setTimeout(function(){ $('#errmsg').html(''); }, 10000);
      // $('#agora_hand_raise'+uid).removeClass("d-none");
      
    } else if(resultant[0] == "1000"){
        // update participent stream join channel
        // add as a audience
        console.log('uid============1000', uid)
        addUserAttribute(convertEmailToId(uid), 'subscribeTime', (new Date()).getTime());
        addUserAttribute(convertEmailToId(uid), 'isSubscribe', 0);
      
      } else if(resultant[0] == "1001"){
        // audience only raise hand by participant
        addAudienceInList(resultant);
      }
      else if(resultant[0] == '216')
      {
       
        let joinDateTime = convertUnixTimestamp(resultant[1]);
     
        let message="Hi " +nlocalDta.firstName+ ", this is "  + getUserDataFromList(uid, 'firstName') + ", welcome to your 1st virtual session with us  ";
        
        //$('#newmsg').html(message);
       // setTimeout(function(){ $('#newmsg').html(''); }, 10000);
       addRtmJoinOrder(uid, resultant[1]);
      } else if(resultant[0] == '211') {   
        
        playSlider();
      // $(" #play-slider").trigger('click');
      
        // if(!isPaused)
        // {
        //   console.log('------------ispaused=false--------------')
        //   isPaused = false;
        // $(".start span a").trigger('click');
        // //$("#ftnsStart").trigger('click');

        // let storeData = getCurrentUserData();
     
        // let ftnsStartCode=storeData.rtm.ftnsStart.code;                  
        // messages=ftnsStartCode+sep;        
        // sendMessageToChannel(channelName1,messages);
        // }else{
        //   console.log('------------ispaused=true--------------')
        //   isPaused = false;
        //   $(".start span a").trigger('click');
        //   //$("#ftnsStart").trigger('click');

        //   let storeData = getCurrentUserData();
     
        //   let ftnsResumeCode=storeData.rtm.ftnsResume.code;                  
        //   messages=ftnsResumeCode+sep;        
        //   sendMessageToChannel(channelName1,messages);

        // }

      }
      else if(resultant[0] == '212') {        
        $("#stop-slider").trigger('click');

        // let storeData2 = getCurrentUserData();
     
        // let ftnsStopCode=storeData2.rtm.ftnsStop.code;                  
        // messages=ftnsStopCode+sep;        
        // sendMessageToChannel(channelName1,messages);

      }else if(resultant[0] == '213') { 
        pauseSlider();       
        //$("#pause-slider").trigger('click');

      }else if(resultant[0] == "214")
      {
        $(".carousel-control-next").trigger('click');

        let storeData3 = getCurrentUserData();
     
        let WinsNextCode=storeData3.rtm.WinsNext.code; 
        let WinsNextCounter=$('.carousel-item.active .fitness-counter1').text();
        WinsNextCounte=WinsNextCounter+1;
        console.log('---------WinsNextCounter---------',WinsNextCounter,WinsNextCode);               
        messages=WinsNextCode+sep+WinsNextCounter;                         
        sendMessageToChannel(channelName1,messages);
        
      }else if(resultant[0] == "215")
      {
        $(".carousel-control-prev").trigger('click');

        let storeData4 = getCurrentUserData();
     
        let WinsPrevCode=storeData4.rtm.WinsPrev.code; 
        let WinsPrevCounter=$('.carousel-item.active .fitness-counter1').text();
        WinsPrevCounter=WinsPrevCounter-1;                 
        messages=WinsPrevCode+sep+WinsPrevCounter;        
        sendMessageToChannel(channelName1,messages);
                
      } 
      else if(resultant[0] == "224")
      {

        $("#partlist").trigger('click');

      }
      else if(resultant[0] == "227")
      {

        // $("#subscribers-list .video-holder:eq(0)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(0)").attr('id');
        console.log('=====================rtmAction',scrnId)
        rtmAction(scrnId);
           
      }
      else if(resultant[0] == "228")
      {
      
        // $("#subscribers-list .video-holder:eq(1)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(1)").attr('id');
        rtmAction(scrnId);
            
      }else if(resultant[0] == "229")
      {

        // $("#subscribers-list .video-holder:eq(2)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(2)").attr('id');
        rtmAction(scrnId);
            
      }
      else if(resultant[0] == "230")
      {

        // $("#subscribers-list .video-holder:eq(3)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(3)").attr('id');
        rtmAction(scrnId);    
      }
      else if(resultant[0] == "231")
      {

        // $("#subscribers-list .video-holder:eq(4)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(4)").attr('id');
        rtmAction(scrnId);
      }
      else if(resultant[0] == "232")
      {

        // $("#subscribers-list .video-holder:eq(5)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(5)").attr('id');
        rtmAction(scrnId);
            
      }
      else if(resultant[0] == "233")
      {
 
        // $("#subscribers-list .video-holder:eq(6)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(6)").attr('id');
        rtmAction(scrnId);
            
      }
      else if(resultant[0] == "234")
      {
       
        // $("#subscribers-list .video-holder:eq(7)").trigger('click');
        let scrnId = $("#subscribers-list .video-holder:eq(7)").attr('id');
        rtmAction(scrnId);
            
      }
      else if(resultant[0] == "235")
      {
        let newlocalstorageDta = getCurrentUserData();

        console.log('-------newlocalstorageDta-------------',newlocalstorageDta,newlocalstorageDta.id)

        checkMuteSelfAudio(newlocalstorageDta.id);           
      }else if(resultant[0] == "226")
      {
        console.log('---------226---------------')
        $("#fullscreen").trigger('click');
      }
      else if(resultant[0] == "223")
      {
        console.log('---------223---------------')
        $("#fitnesScript").trigger('click');
      }
      else if(resultant[0] == "239")
      {
        console.log('---------239---------------')
        $("#logout_button").trigger('click');
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
    // }else if(resultant[0] == '200') {    
    //   $('#hostmsg').html('Now You can Publish');
    //   setTimeout(function(){ $('#hostmsg').html(''); }, 10000);   
    }
    else if(resultant[0] == '216')
    {

      let joinDateTimeattendies = convertUnixTimestamp(resultant[1]);
      if(getUserDataFromList(uid, 'userType') == 1){

        let message="Hi " +nlocalDta.firstName+ ", this is "  + getUserDataFromList(uid, 'firstName') + ", welcome to your 1st virtual session with us  ";        
       
        $('#newmsg').html(message);
      }
     // setTimeout(function(){ $('#newmsg').html(''); }, 10000);
      addRtmJoinOrder(uid, resultant[1]);
    }

    else if(resultant[0] == '205')
    {
     
      $('#hostmsg').html('Eject');
      setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    }else if(resultant[0] == '209')
    {
   
      // $('#hostmsg').html('UnMute');
      // setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    // } else if(resultant[0] == '209') {
      
      // console.log('********ggggggggggggg************** signalData ', signalData.message); 
      unpublish();
      // $('#hostmsg').html('Now you are became a audience.');
      $('#mocrophone-on').removeClass('d-none');
      $('#mocrophone-off').addClass('d-none');
      // setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    

    } else if(resultant[0] == '200') {

      // console.log('********ggggggggggggg************** signalData ', signalData.message); 
      // $('#hostmsg').html('Now you are became a broadcaster.');
      // publish();
      publishAfterKick();
      $('#mocrophone-on').addClass('d-none');
      $('#mocrophone-off').removeClass('d-none');
      // setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
    }

  }

}

    function setBPMAtHost(senderId, signalData, userType)
    {
      //class="heart-icon" data-attr="'+stream.getId()+'"
        
        newSenderID=convertEmailToId(senderId);

        console.log('---------lalit206---------------',senderId,newSenderID,signalData);

        signalData  = signalData ? signalData : 80;
        
        $('.heart-rate-icon[data-attr=\''+newSenderID+'\']').removeClass('d-none');     
        $('.heart-icon[data-attr=\''+newSenderID+'\']').html(signalData);
     
    }
      

    function channelMsgHandler(msg,senderId, userType)
    {
      
      //console.log('********lalit3456************** signalData ', msg);

      let res1=msg.split(sep);
    
      if(res1[0] == "208")
      { 
      
        // if(userType == 2)
        // {
        addRtmJoinOrder(senderId, newDateFormat(res1[1]));
        let message="User "+senderId+" has joined on  "+ res1[1];
        //$('#newmsg').html(message);

        console.log('********Deepak************** signalData ', senderId);
        let rtmJoinOrder = JSON.parse(localStorage.getItem("rtm-join-order"));
        console.log('********Deepak************** signalData ', rtmJoinOrder);
        let localUserDta= JSON.parse(localStorage.getItem("userData"));

        rtmJoinOrder.forEach(ele => {

          if(ele.id == localUserDta.email )
          {
            
            if(ele.joinAt == '' && empty(ele.joinAt))
            {
              let ts = (new Date()).getTime();
              let text ="216"+sep+ts;
            }

            console.log('===jagatlocalUserDta----', localUserDta.userType);

            let text = '';

            if (localUserDta.userType == 1) {
                text ="216"+sep+ele.joinAt+sep+1;
            } else {
                text ="216"+sep+ele.joinAt+sep+0;
            }
            
            // console.log('-------------text=== ', text)
             sendMessage(senderId, text);
          }

        });

      }else if(res1[0] == "222")
      {
      //  $('#continue-join').removeAttr("disabled");
        let newmsg="Now U can Join";
        //$('#newmsg').html(newmsg);
        setTimeout(function(){ $('#newmsg').html(''); }, 10000);    
      }else if(res1[0] == "202")
      {
        console.log('********Deepak************** signalData ', msg,senderId, userType);
        if(userType =='1'){
          setEmojiesAtHost(res1[1],senderId,userType);
          }else{
            setEmojiesAtClient(res1[1],senderId,userType);
          }
      }else if(res1[0] == "211")
      {
        console.log('-------------------fitscript has Started-------------');
       // $('#hostFtnsScript').trigger('click');
        //$(".swiper-guest.swiper-slide.start.swiper-start span a").trigger('click');
        window.startSlider();

      }else if(res1[0] == "212")
      {
       // alert('fitscript has Stopped');
        console.log('-------------------fitscript has Stopped-------------');
      // $(".end span a").trigger('click');
     // guestfitnessScriptStop(res1[0]);
      $("#stop1-script").trigger('click');
      }else if(res1[0] == "213")
      {
       console.log('-----------guestfitnessscript-------------213---')
       guestfitnessscript(res1[0]);
      }else if(res1[0] == "404")
      {
       console.log('-----------guestfitnessscript-------------404---')
       guestfitnessscript(res1[0]);
      }else if(res1[0] == "214")
      {
        $(".carousel-control-next").trigger('click');
          //alert('Winsscript Next');
      }else if(res1[0] == "215")
      {
        $(".carousel-control-prev").trigger('click');
          //alert('Winsscript previous');
      }else if(res1[0] == "206")
      {
        console.log('---------206sssssssss---------------',senderId, res1[1], userType) 

        setBPMAtHost(senderId, res1[1], userType);
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
          $('.hand-raise-list .dropdown-menu').addClass('show');
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

      if(newAudienceList.length <= 0){

        // $('#dropdownMenuButton').click();
        $('#dropdownMenuButton').addClass('d-none');
        $('.hand-raise-list .dropdown-menu').removeClass('show')
      }
      
      localStorage.setItem("audience-list", JSON.stringify(newAudienceList));
    }
     
     function checkTime(timeDur){
        let tm = 0;
        let sec = Math.floor(timeDur / 1000);
        if(sec > 60){
          let min = Math.floor(sec / 60);
          if(min > 60){
            let hrs =  Math.floor(min / 60);
            tm = hrs + ' hrs '
          } else {
            tm = min + ' min '
          }
        } else {
          tm = sec + ' sec '
        }
        return tm;
     }

     function showHandAtHost(){
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        let audienceList = localStorage.getItem("audience-list");
        
        if(audienceList == null) return '';

        audienceList = JSON.parse(audienceList);
        console.log('audienceList', audienceList, audienceList.length)
        if(audienceList.length > 0){
          
          let list='';
          for(let i in audienceList){
            if($('#audience-'+audienceList[i].id).length != 0){
              $('#audience-'+audienceList[i].id).remove();
            }
              let timeDur = (new Date()).getTime() - audienceList[i].handRaisedAt;


              list += '<li id="audience-'+audienceList[i].id+'"><a class="dropdown-item media" href="javascript:;" onClick="changeUserToBroadcaster(\''+audienceList[i].id+'\')"><img src="images/avtar.png" /><div class="media-body"><span class="welcome-title">'+audienceList[i].firstName+', '+getUserDataFromList(audienceList[i].id, 'city')+'</span><span>'+checkTime(timeDur)+' ago</span></div></a></li>';          
          }
          $('#total-raised-hands').html(audienceList.length);
          $('#raised-list').append(list);
          $('#dropdownMenuButton').removeClass('d-none');
          $('.hand-raise-list .dropdown-menu').addClass('show');
        } else {
          $('#dropdownMenuButton').addClass('d-none');
          $('#raised-list').html('');
          $('#total-raised-hands').html(0);
          $('.hand-raise-list .dropdown-menu').removeClass('show');
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
      console.log('=========== dataObj', dataObj)
      let id = convertEmailToId(dataObj.id);
      let vdo = $('#subscribers-list #agora_remote'+ id + ' video' )[0];  
      console.log('subscribers-list video = ', vdo);
      let storeData = getCurrentUserData();

      // check current user in mute state
      if(vdo != undefined && vdo.muted){

        let selectedParticipentId = $('#selected-participent-id').val();
        console.log('selectedParticipentId , id', id, selectedParticipentId)
        if(id != selectedParticipentId){
          // rule = true;
        
          let broadcster = getAllBroadcster();
          if(broadcster.length > 0){
            
            for(let i in broadcster){
              console.log('========== check 30 sec', broadcster[i])
              if(broadcster[i].email == dataObj.id){
                console.log('========== check 30 sec in side', broadcster[i])

                let tm =  (new Date()).getTime() - parseInt(broadcster[i].subscribeTime);
                if((tm / 1000) >= storeData.default.switchDuration){
                  rule = true;
                }
              }
            }
          }
        }
      }

      return rule;
    }

    function kickUser(id) {
      
      localStorage.setItem("swap-subscriber-id", id);
console.log('swap-subscriber-id----', id);
      let text = "209"+sep+"kicked by host";
      console.log('############### text', text)
      sendMessage( convertIdToEmail(id), text);
    }

    function pullFromSessionByHost(limit){
      let storeData = getCurrentUserData();
      
      let userList = getOrderUser();

      console.log(' @@@@@@@ userList @@@ ', userList);
      
      if(userList == '') return false;

      let ctr = 0;
      for(let i=0; i < userList.length; i++){
        
        let id = convertEmailToId(userList[i].id);
        if( $('#subscribers-list #agora_remote'+id).length > 0 ){

          if(ctr < limit && checkKickRule(userList[i])){
            kickUser(id);
            if($('#to-broadcast').val().trim() != ''){
              removeAudienceInList($('#to-broadcast').val());
            }
          }
          ctr++;
        }
      }
    }
    function sendPushIntoSessionMessage(uid){
        let text = "200"+sep+" in session";
        sendMessage(convertIdToEmail(uid), text);
    }

    // switch maxlimit==============
    function switchMultipleUsersByHost(){
      // $('#switch-counter').val(1);
      let storeData = getCurrentUserData();

      let switchCounter = localStorage.getItem("switch-counter");

      switchCounter = switchCounter == null ? 0 : parseInt(switchCounter);
      for(let i = switchCounter * storeData.default.maxUserLimit; i < (switchCounter + 1) * storeData.default.maxUserLimit; i++){

      }
      localStorage.setItem("switch-counter",++switchCounter);
    }

    // switch users
    
    function switchUsers(){
      let storeData = getCurrentUserData();
      if(storeData.userType == 1){

        console.log('switchUsers ***************');
        var switchRef = setInterval( function(){
          switchBroadcasterToAudience();
        } , 1000 * storeData.default.switchDuration); 
      }
    }

    function switchBroadcasterToAudience(){

        let storeData = getCurrentUserData();

        // let audience = getAllAudience();
        let allUsers = getAllParticipent();
        console.log('alluserParticipent====', allUsers);
        let broadcster = getAllBroadcster();
        console.log('alluserBroadcaster====', broadcster);

        console.log('switchBroadcasterToAudience ***************', broadcster, allUsers);
        //if(broadcster.length > 0 && allUsers.length > broadcster.length && broadcster.length == storeData.default.maxUserLimit){
        if(broadcster.length > 0 && allUsers.length > broadcster.length){
          for(let i in broadcster){
            if(checkKickRule({id : broadcster[i].email})){
              console.log('checkKickRule ***************');
              kickUser(broadcster[i].id);
              // removeAudienceInList(broadcster[i].id);
              break;
            }
          }
        }
    }

    function switchAudienceToBroadcaster(){
      console.log('switchAudienceToBroadcaster ***************');
        let audience = getAllAudience();
        if(audience != null) {
            for(let i in audience){
              // if user already select from audience dropdown then not need to initialize
              if(audience[i].id != $('#to-broadcast').val().trim()){
                console.log('switchAudienceToBroadcaster ***************', audience);
                sendPushIntoSessionMessage(audience[i].id)
                break;
              }
            }
        }
    }

    function pushIntoSessionByHost(){
      let uid = '';

      setTimeout(function(){}, 1000);

      if($('#to-broadcast').length > 0 && $('#to-broadcast').val().trim() != ''){

        uid = $('#to-broadcast').val();
        sendPushIntoSessionMessage(uid);        

        $('#audience-'+uid).remove();
        $('#to-broadcast').val('');
        
        let len = parseInt($('#total-raised-hands').html());
        $('#total-raised-hands').html(len > 0 ? (len-1) : 0);
        if(len <= 0){
          $('#dropdownMenuButton').addClass('d-none');
          $('.hand-raise-list .dropdown-menu').removeClass('show');
        }
      }
    }



    function channelSignalHandler(signalData, userType) {

   // getAudienceList();
   // console.log('********guduorigin11111111111************** signalData ', signalData, userType);
    signalData = JSON.parse(signalData);
    if(signalData.code == '208'){
      if(userType =='1'){  
        console.log('********guduorigin99999999999999************** signalData ', signalData, userType);
          incrementcountAtHost(signalData,userType);        
      }else{
        console.log('********guduorigin333333333333************** signalData ', signalData, userType);
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


    function incrementcountOnStreming(signalData,type)      
    { 

      if(type == 'welcome'){          
      let atStremCount=$('#joined_users_at_client').html();
      
      atStremCount=parseInt(atStremCount);

      console.log('------------atStremCount----------------',atStremCount);

      atStremCount=atStremCount+1;
        if(atStremCount < 1)
        {
          atStremCount=0;
        }
       $('#joined_users_at_client').empty(); 

       console.log('------------atStremCount----------------',atStremCount);

       // $('#joined_users_at_client').html(atStremCount); 

       let localstoragedata = JSON.parse(localStorage.getItem('allloginuser'));
       let newmem=signalData;
     
       localstoragedata.push(newmem);
       localStorage.setItem("allloginuser", JSON.stringify(localstoragedata));
       let str=signalData.message;
       let res = str.split(sep);
       let storeData = getCurrentUserData();
        hostEmail=storeData.sessionData.hostEmail;

     let arrayToDispaly = JSON.parse(localStorage.getItem('allloginuser'));

     console.log('----------------------arrayToDispaly', arrayToDispaly,count4)

     $('#all_joined_member_list').html('');

     count4=0;
     arrayToDispaly.forEach(element => {
       
     console.log('---------------arrayToDispaly', element)

     memberID=convertEmailToId(element);

     let userName = getUserDataFromList(element, 'firstName');
        
     console.log('*******element*************** element ', element,'-----memberID-----',memberID);
    
     if(getUserDataFromList(memberID, 'userType') == 2){
       count4++;
       $('#all_joined_member_list').append('<div class="attendee-list"><img src="images/attendee.png" /><span class="title">'+userName+'</span><div class="vid-icons"> <span class="icon-appearance d-none"  id="emojies_app'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-appearance1 d-none"   data-attr="'+memberID+'"></span><span class="icon-appearance2 d-none"  data-attr="'+memberID+'"></span><span class="icon-appearance3 d-none"  data-attr="'+memberID+'"></span><span class="icon-appearance4 d-none"  data-attr="'+memberID+'"></span><span class="icon-aroma d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma1 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma2 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma3 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma4 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-palate d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate1 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate2 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate3 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate4 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-like d-none"  data-attr="'+memberID+'"></span><span class="icon-dislike d-none"  data-attr="'+memberID+'"></span><span class="icon-easy d-none"  data-attr="'+memberID+'"></span><span class="icon-too-hard d-none"  data-attr="'+memberID+'"></span><span class="icon-perfect d-none"  data-attr="'+memberID+'"></span><span class="icon-awesome d-none"  data-attr="'+memberID+'"></span><span class="icon-score d-none"  id="emojies_sc'+memberID+'"  data-attr="'+memberID+'"></span></div></div>');
       }
     }); 
     console.log('*******finalcountatattendies*************** element ', count4);
     if(count4 <= 0)
     {
       count4 = 0;
     }
     console.log('*******finalcountatattendies11*************** element ', count4);
       // $('#joined_users_at_client').empty(); 
       $('#joined_users_at_client').html(count4);


      }
    }

      function incrementcountAtAttendies(signalData,userType)
      {

        let count3=$('#joined_users_at_client').html();
      
        count3=parseInt(count3);
        var arr;
        
      if(signalData.msgtype=='Joined')
      { 
     
        let localstoragedata = JSON.parse(localStorage.getItem('allloginuser'));
        let newmem=signalData.member;
      
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
        //console.log('*******totallist5555555*************** signalData ',count3);

      count4=count3+1;
             
        //console.log('*******totallist666666*************** signalData ',count4); 

     
      }else if(signalData.msgtype=='left') {

        console.log('*******totallist444444*************** signalData ',signalData,'----mmm----', count3);

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

       // console.log('*******totallist333333333*************** signalData ',count3); 


     count4=count3-1;
        
          
      }else if(signalData.msgtype=='totalcount') {

        //console.log('*******totallist555555*************** signalData ', count3);

                   
         arr=signalData.totalmember;  
         localStorage.setItem("allloginuser", JSON.stringify(signalData.totalmember));            
        //console.log('*******totallist2222233333*************** signalData ', signalData);
        count4=signalData.member;
        if(signalData.totalmember !=''){
          signalData.totalmember.forEach(ele => {

          memID=convertEmailToId(ele);

          if(getUserDataFromList(memID, 'userType') == 1)
          {
            
            count4=parseInt(count4);
            count4=count4-1;
          }else{
           
            count4=parseInt(count4);
          }

        }); 
      }
        count4=count4;
    
       console.log('*******totallist*************** signalData ', count4);
       //arr.shift();
   
      }

      let storeData = getCurrentUserData();    
        hostEmail=storeData.sessionData.hostEmail;

      let arrayToDispaly = JSON.parse(localStorage.getItem('allloginuser'));
      
      console.log('----------------------arrayToDispaly', arrayToDispaly,count4)

      $('#all_joined_member_list').html('');

      count4=0;
      arrayToDispaly = getUniqueData(arrayToDispaly);
      console.log('----------------------uniquearrayToDispaly', arrayToDispaly);

      arrayToDispaly.forEach(element => {

      console.log('---------------arrayToDispaly', element)
      memberID=convertEmailToId(element);

      let userName = getUserDataFromList(element, 'firstName');
         
      console.log('*******element*************** element ', element,'-----memberID-----',memberID);
     
      if(getUserDataFromList(memberID, 'userType') == 2){
        count4++;
        $('#all_joined_member_list').append('<div class="attendee-list"><img src="images/attendee.png" /><span class="title">'+userName+'</span><div class="vid-icons"> <span class="icon-appearance d-none"  id="emojies_app'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-appearance1 d-none"   data-attr="'+memberID+'"></span><span class="icon-appearance2 d-none"  data-attr="'+memberID+'"></span><span class="icon-appearance3 d-none"  data-attr="'+memberID+'"></span><span class="icon-appearance4 d-none"  data-attr="'+memberID+'"></span><span class="icon-aroma d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma1 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma2 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma3 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-aroma4 d-none" id="emojies_ar'+memberID+'" data-attr="'+memberID+'"></span><span class="icon-palate d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate1 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate2 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate3 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-palate4 d-none"  id="emojies_pal'+memberID+'"  data-attr="'+memberID+'"></span><span class="icon-like d-none"  data-attr="'+memberID+'"></span><span class="icon-dislike d-none"  data-attr="'+memberID+'"></span><span class="icon-easy d-none"  data-attr="'+memberID+'"></span><span class="icon-too-hard d-none"  data-attr="'+memberID+'"></span><span class="icon-perfect d-none"  data-attr="'+memberID+'"></span><span class="icon-awesome d-none"  data-attr="'+memberID+'"></span><span class="icon-score d-none"  id="emojies_sc'+memberID+'"  data-attr="'+memberID+'"></span></div></div>');
        }
      }); 
      console.log('*******finalcountatattendies*************** element ', count4);
      if(count4 <= 0)
      {
        count4 = 0;
      }
      console.log('*******finalcountatattendies11*************** element ', count4);
        // $('#joined_users_at_client').empty(); 
        $('#joined_users_at_client').html(count4); 
    
      }

      function getUniqueData(arrList) {
          var final = [];
          $.each(arrList, function (i, e) {
              if ($.inArray(e, final) == -1) final.push(e);
          });
          
          return final;
      }

      function incrementcountOnHosttreming(signalData,type)      
      { 

        if(type == 'welcome'){          
        let hoststrecount=$('#joined_users').html();
        
        hoststrecount=parseInt(hoststrecount);

      //  console.log('------------hoststrecount----------------',hoststrecount);

        hoststrecount=hoststrecount+1;
          if(hoststrecount < 1)
          {
            hoststrecount=0;
          }
        // $('#joined_users').empty(); 

        // console.log('------------hoststrecount----------------',hoststrecount);

          //$('#joined_users').html(hoststrecount); 
        }
      }


      function incrementcountAtHost(signalData,userType)
      {  

       // console.log('********munmunHost222222222************** signalData ', signalData, userType);
        let count=$('#joined_users').html();

    //  console.log('********munmunHost************** signalData ', signalData,count);
        count=parseInt(count);

        let storeData = getCurrentUserData();
        let hostid=storeData.sessionData.hostId;
        let clientid=storeData.sessionData.id;
        let TypeOfUser=storeData.userType;
  

        if(TypeOfUser == 1)
        {
          $('#online_state').removeClass("online-status");        
          $('#online_state').addClass("online-status");
        }

      if(signalData.msgtype=='Joined')
      {     
       

        count1=count+1;

       
        //console.log('********guduHost111111111************** signalData ', signalData, count,count1);
              
           // $('#joined_users').empty(); 
           // $('#joined_users').html(count1);
       

      }else if(signalData.msgtype=='left') {

 
          count1=count-1; 

       // console.log('********virenHost111111111************** signalData ', signalData, count,count1);

       
      
            if(count1 <= 0)
            {
              count1 = 0;
            }       
           // $('#joined_users').empty(); 
           // $('#joined_users').html(count1);
        

      }else if(signalData.msgtype=='totalcount') {
        var arr=signalData.totalmember;
           //  console.log('---------alllist----------',arr)
        count1=signalData.member;
        count1=parseInt(count1); 
       
        count1=count1-1;
        

        if(count1 <= 0)
        {
          count1 = 0;
        }
     
         // $('#joined_users').empty(); 
        //  $('#joined_users').html(count1);
       
       }


      // addUserAttribute(convertEmailToId(memberId), 'currentStatus', 1);

       $('#online-user-row-'+convertEmailToId(signalData.member)).find('.user-status').attr('src', '/images/online.png');
       $('#online-user-row-'+convertEmailToId(signalData.member)).find('.user-online-status').html('online');
       let userList = getOrderUser()

       if(userList != ''){
         for(let j in userList){
           if(userList[j].id == signalData.member){

               $('#online-user-row-'+convertEmailToId(signalData.member)).attr('data-position', userList[j].joinAt );
               break;
           }
         }
       }
       function sort_li(a, b) {
         return parseInt($(b).attr('data-position')) < parseInt($(a).attr('data-position')) ? 1 : -1;
       }
       $('#online-user-list tr').sort(sort_li).appendTo('#online-user-list');

       console.log('memberId============', signalData.member)
       if(storeData.userType == 1){
         if( $('#joinee-' + convertEmailToId(signalData.member)).length == 0 ){
           removeFromFirst();
           $('#joiners').append('<span class="welcome-title" id="joinee-'+convertEmailToId(signalData.member)+'"><img src="'+getUserDataFromList(signalData.member, 'image')+'" />'+getUserDataFromList(signalData.member, 'firstName')+', '+getUserDataFromList(signalData.member, 'city')+'</span>');
           totalChannelMembers();
         }
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
       else if(signalData == "appearence1")
        {
        $('.icon-appearance1[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "appearence2")
        {
        $('.icon-appearance2[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }  else if(signalData == "appearence3")
        {
        $('.icon-appearance3[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "appearence4")
        {
        $('.icon-appearance4[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "aroma")
        {
          $('.icon-aroma[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "aroma1")
        {
          $('.icon-aroma1[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "aroma2")
        {
          $('.icon-aroma2[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "aroma3")
        {
          $('.icon-aroma3[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "aroma4")
        {
          $('.icon-aroma4[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate")
        {
          $('.icon-palate[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate1")
        {
          $('.icon-palate1[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate2")
        {
          $('.icon-palate2[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate3")
        {
          $('.icon-palate3[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate4")
        {
          $('.icon-palate4[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "score")
        {
          $('.icon-score[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "like")
        {
          console.log('********hostemojies************** signalData ', newSenderID)
          $('.icon-like[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "dislike")
        {
          console.log('********hostemojiesdislike************** signalData ', newSenderID)
          $('.icon-dislike[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "easy")
        {
          console.log('********hostemojieseasy************** signalData ', newSenderID)
          $('.icon-easy[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "too-hard")
        {
          console.log('********hostemojiestoo-hard************** signalData ', newSenderID)
          $('.icon-too-hard[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "perfect")
        {
          console.log('********hostemojiesperfect************** signalData ', newSenderID)
          $('.icon-perfect[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "awesome")
        {
          console.log('********hostemojiesawesome************** signalData ', newSenderID)
          $('.icon-awesome[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }

      
      }

      function setEmojiesAtClient(signalData,senderId,userType)
      {
        newSenderID=convertEmailToId(senderId);
     
        console.log('*******Emojiesdata22222************** signalData ',newSenderID, signalData,senderId,userType); 
        if(signalData == "appearence")
        {
          console.log('*******Emojiesnewdata************** signalData ',newSenderID, signalData,senderId,userType);
        $('#emojies_app'+newSenderID+'').removeClass("d-none");
       console.log('-------',$('.icon-appearance[data-attr=\''+newSenderID+'\']').length)
       // $('.icon-appearance[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "appearence1")
        {   
                  
       // $('#emojies_app1'+newSenderID+'').removeClass("d-none");      
        $('.icon-appearance1[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "appearence2")
        {  
          console.log('*******Emojiesdata33************** signalData ',newSenderID, signalData,senderId,userType);                   
        $('icon-appearance2[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "appearence3")
        {                  
        $('.icon-appearance3[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "appearence4")
        {          
      
        $('.icon-appearance4[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "aroma")
        {
          $('.icon-aroma[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        //  $('#emojies_ar'+newSenderID+'').removeClass("d-none");
        }else if(signalData == "aroma1")
        {
          $('.icon-aroma1[data-attr=\''+newSenderID+'\']').removeClass("d-none");

        } else if(signalData == "aroma2")
        {
          $('.icon-aroma2[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        } else if(signalData == "aroma3")
        {
          $('.icon-aroma3[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        } else if(signalData == "aroma4")
        {
          $('.icon-aroma4[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        } 
        else if(signalData == "palate")
        {
          $('.icon-palate[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate1")
        {
          $('.icon-palate1[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        } else if(signalData == "palate2")
        {
          $('.icon-palate2[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate3")
        {
          $('.icon-palate3[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "palate4")
        {
          $('.icon-palate4[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "score")
        {
          $('.icon-score[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
        else if(signalData == "like")
        {
          console.log('********attendiesemojies************** signalData ', newSenderID)
          $('.icon-like[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "dislike")
        {
          console.log('********attendiesemojiesdislike************** signalData ', newSenderID)
          $('.icon-dislike[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "easy")
        {
          console.log('********attendiesemojieseasy************** signalData ', newSenderID)
          $('.icon-easy[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "too-hard")
        {
          console.log('********attendiesemojiestoo-hard************** signalData ', newSenderID)
          $('.icon-too-hard[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "perfect")
        {
          console.log('********attendiesemojiesperfect************** signalData ', newSenderID)
          $('.icon-perfect[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }else if(signalData == "awesome")
        {
          console.log('********attendiesemojiesawesome************** signalData ', newSenderID)
          $('.icon-awesome[data-attr=\''+newSenderID+'\']').removeClass("d-none");
        }
      
       // console.log('********Rammmmmmmmmmmmm************** signalData ', signalData, userType);
      }

      function leaveLogout(){
          // localStream.stop();
          updateJoinSessionStatus();
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

      // check user role after publish/unpublish stream
      function checkUserRole(){

        console.log('client changedRole === ', changedRole)
        
        // 0=broadcaster , 1=Audience
        return changedRole == 'host' ? 0 : 1;
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

  function newDateFormat(dtTm){
    if(dtTm == '') return '';

    let tmpDt = dtTm.split(' ');
    let dt = tmpDt[0].split('/');
    let tm = tmpDt[1].split(':');
    let ms = tm[2].split('.');

    // console.log('newDate =========', dt, tm);
    //new Date(2016, 6, 27, 13, 30, 0);
    let newDate = new Date(dt[2], dt[1]-1, dt[0], tm[0], tm[1], tm[2], ms[1]).getTime();
    // console.log('newDate =========', newDate.getTime());
    return newDate;
  }

  function addRtmJoinOrder(userId, time){

    let currentTime = time;
    let strArray = localStorage.getItem("rtm-join-order");
    console.log('userId, time =========== strArray', userId, time, strArray)
    let orderList = [];
    let f = 0;
    if(strArray != null){
      strArray = JSON.parse(strArray);
      for(let i in strArray){
        if(strArray[i].id == userId){
          f = 1;
          // strArray[i].joinAt = currentTime;
        }
      }
      orderList = strArray;
    }

    if(f == 0){
      orderList.push({ id:userId, joinAt:currentTime });  
    }
      
    localStorage.setItem("rtm-join-order", JSON.stringify(orderList));
  }

  function removeFromRtmOrder(memberId){
console.log('removed from rtm order====', memberId);
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

  $(window).resize(function(){
    onPageResize();
  });

  

  function addUserAttribute(id, key, value){
      
    let tempUsers = getTempUsers();
    console.log('tempUsers =========== tempUsers', tempUsers, id, key, value)

    if(tempUsers != null){
      // tempUsers = JSON.parse(tempUsers);
      for(let i in tempUsers){
        if(tempUsers[i].hasOwnProperty(key)){
          if(tempUsers[i].id == id){
            tempUsers[i][key] = value;
          }
        } else {

          if(tempUsers[i].id == id){
            tempUsers[i][key] = value;
          }
        }
      }
    }
      
    localStorage.setItem("tempUsers", JSON.stringify(tempUsers));
  }

  function getAllAudience(){
    let tempUsers = getTempUsers();
    console.log('tempUsers =========== tempUsers ======', tempUsers);
    let audience = [];
    if(tempUsers != null){
      
      for(let i in tempUsers){
        //console.log('&&&&&&& 11111111', tempUsers[i]);
        if(tempUsers[i].hasOwnProperty('isSubscribe') && parseInt(tempUsers[i].isSubscribe) == 0){
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
    console.log('tempUsers =========== tempUsers ======', tempUsers);
    let broadcasters = [];
    if(tempUsers != null){
      
      for(let i in tempUsers){
        // console.log('&&&&&&& 22222222', tempUsers[i]);
        if(tempUsers[i].hasOwnProperty('isSubscribe') && parseInt(tempUsers[i].isSubscribe) == 1){
          broadcasters.push(tempUsers[i]);          
        }
      }
      broadcasters.sort(function(a, b) { return parseInt(a.subscribeTime) - parseInt(b.subscribeTime); });
    }
    console.log('broadcasters =========== broadcasters ======', broadcasters);
    return broadcasters;      
  }

  function getAllParticipent(){
    let tempUsers = getTempUsers();
    console.log('tempUsers =========== tempUsers ======', tempUsers);
    let broadcasters = [];
    if(tempUsers != null){
      
      for(let i in tempUsers){
        if(tempUsers[i].hasOwnProperty('isSubscribe')){
          broadcasters.push(tempUsers[i]);
        }
      }
      // broadcasters.sort(function(a, b) { return parseInt(a.subscribeTime) - parseInt(b.subscribeTime); });
    }
    console.log('broadcasters =========== broadcasters ======', broadcasters);
    return broadcasters;      
  }

  
  
  function removeUserAttribute(id, key){
      let tempUsers = getTempUsers();
      console.log('remove =========== tempUsers', tempUsers)
      let newTempUsers = {};
      if(tempUsers != null){
        for(let i in tempUsers){
          if(tempUsers[i].hasOwnProperty(key) && tempUsers[i].id == id){
            delete tempUsers[i].key;
          }
        }
      }
        
      localStorage.setItem("tempUsers", JSON.stringify(tempUsers));
  }

  function displayError(err){

    $('#exptn-errors').html('<pre>'+err+'</pre>');
  }
  
  function removeFromFirst() {
          let localData = getCurrentUserData();
          let maxUserLimit = localData.default.preScreenUserLimit;
          if($('#joiners').find('span').length >= maxUserLimit){
            $( "#joiners").find('span').first().remove();

          }
      }


      function totalChannelMembers(){
        console.log('%%%%%%%%%%%%%%%%%%%%%%',channel.getMembers());
        let localData = getCurrentUserData();
        channel.getMembers().then(membersList => {
            let totMember = membersList.length -1;
            console.log('totMember-----------', totMember)
            let maxUserLimit = localData.default.preScreenUserLimit;
            console.log('totMember-----------', totMember,maxUserLimit)
            $('#total-joinees').html(totMember > maxUserLimit ? `+${maxUserLimit} more` : '');
            
          }).catch(error => {
            console.log('*************There is an error******');
          });
      }

      function rtmAction(id) {

        let vdo1 = $('#subscribers-list #agora_remote'+id).find('video')[0];
        let ado1 = $('#subscribers-list #agora_remote'+id).find('audio')[0];
        
        if(vdo1.muted || ado1.muted){
          if($('#subscribers-list #agora_remote'+id).find('.hand-icon').hasClass("d-none") == false) {
          
            vdo1.muted = false;
            ado1.muted = false;
            
            onclickhandRaise(id);
            $('#selected-participent-id').val( id );
            $('#subscribers-list #agora_remote'+id).find('video').addClass('video-selected');
            $('#subscribers-list #agora_remote'+id).find(".click-zoom").addClass("d-block").removeClass("d-none");
          } else {
  
            if($('#subscribers-list #agora_remote'+id).find('video').hasClass('video-selected')){
              $('#selected-participent-id').val('');
              $('#subscribers-list #agora_remote'+id).find(".click-zoom").removeClass("d-block").addClass("d-none");
              $('#subscribers-list #agora_remote'+id).find('video').removeClass('video-selected');
            } else {
              $('#selected-participent-id').val( id );
              $('#subscribers-list #agora_remote'+id).find('video').addClass('video-selected');
              $('#subscribers-list #agora_remote'+id).find(".click-zoom").addClass("d-block").removeClass("d-none");
            }
          }
        } else {
          vdo1.muted = true;
          ado1.muted = true;
          onclickaudioOn(id)
          $('#selected-participent-id').val( id );
          $(this).find('video').addClass('video-selected');
          $(this).find(".click-zoom").addClass("d-block").removeClass("d-none");
        }
      }
    function showHideWineScript(){
      
      let hostFooter = $(".host-script-section").height();
      let mxHeight = $(".max-h200").height();
      if ($("#fullscreen img").hasClass("exit-screen") && mxHeight > 200){
          $('.item-description.script-section').addClass("d-none");
        }
        else{
          $('.item-description.script-section').removeClass("d-none");
        }
      if(hostFooter < 300){
        $(".host-script-section").addClass("height-500");
      }
      else {
        $(".host-script-section").removeClass("height-500");
      }
      if($('.script-section').css('display') == 'none') {
          $('.script-section').css('display', 'block');
        }
        
    }

      function guestfitnessscript(code)
      {
        console.log('---------guestfitnessscript--------------')
        if(code == 213){
        isPaused = true;
        }else{
          isPaused = false;
        }
      }
      
      // function guestfitnessScriptStop(code)
      // {
      //   console.log('---------guestfitnessScriptStop--------------')
        
      //   if(code == 212){
      //     var loadScript = function (src) {
      //       var tag = document.createElement('script');
      //       tag.async = false;
      //       tag.src = src;
            
      //       var body = document.getElementsByTagName('body')[0];
      //       body.appendChild(tag);
      //     }
      //     loadScript('/js/swiper.min.js');
      //     loadScript('/js/swiper-modifier.js');
      //     loadScript('/js/fitnessReloadScript.js');
      //     window.loadSwiperSlide();
      //     window.mySwiper.slideTo(0, 1000, true);
      //     window.mySwiper.forceUpdate();
      //    // component12.forceUpdate();
      //   }
      // }

      // function guestfitScriptStop()
      // {
      //   console.log('---------guestfitnessScriptStop--------------')       
      //     var loadScript = function (src) {
      //       var tag = document.createElement('script');
      //       tag.async = false;
      //       tag.src = src;
            
      //       var body = document.getElementsByTagName('body')[0];
      //       body.appendChild(tag);
      //     }
      //     loadScript('/js/swiper.min.js');
      //     loadScript('/js/swiper-modifier.js');
      //     loadScript('/js/fitnessReloadScript.js');         
      // }

 
      
    function zoomVideo(id){
      if($('#agora_remote'+id).find('.video-holder').hasClass('zoom-video'))
        $('#agora_remote'+id).find('.video-holder').removeClass('zoom-video');
      else
        $('#agora_remote'+id).find('.video-holder').addClass('zoom-video');
    }

    function starthostslider(){

      console.log('------------startslider-----------')
      window.startSlider();
      let storeData = getCurrentUserData();
      let ftnsStartCode=storeData.rtm.ftnsStart.code;                  
      messages=ftnsStartCode+sep;        
      sendMessageToChannel(channelName1,messages);
     
    }

    function playSlider(){
      
      $('#pause-slider').removeClass('d-none')
      $('#play-slider').addClass('d-none')
      
      if($('.swiper-slide.start.swiper-start').length > 0){
          
          // $(".start span a").trigger('click');
          $(".swiper-slide.start.swiper-start span button").trigger('click');
        
      }

     
      let storeData = getCurrentUserData();
      if(isPaused != true)
      {
        console.log('------------ispaused=false--------------')
     
        
        // let ftnsStartCode=storeData.rtm.ftnsStart.code;                  
        // messages=ftnsStartCode+sep;        
        // sendMessageToChannel(channelName1,messages);

      }else{
     
        console.log('------------ispaused=resume--------------')
        let ftnsResumeCode=storeData.rtm.ftnsResume.code;                  
        messages=ftnsResumeCode+sep;        
        sendMessageToChannel(channelName1,messages);

      }

      isPaused = false;

    }

    function pauseSlider(){
      isPaused = true;
     
      $('#pause-slider').addClass('d-none')
      $('#play-slider').removeClass('d-none')

      let storeData = getCurrentUserData();     
       let ftnsPauseCode=storeData.rtm.ftnsPause.code;                  
       messages=ftnsPauseCode+sep;        
       sendMessageToChannel(channelName1,messages);
    }

    $(document).ready(function(){

      $('#switch-camera').on('click', function(){
        getDevices();
        $('#switch-camera-popup').modal('show');
      });   

      $('#camera-switch-btn').on('click', function(){
        let mediaSetting = localStorage.getItem("media-setting");
        mediaSetting = JSON.parse(mediaSetting);
        let dId = $('input[name="video-type"]:checked').val();
        mediaSetting['camera'] = dId;
        localStorage.setItem("media-setting", JSON.stringify(mediaSetting));
        localStream.switchDevice("video", dId.toString(), function(){},function(){});
        $('#switch-camera-popup').modal('hide');
      });   

      $(".show-hide-script").click(function(){
        showHideWineScript();
      })

    

      // $('#pause-slider').on('click', function(){
      //   $(this).addClass('d-none')
      //   $('#play-slider').removeClass('d-none')
      //   isPaused = true;
      //  // $("#pause-slider").trigger('click');

      //  let storeData = getCurrentUserData();     
      //  let ftnsPauseCode=storeData.rtm.ftnsPause.code;                  
      //  messages=ftnsPauseCode+sep;        
      //  sendMessageToChannel(channelName1,messages);
      // });

      // $('#play-slider').on('click', function(){
      //   $(this).addClass('d-none')
      //   $('#pause-slider').removeClass('d-none')
      //   if(!isPaused)
      //   {
      //     console.log('------------ispaused=false--------------')
      //     isPaused = false;
      //   $(".start span a").trigger('click');
      //   //$("#ftnsStart").trigger('click');

      //   let storeData = getCurrentUserData();
     
      //   let ftnsStartCode=storeData.rtm.ftnsStart.code;                  
      //   messages=ftnsStartCode+sep;        
      //   sendMessageToChannel(channelName1,messages);
      //   }else{
      //     console.log('------------ispaused=true--------------')
      //     isPaused = false;
      //     $(".start span a").trigger('click');
      //     //$("#ftnsStart").trigger('click');

      //     let storeData = getCurrentUserData();
     
      //     let ftnsResumeCode=storeData.rtm.ftnsResume.code;                  
      //     messages=ftnsResumeCode+sep;        
      //     sendMessageToChannel(channelName1,messages);

      //   }
        
      // });
      $('#stop1-script').on('click', function(){

        console.log('-------------------stopscript-------')

        $('#stop1-script').addClass('d-none')
  
      });

      $('#stop-slider').on('click', function(){

        console.log('------------ftnessStoplalit--------------')  
       
        $('#pause-slider').addClass('d-none')
        $('#play-slider').removeClass('d-none')
        $('#fitness-counter').html(0);      
          $(".script_name").html("");            
          $(".script_time").html("");
     
        
        let storeData = getCurrentUserData();     
        let ftnsStopCode=storeData.rtm.ftnsStop.code;                  
        messages=ftnsStopCode+sep;   
        console.log('------------ftnessStop--------------',messages)     
        sendMessageToChannel(channelName1,messages);
      });

      // $( '#stopGuestFtnesBut' ).bind( "click", function(event) {
      //   $('#pause-slider').addClass('d-none')
      //   $('#play-slider').removeClass('d-none')
      //   let storeData = getCurrentUserData();     
      //   let ftnsStopCode=storeData.rtm.ftnsStop.code;                  
      //   messages=ftnsStopCode+sep;        
      //   sendMessageToChannel(channelName1,messages);
      // });

   
        
      switchUsers();

        let heightScript = $(".host-script-section").height();
            
        // $(".item-description.script-section").height(`${heightScript - 37 }px`);
        //$(".host-local").height(`${heightScript}px`);
        $(".host-show-hide").height(`${heightScript - 30 }px`);
        $(".host-show-hide .video-streams").height("80%");
        
        $('#dropdownMenuButton').on('click', function (e) {
          // alert($('.hand-raise-list .dropdown-menu').hasClass('show'))
            if($('.hand-raise-list .dropdown-menu').hasClass('show') != true){
              showHandAtHost();
            }
        });
        
        changeImage();

      
        $(".script-info .carousel-inner .carousel-item:first").addClass("active");
       
        

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

  
         


    agoraLocal = $("#agora_local").find("video").width();
    $("#agora_local video").height(`${agoraLocal / 1.778 }px`);


    //$("body, div").bind('mousewheel', function() {
      //return false
    //});
    

    $(document).on('click', ".eject-popup button", function(){
      $(this).closest(".video-holder").removeClass("popup-added");
    });

    $(".show-hide-script").click(function(){
      //var scriptHeight = $(".script-section").height();
      //if(scriptHeight < 210){
        //$(".script-section").height("500px");
      //}
      //$(this).text($(this).text() == '"Hide Script"' ? '"Show Script"' : '"Hide Script"');
      showHideScript();
      //$(".add-remove-flex").removeClass( ? '" "' : '"flex-grow-1"');
      
      //$(".script-section").slideToggle();
      
    });

    

    $(".host-script-section").height("255px");
    $(".host-section").css({"min-width": "30%", "max-width": "30%px"});
    
    $(".fullscreen, .back-btn").click(function(){

      console.log('---------fullscreen--------------')
      
      if($(".script_name").hasClass("d-none")){
        $(".script_name").removeClass("d-none")
      }

      if($(".script_time").hasClass("d-none")){
        $(".script_time").removeClass("d-none")
      }

      if($("#fullscreen img").hasClass("exit-screen")){
        $(".script_name").addClass("d-none")
      }

      if($("#fullscreen img").hasClass("exit-screen")){
        $(".script_time").addClass("d-none")
      }

     
      $(".host-script-section").height() < 255 ? $(".host-script-section").height("255px") : $(".host-script-section").height("auto");
      
      $(".show-hide-v").hasClass("d-none") ? $(".show-hide-v").removeClass("d-none").addClass("d-block") : $(".show-hide-v").addClass("d-none").removeClass("d-block");
      
      if($(".show-hide-title").hasClass("d-block")){
        $(".show-hide-title").addClass("d-none").removeClass("d-block");
        $(".header").height("auto");
        $(".countdown-logo").hide();
        // $(".section.attendees").css("margin-top", "77px !important" );
        $("#fullscreen img").attr("src", "images/exit-screen.png"); 
        $("#fullscreen img").addClass("exit-screen");
      }
      else{
        $(".show-hide-title").addClass("d-block").removeClass("d-none");
        $(".header").height("85px");
        $(".countdown-logo").show();
        // $(".section.attendees").css("margin-top", "105px !important" );
        $("#fullscreen img").attr("src", "images/full-screen.png"); 
        $("#fullscreen img").removeClass("exit-screen");
        
      }
      if ($(".item-description.script-section").hasClass("d-block")){
        $(".item-description.script-section").removeClass("d-block");
        $(".item-description.script-section").addClass("d-none");
      } 
      else {
        $(".item-description.script-section").removeClass("d-none");
        $(".item-description.script-section").addClass("d-block");
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
      //$(".script-section").slideToggle();
      



    });

    
    window.onresize = onPageResize;
    window.onload = onPageResize;
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
    
    let onscreenInterval = setInterval(function(){
        let len = $('#subscribers-list .newcss').length;
        $('#joined_users').text(len);
    }, 2000);

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
      //$("#minimize-others, .right-sidebar .title").addClass('d-none');
      $("#minimize-others").addClass('d-none');
      $("#show-everyone").removeClass('d-none');
      //$(".attendee-list").css("background", "transparent");
      $(".slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").fadeOut(300);
        
      })
        
        $(".attendee-list").css("background", "transparent");
        //$(".slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").hide();


      $("#show-everyone").click(function(){
        $(".slide-right-left").css({"width": "100%", "float": "right"});
        //$(".joined-attendees").removeAttr("style");
        
        $("#show-everyone").addClass('d-none');
        setTimeout(function(){
          $("#minimize-others").removeClass('d-none');
          //$(".right-sidebar .title").removeClass('d-none');
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

        if(role == 1){
          massages="1001" +sep+ storeData.id +sep+ storeData.firstName +sep+ storeData.email +sep+ (new Date()).getTime();// +sep+ storeData.image;
        }       
        sendMessage(hostEmail, massages);

      });

      $('#logout_button').click(function(e){
        e.preventDefault();
        // localStream.stop();
        //updateJoinSessionStatus();

        /*let data_op = JSON.parse(localStorage.getItem("userData"));
        if(data_op.userType == 1)
        {
          $.ajax({
            headers: { 
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": data_op.token
            },
            url: '/api/v1/session/'+data_op.sessionData.id+'/updatestatus',       
            //dataType: 'json',
            type: 'PUT',
            success: function( data, textStatus, jQxhr ){
                
                let respData = data;

                console.log('-------respData----------',respData);
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
          });
        }*/
        
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
        sendMessageToChannel(channelName1,messages);
      });

      $( '#appear1' ).bind( "click", function(event) {
        console.log('hello');

      messages="202"+sep+"appearence1"; 
      sendMessageToChannel(channelName1,messages);
      });

      $( '#appear2' ).bind( "click", function(event) {
      console.log('hello');
      messages="202"+sep+"appearence2"; 
      sendMessageToChannel(channelName1,messages);
      });
      $( '#appear3' ).bind( "click", function(event) {
      console.log('hello');

      messages="202"+sep+"appearence3"; 
      sendMessageToChannel(channelName1,messages);
      });

      $( '#appear4' ).bind( "click", function(event) {
      console.log('hello');
      messages="202"+sep+"appearence4"; 
      sendMessageToChannel(channelName1,messages);
      });

      $( '#aroma1' ).bind( "click", function(event) {
      console.log('hello');

      messages="202"+sep+"aroma1";                
      sendMessageToChannel(channelName1,messages);
      });

      $( '#aroma2' ).bind( "click", function(event) {
      console.log('hello');

      messages="202"+sep+"aroma2"; 
      sendMessageToChannel(channelName1,messages);
      });
              
                
      $( '#aroma3' ).bind( "click", function(event) {
      console.log('hello');

      messages="202"+sep+"aroma3"; 
      sendMessageToChannel(channelName1,messages);
      });
    
                  
      $( '#aroma4' ).bind( "click", function(event) {
      console.log('hello');

      messages="202"+sep+"aroma4"; 
      sendMessageToChannel(channelName1,messages);
      });

      $( '#palate1' ).bind( "click", function(event) {
        console.log('hello');

      messages="202"+sep+"palate1";
      sendMessageToChannel(channelName1,messages);
        });
                    
      $( '#palate2' ).bind( "click", function(event) {
        console.log('hello');

      messages="202"+sep+"palate2";
      sendMessageToChannel(channelName1,messages);
        });

      $( '#palate3' ).bind( "click", function(event) {
        console.log('hello');

      messages="202"+sep+"palate3";
      sendMessageToChannel(channelName1,messages);
        });

      $( '#palate4' ).bind( "click", function(event) {
        console.log('hello');

      messages="202"+sep+"palate4";
      sendMessageToChannel(channelName1,messages);
        });

      $( '#like' ).bind( "click", function(event) {  
                         
      messages="202"+sep+"like";
      sendMessageToChannel(channelName1,messages);
      });
      
      $( '#dislike').bind( "click", function(event) {  
                  
      messages="202"+sep+"dislike";
      sendMessageToChannel(channelName1,messages);
      }); 

      $( '#easy' ).bind( "click", function(event) {  
        console.log('Hi Lalit');                    
      messages="202"+sep+"easy";
      sendMessageToChannel(channelName1,messages);
      }); 

      $( '#too-hard' ).bind( "click", function(event) {  
        console.log('Hi Lalit');                    
      messages="202"+sep+"too-hard";
      sendMessageToChannel(channelName1,messages);
      }); 

      $( '#perfect' ).bind( "click", function(event) {  
                     
      messages="202"+sep+"perfect";
      sendMessageToChannel(channelName1,messages);
      }); 

      $( '#awesome' ).bind( "click", function(event) {  
                         
      messages="202"+sep+"awesome";
      sendMessageToChannel(channelName1,messages);
      }); 


      $( '#newhtt').bind( "click", function(event) {
      let message = "206"+sep;
      let attendiesID='arjun.rishi@virdio.com';
      console.log('--------newhtt-----------------',message,attendiesID)
      sendMessageToChannel(channelName1, message);
          //  sendMessage(attendiesID, message);
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
       
        let WinsNextCounter=$('.carousel-item.active .fitness-counter1').text();  
        console.log('---------WinsNextCounter---------',WinsNextCounter,WinsNextCode);               
        messages=WinsNextCode+sep+WinsNextCounter;        
        sendMessageToChannel(channelName1,messages);
      });

      $('#winePrev_button').bind( "click", function(event) {

        let storeData7 = getCurrentUserData();
     
        let WinsPrevCode=storeData7.rtm.WinsPrev.code; 
         
        let WinsPrevCounter=$('.carousel-item.active .fitness-counter1').text();  
        console.log('---------WinsPrevCode---------',WinsPrevCounter,WinsPrevCode);                 
        messages=WinsPrevCode+sep+WinsPrevCounter;        
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
    
    
    $(document).on('click', '#subscribers-list .video-holder video', function(){
      
      rtmAction($(this).closest('.video-holder').attr('id'));
    })

    function sort_li(a, b) {
      return parseInt($(b).attr('data-position')) < parseInt($(a).attr('data-position')) ? 1 : -1;
    }
    $('#online-user-list tr').sort(sort_li).appendTo('#online-user-list');


    $('#attendy-list').on('shown.bs.modal', function () {
          
      channel.getMembers().then(membersList => {
        console.log('membersList!!!!', membersList);
        let userList = getOrderUser();
        $('#attendy-list').find('.user-status').attr('src', '/images/offline.png');
        $('#attendy-list').find('.user-online-status').text('offline');
        $('#attendy-list').find('.fa-check').addClass('d-none');
        $('#attendy-list').find('.fa-times').removeClass('d-none');
        //$('#attendy-list').find('.visible-status .fa').addClass('fa-times').addClass('text-red').removeClass('fa-check').removeClass('text-green');
        
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

                  $('#online-user-row-'+eleId).attr('data-position', userList[j].joinAt );
                  break;
              }
            }
          }
          $('#online-user-list tr').sort(sort_li).appendTo('#online-user-list');
          
        }
      }).catch(error => {
        console.log('*************There is an error******', error);
      });
  })

    $('#mute-unmute').on('click', function(){
      
      let vdo = $('#agora_host video')[0];
      let ado = $('#agora_host audio')[0]; 
      console.log('vdo vdo vdo ', vdo, ado, vdo.muted, ado.muted)

      if( vdo.muted || ado.muted ){
        vdo.muted = false;
        ado.muted = false;
        $(this).find('.fa').addClass('fa-volume-up').removeClass('fa-volume-down');
      } else {
        vdo.muted = true;
        ado.muted = true;
        $(this).find('.fa').addClass('fa-volume-down').removeClass('fa-volume-up');
      }
    });

    $('.host-header .mute-unmute-local').on('click', function(){

      let vdo = $('#agora_local video')[0];
      let ado = $('#agora_local audio')[0]; 
      console.log('vdo vdo vdo ', vdo, ado, vdo.muted, ado.muted)

      if( vdo.muted || ado.muted ){
        vdo.muted = false;
        ado.muted = false;
        localStream.unmuteAudio();
        $(this).attr('src','images/voice-commands.png');
      } else {
        vdo.muted = true;
        ado.muted = true;
        localStream.muteAudio();
        $(this).attr('src','images/mute-microphone.png');
      }

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

    console.log('----------checkMuteUnmute-------------',id)

      let vdo = $('#video'+ id )[0];   
      let ado = $('#audio'+ id )[0];   

      vdo.muted = true;
      ado.muted = true;

      // $('#agora_remote'+id).find('.mute-unmute').addClass('mute');
     // $('#agora_remote'+id).find('.mute-unmute .fa').addClass('fa-volume-off');

  }    

  function checkMuteSelfAudio(id) {

    console.log('----------checkMuteSelfAudio-------------',id)

      let vdo = $('#video'+ id )[0];   
      let ado = $('#audio'+ id )[0];   

      vdo.muted = true;
      ado.muted = true;

      // $('#agora_remote'+id).find('.mute-unmute').addClass('mute');
     // $('#agora_remote'+id).find('.mute-unmute .fa').addClass('fa-volume-off');

  } 




  $(document).ready(function() {
    onPageResize();
});