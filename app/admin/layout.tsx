import { AdminSidebar } from "@/components/AdminSidebar";
import { MilestoneBlockOverlay } from "@/components/MilestoneBlockOverlay";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink text-light md:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
      <MilestoneBlockOverlay />
    </div>
  );
}
