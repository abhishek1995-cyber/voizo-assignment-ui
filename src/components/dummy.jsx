import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function CameraComponent() {
  const [stream, setStream] = useState(null);
  const [videoswitch, setvideo] = useState(true);
  const [audioswitch, setaudio] = useState(true);
  const myvideo = useRef(null);
  const [error, setError] = useState(null);
  const [videoclass, setVideoClass] = useState("bi bi-camera-video");
  const [audioclass, setAudioClass] = useState("bi bi-mic");

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
        // setVideoStream(stream);
        // setAudioStream(stream)
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
          setAudioClass("bi bi-mic-mute");
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

  // const sendDataToServer = () => {
  //   if (!stream) return;

  //   const formData = new FormData();
  //   formData.append("video", stream.getVideoTracks()[0].blob);
  //   formData.append("audio", stream.getAudioTracks()[0].blob);

  //   console.log(stream.getVideoTracks()[0], "video");
  //   axios
  //     .post("http://demo3137003.mockable.io/api/upload", formData)
  //     .then((response) => {
  //       console.log("Video and audio data sent successfully!");
  //     })
  //     .catch((error) => {
  //       setError("Error sending data to the server. Please try again later.");
  //       console.error("Error sending data", error);
  //     });
  // };

  return (
    <div className="card">
      <div>
        <video ref={myvideo} playsInline autoPlay muted></video>
        <div className="icons">
          <i
            onClick={handleVideo}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "brown",
            }}
            className={videoclass}
          ></i>
          <i
            onClick={handleAudio}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "brown",
            }}
            className={audioclass}
          ></i>
          {/* <i
            onClick={sendDataToServer}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              fontSize: "2rem",
              borderRadius: "50%",
              backgroundColor: "brown",
            }}
            className="bi bi-send-check-fill"
          ></i> */}
        </div>
        {error && (
          <div style={{ color: "red", fontSize: "1.8rem", marginTop: "1rem" }}>
            {error}
          </div>
        )}
      </div>

    </div>
  );
}
