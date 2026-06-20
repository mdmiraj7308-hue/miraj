"use client";

import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import {
  deleteMessage,
  markAllMessagesRead,
  toggleMessageRead,
} from "@/actions/messages";
import { AdminButton } from "@/components/admin/AdminButton";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import {
  adminCardClassName,
  adminTableClassName,
  adminTdClassName,
  adminThClassName,
} from "@/lib/admin/forms";
import type { ContactMessage } from "@/types";

type MessagesInboxProps = {
  messages: ContactMessage[];
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function MessagesInbox({ messages }: MessagesInboxProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    messages[0]?.id ?? null,
  );

  const selected = messages.find((message) => message.id === selectedId) ?? null;
  const unreadCount = messages.filter((message) => !message.read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {messages.length} message{messages.length === 1 ? "" : "s"}
          {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
        </p>
        {unreadCount > 0 ? (
          <form action={markAllMessagesRead}>
            <AdminButton type="submit" variant="secondary" size="sm">
              Mark all as read
            </AdminButton>
          </form>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <div className={adminCardClassName}>
          <p className="text-sm text-gray-500">No messages yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className={adminCardClassName}>
            <div className="overflow-x-auto">
              <table className={adminTableClassName}>
                <thead>
                  <tr>
                    <th className={adminThClassName}>From</th>
                    <th className={adminThClassName}>Subject</th>
                    <th className={adminThClassName}>Date</th>
                    <th className={adminThClassName}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className={
                        selectedId === message.id ? "bg-theme/5" : undefined
                      }
                    >
                      <td className={adminTdClassName}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(message.id)}
                          className="text-left"
                        >
                          <p
                            className={
                              message.read
                                ? "font-medium text-gray-700"
                                : "font-semibold text-gray-900"
                            }
                          >
                            {message.name}
                          </p>
                          <p className="text-xs text-gray-500">{message.email}</p>
                        </button>
                      </td>
                      <td className={adminTdClassName}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(message.id)}
                          className="text-left text-gray-700"
                        >
                          {message.subject || "(No subject)"}
                        </button>
                      </td>
                      <td className={adminTdClassName}>
                        {formatDate(message.created_at)}
                      </td>
                      <td className={adminTdClassName}>
                        {message.read ? (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <MailOpen className="h-3.5 w-3.5" />
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                            <Mail className="h-3.5 w-3.5" />
                            Unread
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={adminCardClassName}>
            {selected ? (
              <>
                <div className="mb-4 border-b border-gray-100 pb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {selected.subject || "(No subject)"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    From {selected.name} ·{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-theme hover:underline"
                    >
                      {selected.email}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(selected.created_at)}
                  </p>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {selected.message}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={selected.id} />
                    <input
                      type="hidden"
                      name="read"
                      value={selected.read ? "false" : "true"}
                    />
                    <AdminButton type="submit" variant="secondary" size="sm">
                      {selected.read ? "Mark as unread" : "Mark as read"}
                    </AdminButton>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={selected.id} />
                    <DeleteConfirmButton confirmMessage="Delete this message permanently?" />
                  </form>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Select a message to view.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
