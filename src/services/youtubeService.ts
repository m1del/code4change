import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

export const searchYoutubeVideos = async (query: string): Promise<any[]> => {
  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: "snippet",
        maxResults: 5,
        q: query,
        type: "video",
        key: YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching videos from YouTube:", error);
    return [];
  }
};
