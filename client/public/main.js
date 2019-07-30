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

  // var audioSelect = document.querySelector('select#audioSource');
  // var videoSelect = document.querySelector('select#videoSource');

  function join() {

    var storageData = localStorage.getItem("jwtToken");
    var storeData = JSON.parse(storageData);
    console.log(storeData.userType);
    console.log('-****', localStorage.getItem("channel"));

    $('#join').addClass('d-none');
    $('#unpublish').removeClass('d-none');
    // document.getElementById("join").disabled = true;
    // document.getElementById("video").disabled = true;
    
    var channel_key = null;
    var appId = '748f9639fa864651bef8419d5870ec50';// provided by arjun 
    var appId = '232f270a5aeb4e0097d8b5ceb8c24ab3';
    
    console.log("Init AgoraRTC client with App ID: " + appId);
    
    client = AgoraRTC.createClient({mode: 'live'});
    
    client.init(appId, function () {
      
      console.log("AgoraRTC client initialized");
      
      var channelName = localStorage.getItem("channel");

      client.join(channel_key, channelName, null, function(uid) {
        console.log("User " + uid + " join channel successfully");

        let sessionState = true;
        if (sessionState) {


          AgoraRTC.getDevices(function (devices) {
            
            var _videoSource = _audioSource = '';
            
            for (var i = 0; i !== devices.length; ++i) {
              var device = devices[i];

              if (device.kind === 'audioinput' && _audioSource == '') {
                  _audioSource = device.deviceId;
              } else if (device.kind === 'videoinput' && _videoSource == '') {
                  _videoSource = device.deviceId;
              } else {
                console.log('Some other kind of source/device: ', device);
              }
            }

            // camera = videoSource.value;
            // microphone = audioSource.value;

            camera = _videoSource;
            microphone = _audioSource;
            
            localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: sessionState, screen: false, attributes : { name : "deepak", type : 1} });
            // localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
            localStream.setUserId("999");
            if (sessionState) {
              localStream.setVideoProfile('720p_3');

            }

            // The user has granted access to the camera and mic.
            localStream.on("accessAllowed", function() {
              console.log("accessAllowed");
            });

            // The user has denied access to the camera and mic.
            localStream.on("accessDenied", function() {
              console.log("accessDenied");
            });

            localStream.init(function() {
              console.log("getUserMedia successfully");
              localStream.play('agora_local');

              
              // client.publish(localStream, function (err) {
              //   console.log("Publish local stream error: " + err);
              // });

              // client.on('stream-published', function (evt) {
              //   console.log("Publish local stream successfully");
              //   console.log('localStream ==========================*******************', localStream)
              //   console.log('client ------------', client)
              // });
              
              $.ajax({
                  headers: { 
                      "Content-Type": "application/json; charset=utf-8",
                      "Authorization": storeData.token
                  },
                  url: '/api/v1/conference/'+channelName+'/'+storeData.id+'/stream-id',
                  dataType: 'json',
                  type: 'PUT',
                  contentType: 'application/json',
                  data: JSON.stringify({ "streamId": uid, "userType": storeData.userType }),
                  success: function( data, textStatus, jQxhr ){
                      
                      client.publish(localStream, function (err) {
                        console.log("Publish local stream error: " + err);
                      });

                      client.on('stream-published', function (evt) {
                        console.log("Publish local stream successfully");
                        console.log('localStream ==========================*******************', localStream)
                        console.log('client ------------', client)
                      });
                  },
                  error: function( jqXhr, textStatus, errorThrown ){
                      console.log( errorThrown );
                  }
              });


            }, function (err) {
              console.log("getUserMedia failed", err);
            });

          });
          
        }
      }, function(err) {
        console.log("Join channel failed", err);
      });
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
      console.log("New stream user id added:=========== " + stream.getUserId());
      console.log("New stream added:=========== " + stream.getId());
      console.log("Subscribe ", stream);
      
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });



    // client.on('stream-subscribed', function (evt) {
    //   var stream = evt.stream;
    //   console.log("Subscribe remote stream successfully:********** " + stream.getId());
    //   if ($('div#video .col-md-10 #agora_remote'+stream.getId()).length === 0) {
    //     let _control = '<a class="mute-unmute" data-id="'+stream.getId()+'"></a>';
    //     $('div#video .col-md-10').append('<div class="subscribers-list col-md-4 col-xs-6" id="agora_remote'+stream.getId()+'"><div style="position:relative;">'+_control+'</div><div style="width:100%; height:100%; float:left;" id="agora_remote_vdo'+stream.getId()+'"></div></div>');
    //   }
    //   stream.play('agora_remote_vdo' + stream.getId());

    //   checkMuteUnmute(stream.getId());
    // });

    client.on('stream-subscribed', function (evt) {

      var channelName = localStorage.getItem("channel");
      var storageData = localStorage.getItem("jwtToken");
      var storeData = JSON.parse(storageData);

      var stream = evt.stream;
      console.log("Subscribe remote stream successfully:********** " , stream);
      if(storeData.userType == 1) {

        // console.log("Subscribe remote stream successfully:********** " , stream.getUserId());
        if ($('#subscribers-list #agora_remote'+stream.getId()).length === 0) {
          
          // $('div#video .col-md-10').append('<div class="subscribers-list col-md-4 col-xs-6" id="agora_remote'+stream.getId()+'"><div style="position:relative;"><a class="mute-unmute" data-id="'+stream.getId()+'</div><div style="width:100%; height:100%; float:left;" id="agora_remote_vdo'+stream.getId()+'"></div></div>');

          $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'" class="col-md-4 col-lg-3 col-sm-6 col-6"><div class="video-holder position-relative"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div> <a href="javascript:;" class="mute-icon position-absolute mute-unmute" data-id="'+stream.getId()+'"><i class="fa fa-volume-off" aria-hidden="true"></i></a><span class="hand-icon position-absolute" data-toggle="modal" data-target="#hand-raise"></span><div class="att-details"> <span class="att-name">James K, TX</span><div class="vid-icons"><span class="icon1"></span></div></div></div></div>');
        }
        stream.play('agora_remote_vdo' + stream.getId());

        checkMuteUnmute(stream.getId());
      } else {
        if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
          $.ajax({
              headers: { 
                  "Content-Type": "application/json; charset=utf-8",
                  "Authorization": storeData.token
              },
              url: '/api/v1/conference/'+channelName+'/'+stream.getId()+'/stream-id',
              dataType: 'json',
              type: 'GET',
              success: function( data, textStatus, jQxhr ){
                  
                  let respData = data;
                  if(respData.status){
                    if(respData.type == 1){

                      // console.log("Subscribe remote stream successfully:********** " , stream.getUserId());
                      if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
                        
                        // $('div#video .col-md-10').append('<div class="subscribers-list col-md-4 col-xs-6" id="agora_remote'+stream.getId()+'"><div style="position:relative;"><a class="mute-unmute" data-id="'+stream.getId()+'</div><div style="width:100%; height:100%; float:left;" id="agora_remote_vdo'+stream.getId()+'"></div></div>');

                        $('#agora_host').append('<div id="agora_remote'+stream.getId()+'"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div></div>');
                      }
                      stream.play('agora_remote_vdo' + stream.getId());

                      checkMuteUnmute(stream.getId());
                    }
                  }
                  
              },
              error: function( jqXhr, textStatus, errorThrown ){
                  console.log( errorThrown );
              }
          });
        }
      }
    });
    



    client.on('stream-removed', function (evt) {
      var stream = evt.stream;
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      console.log("Remote stream is removed " + stream.getId());
    });

    client.on('peer-leave', function (evt) {
      var stream = evt.stream;
      if (stream) {
        stream.stop();
        $('#agora_remote' + stream.getId()).remove();
        console.log(evt.uid + " leaved from this channel");
      }
    });

    client.on('mute-audio', function (evt) {
      var stream = evt.stream;
      if (stream) {
        console.log(evt.uid + " muted from this channel");
      }
    });

    client.on('unmute-audio', function (evt) {
      var stream = evt.stream;
      if (stream) {
        console.log(evt.uid + " unmuted from this channel");
      }
    });

    client.on('active-speaker', function(evt) {
       var uid = evt.uid;
       console.log("update active speaker: client " + uid);
    });

    // client.on("volume-indicator", function(evt){
    //   evt.attr.forEach(function(volume, index){
    //     console.log(`#{index} UID ${volume.uid} Level ${volume.level}`);
    //   });
    // });


    // client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
    // client.on("volume-indicator", function(evt){
    //     evt.attr.forEach(function(volume, index){
    //             // console.log(#{index} UID ${volume.uid} Level ${volume.level});
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

  }

  function leave() {
    document.getElementById("leave").disabled = true;
    client.leave(function () {
      $('#subscribers-list').html('');
      console.log("Leavel channel successfully");
    }, function (err) {
      console.log("Leave channel failed");
    });
  }

  function publish() {
    $('#publish').addClass('d-none');
    $('#unpublish').removeClass('d-none');
    // document.getElementById("publish").disabled = true;
    // document.getElementById("unpublish").disabled = false;
    client.publish(localStream, function (err) {
      console.log("Publish local stream error: " + err);
    });
  }

  function unpublish() {
    
    $('#publish').removeClass('d-none');
    $('#unpublish').addClass('d-none');

    // document.getElementById("publish").disabled = false;
    // document.getElementById("unpublish").disabled = true;
    client.unpublish(localStream, function (err) {
      console.log("Unpublish local stream failed == " + err);
    });

    // client.leave(function () {
    //   $('#subscribers-list').html('');
    //   $('#agora_local').html('');
    //   console.log("Leavel channel successfully");
    // }, function (err) {
    //   console.log("Leave channel failed");
    // });
  }

  function getDevices() {
    AgoraRTC.getDevices(function (devices) {
      for (var i = 0; i !== devices.length; ++i) {
        var device = devices[i];
        var option = document.createElement('option');
        option.value = device.deviceId;
        if (device.kind === 'audioinput') {
          option.text = device.label || 'microphone ' + (audioSelect.length + 1);
          audioSelect.appendChild(option);
        } else if (device.kind === 'videoinput') {
          option.text = device.label || 'camera ' + (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log('Some other kind of source/device: ', device);
        }
      }
    });
  }

  //audioSelect.onchange = getDevices;
  //videoSelect.onchange = getDevices;
  // getDevices();
  $(document).ready(function(){
    

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

    if($('#conf-page').length > 0)
      join();
    
    $(document).on('click', '#join', function(){
      join();
    })
   
    $(document).on('click', '#leave', function(){
      leave();
    })
   
    $(document).on('click', '#publish', function(){
      publish();
    })
   
    $(document).on('click', '#unpublish', function(){
      unpublish();
    })

    // attendy
    $(".minimize-others").click(function(){
        $(".slide-right-left").css({"width": "72px", "float": "right"});
        $(".minimize-others").attr("style", "display: none !important");
        $(".slide-right-left .self-video, .slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").hide();
        $(".show-everyone, .self-video1").show();
      })
      $(".show-everyone").click(function(){
        $(".slide-right-left").css({"width": "100%", "float": "right"});
        $(".minimize-others").attr("style", "display: block !important");
        $(".slide-right-left .self-video, .slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").show();
        $(".show-everyone, .self-video1").hide();
      })

  });

  function checkMuteUnmute(id) {

      let vdo = $('#video'+ id )[0];   
      let ado = $('#audio'+ id )[0];   

      vdo.muted = true;
      ado.muted = true;

      // $('#agora_remote'+id).find('.mute-unmute').addClass('mute');
      $('#agora_remote'+id).find('.mute-unmute .fa').addClass('fa-volume-off');

  }