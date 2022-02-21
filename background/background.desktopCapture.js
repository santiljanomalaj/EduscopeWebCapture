function captureDesktop() { 
    if (isRecording) {  
        console.log('isrecording true')      
        stopScreenRecording();
        return;
    }

    if (recorder && recorder.streams) {
        
        recorder.streams.forEach(function(stream, idx) {
            stream.getTracks().forEach(function(track) {
                track.stop();
            });

            if (idx == 0 && typeof stream.onended === 'function') {
                stream.onended();
            }
        });
        recorder.streams = null;
        return;
    }

    chrome.browserAction.setIcon({
        path: 'images/main-icon.png'
    });

    if (enableTabCaptureAPI) {
        captureTabUsingTabCapture();
        return;
    }

    var screenSources = ['screen', 'window', 'tab', 'audio'];
     
    if (enableSpeakers === false) {
        screenSources = ['screen','window', 'tab'];
    }

    chrome.desktopCapture.chooseDesktopMedia(screenSources, onAccessApproved);
}

function onAccessApproved(chromeMediaSourceId, opts) {
     
    if (!chromeMediaSourceId || !chromeMediaSourceId.toString().length) {
        setDefaults();
        console.log('canceled0000000000000')
        chrome.runtime.reload();
        return;
    }
    console.log('opts',opts)
    // console.log('chromemediasourceid',chromeMediaSourceId)
    chrome.storage.sync.get(null,function(obj){
        console.log('null',obj)
        if(enableCamera){
            chrome.windows.get(obj.cameraId, function (Window ){
                if (Window){
                    console.log('camera position',Window.left,Window.top)
                    cameratop = Window.top;
                    cameraleft = Window.left;
                    camerawidth = Window.width;
                    cameraheight = Window.height;
                    console.log('camerasize',Window)
                    chrome.storage.sync.set({cameraLeft:Window.left,cameraTop:Window.top})
                    chrome.windows.remove(obj.cameraId)
                }        
                 
            })
        }
            
            
    })
    var constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId
            },
            optional: []
        }
    };

    if (videoMaxFrameRates && videoMaxFrameRates.toString().length) {
        videoMaxFrameRates = parseInt(videoMaxFrameRates);

        // 30 fps seems max-limit in Chrome?
        // console.log('videofps',videoMaxFrameRates)
        if (videoMaxFrameRates /* && videoMaxFrameRates <= 30 */ ) {
            constraints.video.maxFrameRate = videoMaxFrameRates;
        }
    }
    
    constraints.video.mandatory.maxWidth = parseInt(screenResolutions.split('x')[0]);
    constraints.video.mandatory.maxHeight = parseInt(screenResolutions.split('x')[1]);

    constraints.video.mandatory.minWidth = parseInt(screenResolutions.split('x')[0]);
    constraints.video.mandatory.minHeight = parseInt(screenResolutions.split('x')[1]);
    console.log('iscancel')
    if (opts.canRequestAudioTrack === true) {
        constraints.audio = {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId,
                echoCancellation: true
            },
            optional: []
        };
    }
     
    // console.log('videofps',constraints.video.maxFrameRate)
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        if(enableSpeakers && !enableScreen) {
            var screenOnly = new MediaStream();
            getTracks(stream, 'video').forEach(function(track) {
                screenOnly.addTrack(track);

                // remove video track, because we are gonna record only speakers
                stream.removeTrack(track);
            });

            initVideoPlayer(screenOnly);
            addStreamStopListener(screenOnly, function() {
                console.log('screenonly......')
                stopScreenRecording();
            });

            // alert('You can stop recording only using extension icon. Whenever you are done, click extension icon to stop the recording.');
        }
        else {
            addStreamStopListener(stream, function() {
                console.log('streem......')
                stopScreenRecording();
            });
        }

        initVideoPlayer(stream);
        
        gotStream(stream);
    }).catch(function(error) {
        alert('Unable to capture screen using:\n' + JSON.stringify(constraints, null, '\t') + '\n\n' + error);
        setDefaults();
        chrome.runtime.reload();
    });
}
