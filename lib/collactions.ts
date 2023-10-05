import { AppUser } from "@/features/auth/authSlice";
import { createCollection } from "@/firebase";
import { Chat, Comment, Feed, Message, WirelessQuote } from "@/types";

export const feedsColletion = createCollection<Feed>("feeds");
export const chatsColletion = createCollection<Chat>("chats");
export const messagesCollection = createCollection<Message>("messages");
export const wirelessQuotesCollection =
  createCollection<WirelessQuote>("quotes");

export const usersCollection = createCollection<AppUser>("users");
export const chatsCollection = createCollection<Chat>("chats");
export const commentsCollection = (feedId: string) =>
  createCollection<Comment>(`comments/${feedId}/comments`);
