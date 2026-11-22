import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const response = await axiosInstance.get("/users");

      set({
        users: response.data.data || response.data.users || [],
      });
    } catch (error) {
      console.error("Get users error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  setSelectedUser: (user) => {
    set({
      selectedUser: user,
      messages: [],
    });
  },

  getMessages: async (userId) => {
    if (!userId) return;

    set({ isMessagesLoading: true });

    try {
      const response = await axiosInstance.get(`/messages/${userId}`);

      set({
        messages: Array.isArray(response.data)
          ? response.data
          : response.data.data || [],
      });
    } catch (error) {
      console.error("Get messages error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedUser, messages } = get();

    if (!selectedUser?._id || !message.trim()) return;

    set({ isSendingMessage: true });

    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        { message }
      );

      const newMessage =
        response.data.newMessage || response.data.data?.newMessage;

      if (!newMessage) {
        throw new Error("Message response is missing");
      }

      set({
        messages: [...messages, newMessage],
      });

      return newMessage;
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send message"
      );
      return null;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  addMessage: (newMessage) => {
    set((state) => {
      const alreadyExists = state.messages.some(
        (message) => message._id === newMessage._id
      );

      if (alreadyExists) return state;

      return {
        messages: [...state.messages, newMessage],
      };
    });
  },

  clearChat: () => {
    set({
      selectedUser: null,
      messages: [],
    });
  },
}));

export default useChatStore;