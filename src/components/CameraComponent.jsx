import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function CameraComponent() {
  const [stream, setStream] = useState(null);
  const [videoswitch, setvideo] = useState(true);
  const [audioswitch, setaudio] = useState(true);
  const myvideo = useRef(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [videoclass, setVideoClass] = useState("bi bi-camera-video");
  const [audioclass, setAudioClass] = useState("bi bi-mic");
  // eslint-disable-next-line
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);


  // handling audio and video

  useEffect(() => {
    const startCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myvideo.current.srcObject = stream;
        myvideo.current.autoplay = true;
        myvideo.current.muted = false;
        setStream(stream);
      } catch (error) {
        setError(
          "Error accessing camera or microphone. Please check your device settings."
        );
        console.error("Error accessing camera or microphone", error);
      }
    };

    startCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);

  const handleVideo = () => {
    if (videoswitch) {
      setvideo(false);
      stream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = false;
          setVideoClass("bi bi-camera-video-off");
        }
      });
    } else {
      setvideo(true);
      stream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = true;
          setVideoClass("bi bi-camera-video");
        }
      });
    }
  };
  const handleAudio = () => {
    if (audioswitch) {
      setaudio(false);
      stream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = false;
          setAudioClass("bi bi-mic-mute ");
        }
      });
    } else {
      setaudio(true);
      stream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = true;
          setAudioClass("bi bi-mic");
        }
      });
    }
  };

  // handled recording

  useEffect(() => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      console.log(MediaRecorder,"mediarecoder")
      mediaRecorder.ondataavailable = function (e) {
        setRecordedBlob(e.data);
      };
      setRecorder(mediaRecorder);
    }
  }, [stream]);

  const startRecording = () => {
    if (recorder && recorder.state !== "recording") {
      setRecording(true);
      recorder.start();
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== "inactive") {
      setRecording(false);

      recorder.stop();
    }
  };


  // server integration and mocking on Mocking.io


  const sendDataToServer = () => {
    if (!recordedBlob) {
      setError("No recorded data available.");
      return;
    }
    const payload = {
      data : recordedBlob
    }
    axios
      .post("http://demo3137003.mockable.io/api/upload", payload)
      .then((response) => {
        setStatus(response.data);
        setError(null)
      })
      .catch((error) => {
        setError("Error sending data to the server. Please try again later.");
        console.error("Error sending data", error);
      });
  };

  return (
    <div className="card">
      <div>
        <video ref={myvideo} playsInline autoPlay muted></video>
        <div className="icons">
          <div>
          <i
            onClick={handleVideo}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "cadetblue",
            }}
            className={videoclass}
          ></i>
          <label style={{display:"block"}}>Camera</label>
          </div>
          <div>
          <i
            onClick={handleAudio}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "cadetblue",
            }}
            className={audioclass}
          ></i>
          <label style={{display:"block"}}>Microphone</label>
          </div>
          <div>
          <i
            onClick={sendDataToServer}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "cadetblue",
            }}
            className="bi bi-send-check-fill "
          ></i>
          <label style={{display:"block"}}>Send data</label>
          </div>
          <div>
          <i
            onClick={startRecording}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "cadetblue",
            }}
            className={!recording? "bi-play-circle" : "bi-record-circle-fill" }
          ></i>
          <label style={{display:"block"}}>Recording</label>
          </div>
          <div>
          <i
            onClick={stopRecording}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "cadetblue",
            }}
            className="bi-pause-circle-fill"
          ></i>
          <label style={{display:"block"}}>Stop Recording</label>
          </div>
        </div>

        {error ? (
          <div style={{ color: "red", fontSize: "1.8rem", marginTop: "1rem" }}>
            {error}
          </div>
        ) : (
          <div
            style={{ color: "green", fontSize: "1.8rem", marginTop: "1rem" }}
          >
            {status}
          </div>
        )}
      </div>

    </div>
  );
}
