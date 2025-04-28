package com.stream.app;

import com.stream.app.services.VideoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
public class SpringStreamBackendApplication implements CommandLineRunner {
    private final com.stream.app.services.impl.VideoServiceImpl videoServiceImpl;

    @Autowired
    public SpringStreamBackendApplication(com.stream.app.services.impl.VideoServiceImpl videoServiceImpl) {
        this.videoServiceImpl = videoServiceImpl;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringStreamBackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        // Remove thumbnail generation call from startup
        // videoServiceImpl.generateThumbnailsForAllVideos();
        // System.out.println("Thumbnails generated for all existing videos.");
    }
}
