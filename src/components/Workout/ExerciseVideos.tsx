import React, { useEffect, useState } from "react";
import { searchYoutubeVideos } from "../../services/youtubeService";

interface Video {
  id: { videoId: string };
  snippet: { title: string; thumbnails: { medium: { url: string } } };
}

interface Props {
  query: string;
}

const ExerciseVideos: React.FC<Props> = ({ query }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videoResults = await searchYoutubeVideos(query);
      setVideos(videoResults);
    };

    if (query) fetchVideos();
  }, [query]);

  return (
    <div>
      {videos.map((video) => (
        <div key={video.id.videoId}>
          <h3>{video.snippet.title}</h3>
          <a
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
            />
          </a>
        </div>
      ))}
    </div>
  );
};

export default ExerciseVideos;
