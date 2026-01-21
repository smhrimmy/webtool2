import { 
  Globe, 
  Mail, 
  Code2, 
  Wrench, 
  LayoutDashboard,
  Bug,
  FileText,
  Activity
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Global DNS",
    url: "/",
    icon: Globe,
  },
  {
    title: "Error Analysis",
    url: "/error-analysis",
    icon: Bug,
  },
  {
    title: "CMS Security",
    url: "/cms-analysis",
    icon: Code2,
  },
  {
    title: "Email Health",
    url: "/email-health",
    icon: Mail,
  },
  {
    title: "Web Tools",
    url: "/tools",
    icon: Wrench,
  },
  {
    title: "Documentation",
    url: "/documentation",
    icon: FileText,
  },
]

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-[#111111] border-r border-white/5">
      <SidebarHeader className="border-b border-white/5 p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/20">
            <Activity className="size-6 text-white" />
          </div>
          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-bold text-white text-lg tracking-tight">Stitch</span>
            <span className="truncate text-[10px] font-bold text-blue-400 uppercase tracking-wider">Diagnostic Suite</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-12 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300" 
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-4 px-4">
                        <item.icon className={cn("size-5", isActive ? "text-blue-400" : "text-gray-500")} />
                        <span className="font-medium text-sm tracking-wide">{item.title}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
             <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:hidden">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">System Online</span>
                  <span className="text-[10px] text-gray-500 font-mono">v4.2.0-beta</span>
                </div>
             </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
