var runtimePort;

chrome.runtime.onConnect.addListener(function(port) {
    runtimePort = port;

    runtimePort.onMessage.addListener(function(message) {
        // alert(message.RecordRTC_Extension);
        if (!message || !message.messageFromContentScript1234) {
            return;
        }

        if (message.startRecording) {
            if(message.onlyMicrophone && enableCamera) {
                message.startRecording = false;
                message.stopRecording = true;
                alert('Unable to access camera device.');
                setDefaults();
                return;
            }
        }

        if (message.startRecording) {
            if(message.dropdown) {
                openPreviewOnStopRecording = true;
                openCameraPreviewDuringRecording = true;
            }

             
            console.log('abc',message.RecordRTC_Extension) // undefined
            if(message.RecordRTC_Extension) {
                openPreviewOnStopRecording = false;
                openCameraPreviewDuringRecording = false;
                
                enableTabCaptureAPI = message['enableTabCaptureAPI'] === true;
                enableTabCaptureAPIAudioOnly = message['enableTabCaptureAPIAudioOnly'] === true;
                enableScreen = message['enableScreen'] === true;
                enableMicrophone = message['enableMicrophone'] === true;
                enableCamera = message['enableCamera'] === true;
                enableSpeakers = message['enableSpeakers'] === true;

                startRecordingCallback = function(file) {
                    console.log('postmessage6666666666666666')
                    port.postMessage({
                        messageFromContentScript1234: true,
                        startedRecording: true
                    });
                };
                console.log('getuserconfig')
                chrome.storage.sync.set({
                    enableTabCaptureAPI: enableTabCaptureAPI ? 'true' : 'false',
                    enableTabCaptureAPIAudioOnly: enableTabCaptureAPIAudioOnly ? 'true' : 'false',
                    enableMicrophone: enableMicrophone ? 'true' : 'false',
                    enableCamera: enableCamera ? 'true' : 'false',
                    enableScreen: enableScreen ? 'true' : 'false',
                    enableSpeakers: enableSpeakers ? 'true' : 'false',
                    isRecording: 'true'
                }, function() {
                    getUserConfigs();
                });
                return;
            }
            // this is running...
            getUserConfigs();
            return;
        }

        if (message.stopRecording) {
            console.log('stoprecording123',message.RecordRTC_Extension)
            if(message.RecordRTC_Extension) {
                stopRecordingCallback = function(file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        console.log('postmessage77777777777777777')
                        port.postMessage({
                            messageFromContentScript1234: true,
                            stoppedRecording: true,
                            file: e.target.result
                        });
                    };
                    reader.readAsDataURL(file);
                };
            }
            console.log('stop555555555')
            stopScreenRecording();
            return;
        }

        if (message.resumeRecording) {     
            chrome.browserAction.setPopup({
                popup: "control.html"
            }) 
            resumeScreenRecording();
            return;
        }

        if (message.pauseRecording) {  
            chrome.browserAction.setPopup({
                popup: "control_resume.html"
            })     
            pauseScreenRecording();
            return;
        }
    });
});
