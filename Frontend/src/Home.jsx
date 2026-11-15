import { useMemo, useState } from "react";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const initialContacts = [
  {
    id: 1,
    name: "Sanaya Khan",
    initials: "SK",
    online: true,
    lastMessage: "Hey, how are you?",
    time: "10:42 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Sant Kumar",
    initials: "SK",
    online: true,
    lastMessage: "Let's talk later.",
    time: "10:30 AM",
    unread: 0,
  },
  {
    id: 3,
    name: "Aman Verma",
    initials: "AV",
    online: false,
    lastMessage: "Thanks bro!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 4,
    name: "Priya Sharma",
    initials: "PS",
    online: true,
    lastMessage: "That sounds great!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 5,
    name: "Rahul Singh",
    initials: "RS",
    online: false,
    lastMessage: "See you tomorrow.",
    time: "Monday",
    unread: 0,
  },
];

const initialMessages = {
  1: [
    {
      id: 1,
      text: "Hey! How are you?",
      sender: "them",
      time: "10:40 AM",
    },
    {
      id: 2,
      text: "I'm good! What about you?",
      sender: "me",
      time: "10:41 AM",
    },
    {
      id: 3,
      text: "I'm doing great 😊",
      sender: "them",
      time: "10:42 AM",
    },
  ],
  2: [
    {
      id: 1,
      text: "Hey, are you free today?",
      sender: "them",
      time: "10:25 AM",
    },
    {
      id: 2,
      text: "Yes, what's up?",
      sender: "me",
      time: "10:28 AM",
    },
    {
      id: 3,
      text: "Let's talk later.",
      sender: "them",
      time: "10:30 AM",
    },
  ],
  3: [
    {
      id: 1,
      text: "Thanks bro!",
      sender: "them",
      time: "Yesterday",
    },
  ],
  4: [
    {
      id: 1,
      text: "That sounds great!",
      sender: "them",
      time: "Yesterday",
    },
  ],
  5: [
    {
      id: 1,
      text: "See you tomorrow.",
      sender: "them",
      time: "Monday",
    },
  ],
};

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ContactAvatar({ contact, size = "h-12 w-12" }) {
  return (
    <div className="relative shrink-0">
      <Avatar className={size}>
        <AvatarFallback className="bg-emerald-100 font-semibold text-emerald-800">
          {contact.initials}
        </AvatarFallback>
      </Avatar>

      {contact.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
      )}
    </div>
  );
}

export default function Home() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState(initialMessages);

  const selectedContact = contacts.find(
    (contact) => contact.id === selectedId
  );

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  function openChat(contact) {
    setSelectedId(contact.id);
    setShowChat(true);

    setContacts((previous) =>
      previous.map((item) =>
        item.id === contact.id ? { ...item, unread: 0 } : item
      )
    );
  }

  function sendMessage(event) {
    event.preventDefault();

    const text = message.trim();
    if (!text || !selectedContact) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: "me",
      time: getTime(),
    };

    setMessages((previous) => ({
      ...previous,
      [selectedId]: [
        ...(previous[selectedId] || []),
        newMessage,
      ],
    }));

    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === selectedId
          ? { ...contact, lastMessage: text, time: "Now" }
          : contact
      )
    );

    setMessage("");
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
              <AvatarFallback className="bg-indigo-500 font-semibold text-white">
                ZK
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">Your Name</p>
              <p className="text-xs text-emerald-400">
                Available
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Log out"
              onClick={() => {
                window.location.href = "/login";
              }}
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
              Recent chats
            </p>
          </div>

          {/* Contacts */}
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-1 px-2 pb-3">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => openChat(contact)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    selectedId === contact.id
                      ? "bg-emerald-500/10"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <ContactAvatar contact={contact} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-100">
                        {contact.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-slate-500">
                        {contact.time}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-400">
                        {contact.lastMessage}
                      </p>

                      {contact.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {filteredContacts.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  No contacts found.
                </p>
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
          {selectedContact ? (
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
                  contact={selectedContact}
                  size="h-10 w-10"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold sm:text-base">
                    {selectedContact.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedContact.online ? (
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
                  <div className="mb-3 text-center">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-400">
                      Today
                    </span>
                  </div>

                  {(messages[selectedId] || []).map((item) => {
                    const mine = item.sender === "me";

                    return (
                      <div
                        key={item.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] break-words rounded-2xl px-3 py-2 sm:max-w-[75%] sm:px-4 ${
                            mine
                              ? "rounded-br-sm bg-emerald-600 text-white"
                              : "rounded-bl-sm border border-slate-700 bg-slate-800 text-slate-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {item.text}
                          </p>

                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                              mine ? "text-emerald-100" : "text-slate-400"
                            }`}
                          >
                            {item.time}
                            {mine && <CheckCheck size={14} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Message composer */}
              <form
                onSubmit={sendMessage}
                className="border-t border-slate-800 bg-slate-900 p-3 sm:px-5 sm:py-4"
              >
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hidden shrink-0 text-slate-400 hover:bg-slate-800 hover:text-white sm:inline-flex"
                    aria-label="Attach file"
                  >
                    <Paperclip size={20} />
                  </Button>

                  <div className="relative min-w-0 flex-1">
                    <Input
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Type a message..."
                      className="h-11 border-slate-700 bg-slate-800 pr-10 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                      aria-label="Message"
                    />
                    <Smile
                      size={19}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim()}
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
              <h2 className="text-xl font-bold">Welcome to ChitChat</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Choose a conversation from the sidebar to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}