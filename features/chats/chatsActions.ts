import { Chat, Message } from "@/types";
import { chatsCollection, messagesCollection } from "@/lib/collactions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import { RootState } from "@/store/configureStore";

export const createChat = createAsyncThunk(
  "chat/create",
  async (data: Chat): Promise<string | null> => {
    try {
      if (!data) return null;
      const created = await addDoc(chatsCollection, data);
      return created.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: Message) => {
    try {
      await addDoc(messagesCollection, data);
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (id: string) => {
    try {
      const messageRef = doc(messagesCollection, id);
      await deleteDoc(messageRef);
    } catch (error) {
      console.log(error);
    }
    return id; // return id to trigger re-render of chat page
  }
);
