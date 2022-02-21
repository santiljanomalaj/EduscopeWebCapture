var runtimePort = chrome.runtime.connect({
  name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

runtimePort.onMessage.addListener(function(message) {
  if (!message || !message.messageFromContentScript1234) {
      return;
  }
});

document.getElementById('start').disabled = true;
chrome.tabs.getSelected(null, function(tab) {
console.log(tab.url)

//Users can record on these websites...
var urls = ['https://capture.sliit.lk/webcapture.php','https://eduscopecloud.com/webcapture.php'];
 
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", 'https://www.cloudflare.com/cdn-cgi/trace'); // false for synchronous request
xmlHttp.onreadystatechange = function() { 
  
  for(var i = 0;i< urls.length;i++){
    if(urls[i] == tab.url && xmlHttp.responseText){

      document.getElementById('start').disabled = false;
    }
    }
};
xmlHttp.send( null );
// console.log('ip address',xmlHttp.responseText);



  

});

var isRecording = false;
chrome.storage.sync.get('isRecording', function(obj) {
 

  isRecording = obj.isRecording === 'true';

  // auto-stop-recording
  if (isRecording === true) {
    console.log('auto-stop')
      document.getElementById('stop-recording').click();

      chrome.tabs.query({}, function(tabs) {
      var tabIds = [];
      var url = 'chrome-extension://' + chrome.runtime.id + '/video.html';
      for (var i = tabs.length - 1; i >= 0; i--) {
          if (tabs[i].url === url) {
              tabIds.push(tabs[i].id);
              chrome.tabs.update(tabs[i].id, {
                  active: true,
                  url: url
              });
              break;
          }
      }
      if (tabIds.length) {
          chrome.tabs.remove(tabIds);
      }
  });
  }
});
document.getElementById('tab').style.display = 'none';
document.getElementById('onlyWebcam').style.display = 'none';
document.getElementById('nav_screen').onclick = function(){
  document.getElementById('tab_check').checked = false;
  document.getElementById('cam_check').checked = false;
  document.getElementById('screen_check').checked = true;
  // document.getElementById('nav_tab').classList.remove('active');
  document.getElementById('nav_cam').classList.remove('active');
  document.getElementById('nav_screen').classList.add('active');
   
 }

document.getElementById('nav_cam').onclick = function (){
  document.getElementById('screen_check').checked = false;
  document.getElementById('tab_check').checked = false;
  document.getElementById('cam_check').checked = true;

  document.getElementById('nav_cam').classList.add('active');
  document.getElementById('nav_screen').classList.remove('active');
  // document.getElementById('nav_tab').classList.remove('active');
  
}
document.getElementById('start').onclick = function() {
  var screen = document.getElementById('screen_check').checked;
  var camera = document.getElementById('camera_check').checked;
  var microphone = document.getElementById('microphone_check').checked;
  var speaker = document.getElementById('speaker_check').checked;
  var tab = document.getElementById('tab_check').checked;
  var cam = document.getElementById('cam_check').checked;
   
  if(screen){
    chrome.storage.sync.set({
      enableTabCaptureAPI: 'false',
      enableTabCaptureAPIAudioOnly: 'false',
      enableMicrophone: microphone.toString(),
      enableCamera: camera.toString(),
      enableScreen: screen.toString(),
      isRecording: 'true',
      enableSpeakers: speaker.toString()
    }, function() {
        runtimePort.postMessage({
            messageFromContentScript1234: true,
            startRecording: true,
            dropdown: true
        });
        window.close();
    });
  }
  else if(tab){
    var audioOnly = document.getElementById('audio_check').checked;
    chrome.storage.sync.set({
      enableTabCaptureAPI: 'true',
      enableTabCaptureAPIAudioOnly: audioOnly.toString(),
      enableMicrophone: 'false',
      enableCamera: 'false',
      enableScreen: 'false',
      isRecording: 'true',
      enableSpeakers: 'false'
  }, function() {
      runtimePort.postMessage({
          messageFromContentScript1234: true,
          startRecording: true,
          dropdown: true
      });
      window.close();
  });
  }
  else if (cam){
    chrome.storage.sync.set({
      enableTabCaptureAPI: 'false',
      enableTabCaptureAPIAudioOnly: 'false',
      enableMicrophone: 'true',
      enableCamera: 'true',
      enableScreen: 'false',
      isRecording: 'true',
      enableSpeakers: 'false'
  }, function() {
      runtimePort.postMessage({
          messageFromContentScript1234: true,
          startRecording: true,
          dropdown: true
      });
      window.close();
  });
  }
   
};
 

// for options 
chrome.storage.sync.get(null, function(items) {
  console.log('items',items)
  if (items['videoCodec']) {
    document.getElementById('videoCodec').value = items['videoCodec'];
  } else {
      chrome.storage.sync.set({
          videoCodec: 'H264'
      }, function() {
        document.getElementById('videoCodec').value = 'H264';
      });
  }

  if (items['videoMaxFrameRates'] && items['videoMaxFrameRates'] !== 'None' && items['videoMaxFrameRates'].length) {
      document.getElementById('videoMaxFrameRates').value = items['videoMaxFrameRates'];
  } else {
      chrome.storage.sync.set({
          videoMaxFrameRates: '30'
      }, function() {
          document.getElementById('videoMaxFrameRates').value = 30;
      });
  }

 

  if (items['youtube_privacy']) {
      // document.getElementById('youtube_privacy').value = items['youtube_privacy'];
  } else {
      chrome.storage.sync.set({
          youtube_privacy: ''
      }, function() {
          // document.getElementById('youtube_privacy').value = 'public';
      });
  }

  if (items['videoResolutions']) {
      document.getElementById('videoResolutions').value = items['videoResolutions'];
  } else {
      chrome.storage.sync.set({
          videoResolutions: '1920x1080'
      }, function() {
          document.getElementById('videoResolutions').value = '1920x1080';
      });
  }

  if (items['screenResolutions']) {
      document.getElementById('screenResolutions').value = items['screenResolutions'];
  } else {
      chrome.storage.sync.set({
        screenResolutions: '1920x1080'
      }, function() {
          document.getElementById('screenResolutions').value = '1920x1080';
      });
  }

  if (items['fixVideoSeekingIssues']) {
      // document.getElementById('fixVideoSeekingIssues').checked = items['fixVideoSeekingIssues'] == 'true';
  } else {
      chrome.storage.sync.set({
          fixVideoSeekingIssues: 'false'
      }, function() {
          // document.getElementById('fixVideoSeekingIssues').checked = false;
      });
  }
});

function querySelectorAll(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
}
 

document.getElementById('videoCodec').onchange = function() {
  this.disabled = true;

  showSaving();
  chrome.storage.sync.set({
    videoCodec: this.value
  }, function() {
      document.getElementById('videoCodec').disabled = false;
      hideSaving();
  });
};
document.getElementById('videoMaxFrameRates').onchange = function() {
  this.disabled = true;

  showSaving();
  chrome.storage.sync.set({
      videoMaxFrameRates: this.value === 'None' ? '' : this.value
  }, function() {
      document.getElementById('videoMaxFrameRates').disabled = false;
      hideSaving();
  });
};

// document.getElementById('bitsPerSecond').onchange = function() {
//   this.disabled = true;
//   showSaving();
//   chrome.storage.sync.set({
//       bitsPerSecond: this.value === 'default' ? '' : this.value
//   }, function() {
//       document.getElementById('bitsPerSecond').disabled = false;
//       hideSaving();
//   });
// };
 
document.getElementById('videoResolutions').onchange = function() {
  this.disabled = true;
  showSaving();
  chrome.storage.sync.set({
      videoResolutions: this.value || '1920x1080'
  }, function() {
      document.getElementById('videoResolutions').disabled = false;
      hideSaving();
  });
};
 
document.getElementById('screenResolutions').onchange = function() {
  this.disabled = true;
  showSaving();
  chrome.storage.sync.set({
    screenResolutions: this.value || '1920x1080'
  }, function() {
      document.getElementById('screenResolutions').disabled = false;
      hideSaving();
  });
};

function showSaving() {
  document.getElementById('applying-changes').style.display = 'block';
}

function hideSaving() {
  setTimeout(function() {
      document.getElementById('applying-changes').style.display = 'none';
  }, 700);
}
function get_camera_demention(cameraid = 0,dimension){
  chrome.storage.sync.get(null, function(items) {
    var hints = {
        video: true
    };
    if (cameraid){
      hints.video ={
        deviceId: cameraid
      }
      // console.log('cameraid0000',cameraid)
    }
    if(items['camera'] && typeof items['camera'] === 'string') {
        hints.video = {
            deviceId: items['camera']
        };
        // console.log('cameraid0.0.0.',items['camera'])
    }
// return
   
      // var videoResolutions = ['1920x1080','1280x720','640x480','640x360'];
      // for(var i = 0;i< videoResolutions.length;i++){
        if(hints.video === true) {
            hints.video = {};
        }

        var width = dimension.split('x')[0];
        var height = dimension.split('x')[1];
        console.log('dddd',width,height)
        if(width && height) {
            hints.video.width = {
                exact: width
            };

            hints.video.height = {
                exact: height
            };
        }     

        navigator.mediaDevices.getUserMedia(hints).then(function(stream) {
          var videoResolutions = ['1920x1080','1280x720','640x480','640x360','320x240'];
          var option = document.createElement('option');  
          var end = 0;
          for (var i= 0;i<videoResolutions.length;i++){
            if(videoResolutions[i] == hints.video.width.exact + 'x' + hints.video.height.exact){
              option.innerHTML = videoResolutions[i];
              option.value = videoResolutions[i];
              console.log('camera dementions',hints)
              document.getElementById('videoResolutions').appendChild(option);
              end = i;
            }
            
          }   
          if(end < videoResolutions.length -1){
            console.log('added one',end)
            get_camera_demention(hints.video.deviceId,videoResolutions[end+1])
          }   
          
        }).catch(function() {
          var videoResolutions = ['1920x1080','1280x720','640x480','640x360','320x240'];          
          var end = 0;
          for (var i= 0;i<videoResolutions.length;i++){
            if(videoResolutions[i] == hints.video.width.exact + 'x' + hints.video.height.exact){             
              end = i;
            }            
          }   
          if(end < videoResolutions.length -1){
            console.log('failed one',end)            
            get_camera_demention(hints.video.deviceId,videoResolutions[end+1])
          } 
          // console.log('hint error',hints) 
        });
      // }
      
});
}
// camera & mic
// microphone-devices
function onGettingDevices(result, stream) {
  chrome.storage.sync.get('microphone', function(storage) {
      result.audioInputDevices.forEach(function(device, idx) {
        console.log('mic device',device)
          var option = document.createElement('option');
          option.innerHTML = (device.label).slice(0,10) ||(device.id).slice(0,10) ;
          option.value = device.id;
          if(idx == 0){
            option.innerHTML = 'default'
          }
          if (!storage.microphone && idx === 0) {
              option.selected = true;
          }

          if (storage.microphone && storage.microphone === device.id) {
              option.selected = true;
          }

          document.getElementById('microphone-devices').appendChild(option);
      });
  });

  chrome.storage.sync.get('camera', function(storage) {
      result.videoInputDevices.forEach(function(device, idx) {
          var option = document.createElement('option');
          console.log('cam device',device)
          option.innerHTML = (device.label).slice(0,10) || (device.id).slice(0,10);
          // option.innerHTML = (device.label).slice(0,10);
          console.log('index.',idx)
          option.value = device.id;
          if(idx == 0){
            option.innerHTML = 'default'
            get_camera_demention(device.id,'1920x1080');
          }
          if (!storage.camera && idx === 0) {
              option.selected = true;
          }

          if (storage.camera && storage.camera === device.id) {
              option.selected = true;
          }

          document.getElementById('camera-devices').appendChild(option);
      });
  });

  stream && stream.getTracks().forEach(function(track) {
      track.stop();
  });
}

getAllAudioVideoDevices(function(result) {
  if (result.audioInputDevices.length && !result.audioInputDevices[0].label) {
      var constraints = { audio: true, video: true };
      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
          var video = document.createElement('video');
          video.muted = true;
          if('srcObject' in video) {
              video.srcObject = stream;
          }
          else {
              video.src = URL.createObjectURL(stream);
          }

          onGettingDevices(result, stream);
      }).catch(function() {
          onGettingDevices(result);
      });
      return;
  }

  onGettingDevices(result);
});

document.getElementById('microphone-devices').onchange = function() {
  showSaving();
  chrome.storage.sync.set({
      microphone: this.value
  }, hideSaving);
};

document.getElementById('camera-devices').onchange = function() {
  showSaving();
  document.getElementById('videoResolutions').options.length = 0; 
  chrome.storage.sync.set({
      camera: this.value
  }, hideSaving);
  get_camera_demention(this.value,'1920x1080');
};
 

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}