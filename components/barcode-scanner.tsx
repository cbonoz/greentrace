"use client";

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import Quagga from "@ericblade/quagga2";
import { Button } from "./ui/button";
import Scanner from "./scanner";
import { isEmpty } from "@/lib/utils";
import { getKey } from "@/util/api";
import RenderObject from "./render-object";

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false); // toggleable state for "should render scanner"
  const [cameras, setCameras] = useState([]); // array of available cameras, as returned by Quagga.CameraAccess.enumerateVideoDevices()
  const [cameraId, setCameraId] = useState(null); // id of the active camera device
  const [cameraError, setCameraError] = useState(null); // error message from failing to access the camera
  const [results, setResults] = useState<any[]>([]); // list of scanned results
  const [torchOn, setTorch] = useState(false); // toggleable state for "should torch be on"
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [data, setData] = useState<any>({});

  const scannerRef = useRef(null); // reference to the scanner element in the DOM

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
      // console.log("Cameras Detected: ", cameras);
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

  useEffect(() => {
    if (!width) {
      updateWindowSize();
    }
  }, [scanning]);

  // get window size
  const updateWindowSize = () => {
    // log
    console.log("updateWindowSize", window.innerWidth, window.innerHeight);
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      updateWindowSize();
      Quagga.stop();
      try {
        Quagga.start();
      } catch (error) {
        console.error("Error starting Quagga:", error);
      }
    };

    // handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasResult = !isEmpty(results);

  async function onDetected(result: string) {
    console.log("onDetected", result);
    setResults([...results, result]);
    setScanning(false);

    try {
      const response = await getKey(result);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {/* // center align */}
      <div className="flex justify-center my-2">
        <div className="flex">
          {cameraError ? (
            <p>ERROR INITIALIZING CAMERA ${JSON.stringify(cameraError)} -- DO YOU HAVE PERMISSION?</p>
          ) : null}
          {cameras.length === 0 ? (
            <p>Enumerating Cameras, browser may be prompting for permissions beforehand</p>
          ) : (
            <form>
              <select
                onChange={(event) => {
                  updateWindowSize();
                  setCameraId(event.target.value as any);
                }}
              >
                {cameras.map((camera: any) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || camera.deviceId}
                  </option>
                ))}
              </select>
            </form>
          )}
        </div>
        <br />
        <Button className="cursor-pointer" onClick={() => setScanning(!scanning)}>
          {scanning ? "Stop" : "Start"}
        </Button>
        &nbsp;
        <Button className="cursor-pointer mb-1" onClick={onTorchClick}>
          {torchOn ? "Disable Torch" : "Enable Torch"}
        </Button>
        &nbsp;
      </div>
      {/* <ul className="results">
        {results.map((result) => result.codeResult && <Result key={result.codeResult.code} result={result} />)}
      </ul> */}
      <div ref={scannerRef} style={{ position: "relative" }}>
        {/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
        {/* Make the canvas fill the screen */}
        <canvas
          className="drawingBuffer"
          style={{
            position: "absolute",
            top: "0px",
            // left: '0px',
            // border: "3px solid green",
          }}
          width={width}
          height={height}
        />
        {/* Tailwind modal */}

        {hasResult && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-96">
              <div className="flex justify-between">
                {!data.value && <div className="text-lg font-semibold text-red-500">No product found</div>}
                {data.value && <div className="text-lg font-semibold text-green-500">Item detected!</div>}
                <button
                  onClick={() => {
                    setResults([]);
                    setScanning(true);
                  }}
                >
                  Close
                </button>
              </div>
              <div className="w-full h-96 border-2 p-4 border-dashed border-gray-400">
                {JSON.stringify(results)}
                <br />

                {!data.value && (
                  <div className="my-2">
                    <div className="text-sm">Try scanning another item!</div>
                  </div>
                )}
                {data.value && (
                  <div>
                    <RenderObject obj={data} title={data.value?.name} />
                    <div className="text-lg">Uploaded documents/certifications</div>
                    <div className="text-med text-black-500">No documents found</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {scanning && width > 0 ? (
          <Scanner
            constraints={{ width, height }}
            scannerRef={scannerRef}
            cameraId={cameraId as any}
            onDetected={onDetected}
          />
        ) : null}
      </div>
    </div>
  );
};

export default BarcodeScanner;
