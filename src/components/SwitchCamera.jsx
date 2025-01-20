import React, { useState } from "react";
import { Loading } from "./Loading";
import { GithubLink } from "./GithubLink";



const SwitchCamera = (props) => {
  const [devices, setDevices] = useState([]);

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>{!props.isModelLoaded &&
    <div className="info">
      {!props.isModelLoaded ? <Loading /> : <GithubLink />}
      <div>
        <select className={"cameraSelector"}>
          {devices.map((device, key) => (
            <option
              key={device.deviceId}
              onClick={() => props.setConstraints(device)}
            >
              {device.label || `Device ${key + 1}`}
            </option>
          ))}
        </select>
      </div>
    </div>}

    </>

  );
};

export default SwitchCamera;
