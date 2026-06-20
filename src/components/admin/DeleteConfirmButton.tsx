"use client";

import { AdminButton } from "@/components/admin/AdminButton";

type DeleteConfirmButtonProps = {
  label?: string;
  confirmMessage?: string;
  className?: string;
};

export function DeleteConfirmButton({
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this item?",
  className,
}: DeleteConfirmButtonProps) {
  return (
    <AdminButton
      type="submit"
      variant="danger"
      size="sm"
      className={className}
      onClick={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </AdminButton>
  );
}
