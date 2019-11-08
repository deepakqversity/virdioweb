function checkBandwidthRule(userType, bandwidth) {
  
  var resolution = '';

  if (userType == 1) { // for Host

      // check in kbps
      if(bandwidth > 500){

        resolution = '720p_3';
        $('.fill-wifi').removeClass('waveStrength-3');
      } else if(bandwidth > 300) {

        resolution = '720p_6';
        $('.fill-wifi').addClass('waveStrength-3');
        $('.fill-wifi').removeClass('waveStrength-2');
      } else if(bandwidth > 100) {

        resolution = '480p_6';
        $('.fill-wifi').addClass('waveStrength-2');
        $('.fill-wifi').removeClass('waveStrength-1');
      } else {

        resolution = '360p_10';
        $('.fill-wifi').addClass('waveStrength-1');
        $('.fill-wifi').removeClass('waveStrength-0');
      }
  } else { // for Participants

      // check in kbps
      if(bandwidth > 500){

        resolution = '720p_3';
        $('.fill-wifi').removeClass('waveStrength-3');
      } else if(bandwidth > 300) {

        resolution = '720p_6';
        $('.fill-wifi').addClass('waveStrength-3');
        $('.fill-wifi').removeClass('waveStrength-2');
      } else if(bandwidth > 100) {

        resolution = '480p_6';
        $('.fill-wifi').addClass('waveStrength-2');
        $('.fill-wifi').removeClass('waveStrength-1');
      } else {

        resolution = '360p_10';
        $('.fill-wifi').addClass('waveStrength-1');
        $('.fill-wifi').removeClass('waveStrength-0');
      }
  }

  if (resolution != '') {
      localStorage.setItem("video-resolution", resolution);
      return true;
  }

  return false;
}