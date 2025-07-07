// app/complete-registration/layout.tsx

import { PublicLayout } from "@/components/layout/public-layout";

export default function CompleteRegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps the [token]/page.tsx file
  return <PublicLayout>{children}</PublicLayout>;
}