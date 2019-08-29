// if(!AgoraRTC.checkSystemRequirements()) {
//     alert("Your browser does not support WebRTC!");
//   }



//       function leaveRtm() {
//         channel.leave();
//        }
    

// function sendMessage(peerId, text)
//     {
//         console.log("sendPeerMessage", text, peerId);
//         newclient.sendMessageToPeer({text}, peerId.toString());
//     }

//     function sendMessageToChannel(channelName, text)
//     {
//         channel.sendMessage({text},channelName);
//         console.log('mssages send successfully on channel');
//     }

//     function getMemberList()
//     {
//         channel.getMembers().then(membersList => {    
//         console.log('*************Total Number Of User******',membersList[1]);
//        // channelSignalHandler(JSON.stringify({code:"100",member:membersList.length, totalmember:membersList, message:"totalcount"}), storeData.userType);
//     }).catch(error => {
//         console.log('*************There is an error******');
//     });

//     }


// function signalHandler(uid, signalData, userType) {

//     signalData = JSON.parse(signalData);
       
//     console.log('********gudu************** signalData ', signalData,uid, userType); 
//     if(userType == 1) { // Host

//       if(signalData.code == '101'){

//       } else if(signalData.code == '100') {
//         // $('#guestmsg').html(signalData.message);
//         // setTimeout(function(){ $('#guestmsg').html(''); }, 10000);
//         $('#agora_hand_raise'+uid+'').removeClass("d-none");
        
//       }

  
//     } else { // Attendy

//       if(signalData.code == '101'){

//         console.log('********gudu************** signalData ', signalData,uid, userType); 
//         $('#hostmsg').html(signalData.message);
//         setTimeout(function(){ $('#hostmsg').html(''); }, 10000);

//       } else if(signalData.code == '100') {
//         console.log('********gudu************** signalData ', signalData,uid, userType); 
//         $('#hostmsg').html(signalData.message);
//         setTimeout(function(){ $('#hostmsg').html(''); }, 10000);      
//         //hand-icon position-absolute hand;    
//       }else if(signalData.code == '102') {
//         console.log('********gudu************** signalData ', signalData,uid, userType); 
//         $('#hostmsg').html(signalData.message);
//         setTimeout(function(){ $('#hostmsg').html(''); }, 10000);   
//       }else if(signalData.code == '111')
//       {
//         $('#hostmsg').html(signalData.message);
//         setTimeout(function(){ $('#hostmsg').html(''); }, 10000);
//       }

//     }

//   }

//   function channelSignalHandler(signalData, userType) {

//     //console.log('********gudu************** signalData ', signalData, userType);
//    signalData = JSON.parse(signalData);
//    if(signalData.code == '100'){
//    if(userType =='1'){  
//      incrementcountAtHost(signalData,userType);        
//      }else{
//          incrementcountAtAttendies(signalData,userType);    
//      }
//    }else if(signalData.code == '110')
//    {
//      if(userType =='1'){
//      setEmojiesAtHost(signalData, userType);
//      }else{
//        setEmojiesAtClient(signalData, userType);
//      }
//    }
//  }

//   function incrementcountAtAttendies(signalData,userType)
//   {
//     console.log('********ttttttttt************** signalData ',signalData, userType);

//     var count3=$('#joined_users_at_client').html();
//     count3=parseInt(count3);
//   if(signalData.message=='Joined')
//   {     
//     console.log('********************** signalData ', count3);
//     count4=count3+1;
//   }else if(signalData.message=='left') {

//     console.log('********************** signalData ', count3);
//     count4=count3-1;      
//   }else if(signalData.message=='totalcount') {
    
//     var arr=signalData.totalmember;
//      arr.shift();
//     console.log('*******totallist*************** signalData ', arr);
//     count4=signalData.member;
//     count4=parseInt(count4);
    
//     arr.forEach(element => {
//       $('#all_joined_member_list').append('<div className="attendee-list"><img src="images/attendee.png" /><span class="title">'+element+'</span><div className="vid-icons"><span className="icon1"></span><span className="icon2"></span></div></div>');
//     });     
//   }
//   $('#joined_users_at_client').empty(); 
//   $('#joined_users_at_client').html(count4); 
//   }

