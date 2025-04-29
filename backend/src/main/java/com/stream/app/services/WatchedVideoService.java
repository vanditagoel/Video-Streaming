package com.stream.app.services;

import com.stream.app.entities.WatchedVideo;
import java.util.List;

public interface WatchedVideoService {
    WatchedVideo saveOrUpdateWatched(String userId, String videoId, long watchedTill);
    List<WatchedVideo> getWatchedVideosForUser(String userId);
    WatchedVideo getWatchedVideo(String userId, String videoId);
}
