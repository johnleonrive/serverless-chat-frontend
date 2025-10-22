'use client';

import { useState } from 'react';
import { useChatStore } from '@/lib/store';

interface SidebarProps {
  username: string;
  onLogout: () => void;
}

export default function Sidebar({ username, onLogout }: SidebarProps) {
  const { recipientId, contacts, selectChat, addContact, removeContact } =
    useChatStore();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    contactId: string;
  } | null>(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendId, setNewFriendId] = useState('');
  const [newFriendName, setNewFriendName] = useState('');

  const handleContextMenu = (
    e: React.MouseEvent,
    contactId: string,
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      contactId,
    });
  };

  const handleDeleteContact = () => {
    if (contextMenu) {
      removeContact(contextMenu.contactId);
      setContextMenu(null);
    }
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendId.trim() && newFriendName.trim()) {
      // Check if contact already exists
      if (!contacts.find((c) => c.id === newFriendId.trim().toLowerCase())) {
        addContact({
          id: newFriendId.trim().toLowerCase(),
          name: newFriendName.trim(),
        });
        setNewFriendId('');
        setNewFriendName('');
        setShowAddFriend(false);
      } else {
        alert('Contact already exists!');
      }
    }
  };

  // Close context menu when clicking elsewhere
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      {/* Click outside to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={handleCloseContextMenu}
        />
      )}

      <aside className="flex w-64 flex-col border-r border-gray-300 bg-white">
        {/* Profile Section - Top Left */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500 text-gray-900">
              <span className="text-lg font-semibold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-gray-900">
                {username}
              </p>
              <p className="text-xs text-gray-700">Online</p>
            </div>
          </div>
        </div>

        {/* Contacts Section - Middle */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
            <button
              onClick={() => setShowAddFriend(true)}
              className="rounded-md p-1 text-gray-900 transition hover:bg-lime-100"
              title="Add Friend"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center text-sm text-gray-700">
              No contacts yet. Add a friend to start chatting!
            </div>
          ) : (
            <nav className="space-y-2">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => selectChat(contact.id)}
                  onContextMenu={(e) => handleContextMenu(e, contact.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-2 transition ${
                    recipientId === contact.id
                      ? 'bg-lime-400 text-gray-900'
                      : 'text-gray-900 hover:bg-lime-100'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 text-gray-900">
                    <span className="text-sm font-semibold">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{contact.name}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Logout Section - Bottom Left */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-lime-100 focus:outline-none focus:ring-2 focus:ring-lime-400"
          >
            <span>Log Out</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-20 w-40 rounded-md border border-gray-300 bg-white shadow-lg"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={handleDeleteContact}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            Delete Contact
          </button>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Add Friend
            </h3>
            <form onSubmit={handleAddFriend} className="space-y-4">
              <div>
                <label
                  htmlFor="friendId"
                  className="block text-sm font-medium text-gray-900"
                >
                  Friend Username
                </label>
                <input
                  id="friendId"
                  type="text"
                  value={newFriendId}
                  onChange={(e) => setNewFriendId(e.target.value)}
                  placeholder="e.g., alice"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="friendName"
                  className="block text-sm font-medium text-gray-900"
                >
                  Display Name
                </label>
                <input
                  id="friendName"
                  type="text"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="e.g., Alice Smith"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-lime-500 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  Add Friend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFriend(false);
                    setNewFriendId('');
                    setNewFriendName('');
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
