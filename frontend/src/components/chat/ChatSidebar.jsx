import { getInitials, useSelectedChat } from "../../hooks/useSelectedChat";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import AppLogo, { APP_NAME } from "../AppLogo";
import { UserButton } from "@clerk/react";

import { SearchField, Tabs } from "@heroui/react";
import { MessageSquareIcon, UsersIcon } from "lucide-react";
import { ConversationRow } from "./ConversationRow";

function mapUserForList(user, onlineUsers) {
    return {
        conversationId: user._id,
        id: user._id,
        name: user.fullName,
        avatarUrl: user.profilePic,
        initials: getInitials(user.fullName),
        isOnline: onlineUsers.includes(user._id),
        peer: {
            name: user.fullName,
            avatarUrl: user.profilePic,
            initials: getInitials(user.fullName),
            isOnline: onlineUsers.includes(user._id),
        },
    };
}

function ChatSidebar() {
    const { chats, users, searchQuery, setSearchQuery, sidebarTab, setSidebarTab, setActiveChatId } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const { activeChatId, isLargeScreen } = useSelectedChat();

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    const chatUsers = chats.map((user) => mapUserForList(user, onlineUsers));
    const allUsers = users.map((user) => mapUserForList(user, onlineUsers));

    const filteredChats = normalizedSearchQuery
        ? chatUsers.filter((chat) =>
            chat.peer.name.toLowerCase().includes(normalizedSearchQuery),
        )
        : chatUsers;

    const filteredUsers = normalizedSearchQuery
        ? allUsers.filter((user) => user.name.toLowerCase().includes(normalizedSearchQuery))
        : allUsers;

    return (
        <aside
            className={`w-full shrink-0 flex-col overflow-hidden border-r border-border lg:w-72 ${!isLargeScreen && activeChatId ? "hidden lg:flex" : "flex"
                }`}
        >
            <div className="shrink-0 border-b border-border px-2 pb-2 pt-2.5 sm:px-3 sm:pt-3">
                <div className="flex items-center gap-2 px-0.5 sm:gap-2.5 sm:px-1">
                    <AppLogo size={32} className="size-8 shrink-0 rounded-[9px] sm:size-8.5" alt="" />
                    <p className="flex-1 truncate text-lg font-bold tracking-tight sm:text-[22px]">
                        {APP_NAME}
                    </p>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "size-8",
                            },
                        }}
                    />
                </div>
            </div>

            <Tabs
                selectedKey={sidebarTab}
                onSelectionChange={(key) => setSidebarTab(String(key))}
                variant="secondary"
                className="flex flex-1 flex-col overflow-y-auto"
            >
                <div className="shrink-0 border-b border-border px-3 pb-2 pt-2">
                    <SearchField
                        fullWidth
                        variant="secondary"
                        className="w-full"
                        value={searchQuery}
                        onChange={setSearchQuery}
                        aria-label="search"
                    >
                        <SearchField.Group className="rounded-xl">
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder="Search" />
                            {searchQuery ? <SearchField.ClearButton /> : null}
                        </SearchField.Group>
                    </SearchField>
                </div>

                <Tabs.ListContainer className="shrink-0 border-b border-border px-2 pb-2 pt-1">
                    <Tabs.List className="w-full gap-0.5">
                        <Tabs.Tab id="chats" className="flex-1 justify-center gap-1.5">
                            <MessageSquareIcon className="size-3.5 opacity-80" aria-hidden />
                            Chats
                        </Tabs.Tab>
                        <Tabs.Tab id="users" className="flex-1 justify-center gap-1.5">
                            <UsersIcon className="size-3.5 opacity-80" aria-hidden />
                            Users
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel
                    id="chats"
                    className="flex-1 overflow-x-hidden overflow-y-auto outline-none"
                >
                    {filteredChats.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-muted">
                            No conversations match your search.
                        </p>
                    ) : (
                        filteredChats.map((chat) => (
                            <ConversationRow
                                key={chat.id}
                                user={chat}
                                selected={chat.id === activeChatId}
                                onSelect={() => setActiveChatId(chat.id)}
                            />
                        ))
                    )}
                </Tabs.Panel>

                <Tabs.Panel id="users" className="flex-1 overflow-x-hidden overflow-y-auto outline-none">
                    {filteredUsers.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-muted">No people match your search.</p>
                    ) : (
                        filteredUsers.map((user) => (
                            <ConversationRow
                                key={user.id}
                                user={user}
                                selected={user.id === activeChatId}
                                onSelect={() => setActiveChatId(user.id)}
                            />
                        ))
                    )}
                </Tabs.Panel>
            </Tabs>
        </aside>
    );
}
export default ChatSidebar;