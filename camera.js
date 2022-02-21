 

var video = document.querySelector('video');
video.style.width = parseInt(innerWidth) + 'px';

var deviceId = {};
chrome.storage.sync.get(null, function(items) {
    var hints = {
        video: true
    };

    if(items['camera'] && typeof items['camera'] === 'string') {
        hints.video = {
            deviceId: items['camera']
        };
    }

    if(items['videoResolutions'] && items['videoResolutions'] !== 'default') {
        var videoResolutions = items['videoResolutions'];

        if(hints.video === true) {
            hints.video = {};
        }

        var width = videoResolutions.split('x')[0];
        var height = videoResolutions.split('x')[1];

        if(width && height) {
            hints.video.width = {
                ideal: width
            };

            hints.video.height = {
                ideal: height
            };
        }
    }
    console.log('height',video.style.height,window.innerHeight)

    navigator.mediaDevices.getUserMedia(hints).then(function(stream) {
        video.srcObject = stream;

        console.log('camerascreen123123',stream,video.clientWidth,hints.video)
    }).catch(function() {
        // retry with default devices
        hints = {
            video: true
        };

        navigator.mediaDevices.getUserMedia(hints).then(function(stream) {
            video.srcObject = stream;
        }).catch(function() {
            alert('Unable to capture your camera.');
        });
    });
});

document.querySelector('body').onresize = function () {
    console.log('reheight',window.innerHeight);
    document.querySelector('video').style.width = window.innerWidth + 'px';
    // window.resizeTo(380,290);
}
 
