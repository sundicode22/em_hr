"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { footerNavigation } from "@/config/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HelpCircleIcon,
  Moon02Icon,
  Sun03Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

const iconMap: Record<string, typeof UserIcon> = {
  Profile: UserIcon,
  "Help and resource": HelpCircleIcon,
};

export function NavFooter() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SidebarGroup className="mt-auto">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={isDark ? "Light mode" : "Dark mode"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <HugeiconsIcon
              icon={isDark ? Sun03Icon : Moon02Icon}
              strokeWidth={2}
            />
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {footerNavigation.map((item) => {
          const Icon = iconMap[item.title] ?? UserIcon;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.href}>
                  <HugeiconsIcon icon={Icon} strokeWidth={2} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
