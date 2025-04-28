package com.stream.app.services.impl;

import com.stream.app.entities.Video;
import com.stream.app.repositories.VideoRepository;
import com.stream.app.services.VideoService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {

    @Value("${files.video}")
    String DIR;

    private VideoRepository videoRepository;


    public VideoServiceImpl(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @PostConstruct
    public void init() {

        Path videoDirPath = Paths.get(DIR);

        try {
            Files.createDirectories(videoDirPath); // For consistency
        } catch (IOException e) {
            throw new RuntimeException("Failed to create directories: " + e.getMessage(), e);
        }


    }

    @Override
    public Video save(Video video, MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            if (filename == null || filename.isEmpty()) {
                throw new IllegalArgumentException("File name is missing or invalid");
            }
            String contentType = file.getContentType() != null ? file.getContentType() : "video/mp4";

            // Always save as .mp4
            String cleanFileName = video.getVideoId() + ".mp4";
            Path targetPath = Paths.get(DIR, cleanFileName);
            Files.createDirectories(targetPath.getParent());

            // Save the file
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            video.setContentType(contentType);
            video.setFilePath(targetPath.toString());


            Video savedVideo = videoRepository.save(video);
            return savedVideo;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error in saving video ");
        }
    }

    @Override
    public Video get(String videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("video not found"));
        return video;
    }

    @Override
public Video getByTitle(String title) {
    return videoRepository.findByTitle(title).orElseThrow(() -> new RuntimeException("Video not found with title: " + title));
}


    @Override
    public List<Video> getAll() {
        return videoRepository.findAll();
    }

    @Override
    public String processVideo(String videoId) {
        // No processing needed for direct MP4 streaming
        return videoId;
    }

    @Override
    public List<Video> searchVideos(String search) {
        if (search == null || search.trim().isEmpty()) {
            return videoRepository.findAll();
        }
        return videoRepository.searchByTitleOrDescription(search.trim());
    }
}
