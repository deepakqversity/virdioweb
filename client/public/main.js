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

  function join() {
   
    var storageData = localStorage.getItem("jwtToken");
    var storeData = JSON.parse(storageData);
   
    console.log('-****', localStorage.getItem("channel"), storeData.userType);

    var channel_key = null;
    //var appId = '748f9639fa864651bef8419d5870ec50';// provided by arjun 

    var appId = '232f270a5aeb4e0097d8b5ceb8c24ab3';
    
    console.log("Init AgoraRTC client with App ID: " + appId);
    
    // create client first
    client = AgoraRTC.createClient({mode: 'live'});
    
    // initialize client
    client.init(appId, function () {
      
      console.log("AgoraRTC client initialized");
      console.log('join as Role = ', storeData.userType == 1 ? "host" : "audience");

      // Before join channel add user role 
      client.setClientRole(storeData.userType == 1 ? "host" : "audience", function(err) {
        if(err) {
          console.log("user role failed", e);
        } else {
          console.log("user role set success");

      var channelName = localStorage.getItem("channel");

      // create and join channel
      client.join(channel_key, channelName, storeData.id.toString(), function(uid) {

          console.log("User " + uid + " join channel successfully");

          let sessionState = true;

          // check for device type
          AgoraRTC.getDevices(function (devices) {
            
            var _videoSource = _audioSource = '';
            
            console.log(' device type ===> ', devices)

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

            camera = _videoSource;
            microphone = _audioSource;
            
            // create local stream
            localStream = AgoraRTC.createStream({streamID: uid, audio: storeData.userType == 1 ? true : true, cameraId: camera, microphoneId: microphone, video: sessionState, screen: false });
            
            

            if (sessionState) {
              localStream.setVideoProfile('720p_3');
            }

            localStream.setVideoEncoderConfiguration({
              // Video resolution
              resolution: {
                  width: 640,
                  height: 380
              }
          });

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

              console.log("getUserMedia successfully");
              localStream.play('agora_local');
              
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

                      }
                  },
                  error: function( jqXhr, textStatus, errorThrown ){
                      console.log( errorThrown );
                  }
              });


            }, function (err) {
              console.log("getUserMedia failed", err);
            });

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
    var count=1;
    client.on('stream-subscribed', function (evt) {

      var channelName = localStorage.getItem("channel");
      var storageData = localStorage.getItem("jwtToken");
      var storeData = JSON.parse(storageData);

      var stream = evt.stream;
      
      console.log("Subscribe remote stream successfully:********** " , stream);
      if(storeData.userType == 1) {
        //console.log('------------------------lalit',count);
        // console.log("Subscribe remote stream successfully:********** " , stream.getUserId());
        if ($('#subscribers-list #agora_remote'+stream.getId()).length === 0) {
        
          $('#subscribers-list').append('<div id="agora_remote'+stream.getId()+'"  class="col-md-4 col-lg-3 col-sm-6 col-6 newcss"><div class="video-holder position-relative"><div id="agora_remote_vdo'+stream.getId()+'" class="video-streams"></div> <a href="javascript:;" class="mute-icon position-absolute speaker mute-unmute d-none" data-id="'+stream.getId()+'"><i class="fa fa-volume-off" aria-hidden="true"></i></a><span class="hand-icon position-absolute hand d-none" data-toggle="modal" data-target="#guest-video"></span><div class="att-details"> <span class="att-name">James K, TX</span><div class="vid-icons"><span class="icon1"></span></div></div></div></div>');
          onPageResize();
        }
        stream.play('agora_remote_vdo' + stream.getId());
        SwitchVideoSize();
        checkMuteUnmute(stream.getId());
        $('#subscribers-list #agora_remote'+stream.getId()).removeClass('d-none');

        }
  
  // window.onload = onPageResize;

        
      } else {

        // if ($('#agora_host #agora_remote'+stream.getId()).length === 0) {
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
        // }
      }
     
    });

    function SwitchVideoSize(){
      count++;
      let len = $('#subscribers-list .newcss').length;
     // console.log('------------------------lalit',len);
      if(len == 0) return false;

      let vdoSize = '';
      if(len == 1){
        //vdoSize = 'one mx-auto';
        vdoSize = 'one mx-auto';
      } else if(len == 2) {
        //vdoSize = 'col-md-6 col-lg-6 col-sm-6 col-6';
        vdoSize = 'two';
      } else if(len == 3) {
        //vdoSize = 'col-md-4 col-lg-4 col-sm-4 col-12';
        vdoSize = 'three';
      } else {
        vdoSize = 'col-md-3 col-lg-3 col-sm-3 col-12';
        vdoSize = 'four';
      }

        // javascript each
        $('#subscribers-list .newcss').each(function (index, value) {
          
          $(this).removeClass('col-md-6')
            .removeClass('col-md-4')
            .removeClass('one')
            .removeClass('two')
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

          $('#subscribers-list .newcss').addClass(vdoSize);

          });

         
          
    }
    

  
    client.on('stream-removed', function (evt) {
      var stream = evt.stream;
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      SwitchVideoSize();
      console.log("Remote stream is removed " + stream.getId());
    });

    client.on('peer-leave', function (evt) {
      console.log('peer-leave = ', evt)
      var stream = evt.stream;
      if (stream) {
        stream.stop();
        $('#agora_remote' + stream.getId()).remove();
        SwitchVideoSize();
        console.log(evt.uid + " leaved from this channel");
      }
    });

    client.on('mute-audio', function (evt) {
      console.log('------------------->111', evt)
      if ($('#subscribers-list #agora_remote'+evt.uid).length > 0){
        $('#subscribers-list #agora_remote'+evt.uid).find('.speaker').addClass('d-none')
        $('#subscribers-list #agora_remote'+evt.uid).find('.hand').addClass('d-none')
      }
      // var stream = evt.stream;
      // if (stream) {
      //   console.log(evt.uid + " ===> muted from this channel");
      // }
    });

    client.on('unmute-audio', function (evt) {
      console.log('------------------->222', evt)
      
        console.log('8*******************',evt.uid);
      if ($('#subscribers-list #agora_remote'+evt.uid).length > 0){
        $('#subscribers-list #agora_remote'+evt.uid).find('.speaker').removeClass('d-none')
        $('#subscribers-list #agora_remote'+evt.uid).find('.hand').removeClass('d-none')
      }

      // var stream = evt.stream;
      // if (stream) {
      //   console.log(evt.uid + " ===> unmuted from this channel");
      // }
      
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

  function leave() {
   // document.getElementById("leave").disabled = true;
    client.leave(function () {
      $('#subscribers-list').html('');
      console.log("Leavel channel successfully");
    }, function (err) {
      console.log("Leave channel failed");
    });
  }

  $('#logout_button').click(function(){     
    leave();
    localStorage.removeItem("jwtToken");
    window.location.href  = '/login';
  });

  function publish() {
    // localStream.muteAudio();
    client.publish(localStream, function (err) {
      console.log("Publish local stream error: " + err);
    });
  }

  function unpublish() {
    
    client.unpublish(localStream, function (err) {
      console.log("Unpublish local stream failed == " + err);
    });

  }

  function raiseHand(){
    console.log('localStream.hasAudio = ', localStream.hasAudio())
    // if(localStream.hasAudio())
      localStream.unmuteAudio(); 
    // client.setClientRole('host', function(err){
      // console.log('=========1',localStream.hasAudio())
      // if(localStream.hasAudio() == false)
      //     localStream.unmuteAudio();
      
      // client.publish(localStream, function (err) {
        
      //   console.log("Publish local stream error: " + err);

      //   if(err) {
      //     console.log("111 user role failed", err);
      //   } else {
      //     console.log("111 user role set success");
      //     }
      // });
    // });

  }

  function downHand(){
    console.log('localStream.hasAudio = ', localStream.hasAudio())
    // if(localStream.hasAudio() == true)
      localStream.muteAudio();
    // client.setClientRole('audience', function(err){

    //   if(err){
    //     console.log('====== err ' ,err)
    //   }

    //     console.log('====== no err ' ,err)

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
    //$("#strm-publish").click();
  window.onresize = onPageResize;
  // window.onload = onPageLoad;

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
        //$(".joined-attendees").css("right", "-280px");
        
        $("#minimize-others, .right-sidebar .title").addClass('d-none');
        $("#show-everyone").removeClass('d-none');
        $(".attendee-list").css("background", "transparent");
        $(".slide-right-left .title, .slide-right-left .joined-attendees .attendee-list span").hide();
      })
    
      $("#show-everyone").click(function(){
        $(".slide-right-left").css({"width": "100%", "float": "right"});
        //$(".joined-attendees").removeAttr("style");
        
        $("#show-everyone").addClass('d-none');
        setTimeout(function(){
          $("#minimize-others").removeClass('d-none').fadeIn(500);
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
      
      

  });
  // window.onresize = onPageResize;
  // window.onload = onPageLoad;
  

    //function onPageLoad(){

      //let winHeight = window.innerHeight;
      //let headerHeight = $(".header.bg-gray").height()+20;
      //let hostHeight = $(".host-script-section").height();
     // let sectionHeight = winHeight - (hostHeight+headerHeight);
      //$(".section.attendees").height(`${sectionHeight - 67}px`);
     // $("#subscribers-list").height(`${sectionHeight - 150}px`)
      //let sub_list_y = $("#subscribers-list").height(); 
      //let sub_list_x = $("#subscribers-list").width(); 

    //setTimeout(function(){
      
      
      //if(sub_list_x > 1400){
        //$(".newcss.one").width(`${sub_list_x / 3 }px`);
      //}
      //else{
        //$(".newcss.one").width(`${sub_list_x / 4 }px`);
      //}
    //}, 600)

    //console.log(`${sectionHeight}px`);
    //let vid_y = $("#subscribers-list video").height();
    //let vid_x = $("#subscribers-list video").width();
  //}

    function onPageResize(){
      
      let winHeight = window.innerHeight;
      let headerHeight = $(".header.bg-gray").height()+20;
      let hostHeight = $(".host-script-section").height();
      let sectionHeight = winHeight - (hostHeight+headerHeight);
      $(".section.attendees").height(`${sectionHeight - 50}px`);
      $("#subscribers-list").height(`${sectionHeight - 100}px`)
      let sub_list_y = $("#subscribers-list").height(); 
      let sub_list_x = $("#subscribers-list").width(); 
      setTimeout(function(){
        $(".newcss.two").width(`${sub_list_x / 2.8}`);
        $(".newcss.three").width(`${sub_list_x / 3}`);
        $(".newcss.four").width(`${sub_list_x / 3}`);
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
    }

   
    

  function checkMuteUnmute(id) {

      let vdo = $('#video'+ id )[0];   
      let ado = $('#audio'+ id )[0];   

      vdo.muted = true;
      ado.muted = true;

      // $('#agora_remote'+id).find('.mute-unmute').addClass('mute');
      $('#agora_remote'+id).find('.mute-unmute .fa').addClass('fa-volume-off');

  }