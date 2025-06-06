package com.stream.app.controllers;

import com.stream.app.AppConstants;
import com.stream.app.entities.Video;
import com.stream.app.entities.WatchedVideo;
import com.stream.app.playload.CustomMessage;
import com.stream.app.repositories.VideoRepository;
import com.stream.app.services.VideoService;
import com.stream.app.services.WatchedVideoService;
import lombok.experimental.Delegate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

// Controller for handling video-related API endpoints
@RestController
@RequestMapping("/api/v1/videos")
@CrossOrigin("http://localhost:5173")  // Allow frontend requests
public class VideoController {
    // Service for video operations
    private final VideoService videoService;
    // Service for watched video operations
    private final WatchedVideoService watchedVideoService;
    // Repository for video data
    private final VideoRepository videoRepository;

    // Constructor for injecting services and repository dependencies
    public VideoController(VideoService videoService, WatchedVideoService watchedVideoService, VideoRepository videoRepository) {
        this.videoService = videoService;
        this.watchedVideoService = watchedVideoService;
        this.videoRepository = videoRepository;
    }

    // Handle video upload requests and save video details
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description) {
        try {
            System.out.println("[UPLOAD-STEP-1] Received upload request");
            Video video = new Video();
            video.setTitle(title);
            video.setDescription(description);
            video.setVideoId(UUID.randomUUID().toString());
            System.out.println("[UPLOAD-STEP-2] Video object created");
            Video savedVideo = null;
            try {
                savedVideo = videoService.save(video, file);
                System.out.println("[UPLOAD-STEP-3] Video saved by service");
            } catch (Exception e) {
                System.err.println("[UPLOAD-ERROR] Error in videoService.save: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(CustomMessage.builder()
                                .message("[UPLOAD-ERROR] Error in videoService.save: " + e.getMessage())
                                .success(false)
                                .build());
            }
            if (savedVideo != null) {
                System.out.println("[UPLOAD-STEP-4] Video saved successfully, returning response");
                return ResponseEntity.status(HttpStatus.OK).body(savedVideo);
            } else {
                System.err.println("[UPLOAD-ERROR] Video not uploaded, savedVideo is null");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(CustomMessage.builder()
                                .message("[UPLOAD-ERROR] Video not uploaded, savedVideo is null")
                                .success(false)
                                .build());
            }
        } catch (Exception ex) {
            System.err.println("[UPLOAD-ERROR] Unexpected error: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomMessage.builder()
                            .message("[UPLOAD-ERROR] Unexpected error: " + ex.getMessage())
                            .success(false)
                            .build());
        }
    }

    // Endpoint to get all videos, with optional search
    @GetMapping
    public List<Video> getAll(@RequestParam(value = "search", required = false) String search) {
        return videoService.searchVideos(search);
    }

    // Endpoint to stream a video file
    @GetMapping("/stream/{videoId}")
    public ResponseEntity<Resource> stream(@PathVariable String videoId) {
        Video video = videoService.get(videoId);
        String contentType = video.getContentType();
        String filePath = video.getFilePath();
        Resource resource = new FileSystemResource(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
    }

    // Endpoint to stream a video in chunks (for seeking)
    @GetMapping("/stream/range/{videoId}")
    public ResponseEntity<Resource> streamVideoRange(
            @PathVariable String videoId,
            @RequestHeader(value = "Range", required = false) String range) {
        Video video = videoService.get(videoId);
        Path path = Paths.get(video.getFilePath());
        Resource resource = new FileSystemResource(path);
        String contentType = video.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        long fileLength = path.toFile().length();
        if (range == null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        }
        // Calculate start and end range for chunked streaming
        long rangeStart;
        long rangeEnd;
        String[] ranges = range.replace("bytes=", "").split("-");
        rangeStart = Long.parseLong(ranges[0]);
        rangeEnd = rangeStart + AppConstants.CHUNK_SIZE - 1;
        if (rangeEnd >= fileLength) {
            rangeEnd = fileLength - 1;
        }
        System.out.println("range start : " + rangeStart);
        System.out.println("range end : " + rangeEnd);
        InputStream inputStream;
        try {
            inputStream = Files.newInputStream(path);
            inputStream.skip(rangeStart);
            long contentLength = rangeEnd - rangeStart + 1;
            byte[] data = new byte[(int) contentLength];
            int read = inputStream.read(data, 0, data.length);
            System.out.println("read(number of bytes) : " + read);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + fileLength);
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            headers.add("X-Content-Type-Options", "nosniff");
            headers.setContentLength(contentLength);
            return ResponseEntity
                    .status(HttpStatus.PARTIAL_CONTENT)
                    .headers(headers)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(new ByteArrayResource(data));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint to serve the raw .mp4 file
    @GetMapping("/{videoId}/file")
    public ResponseEntity<Resource> serveVideoFile(@PathVariable String videoId) {
        Video video = videoService.get(videoId);
        Path path = Paths.get(video.getFilePath());
        if (!Files.exists(path)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Resource resource = new FileSystemResource(path);
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, "video/mp4")
                .body(resource);
    }

    // Endpoint to get a video by its ID
    @GetMapping("/{videoId}")
    public Video getById(@PathVariable String videoId) {
        return videoService.get(videoId);
    }

    // Endpoint to get all watched videos for a user
    @GetMapping("/watched/user/{userId}")
    public List<Video> getWatchedVideosForUser(@PathVariable String userId) {
        List<WatchedVideo> watched = watchedVideoService.getWatchedVideosForUser(userId);
        List<String> videoIds = watched.stream().map(WatchedVideo::getVideoId).toList();
        if (videoIds.isEmpty()) return List.of();
        // Attach watchedTill to each Video object (as a transient field)
        List<Video> videos = videoRepository.findAllByVideoIdIn(videoIds);
        for (Video video : videos) {
            watched.stream()
                .filter(w -> w.getVideoId().equals(video.getVideoId()))
                .findFirst()
                .ifPresent(w -> video.setWatchedTill(w.getWatchedTill()));
        }
        return videos;
    }
}
