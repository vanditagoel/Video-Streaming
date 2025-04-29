package com.stream.app.repositories;

import com.stream.app.entities.WatchedVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchedVideoRepository extends JpaRepository<WatchedVideo, String> {
    List<WatchedVideo> findByUserId(String userId);
    WatchedVideo findByUserIdAndVideoId(String userId, String videoId);
}
