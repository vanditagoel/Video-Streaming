package com.stream.app;

// Import necessary packages for Spring Boot application
import com.stream.app.services.VideoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;

// Define the main application class for the backend
@SpringBootApplication
public class SpringStreamBackendApplication implements CommandLineRunner {
    // Constructor for injecting the video service implementation
    private final com.stream.app.services.impl.VideoServiceImpl videoServiceImpl;

    @Autowired
    public SpringStreamBackendApplication(com.stream.app.services.impl.VideoServiceImpl videoServiceImpl) {
        this.videoServiceImpl = videoServiceImpl;
    }

    // Main method to run the Spring Boot application
    public static void main(String[] args) {
        SpringApplication.run(SpringStreamBackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        // Override the run method to execute code at startup
        // Remove thumbnail generation call from startup
        // videoServiceImpl.generateThumbnailsForAllVideos();
        // System.out.println("Thumbnails generated for all existing videos.");
    }
}
