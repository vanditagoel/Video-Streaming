// Import necessary React and library components
import React, { useState } from "react";
import videoLogo from "../assets/video-posting.png";
import {
  Button,
  Card,
  Label,
  FileInput,
  TextInput,
  Textarea,
  Progress,
  Alert,
} from "flowbite-react";
import axios from "axios";
import toast from "react-hot-toast";

// VideoUpload component handles video upload form and logic
function VideoUpload({ onUploadComplete }) {
  // State for selected file
  const [selectedFile, setSelectedFile] = useState(null);
  // State for video metadata (title, description)
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  // State for upload progress
  const [progress, setProgress] = useState(0);
  // State to indicate if upload is in progress
  const [uploading, setUploading] = useState(false);
  // State for upload status message
  const [message, setMessage] = useState("");

  // Handle file input change
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        toast.error('File size should be less than 500MB');
        return;
      }
      setSelectedFile(file);
    }
  }

  // Handle changes in form fields
  function formFieldChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  }

  // Handle form submission
  function handleForm(formEvent) {
    formEvent.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a video file!");
      return;
    }
    if (!meta.title.trim()) {
      toast.error("Please enter a video title!");
      return;
    }
    saveVideoToServer(selectedFile, meta);
  }

  // Upload video to server
  async function saveVideoToServer(video, videoMetaData) {
    setUploading(true);
    setProgress(0);
    try {
      let formData = new FormData();
      formData.append("title", videoMetaData.title.trim());
      formData.append("description", videoMetaData.description.trim());
      formData.append("file", video);
      // Send POST request to backend
      const response = await axios.post(
        `http://localhost:8080/api/v1/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(progress);
          },
        }
      );
      setProgress(100);
      setMessage("File uploaded " + response.data.videoId);
      toast.success("File uploaded successfully!");
      setTimeout(() => {
        resetForm();
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 1000);
    } catch (error) {
      // Handle upload error
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error in uploading file";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  }

  // Reset form fields and state
  function resetForm() {
    setMeta({
      title: "",
      description: "",
    });
    setSelectedFile(null);
    setUploading(false);
  }

  // Render the upload form UI
  return (
    <div className="text-white">
      <div className="flex flex-col items-center justify-center rounded-2xl shadow-xl p-8 border border-white/20 bg-#048c7f-900/70 backdrop-blur-lg" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <h1 className="text-lg font-semibold mb-6 text-white/90">Upload Videos</h1>
        <form
          noValidate
          className="flex flex-col space-y-6 w-full max-w-sm"
          onSubmit={handleForm}
        >
          <div>
            {/* Video title input */}
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-white/80">
              Video Title
            </label>
            <TextInput
              id="title"
              value={meta.title}
              onChange={formFieldChange}
              name="title"
              placeholder="Enter title"
              className="bg-#048c7f-900/40 border border-white/20 text-white placeholder:text-#048c7f-300 focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-md"
            />
          </div>

          <div>
            {/* Video description input */}
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-white/80">
              Video Description
            </label>
            <Textarea
              id="description"
              value={meta.description}
              onChange={formFieldChange}
              name="description"
              placeholder="Write video description..."
              rows={4}
              className="bg-#048c7f-900/40 border border-white/20 text-white placeholder:text-#048c7f-300 focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-md"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* File input for video selection */}
            <label className="flex flex-col items-center cursor-pointer">
              <span className="text-xs text-white/60 mb-1">Choose video file</span>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleFileChange}
                className="file:bg-#048c7f-900/40 file:text-white file:rounded-lg file:border-none file:px-4 file:py-2 file:cursor-pointer file:shadow-sm file:hover:bg-#048c7f-900/60 bg-transparent border-none text-white backdrop-blur-md"
              />
            </label>
          </div>

          {/* Show upload progress bar if uploading */}
          {uploading && (
            <Progress
              progress={progress}
              textLabel="Uploading"
              size={"lg"}
              labelProgress
              labelText
              className="mt-2"
            />
          )}

          {/* Show success or error message */}
          {message && (
            <Alert
              color={"success"}
              rounded
              withBorderAccent
              onDismiss={() => setMessage("")}
              className="mt-2"
            >
              <span className="font-medium">Success alert! </span>
              {message}
            </Alert>
          )}

          {/* Submit button for uploading video */}
          <Button
            type="submit"
            disabled={uploading}
            className="bg-white/60 hover:bg-white/80 text-#048c7f-900 font-semibold rounded-lg px-6 py-2 mt-2 transition-colors border border-white/40 backdrop-blur-md shadow-md"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

// Export the VideoUpload component
export default VideoUpload;
