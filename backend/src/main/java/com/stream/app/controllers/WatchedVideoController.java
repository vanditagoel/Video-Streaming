package com.stream.app.controllers;

import com.stream.app.entities.WatchedVideo;
import com.stream.app.services.WatchedVideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/watched")
public class WatchedVideoController {
    private final WatchedVideoService watchedVideoService;

    public WatchedVideoController(WatchedVideoService watchedVideoService) {
        this.watchedVideoService = watchedVideoService;
    }

    @PostMapping
    public ResponseEntity<WatchedVideo> saveOrUpdateWatched(@RequestBody WatchedVideo watchedVideo) {
        WatchedVideo watched = watchedVideoService.saveOrUpdateWatched(
            watchedVideo.getUserId(),
            watchedVideo.getVideoId(),
            watchedVideo.getWatchedTill()
        );
        return ResponseEntity.ok(watched);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WatchedVideo>> getWatchedVideosForUser(@PathVariable String userId) {
        return ResponseEntity.ok(watchedVideoService.getWatchedVideosForUser(userId));
    }

    @GetMapping
    public ResponseEntity<WatchedVideo> getWatchedVideo(
            @RequestParam String userId,
            @RequestParam String videoId) {
        WatchedVideo watched = watchedVideoService.getWatchedVideo(userId, videoId);
        if (watched == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(watched);
    }
}
