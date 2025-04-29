package com.stream.app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.*;

@Entity
@Table(name = "video_storage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {


    @Id
    private  String videoId;

    private  String title;

    private  String description;

    private  String  contentType;

    private  String filePath;

    @Transient // Not stored in the database
    private long watchedTill;

    public long getWatchedTill() {
        return watchedTill;
    }
    public void setWatchedTill(long watchedTill) {
        this.watchedTill = watchedTill;
    }
}
