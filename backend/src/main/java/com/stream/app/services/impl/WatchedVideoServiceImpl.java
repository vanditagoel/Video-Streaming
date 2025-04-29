package com.stream.app.services.impl;

import com.stream.app.entities.WatchedVideo;
import com.stream.app.repositories.WatchedVideoRepository;
import com.stream.app.services.WatchedVideoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchedVideoServiceImpl implements WatchedVideoService {
    private final WatchedVideoRepository watchedVideoRepository;

    public WatchedVideoServiceImpl(WatchedVideoRepository watchedVideoRepository) {
        this.watchedVideoRepository = watchedVideoRepository;
    }

    @Override
    public WatchedVideo saveOrUpdateWatched(String userId, String videoId, long watchedTill) {
        WatchedVideo watched = watchedVideoRepository.findByUserIdAndVideoId(userId, videoId);
        if (watched == null) {
            watched = WatchedVideo.builder()
                .userId(userId)
                .videoId(videoId)
                .watchedTill(watchedTill)
                .build();
        } else {
            watched.setWatchedTill(watchedTill);
        }
        return watchedVideoRepository.save(watched);
    }

    @Override
    public List<WatchedVideo> getWatchedVideosForUser(String userId) {
        return watchedVideoRepository.findByUserId(userId);
    }

    @Override
    public WatchedVideo getWatchedVideo(String userId, String videoId) {
        return watchedVideoRepository.findByUserIdAndVideoId(userId, videoId);
    }
}
