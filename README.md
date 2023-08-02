# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project description

A simple web application to access the user's camera and microphone, record audio and video streams, and send the recorded data to a server for processing or storage. The component offers a user-friendly interface with buttons to control video, audio, recording, and data sending functionalities.

Upon loading, the component requests access to the user's camera and microphone using the navigator.mediaDevices.getUserMedia API. Users can control video and audio streams using toggle buttons for each. When the "Start Recording" button is clicked, the component starts recording audio and video using the MediaRecorder API. The recorded data is stored in a Blob, which can be sent to the server for further processing.


## How to Run

1. Clone this repo using git clone or fork this repo.
2. Run npm install to oad all the dependencies.
3. Run npm start to to run this code locally on 3000 port.