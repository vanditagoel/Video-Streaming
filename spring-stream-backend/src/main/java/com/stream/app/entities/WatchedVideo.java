package com.stream.app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "watched_videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchedVideo {
    @Id
    private String videoId;
    private String userId; // or sessionId if you want per-user tracking
    private long watchedTill; // in seconds or milliseconds
}
