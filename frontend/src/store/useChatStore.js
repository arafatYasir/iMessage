import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    // States
    chats: [],
    users: [],
    messages: [],
    selectedUser: null,
    isChatsLoading: false,
    isUsersLoading: false,
    isMessagesLoading: false,
    activeChatId: null,
    searchQuery: "",
    sidebarTab: "chats",
    composerText: "",
    isSoundEnabled: true,
    isSendingMedia: false,

    // Methods
    getUsers: async () => {
        set({ isUsersLoading: true });

        try {
            const res = await axiosInstance.get("/messages/users");

            set((state) => ({
                users: res.data,
                selectedUser: state.selectedUser && res.data.some((user) => user._id === state.selectedUser._id) ? state.selectedUser : null,
            }));
        } catch (e) {
            console.error("Error in getUsers: ", e.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getChats: async () => {
        set({ isChatsLoading: true });

        try {
            const res = await axiosInstance.get("/messages/chats");

            set({ chats: res.data });
        } catch (e) {
            console.error("Error in getChats: ", e.message);
        } finally {
            set({ isChatsLoading: false });
        }
    },

    getMessages: async (userId) => {
        if (!userId) return;

        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);

            set({ messages: res.data });
        } catch (e) {
            console.error("Error in getmessages: ", e.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        if (!selectedUser) return false;

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

            set({ messages: [...messages, res.data], composerText: "" });

            get().getChats();

            return true;
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to send message");
            return false;
        }
    },

    subscribeToMessages: (userId) => {
        if (!userId) return;

        const { messages } = get();

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            if (String(newMessage.senderId) !== String(userId)) return;

            set((state) => ({ messages: [...state.messages, newMessage] }));

            get().getChats();
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },

    setActiveChatId: (chatId) => {
        set((state) => ({
            activeChatId: chatId,
            selectedUser: state.users.find((user) => user._id === chatId) || state.chats.find((user) => user._id === chatId) || null,
            messages: chatId ? state.messages : []
        }))
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
    },

    setSidebarTab: (tab) => {
        set({ sidebarTab: tab });
    },

    setComposerText: (text) => {
        set({ composerText: text });
    },

    setSoundEnabled: (isEnabled) => {
        set({ isSoundEnabled: isEnabled });
    },

    sendTextMessage: async (chatId) => {
        const { composerText } = get();
        const messageText = composerText.trim();

        if (!chatId || !messageText) return false;

        return await get().sendMessage({ text: messageText });
    },

    sendMediaMessage: async ({ chatId, file }) => {
        if (!chatId || !file) return false;

        const formData = new FormData();
        formData.append("media", file);

        set({ isSendingMedia: true });

        try {
            return await get().sendMessage(formData);
        } finally {
            set({ isSendingMedia: false });
        }
    }
}));