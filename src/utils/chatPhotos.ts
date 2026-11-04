// Utility for collecting and selecting photos proposed / shared by the user in chat
export interface ChatPhotoItem {
  id: string;
  url: string;
  timestamp: number;
  caption?: string;
  sender?: string;
}

const STORAGE_KEY = 'user_chat_shared_photos';
const AVATAR_KEY = 'app_user_avatar_custom';

export function getChatPhotos(): ChatPhotoItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatPhoto(url: string, caption?: string, sender = 'Вы'): ChatPhotoItem | null {
  if (!url || typeof window === 'undefined') return null;
  try {
    const photos = getChatPhotos();
    // Avoid duplicate URLs
    const existing = photos.find((p) => p.url === url);
    if (existing) return existing;

    const newPhoto: ChatPhotoItem = {
      id: `chat_photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      url,
      timestamp: Date.now(),
      caption: caption || 'Фотография из чата',
      sender,
    };

    photos.unshift(newPhoto);
    // Keep max 60 photos
    const trimmed = photos.slice(0, 60);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent('chat_photos_updated', { detail: trimmed }));
    return newPhoto;
  } catch {
    return null;
  }
}

export function deleteChatPhoto(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const photos = getChatPhotos().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    window.dispatchEvent(new CustomEvent('chat_photos_updated', { detail: photos }));
  } catch {}
}

export function setUserAvatar(url: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AVATAR_KEY, url);
    localStorage.setItem('profile_avatar_url', url);
    window.dispatchEvent(new CustomEvent('avatar_updated', { detail: url }));
  } catch {}
}

export function getUserAvatar(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(AVATAR_KEY) || localStorage.getItem('profile_avatar_url');
  } catch {
    return null;
  }
}
