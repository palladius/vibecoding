import { render, screen } from '@testing-library/react';
import TalkPage from './page';
import { getTalk } from '../../lib/data'; // Import getTalk directly
import { notFound } from 'next/navigation';
import { vi } from 'vitest';

// Mock the next/navigation notFound function
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('notFound called'); }),
}));

// Mock the getTalk function from src/app/lib/data.ts
vi.mock('../../lib/data', () => ({
  getTalk: vi.fn(),
  // Ensure other exports from data.ts are also mocked if used by getTalk
  getTalks: vi.fn(),
  getArticles: vi.fn(),
  getFutureTalks: vi.fn(),
  getHighlightedTalks: vi.fn(),
  getHighlightedArticles: vi.fn(),
}));

describe.skip('TalkPage', () => {
  const mockTalk = {
    id: 1,
    title: 'Test Talk Title',
    event: 'Test Event',
    date: '2025-01-01',
    location: 'Test Location',
    country_code: 'us',
    session_url: 'http://example.com/session',
    video_url: 'http://example.com/video',
    slides_url: 'http://example.com/slides',
    status: 'delivered',
    tags: 'tag1,tag2',
    image: '/images/placeholder-image.png',
    event_description: 'Event description.',
    talk_description: 'Talk description.',
    slug: '2025-01-01-test-talk-title',
  };

  beforeEach(() => {
    // Reset mocks before each test
    (getTalk as vi.Mock).mockReset(); // Use getTalk directly
    (notFound as vi.Mock).mockReset();
  });

  it('renders talk details when talk is found', async () => {
    // Mock getTalk to return the mockTalk
    (getTalk as vi.Mock).mockResolvedValue(mockTalk);

    await render(<TalkPage params={{ slug: mockTalk.slug }} />);

    // Assert that the talk title is displayed
    expect(screen.getByText(mockTalk.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockTalk.event} - ${mockTalk.date}`)).toBeInTheDocument();
    expect(screen.queryByText('404: This page could not be found.')).not.toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when talk is not found', async () => {
    // Mock getTalk to return undefined (talk not found)
    (getTalk as vi.Mock).mockResolvedValue(undefined); // Simulate talk not found

    await render(<TalkPage params={{ slug: 'non-existent-slug' }} />);

    // Assert that notFound was called
    expect(notFound).toHaveBeenCalled();
  });
});
