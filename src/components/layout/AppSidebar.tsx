"use client";
import { Sidebar, SidebarRail } from '@/components/ui/sidebar';
import AppSidebarContent from './AppSidebarContent';

export default function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon" // Or "offcanvas", "none"
      variant="sidebar"    // Or "floating", "inset"
      className="border-r print:hidden"
    >
      <AppSidebarContent />
      <SidebarRail />
    </Sidebar>
  );
