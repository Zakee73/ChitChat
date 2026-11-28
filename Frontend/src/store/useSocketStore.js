import { create } from "zustand";
import { io } from "socket.io-client";
import useChatStore from "./useChatStore";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8081";

const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (user) => {
    if (!user?._id) return;

    const existingSocket = get().socket;

    if (existingSocket?.connected) return;

    existingSocket?.disconnect();

    const socket = io(SOCKET_URL, {
      query: { userId: user._id },
      withCredentials: true,
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, addMessage } = useChatStore.getState();

      if (
        selectedUser &&
        String(newMessage.senderId) === String(selectedUser._id)
      ) {
        addMessage(newMessage);
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }

    set({ socket: null, onlineUsers: [] });
  },
}));

export default useSocketStore;