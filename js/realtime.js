 image = []
 $(document).ready(function () {


     c_dict = {}
     tempDict = {}
     ///////////////////////////////////////////////	
     //Camera Functionality
     ///////////////////////////////////////////////
     video = document.querySelector('#camera-stream');
     videoSelect = document.querySelector('select#videoSource');
     selectors = [videoSelect];

     $('#myCanvas').hide();

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

     function gotStream(stream) {
         window.stream = stream; // make stream available to console
         video.srcObject = stream;
         video.play();

         // Refresh button list in case labels have become available
         return navigator.mediaDevices.enumerateDevices();
     }

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
//         $('.controls').show();

     }

     function handleError(error) {
         console.log('navigator.getUserMedia error: ', error);
     }

     $('#videoSource').change(function () {
         start();
         console.log("Starting video")
     });

     var canvas_draw = document.getElementById('myCanvas'),
         ctx = canvas_draw.getContext('2d');

//     $("a#capture").click(function (e) {
//
//         var width = video.videoWidth,
//             height = video.videoHeight;
//
//         if (width && height) {
//
//             c_dict["image_width"] = width
//             c_dict["image_height"] = height
//
//             // Setup a canvas with the same dimensions as the video.
//             canvas_draw.width = width;
//             canvas_draw.height = height;
//
//             // Make a copy of the current frame in the video on the canvas.
//             ctx.drawImage(video, 0, 0, width, height);
//             imageData = canvas_draw.toDataURL('image/png');
//             $('#screenshot').prepend($('<img>', {
//                 id: 'image',
//                 src: imageData,
//                 width: "640",
//                 height: "380",
//                 position: "relative",
//                 left: "560px",
//                 top: "44px"
//             }))
//             $('#camera-stream').hide();
//             $('#myCanvas').show();
//             image.push(imageData);
//             console.log(image)
//             //Variables
//             var canvasx = $(canvas_draw).offset().left;
//             var canvasy = $(canvas_draw).offset().top;
//             var last_mousex = last_mousey = 0;
//             var mousex = mousey = 0;
//             var mousedown = false;
//             var widthForDict = 0;
//             var heightForDict = 0
//             //Mousedown
//             $(canvas_draw).on('mousedown', function (e) {
//                 last_mousex = parseInt(e.clientX - canvasx);
//                 last_mousey = parseInt(e.clientY - canvasy);
//                 mousedown = true;
//                 console.log("Mouse pressed");
//             });
//
//             //Mouseup
//             $(canvas_draw).on('mouseup', function (e) {
//                 mousedown = false;
//                 console.log("Mouse Left");
//                 mousex = parseInt(e.clientX - canvasx);
//                 mousey = parseInt(e.clientY - canvasy);
//                 //	            ctx.beginPath();
//                 var width = mousex - last_mousex;
//                 var height = mousey - last_mousey;
//                 ctx.strokeStyle = "#FF0000";
//                 ctx.strokeRect(last_mousex, last_mousey, width, height);
//                 $('#maplocation').show();
//                 $("#mapplace").val("");
//                 heightForDict = height;
//                 widthForDict = width;
//             });
//
//             //Mousemove
//             $(canvas_draw).on('mousemove', function (e) {
//                 console.log("Mouse Moving");
//
//                 $("#mapsave").click(function (e) {
//                     if ($("#mapplace").val() == "") {
//                         alert("Please assign a place name");
//                     } else {
//                         value_dict = {}
//                         value_dict["x"] = last_mousex
//                         value_dict["y"] = last_mousey
//                         value_dict["w"] = widthForDict
//                         value_dict["h"] = heightForDict
//                         console.log(value_dict)
//                         tempDict[$("#mapplace").val()] = value_dict
//                         c_dict[$("#videoSource option:selected").text()] = tempDict;
//                         console.log(c_dict)
//                     }
//                     $('#maplocation').hide();
//                     e.preventDefault();
//                 });
//             });
//         }
//         e.preventDefault();
//     });

//     $("a#next").click(function (e) {
//
//         $('#camera-stream').show();
//         $('#myCanvas').hide();
//         tempDict = {}
//         // Disable delete and save buttons
//         // Resume playback of stream.
//         e.preventDefault();
//     });

//     $("a#delete").click(function (e) {
//
//         image.pop()
//         $('#camera-stream').show();
//         $('#myCanvas').hide();
//         c_dict = {}
//         // Disable delete and save buttons
//         // Resume playback of stream.
//         e.preventDefault();
//     });


//     $("a#saveDetails").click(function (e) {
//
//         $.ajax({
//             url: "save",
//             type: "POST",
//             data: {
//                 "data": JSON.stringify(c_dict)
//             },
//             async: false,
//             success: function (response) {
//                 console.log(response)
//                 alert("Your configurations have been saved!!!")
//                 window.location.replace("https://" + window.location.hostname + ":" + window.location.port + "/dashboard/analytics");
//             }
//         });
//         //    $('.nav-tabs a[href="#upload"]').tab('show');
//         e.preventDefault();
//
//     });


     /////////////////////////////////////////////////////////////
     //Placing the Marker on the Map
     /////////////////////////////////////////////////////////////

     dict = []
     var dropZone = document.getElementById('drop-zone');
     var uploadForm = document.getElementById('js-upload-form');
     var map = document.getElementById('show-map');
     var canvas = document.getElementById('Canvas');
     var context = canvas.getContext("2d");
     var xc = document.getElementById('x');
     var yc = document.getElementById('y');
     var place = document.getElementById('place');

//     function readURL(input) {
//         if (input) {
//             var reader = new FileReader();
//
//             reader.onload = function (e) {
//                 $('#show-map').attr('src', e.target.result);
//             }
//             reader.readAsDataURL(input[0]);
//         }
//
//     }


     function saveImage(dataURL) {
         $.ajax({
             url: "saveImage",
             type: "POST",
             data: {
                 "image": dataURL
             },
             async: false,
             success: function (response) {
                 console.log(response)
             }
         });
     }

//     $("#save").click(function () {
//         // validate and process form here
//         var zone_data = {
//             "place": place.value,
//             "x": x.value,
//             "y": y.value
//         }
//         dict.push(zone_data);
//         $.ajax({
//             url: "saveZone",
//             type: "POST",
//             data: {
//                 "data": JSON.stringify(zone_data)
//             },
//             async: false,
//             success: function (response) {
//                 console.log(response)
//             }
//         });
//         console.log(dict)
//     });

     +
     function ($) {
         'use strict';

         // UPLOAD CLASS DEFINITION
         // ======================

         //    $( "#js-upload-webpage" ).click(function() {
         //        var current_progress = 0;
         //        var interval = setInterval(function() {
         //            current_progress += 25;
         //            $("#web_progress")
         //            .css("width", current_progress + "%")
         //            .attr("aria-valuenow", current_progress)
         //            .text(current_progress + "% Complete");
         //            if (current_progress > 100)
         //            	{ 
         //            		clearInterval(interval);
         //                    webpage();
         //                }
         //        }, 100);
         //    	});

//         var startUpload = function (files) {
//             var current_progress = 0;
//             var interval = setInterval(function () {
//                 current_progress += 100;
//                 $("#pdf_progress")
//                     .css("width", current_progress + "%")
//                     .attr("aria-valuenow", current_progress)
//                     .text(current_progress + "% Complete");
//                 if (current_progress >= 100) {
//                     clearInterval(interval);
//                     //                    file(files);
//                 }
//             }, 500);
//             readURL(files);
//             console.log(files);
//             $('.nav-tabs a[href="#map"]').tab('show');
//         }

//         uploadForm.addEventListener('submit', function (e) {
//             var uploadFiles = document.getElementById('js-upload-files').files;
//             e.preventDefault()
//             startUpload(uploadFiles);
//         })

//         dropZone.ondrop = function (e) {
//             e.preventDefault();
//             this.className = 'upload-drop-zone';
//
//             startUpload(e.dataTransfer.files)
//         }
//
//         dropZone.ondragover = function () {
//             this.className = 'upload-drop-zone drop';
//             return false;
//         }
//
//         dropZone.ondragleave = function () {
//             this.className = 'upload-drop-zone';
//             return false;
//         }

//         var Marker = function () {
//             this.Sprite = new Image();
//             this.Sprite.src = document.getElementById('marker').src;
//             this.Width = 30;
//             this.Height = 30;
//             this.XPos = 0;
//             this.YPos = 0;
//         }

//         var Markers = new Array();

//         var mouseClicked = function (mouse) {
//             // Get corrent mouse coords
//             var rect = canvas.getBoundingClientRect();
//             var mouseXPos = (mouse.x - rect.left);
//             var mouseYPos = (mouse.y - rect.top);
//             place.value = ""
//             console.log("Marker added");
//
//             // Move the marker when placed to a better location
//             var marker = new Marker();
//             marker.XPos = mouseXPos - (marker.Width / 2);
//             marker.YPos = mouseYPos - marker.Height;
//
//             Markers.push(marker);
//
//             console.log("Markers:" + Markers)
//             document.getElementById("location").style.visibility = "visible";
//             x.value = marker.XPos;
//             y.value = marker.YPos;
//         }


         // Add mouse click event listener to canvas
//         canvas.addEventListener("mousedown", mouseClicked, false);

         var firstLoad = function () {
             context.font = "15px Georgia";
             context.textAlign = "center";
         }

         firstLoad();

         var main = function () {
             console.log("Drawing")
             draw();
         };

         var draw = function () {
             canvas.width = map.width;
             canvas.height = map.height;
             // Clear Canvas
             context.fillStyle = "#000";
             context.fillRect(0, 0, canvas.width, canvas.height);

             // Draw map
             // Sprite, X location, Y location, Image width, Image height
             // You can leave the image height and width off, if you do it will draw the image at default size
             context.drawImage(map, 0, 0, canvas.width, canvas.height);

             // Draw markers
             for (var i = 0; i < Markers.length; i++) {
                 var tempMarker = Markers[i];
                 // Draw marker
                 context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

                 // Calculate postion text
                 var markerText = "Postion (X:" + tempMarker.XPos + ", Y:" + tempMarker.YPos;

                 // Draw a simple box so you can see the position
                 //            var textMeasurements = context.measureText(markerText);
                 //            context.fillStyle = "#666";
                 //            context.globalAlpha = 0.7;
                 //            context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
                 //            context.globalAlpha = 1;

                 // Draw position above
                 //            context.fillStyle = "#000";
                 //            context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
             }
             localStorage.setItem('Markers', JSON.stringify(Markers))
         };


//         $("#generateHeatMap").click(function () {
//             // validate and process form here
//             dict.push({
//                 "image": {
//                     "width": document.querySelector('#Canvas').clientWidth,
//                     "height": document.querySelector('#Canvas').clientHeight
//                 }
//             });
//             saveImage((document.querySelector('#Canvas').toDataURL()).replace(/^data:image\/(png|jpg);base64,/, ""));
//             localStorage.setItem('points', JSON.stringify(dict))
//             window.location.assign("https://" + window.location.hostname + ":" + window.location.port + "/heatmap");
//         });



         setInterval(main, (1000)); // Refresh 60 times a second

     }(jQuery);
 });
