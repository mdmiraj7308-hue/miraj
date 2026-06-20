import { MessagesInbox } from "@/components/admin/messages/MessagesInbox";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getContactMessages } from "@/lib/admin/queries";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description="View and manage contact form submissions from your portfolio."
      />
      <MessagesInbox messages={messages} />
    </div>
  );
}