//   function setEmojiesAtClient(signalData, userType)
//   {
//     console.log('********Rammmmmmmmmmmmm************** signalData ', signalData, userType);
//   }

//   function incrementcountAtHost(signalData,userType)
//   {
//     console.log('********munmunHost************** signalData ', signalData, userType);
//     var count=$('#joined_users').html();
//     count=parseInt(count);
//   if(signalData.message=='Joined')
//   {     
//     console.log('********guduHost************** signalData ', signalData, userType);
//     count1=count+1;
//     $('#joined_users').empty(); 
//     $('#joined_users').html(count1); 
//     var peerId=signalData.member;
//     if(count1 <= 8)
//    var text =JSON.stringify({code:"111", message:"welcom, You joined as a broadCaster"});
//    else{
//     var text =JSON.stringify({code:"111", message:"welcom, You joined as a audience"});
//    }
//     sendMessage(peerId, text);
//   }else if(signalData.message=='left') {

//     console.log('********swapHost************** signalData ', count);
//     count1=count-1; 
//     $('#joined_users').empty(); 
//     $('#joined_users').html(count1);      
//   }else if(signalData.message=='totalcount') {
//     var arr=signalData.totalmember;
    
//     console.log('********mmmw************** signalData ', count);
//     count1=signalData.member;
//     count1=parseInt(count1); 
 
//     arr.forEach(function (value, i) {
//       console.log("--------totalvalue--------------", i, value);
//       if(i > 1)
//       {
        
//         $('#guestmsg').append('<span class="title" onclick="onclickShowAsBroadcaster(\''+value+'\')">'+value+'</span>');
//       }
//     });
//     $('#joined_users').empty(); 
//     $('#joined_users').html(count1);   
//   }


//   }

//   function setEmojiesAtHost(signalData, userType)
//   {
//     //console.log('********guduuuuuuuuu************** signalData ', signalData, userType); 
//     if(signalData.message=="appearence")
//     {
//     $('.icon-appearance[data-attr=\''+signalData.data+'\']').removeClass("d-none");
//     }
//     else if(signalData.message=="aroma")
//     {
//       $('.icon-aroma[data-attr=\''+signalData.data+'\']').removeClass("d-none");
//     }else if(signalData.message=="palate")
//     {
//       $('.icon-palate[data-attr=\''+signalData.data+'\']').removeClass("d-none");
//     }else if(signalData.message=="score")
//     {
//       $('.icon-score[data-attr=\''+signalData.data+'\']').removeClass("d-none");
//     }
   
//   }

//   $(document).ready(function(){

//   //  recieveMessage();
//   //  recieveChannelmassages();
//     console.log('***************getmemberlist***********');
//   //  getMemberList();  

//     $( '#appearence_button' ).bind( "click", function(event) {
//         var attendiesID=$( '#appearence_button' ).val();
//        sendMessageToChannel(channelName, JSON.stringify({code:"110",data:attendiesID, message:"appearence"}));

//       });

//       $( '#aroma_button' ).bind( "click", function(event) {
//         var attendiesID=$( '#aroma_button' ).val();
//         sendMessage(channelName, JSON.stringify({code:"110",data:attendiesID, message:"aroma"}));

//       });

//       $( '#palate_button' ).bind( "click", function(event) {
//         var attendiesID=$( '#palate_button' ).val();
//         sendMessage(channelName, JSON.stringify({code:"110",data:attendiesID, message:"palate"}));

//       });

//       $( '#score_button' ).bind( "click", function(event) {
//         var attendiesID=$( '#score_button' ).val();
//         sendMessage(channelName, JSON.stringify({code:"110",data:attendiesID, message:"score"}));

//       });

//       $( '#handRaiseClient_button' ).on( "click", function(event) {       
//        var attendiesID=$( '#handRaiseClient_button' ).val();
//         sendMessage(channelName, JSON.stringify({code:"100",data:attendiesID, message:"HAND"}));
//       });

//     });


