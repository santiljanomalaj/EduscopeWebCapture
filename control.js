var runtimePort = chrome.runtime.connect({
  name: location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')
});

runtimePort.onMessage.addListener(function(message) {
  if (!message || !message.messageFromContentScript1234) {
      return;
  }
 
}); 
function convertTime(miliseconds) {
  var totalSeconds = Math.floor(miliseconds / 1000);
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds - minutes * 60;

  minutes += '';
  seconds += '';

  if (minutes.length === 1) {
      minutes = '0' + minutes;
  }

  if (seconds.length === 1) {
      seconds = '0' + seconds;
  }

  return minutes + ':' + seconds;
}
var recordingDuration = 0;
function recording() {
   console.log('recording control')
  if (!localStorage.initialTime) return;
  
    var timeDifference = Date.now() - parseInt(localStorage.initialTime) + parseInt(localStorage.whileseconds);
    var willstoptime = convertTime(3600000 - timeDifference);
    var formatted = convertTime(timeDifference);
    console.log('localStorage valid',timeDifference)
    document.getElementById('duration').innerHTML = 'Current Duration: ' + formatted;
    document.getElementById('restDuration').innerHTML = 'Your recording will end in ' + willstoptime; 

}
recordingDuration = setInterval(recording, 1000);
recording();
document.getElementById('stop_recording').onclick = function() {
  chrome.storage.sync.set({
      isRecording: 'false'
  }, function() {
      runtimePort.postMessage({
          messageFromContentScript1234: true,
          stopRecording: true,
          dropdown: true
      });
      window.close();
      chrome.browserAction.setPopup({
        popup: "dropdown.html"
    }) 
  });
};
document.getElementById('resume_recording').onclick = function() {
   
  recordingDuration = setInterval(recording,1000)
  localStorage.initialTime = Date.now();
  document.getElementsByClassName('li_pause')[0].style.display = '';
  document.getElementsByClassName('li_resume')[0].style.display = 'none';
  chrome.storage.sync.set({
      isRecording: 'false'
  }, function() {
      runtimePort.postMessage({
          messageFromContentScript1234: true,
          resumeRecording: true,
          dropdown: true
      });
      
  });
};
document.getElementById('pause_recording').onclick = function() {
  clearInterval(recordingDuration);
  var duration_second = document.getElementById('duration').innerHTML;
  console.log('duration',duration_second)
  localStorage.whileseconds = (parseInt(duration_second.split(':')[1]) * 60 + parseInt(duration_second.split(':')[2])) * 1000;
  console.log('whilesecond', localStorage.whileseconds)
  document.getElementsByClassName('li_pause')[0].style.display = 'none';
  document.getElementsByClassName('li_resume')[0].style.display = '';
  chrome.storage.sync.set({
      isRecording: 'false'
  }, function() {
      runtimePort.postMessage({
          messageFromContentScript1234: true,
          pauseRecording: true,
          dropdown: true
      });
      
  });
};
 