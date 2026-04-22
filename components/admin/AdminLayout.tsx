import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar user={user} />
      <div className="flex-1 flex flex-col ml-64">
        <AdminHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
