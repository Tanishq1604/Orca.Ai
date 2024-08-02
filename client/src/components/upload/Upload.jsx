import React, { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";

// Endpoint and public key for ImageKit
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

// Function to authenticate with ImageKit
const authenticator = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/upload`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token }; // Return the authentication details
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setimage }) => {
  const ikUploadRef = useRef(null); // Ref for accessing the IKUpload component

  // Callback for handling upload errors
  const onError = (err) => {
    console.log("Error", err);
  };

  // Callback for handling successful uploads
  const onSuccess = (res) => {
    console.log("Success", res);
    setimage((prev) => ({ ...prev, dbData: res, isLoading: false }));
  };
  
    // Update image state with response data

  // Callback for monitoring upload progress
  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  // Callback for handling upload start
  const onUploadStart = (evt) => {
    const file = evt.target.files[0]; // Get the uploaded file
    const reader = new FileReader();
    reader.onload = () => {
      setimage((prev) => ({
        ...prev,
        isLoading: true, // Set loading state
        aiData: {
          inlineData: {
            data: reader.result.split(",")[1], // Extract base64 data from the file
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file); // Read file as base64
  };

  return (
    <>
      <IKContext
        publicKey={publicKey} // Set public key for ImageKit
        urlEndpoint={urlEndpoint} // Set URL endpoint for ImageKit
        authenticator={authenticator} // Set authentication function
      >
        <IKUpload
          ref={ikUploadRef} // Attach ref to IKUpload component
          fileName="test-upload.png" // Default file name for uploads
          onError={onError} // Set error callback
          onSuccess={onSuccess} // Set success callback
          onUploadProgress={onUploadProgress} // Set progress callback
          onUploadStart={onUploadStart} // Set upload start callback
          useUniqueFileName={true} // Ensure each file has a unique name
          style={{ display: "none" }} // Hide the upload input
        />
        <label onClick={() => ikUploadRef.current.click()}>
          <img src="/attachment.png" alt="" /> {/* Trigger file input click */}
        </label>
      </IKContext>
    </>
  );
};

export default Upload;
