import { extractYouTubeVideoId } from './utils';

describe('extractYouTubeVideoId', () => {
  it('should extract the video ID from a valid YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=T76NbeTdDFA';
    expect(extractYouTubeVideoId(url)).toBe('T76NbeTdDFA');
  });

  it('should throw an error for an invalid YouTube URL format', () => {
    const invalidUrl = 'https://youtu.be/T76NbeTdDFA';
    expect(() => extractYouTubeVideoId(invalidUrl)).toThrowError(
      'Invalid YouTube URL format. Expected format: https://www.youtube.com/watch?v=VIDEO_ID. Received: https://youtu.be/T76NbeTdDFA'
    );
  });

  it('should return null for an empty URL', () => {
    const emptyUrl = '';
    expect(extractYouTubeVideoId(emptyUrl)).toBeNull();
  });

  it('should extract the video ID from a YouTube URL with query parameters', () => {
    const url = 'https://www.youtube.com/watch?v=fN4l5MdrCus&list=PLBN2vYvV7Y5euAbxoU3jhhDfZnL3EPkyG&index=1';
    expect(extractYouTubeVideoId(url)).toBe('fN4l5MdrCus');
  });
});
