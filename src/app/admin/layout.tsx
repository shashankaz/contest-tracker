import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./_components/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="p-2">{children}</main>
    </SidebarProvider>
  );
};

export default AdminLayout;
