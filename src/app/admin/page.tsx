import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminPage = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <SidebarTrigger /> <span>Welcome, Admin</span>
      </div>
    </div>
  );
};

export default AdminPage;
