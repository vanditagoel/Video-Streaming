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

function VideoUpload({ onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

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

  function formFieldChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  }

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

  async function saveVideoToServer(video, videoMetaData) {
    setUploading(true);
    setProgress(0);

    try {
      let formData = new FormData();
      formData.append("title", videoMetaData.title.trim());
      formData.append("description", videoMetaData.description.trim());
      formData.append("file", video);

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
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error in uploading file";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setMeta({
      title: "",
      description: "",
    });
    setSelectedFile(null);
    setUploading(false);
  }

  return (
    <div className="text-white">
      <div className="flex flex-col items-center justify-center rounded-2xl shadow-xl p-8 border border-white/20 bg-zinc-900/70 backdrop-blur-lg" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <h1 className="text-lg font-semibold mb-6 text-white/90">Upload Videos</h1>
        <form
          noValidate
          className="flex flex-col space-y-6 w-full max-w-sm"
          onSubmit={handleForm}
        >
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-white/80">
              Video Title
            </label>
            <TextInput
              id="title"
              value={meta.title}
              onChange={formFieldChange}
              name="title"
              placeholder="Enter title"
              className="bg-zinc-900/40 border border-white/20 text-white placeholder:text-zinc-300 focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-md"
            />
          </div>

          <div>
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
              className="bg-zinc-900/40 border border-white/20 text-white placeholder:text-zinc-300 focus:ring-2 focus:ring-white/30 rounded-lg backdrop-blur-md"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex flex-col items-center cursor-pointer">
              <span className="text-xs text-white/60 mb-1">Choose video file</span>
              <input
                type="file"
                name="file"
                accept="video/*"
                onChange={handleFileChange}
                className="file:bg-zinc-900/40 file:text-white file:rounded-lg file:border-none file:px-4 file:py-2 file:cursor-pointer file:shadow-sm file:hover:bg-zinc-900/60 bg-transparent border-none text-white backdrop-blur-md"
              />
            </label>
          </div>

          {uploading && (
            <Progress
              color="green"
              progress={progress}
              textLabel="Uploading"
              size={"lg"}
              labelProgress
              labelText
              className="mt-2"
            />
          )}

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

          <Button
            type="submit"
            disabled={uploading}
            className="bg-white/60 hover:bg-white/80 text-zinc-900 font-semibold rounded-lg px-6 py-2 mt-2 transition-colors border border-white/40 backdrop-blur-md shadow-md"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
