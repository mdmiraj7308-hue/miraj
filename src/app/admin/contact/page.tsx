import { ContactForm } from "@/components/admin/forms/ContactForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getContactContent } from "@/lib/admin/queries";
import { isContactEmailConfigured } from "@/lib/email/contact-notification";

export default async function AdminContactPage() {
  const content = await getContactContent();

  return (
    <div>
      <AdminPageHeader
        title="Contact"
        description="Edit contact settings, WhatsApp link, notification email, and social links."
      />
      <ContactForm
        content={content}
        emailConfigured={isContactEmailConfigured()}
      />
    </div>
  );
}
