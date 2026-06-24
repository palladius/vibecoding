// src/app/articles/[slug]/page.tsx
import { getArticle } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { extractYouTubeVideoId } from '../../../lib/utils';

// Basic Markdown rendering helper for bold, italic, and inline code
function renderMarkdown(text: string) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return paragraphs.map((p, idx) => {
    let html = p;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code class="font-mono bg-gray-800 px-1.5 py-0.5 rounded text-yellow-300">$1</code>');
    
    return (
      <p 
        key={idx} 
        className="mb-4 text-gray-300 leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const tags = article.tags?.split(',').map(tag => tag.trim());

  // Derive thumbnail image if needed
  let displayImage = article.image;
  if (!displayImage && article.video_url) {
    try {
      const ytId = extractYouTubeVideoId(article.video_url);
      if (ytId) {
        displayImage = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    } catch {
      // Ignored
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-400">{article.title}</h1>
          
          <div className="flex items-center text-sm text-gray-400 mb-6 gap-4">
            <span>🗓️ {article.publish_date}</span>
            <span className="capitalize px-2 py-0.5 rounded bg-gray-800 text-gray-300">
              {article.resource_type === 'video' ? '📹 Video' : article.resource_type === 'slides' ? '📊 Slides' : '📄 Article'}
            </span>
          </div>

          {/* YouTube Video Embed */}
          {article.video_url && (() => {
            try {
              const ytId = extractYouTubeVideoId(article.video_url);
              if (ytId) {
                return (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-700 shadow-xl mb-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={article.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                );
              }
            } catch (e) {
              console.error(e);
            }
            return null;
          })()}

          {/* Description (rendered with Markdown) */}
          {article.description && (
            <div className="markdown-content mb-6">
              {renderMarkdown(article.description)}
            </div>
          )}

          {/* Actions & Resources links */}
          <div className="flex flex-wrap gap-4 mt-6">
            {article.cta_text && article.cta_url && (
              <a 
                href={article.cta_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-300 transition-colors"
              >
                {article.cta_text}
              </a>
            )}
            
            {article.url && (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded font-semibold hover:bg-yellow-400 hover:text-black transition-all"
              >
                🔗 {article.resource_type === 'video' ? 'Watch on YouTube' : 'Read Article'}
              </a>
            )}

            {article.slides_url && (
              <a 
                href={article.slides_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="border border-blue-400 text-blue-400 px-6 py-2 rounded font-semibold hover:bg-blue-400 hover:text-white transition-all"
              >
                📊 View Presentation Slides
              </a>
            )}
          </div>

          {/* Buganizer ID */}
          {article.bug_id && (
            <div className="flex items-center gap-2 mt-6 p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-sm text-gray-300">
              <span>🐛 Buganizer Ticket:</span>
              <a 
                href={`https://issuetracker.google.com/issues/${article.bug_id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-400 hover:underline font-mono font-bold"
              >
                b/{article.bug_id}
              </a>
            </div>
          )}

          {/* Additional links list */}
          {article.links && (() => {
            try {
              interface ResourceLink {
                text: string;
                url: string;
                emoji?: string;
                description?: string;
              }
              const linkList = JSON.parse(article.links);
              if (Array.isArray(linkList) && linkList.length > 0) {
                return (
                  <div className="mt-8 border-t border-gray-800 pt-6">
                    <h3 className="text-xl font-bold mb-4 text-yellow-400">Related Resources</h3>
                    <ul className="space-y-3">
                      {linkList.map((link: ResourceLink, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-lg mt-0.5">{link.emoji || '🔹'}</span>
                          <div>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:underline font-semibold"
                            >
                              {link.text}
                            </a>
                            {link.description && (
                              <p className="text-sm text-gray-400 mt-0.5">{link.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
            } catch (e) {
              console.error("Failed to parse links JSON:", e);
            }
            return null;
          })()}

          {tags && tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-700">#{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column for static image if not embedding video, or general info card */}
        <div className="w-full md:w-1/3">
          {displayImage && (!article.video_url || article.image) && (
            <div className="relative h-64 md:h-80 w-full mb-6">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-lg border-2 border-gray-700 opacity-90 shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}