"use client";

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import Quagga from "@ericblade/quagga2";
import { Button } from "./ui/button";
import Scanner from "./scanner";

const Result = ({ result }: { result: any }) => (
  <li>
    {result.codeResult.code} [{result.codeResult.format}]
  </li>
);

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false); // toggleable state for "should render scanner"
  const [cameras, setCameras] = useState([]); // array of available cameras, as returned by Quagga.CameraAccess.enumerateVideoDevices()
  const [cameraId, setCameraId] = useState(null); // id of the active camera device
  const [cameraError, setCameraError] = useState(null); // error message from failing to access the camera
  const [results, setResults] = useState<any[]>([]); // list of scanned results
  const [torchOn, setTorch] = useState(false); // toggleable state for "should torch be on"
  const scannerRef = useRef(null); // reference to the scanner element in the DOM
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);

  // at start, we need to get a list of the available cameras.  We can do that with Quagga.CameraAccess.enumerateVideoDevices.
  // HOWEVER, Android will not allow enumeration to occur unless the user has granted camera permissions to the app/page.
  // AS WELL, Android will not ask for permission until you actually try to USE the camera, just enumerating the devices is not enough to trigger the permission prompt.
  // THEREFORE, if we're going to be running in Android, we need to first call Quagga.CameraAccess.request() to trigger the permission prompt.
  // AND THEN, we need to call Quagga.CameraAccess.release() to release the camera so that it can be used by the scanner.
  // AND FINALLY, we can call Quagga.CameraAccess.enumerateVideoDevices() to get the list of cameras.
  // Normally, I would place this in an application level "initialization" event, but for this demo, I'm just going to put it in a useEffect() hook in the BarcodeScanner component.

  useEffect((): (() => void) => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log("Cameras Detected: ", cameras);
      return cameras;
    };

    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then((cameras: any) => setCameras(cameras))
      .then(() => Quagga.CameraAccess.disableTorch()) // disable torch at start, in case it was enabled before and we hot-reloaded
      .catch((err) => setCameraError(err));
    return () => disableCamera();
  }, []);

  // provide a function to toggle the torch/flashlight
  const onTorchClick = useCallback(() => {
    console.log("on torch");
    const torch = !torchOn;
    setTorch(torch);
    if (torch) {
      Quagga.CameraAccess.enableTorch();
    } else {
      Quagga.CameraAccess.disableTorch();
    }
  }, [torchOn, setTorch]);

  // get window size
  const updateWindowSize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      updateWindowSize();
      Quagga.stop();
      Quagga.start();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {cameraError ? <p>ERROR INITIALIZING CAMERA ${JSON.stringify(cameraError)} -- DO YOU HAVE PERMISSION?</p> : null}
      {cameras.length === 0 ? (
        <p>Enumerating Cameras, browser may be prompting for permissions beforehand</p>
      ) : (
        <form>
          <select onChange={(event) => setCameraId(event.target.value as any)}>
            {cameras.map((camera: any) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || camera.deviceId}
              </option>
            ))}
          </select>
        </form>
      )}
      <Button className="cursor-pointer" onClick={onTorchClick}>
        {torchOn ? "Disable Torch" : "Enable Torch"}
      </Button>
      &nbsp;
      <Button className="cursor-pointer" onClick={() => setScanning(!scanning)}>
        {scanning ? "Stop" : "Start"}
      </Button>
      <ul className="results">
        {results.map((result) => result.codeResult && <Result key={result.codeResult.code} result={result} />)}
      </ul>
      <div ref={scannerRef} className="h-screen w-screen 1px solid mt-[60]">
        {/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
        {/* Make the canvas fill the screen */}
        <canvas
          width={width}
          height={height}
          className="drawingBuffer"
          style={{ position: "absolute", left: 0, top: 60, width: "100%", height: "100%" }}
        />
        {scanning ? (
          <Scanner
            scannerRef={scannerRef}
            cameraId={cameraId}
            onDetected={(result) => setResults([...results, result])}
          />
        ) : null}
      </div>
    </div>
  );
};

export default BarcodeScanner;
