import { List, FileText, Database, LifeBuoy, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  {
    title: "Manage Contests",
    url: "/admin/manage-contests",
    icon: List,
  },
  {
    title: "Manage Solutions",
    url: "/admin/manage-solutions",
    icon: FileText,
  },
  {
    title: "Manage Platforms",
    url: "/admin/manage-platforms",
    icon: Database,
  },
  {
    title: "Health Check",
    url: "/admin/health-check",
    icon: LifeBuoy,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const SidebarMain = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contest Tracker</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMain;
