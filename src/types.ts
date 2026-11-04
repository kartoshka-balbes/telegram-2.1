export interface MessageItem {
  id: string;
  text: string;
  sender: 'user' | 'other' | 'system';
  time: string;
  isBroadcast?: boolean;
  replyToId?: string;
  replyToText?: string;
  quotedText?: string;
  isEdited?: boolean;
  reactions?: { [emoji: string]: number };
  type?: 'text' | 'voice' | 'video_circle' | 'location' | 'photo' | 'video' | 'poll' | 'contact' | 'sticker';
  locationName?: string;
  locationCoords?: string;
  duration?: string;
  mediaUrl?: string;
  caption?: string;
  stickerUrl?: string;
  isScheduled?: boolean;
  pollData?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedIndex?: number;
  };
  contactData?: {
    name: string;
    phone: string;
    avatar: string;
  };
}

export type Message = MessageItem;

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastMessage: string;
  lastMessageTime: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isGroup?: boolean;
  isBlocked?: boolean;
  isFriend?: boolean;
  folder?: string;
  pinnedMessageId?: string;
  wallpaper?: string;
  isUnread?: boolean;
  messages: MessageItem[];
}

export type Chat = ChatItem;

export interface UserProfile {
  name: string;
  status: string;
  avatar: string;
  phoneNumber?: string;
  hidePhone?: boolean;
  hideAvatar?: boolean;
  hideName?: boolean;
  music?: string;
  banner?: string;
  description?: string;
  about?: string;

  // Extended Profile Fields
  favMusic?: string;
  favMovie?: string;
  favMusicGenre?: string;
  favMovieGenre?: string;
  favFood?: string;
  favColor?: string;
  favDayOfWeek?: string;
  favMonth?: string;
  favYear?: string;
  favHoliday?: string;
  favProfession?: string;
  favBook?: string;
  favBookGenre?: string;

  profileColor?: string;
}

export type QualityLevel = '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '2k' | '4k' | '8k' | '16k';

export interface AppSettings {
  quality: QualityLevel;
  vrMode: boolean;
  cinemaMode: boolean;
  coolMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  notificationFrequency: 'rare' | 'frequent';
}

export type AppTheme =
  | 'telegram_dark'
  | 'telegram_light'
  | 'matrix_green'
  | 'cyberpunk'
  | 'sunset_gold'
  | 'oled_black'
  | 'windows_xp';

export type FontFamilyType = 'mono' | 'sans' | 'serif' | 'display' | 'pixel' | 'comic';

export type ChatWallpaperType =
  | 'cyber_emerald'
  | 'matrix'
  | 'matrix_rain'
  | 'neon_mesh'
  | 'stars_space'
  | 'deep_space'
  | 'sunset_glow'
  | 'grid_cyber'
  | 'minimal_dark'
  | 'soviet_carpet'
  | 'aurora'
  | 'rain'
  | 'snow'
  | 'fireflies'
  | 'bubbles'
  | 'ocean_waves'
  | 'gradient_flow'
  | 'lava_lamp'
  | 'neon_rings'
  | 'twinkle'
  | 'sakura'
  | 'confetti'
  | 'default';

export interface LoginCustomizationData {
  title: string;
  subtitle: string;
  logoType: 'emoji' | 'image' | 'none';
  logoValue: string;
  buttonText: string;
  placeholderText: string;
  customBgUrl?: string;
  cardBannerUrl?: string;
  footerText?: string;
  accentColor?: string;
}

export interface Drawing {
  id: string;
  dataUrl: string;
  date: string;
}
