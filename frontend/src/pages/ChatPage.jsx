import { useWallpaper } from "../context/wallpaper";
import { useChatStore } from "../store/useChatStore";
import { useSelectedChat } from "../hooks/useSelectedChat";
import { useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar"
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { ChatComposer } from "../components/chat/ChatComposer";

const ChatPage = () => {
    const { frameStyle } = useWallpaper();
    const { getChats, getMessages, getUsers, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

    const { activeChat, activeChatId, isLargeScreen } = useSelectedChat();

    useEffect(() => {
        getChats();
        getUsers();
    }, [getChats, getUsers]);

    useEffect(() => {
        if (!activeChatId) return;

        getMessages(activeChatId);
        subscribeToMessages(activeChatId);

        return () => unsubscribeFromMessages();
    }, [getMessages, activeChatId, subscribeToMessages, unsubscribeFromMessages]);

    return (
        <div className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8" style={frameStyle}>
            <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
                <ChatSidebar />

                <div
                    className={`flex-1 flex-col overflow-hidden ${!isLargeScreen && !activeChatId ? "hidden lg:flex" : "flex"
                        }`}
                >
                    <ChatHeader />
                    <MessageList />

                    {activeChat ? <ChatComposer /> : null}
                </div>
            </div>
        </div>
    )
}

export default ChatPage