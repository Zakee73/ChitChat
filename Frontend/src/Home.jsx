import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  CheckCheck,
  Smile,
  LogOut,
  Plus,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";
import axiosInstance from "./lib/axios";
import useAuthstore from "./store/useAuthstore.js";
import useChatStore from "./store/useChatStore.js";
import useSocketStore from "./store/useSocketStore.js";

function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";
}

function formatMessageTime(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ContactAvatar({ contact, size = "h-12 w-12" }) {
  return (
    <div className="relative shrink-0">
      <Avatar className={size}>
        <AvatarImage 
          src={contact.coverImage || ""}
          alt={contact.username || "User"}
        />
        <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-800">
          {getInitials(contact.username)}
        </AvatarFallback>
      </Avatar>

      {contact.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
      )}
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const fileInputRef = useRef(null);
  // Auth store
  const authUser = useAuthstore((state) => state.authUser);
  const logoutUser = useAuthstore((state) => state.logout);

  // Chat store
  const navigate = useNavigate();
  const users = useChatStore((state) => state.users);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);
  const isMessagesLoading = useChatStore(
    (state) => state.isMessagesLoading
  );
  const isSendingMessage = useChatStore(
    (state) => state.isSendingMessage
  );

  const getUsers = useChatStore((state) => state.getUsers);
  const setSelectedUser = useChatStore(
    (state) => state.setSelectedUser
  );
  const getMessages = useChatStore((state) => state.getMessages);
  const sendMessageToBackend = useChatStore(
    (state) => state.sendMessage
  );

  // Socket store
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const connectSocket = useSocketStore(
    (state) => state.connectSocket
  );
  const disconnectSocket = useSocketStore(
    (state) => state.disconnectSocket
  );

  // Fetch users and connect socket after login
  useEffect(() => {
    if (!authUser?._id) {
      window.location.replace("/login");
      return;
    }

    getUsers();
    connectSocket(authUser);

    return () => {
      disconnectSocket();
    };
  }, [authUser, getUsers, connectSocket, disconnectSocket]);

  // Update online status for contacts
  const contacts = useMemo(() => {
    return users.map((user) => ({
      ...user,
      online: onlineUsers.includes(String(user._id)),
    }));
  }, [users, onlineUsers]);

  // Search users
  const filteredContacts = useMemo(() => {
    const searchText = search.toLowerCase();

    return contacts.filter(
      (contact) =>
        contact.username?.toLowerCase().includes(searchText) ||
        contact.email?.toLowerCase().includes(searchText)
    );
  }, [contacts, search]);

  // Open a real conversation
  async function openChat(contact) {
    setSelectedUser(contact);
    setShowChat(true);
    setMessage("");

    await getMessages(contact._id);
  }

  // Send message through backend API
 async function handleSendMessage(event) {
  event.preventDefault();

  if ((!message.trim() && !selectedFile) || !selectedUser || isSendingMessage) {
    return;
  }

  const sentMessage = await sendMessageToBackend({
    message,
    file: selectedFile,
  });

  if (sentMessage) {
    setMessage("");
    setSelectedFile(null);
    setShowEmojiPicker(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
}

  // Logout
  async function handleLogout() {
  try {
    await axiosInstance.post("/users/logout");
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    disconnectSocket();
    logoutUser();
    navigate("/login", { replace: true });
  }
      }

  return (
    <main className="h-dvh overflow-hidden bg-slate-950 p-0 text-white sm:p-3 md:p-5">
      <div className="mx-auto flex h-full w-full max-w-7xl overflow-hidden border border-slate-800 bg-slate-900 sm:rounded-2xl">

        {/* LEFT SIDEBAR */}
        <aside
          className={`${
            showChat ? "hidden" : "flex"
          } w-full flex-col border-r border-slate-800 sm:flex sm:w-80 sm:shrink-0 lg:w-96`}
        >
          {/* App header */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <MessageCircle size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  ChitChat
                </h1>
                <p className="text-xs text-slate-400">
                  Stay connected
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
              aria-label="New chat"
            >
              <Plus size={21} />
            </Button>
          </div>

          <Separator className="bg-slate-800" />

          {/* Current user */}
          <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src={authUser?.coverImage || ""}
                alt={authUser?.username || "Your profile"}
              />
              <AvatarFallback className="bg-indigo-500 font-semibold text-white">
                {getInitials(authUser?.username)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {authUser?.username || "User"}
              </p>
              <p className="text-xs text-emerald-400">
                Available
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Log out"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 pb-4 sm:px-5">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search people..."
                className="h-11 border-slate-700 bg-slate-800 pl-10 placeholder:text-slate-400 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="px-5 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              People
            </p>
          </div>

          {/* Real users from database */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-1 px-2 pb-3">
              {isUsersLoading ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">
                  Loading users...
                </p>
              ) : (
                <>
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact._id}
                      onClick={() => openChat(contact)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                        selectedUser?._id === contact._id
                          ? "bg-emerald-500/10"
                          : "hover:bg-slate-800"
                      }`}
                    >
                      <ContactAvatar contact={contact} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-100">
                            {contact.username}
                          </p>

                          <span className="shrink-0 text-[10px] text-slate-500">
                            {contact.online ? "Online" : "Offline"}
                          </span>
                        </div>

                        <div className="mt-1">
                          <p className="truncate text-xs text-slate-400">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {filteredContacts.length === 0 && (
                    <p className="px-4 py-8 text-center text-sm text-slate-500">
                      {search
                        ? "No users found."
                        : "No other users registered yet."}
                    </p>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-slate-800 px-4 py-3">
            <p className="text-center text-xs text-slate-500">
              ChitChat · Your space to connect
            </p>
          </div>
        </aside>

        {/* RIGHT CHAT AREA */}
        <section
          className={`${
            showChat ? "flex" : "hidden"
          } min-w-0 flex-1 flex-col sm:flex`}
        >
          {selectedUser ? (
            <>
              {/* Chat header */}
              <header className="flex items-center gap-3 border-b border-slate-800 px-3 py-3 sm:px-5 sm:py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-slate-300 hover:bg-slate-800 hover:text-white sm:hidden"
                  onClick={() => setShowChat(false)}
                  aria-label="Back to contacts"
                >
                  <ArrowLeft size={20} />
                </Button>

                <ContactAvatar
                  contact={{
                    ...selectedUser,
                    online: onlineUsers.includes(
                      String(selectedUser._id)
                    ),
                  }}
                  size="h-10 w-10"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold sm:text-base">
                    {selectedUser.username}
                  </h2>

                  <p className="text-xs text-slate-400">
                    {onlineUsers.includes(String(selectedUser._id)) ? (
                      <span className="text-emerald-400">Online</span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-0 sm:gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden text-slate-400 hover:bg-slate-800 hover:text-white sm:inline-flex"
                    aria-label="Voice call"
                  >
                    <Phone size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden text-slate-400 hover:bg-slate-800 hover:text-white sm:inline-flex"
                    aria-label="Video call"
                  >
                    <Video size={19} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:bg-slate-800 hover:text-white"
                    aria-label="More options"
                  >
                    <MoreVertical size={20} />
                  </Button>
                </div>
              </header>

              {/* Messages */}
              <ScrollArea className="min-h-0 flex-1">
                <div className="flex min-h-full flex-col justify-end gap-4 bg-slate-950/40 px-3 py-5 sm:px-6 sm:py-6">
                  {isMessagesLoading ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                      Loading messages...
                    </p>
                  ) : messages.length === 0 ? (
                    <div className="my-auto text-center">
                      <MessageCircle
                        size={32}
                        className="mx-auto mb-3 text-slate-600"
                      />
                      <p className="text-sm text-slate-400">
                        No messages yet.
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Send a message to start the conversation.
                      </p>
                    </div>
                  ) : (
                    messages.map((item) => {
                      const mine =
                        String(item.senderId) === String(authUser?._id);

                      return (
                        <div
                          key={item._id}
                          className={`flex ${
                            mine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] break-words rounded-2xl px-3 py-2 sm:max-w-[75%] sm:px-4 ${
                              mine
                                ? "rounded-br-sm bg-emerald-600 text-white"
                                : "rounded-bl-sm border border-slate-700 bg-slate-800 text-slate-100"
                            }`}
                          >
                            {item.messageType === "image" && (
  <a href={item.attachment.url} target="_blank" rel="noreferrer">
    <img
      src={item.attachment.url}
      alt={item.attachment.fileName || "Shared image"}
      className="mb-2 max-h-72 max-w-full rounded-lg object-contain"
    />
  </a>
)}

{item.messageType === "video" && (
  <video
    src={item.attachment.url}
    controls
    className="mb-2 max-h-72 max-w-full rounded-lg"
  />
)}

{item.messageType === "file" && (
  <a
    href={item.attachment.url}
    target="_blank"
    rel="noreferrer"
    className="mb-2 flex items-center gap-2 rounded-lg bg-black/20 p-3 underline"
  >
    <Paperclip size={18} />
    <span className="break-all text-sm">
      {item.attachment.fileName || "Download file"}
    </span>
  </a>
)}

{item.message && (
  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
    {item.message}
  </p>
)}

                            <div
                              className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                mine
                                  ? "text-emerald-100"
                                  : "text-slate-400"
                              }`}
                            >
                              {formatMessageTime(item.createdAt)}
                              {mine && <CheckCheck size={14} />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Message composer */}
              {/* Message composer */}
<form
  onSubmit={handleSendMessage}
  className="relative border-t border-slate-800 bg-slate-900 p-3 sm:px-5 sm:py-4"
>
  {showEmojiPicker && (
    <div className="absolute bottom-20 left-3 z-50">
      <EmojiPicker
        onEmojiClick={(emojiData) =>
          setMessage((prev) => prev + emojiData.emoji)
        }
        theme="dark"
        height={350}
      />
    </div>
  )}

  {selectedFile && (
    <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-800 p-3">
      <p className="truncate text-sm text-white">
        {selectedFile.name}
      </p>
      <button
        type="button"
        onClick={() => {
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        className="ml-3 text-red-400"
      >
        Remove
      </button>
    </div>
  )}

  <input
    ref={fileInputRef}
    type="file"
    hidden
    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,application/pdf"
    onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        toast.error("Maximum attachment size is 50 MB");
        event.target.value = "";
        return;
      }

      setSelectedFile(file);
    }}
  />

  <div className="flex items-center gap-2">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => fileInputRef.current?.click()}
      aria-label="Attach file"
    >
      <Paperclip size={20} />
    </Button>

    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setShowEmojiPicker((prev) => !prev)}
      aria-label="Choose emoji"
    >
      <Smile size={20} />
    </Button>

    <Input
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      placeholder="Type a message..."
      className="h-11 min-w-0 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
      aria-label="Message"
    />

    <Button
      type="submit"
      size="icon"
      disabled={(!message.trim() && !selectedFile) || isSendingMessage}
      className="h-11 w-11 shrink-0 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40"
      aria-label="Send message"
    >
      <Send size={18} />
    </Button>
  </div>
</form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400">
                <MessageCircle size={38} />
              </div>

              <h2 className="text-xl font-bold">
                Welcome to ChitChat
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Choose a person from the sidebar to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
