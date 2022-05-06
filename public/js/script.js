const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
var children = []
// Check if webcam access is supported.
function getUserMediaSupported(){
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// If webcam is supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.

if(getUserMediaSupported()){
    enableWebcamButton.addEventListener('click', enableCam)
} else {
    console.log('getUserMedia() is not supported by your broswer');
}

// Placeholder function for next step. Paste over this in the next step.
function enableCam(e){
    // Only continue if the COCO-SSD has finished loading.
    if(!model) {
        return
    }

    // Hide the button once clicked.
    e.target.classList.add('removed')

    // getUsermedia parameters to force video but not audio.
    const constrants = {
        video: true
    }

    //Activate the webcam
    navigator.mediaDevices.getUserMedia(constrants)
    .then((stream) => {
        video.srcObject = stream
        video.addEventListener('loadeddata', predictWebcam)
    })

}

// Placeholder function for next step.
function predictWebcam(){
  // Now let's start classifying a frame in the stream.
  /*
  The really important call in this new code is model.detect().

  All pre-made models for TensorFlow.js have a function like 
  this (the name of which may change from model to model, 
  so check the docs for details) that actually performs 
  the machine learning inference.

  Inference is simply the act of taking some input 
  and running it through the machine learning model 
  (essentially a lot of mathematical operations), and 
  then providing some results. With the TensorFlow.js 
  pre-made models we return our predictions in the 
  form of JSON objects, so it is easy to use.
  */
  model.detect(video).then((predictions) => {
        // Remove any highlighting we did previous frame.
        for(let i = 0; i < children.length; i++){
            liveView.removeChild(children[i])
        }
        children.splice(0)

        // Now lets loop through predictions and draw them to the live view if
        // they have a high confidence score.
        for(let n = 0; n < predictions.length; n++){
            // If we are over 66% sure we are sure we classified it right, draw it!
            if(predictions[n].score > 0.66){
                const p = document.createElement('p')
                p.innerText = predictions[n].class + '- with' + Math.round(parseFloat(predictions[n].score) * 100) + '% confidence'
                p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
                + (predictions[n].bbox[1] - 10) + 'px; width: ' + (predictions[n].bbox[2] - 10) +
                'px; top: 0; left: 0;'

                const highLighter = document.createElement('div')
                highLighter.setAttribute('class', 'highlighter')
                highLighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
                + predictions[n].bbox[1] + 'px; width: ' 
                + predictions[n].bbox[2] + 'px; height: '
                + predictions[n].bbox[3] + 'px;'

                liveView.appendChild(highLighter)
                liveView.appendChild(p)
                children.push(highLighter)
                children.push(p)
            }
        }
        //here we are making the predictCam method a recursive function. it will keep detecting until user refresh the page.
        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcam)
  })
}

// Store the resulting model in the global scope of our app.
var model = undefined
// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
cocoSsd.load().then((loadedModel) => {
    model = loadedModel
    // Show demo section now model is ready to use.
    demosSection.classList.remove('invisible')
})
