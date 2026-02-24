import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div className="space-y-6">{children}</div>
    </div>
  );
}

