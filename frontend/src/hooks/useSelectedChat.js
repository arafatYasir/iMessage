import { useMediaQuery } from "./useMediaQuery";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((namePart) => namePart[0])
        .join("");
}


function mapUserToChat({ user, messages, authUser, onlineUsers }) {
    const mappedMessages = messages.map((message) => ({
        id: message._id,
        role: String(message.senderId) === String(authUser?._id) ? "me" : "them",
        text: message.text || "",
        time: formatMessageTime(message.createdAt),
        imageUrl: message.image,
        videoUrl: message.video,
    }));

    return {
        id: user._id,
        peer: {
            name: user.fullName,
            subtitle: user.email,
            isOnline: onlineUsers.includes(user._id),
            avatarUrl: user.profilePic,
            initials: getInitials(user.fullName),
        },
        messages: mappedMessages,
    };
}

export function useSelectedChat() {
    const { activeChatId, chats, users, messages } = useChatStore();
    const { authUser, onlineUsers } = useAuthStore();

    const isLargeScreen = useMediaQuery("(min-width: 1024px)");

    const selectedUser = activeChatId
        ? users.find((user) => user._id === activeChatId) ||
        chats.find((user) => user._id === activeChatId)
        : null;

    const activeChat = selectedUser
        ? mapUserToChat({ user: selectedUser, messages, authUser, onlineUsers })
        : null;

    return {
        activeChat,
        activeChatId,
        isLargeScreen,
    };
}