$(document).ready(function () {

    ///////////////////////////////////////////////	
    //Camera Functionality
    ///////////////////////////////////////////////
    video = document.querySelector('#camera-stream');
    videoSelect = document.querySelector('select#videoSource');
    selectors = [videoSelect];

    // Get the camera devices connected to the screen
    function gotDevices(deviceInfos) {
        // Handles being called several times to update labels. Preserve values.
        var values = selectors.map(function (select) {
            return select.value;
        });
        selectors.forEach(function (select) {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
        });
        var option = document.createElement('option');
        option.text = "Select Camera Source";
        videoSelect.appendChild(option);
        for (var i = 0; i !== deviceInfos.length; ++i) {
            var deviceInfo = deviceInfos[i];
            var option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label;
                videoSelect.appendChild(option);
            } else {
                //		      console.log('Some other kind of source/device: ', deviceInfo);
            }
        }
        selectors.forEach(function (select, selectorIndex) {
            if (Array.prototype.slice.call(select.childNodes).some(function (n) {
                    return n.value === values[selectorIndex];
                })) {
                select.value = values[selectorIndex];
            }
        });
    }


    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

    // Apply the stream to the video tag on the screen with id camera-stream
    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        video.srcObject = stream;
        video.play();

        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }

    // Function is called everytime you change the camera source (videoSource)
    function start() {
        if (window.stream) {
            window.stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        var videoSource = videoSelect.value;
        var constraints = {
            video: {
                deviceId: videoSource ? {
                    exact: videoSource
                } : undefined
            }
        };
        navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).then(gotDevices).catch(handleError);
        //  $('#camera-stream').css('border', '1px solid black');
        $('.controls').show();

    }

    function handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    $('#videoSource').change(function () {
        start();
    });

    var canvas_draw = document.getElementById('myCanvas'),
        ctx = canvas_draw.getContext('2d');


    // NOT REQUIRED becuase we are sending base64 in JSON now
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }

    function parseJsonAndDisplay(response) {
        var name = "";
        var nameString = "";
        var unrecognized = "Unrecognised";
        var defaultmsg = "Please come closer to the camera.";
        if (response["status_message"] == true) {
            detectedFaces = response["detectedFaces"];
            // Handle multiple faces here, 
            // remember even in multiple faces people can be unrecognized 
                // possible scenario - two faces - first person recognized but not the second person
            
            for (i = 0; i < detectedFaces.length; i++) {
                name = detectedFaces[i]["name"]
                id = detectedFaces[i]["id"];
                if (id != unrecognized) {
                    nameString = nameString + name + "   ";
                }
            }
            console.log(nameString)
            
            // Show on the web ui
            if (nameString != "") {
                $("#people").html(nameString);
            } else {

                $("#people").html(defaultmsg);
            }


        }

    }


    // Function that sends the request to the FR server
    function captureFrame() {

        width = 320, height = 240;
        var canvas = document.getElementById('myCanvas')
        context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(video, 0, 0, width, height);
        var dataurl = canvas.toDataURL('image/jpeg', 0.8);
        // var blob = dataURLtoBlob(dataurl);

        image_frame = {
            image: dataurl
        }

        // Send frame to the server
        $.ajax({
            url: 'http://52.172.149.43:9000/face_detection/detect/',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                // Parse the response json to see if there is an unrecognized face or multiple recognized people
                // Using Jquery you can show it on screen
                console.log(response)

                parseJsonAndDisplay(response);
            },
            data: JSON.stringify(image_frame)
        });

        //        console.log(image_frame);
    }


    interval = setInterval(function () {
        if ($("#videoSource option:selected").text() != "Select Camera Source") {
            image = []
            //            console.log("send form data")
            captureFrame();
            // $('#myCanvas').show();

            //            $('form#data').trigger('submit');
        }
    }, 5000);

});
