// src/app/talks/[slug]/page.tsx
import { getTalk } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { extractYouTubeVideoId } from '../../lib/utils';
