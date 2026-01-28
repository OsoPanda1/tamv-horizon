// TAMV Social Feed - Type Definitions

export interface FeedPost {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  mediaTypes: ('image' | 'video' | 'audio')[];
  hashtags: string[];
  mentions: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  visibility: 'public' | 'followers' | 'private';
  isPinned: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  // Author info
  author?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  // Engagement state for current user
  isLiked?: boolean;
  isSaved?: boolean;
  isReposted?: boolean;
}

export interface FeedComment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
  likesCount: number;
  createdAt: string;
  author?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  replies?: FeedComment[];
}

export interface FeedFilters {
  type: 'all' | 'following' | 'trending' | 'groups' | 'channels';
  mediaType?: 'image' | 'video' | 'audio' | 'text';
  hashtag?: string;
  userId?: string;
  groupId?: string;
  channelId?: string;
  timeRange?: 'today' | 'week' | 'month' | 'all';
}

export interface CreatePostInput {
  content: string;
  mediaUrls?: string[];
  mediaTypes?: ('image' | 'video' | 'audio')[];
  visibility?: 'public' | 'followers' | 'private';
  replyToId?: string;
  repostOfId?: string;
  locationName?: string;
}

export interface FeedEngagement {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
}

// Real-time feed events
export type FeedEventType = 
  | 'new_post'
  | 'post_deleted'
  | 'post_updated'
  | 'new_like'
  | 'new_comment'
  | 'new_share';

export interface FeedEvent {
  type: FeedEventType;
  postId: string;
  userId: string;
  data?: Record<string, unknown>;
  timestamp: string;
}
