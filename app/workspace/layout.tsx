"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Modal } from "@/components/modal";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { ReportDateProvider, useReportDateOptional } from "@/components/reports/report-date-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getBreadcrumbs } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

function ReportHeaderControls() {
  const reportDate = useReportDateOptional();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (!reportDate) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <DateRangePicker range={reportDate.range} onChange={reportDate.setRange} />
        <Button
          size="sm"
          className="shadow-none"
          onClick={() => setUpgradeOpen(true)}
        >
          Upgrade plan
        </Button>
      </div>
      <Modal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        title="Upgrade plan"
        description="Unlock advanced reports, team analytics, and workflow automation."
        footer={
          <>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Not now
            </Button>
            <Button onClick={() => setUpgradeOpen(false)}>Upgrade</Button>
          </>
        }
      />
    </>
  );
}

function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const isReportPage = pathname.includes("/reports/");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/70 bg-white px-4">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 hidden h-4 sm:block" />
            <div className="hidden items-center gap-0.5 sm:flex">
              <Button variant="ghost" size="icon-sm" disabled className="rounded-md">
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
              </Button>
              <Button variant="ghost" size="icon-sm" disabled className="rounded-md">
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.label} className="contents">
                    {i > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href && i < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {isReportPage && <ReportHeaderControls />}
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReportDateProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </ReportDateProvider>
  );
}
