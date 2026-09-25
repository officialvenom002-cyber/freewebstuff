import { isAuthenticatedAdmin } from "@/lib/auth/admin-auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal — FreeWebStuff",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin();
  return <AdminDashboardClient initialAuth={isAuth} />;
}
