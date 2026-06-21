"use client";

import { useEffect, useState } from "react";
import { HrSettingsFormModal } from "@/components/settings/hr-settings-form-modal";
import { Button } from "@/components/ui/button";
import { cardClassName } from "@/config/design-system";
import { cn } from "@/lib/utils";
import {
  defaultHrSettings,
  type HrSettings,
} from "@/types/hr-settings";

const STORAGE_KEY = "em-hr-settings";

function loadSettings(): HrSettings {
  if (typeof window === "undefined") return defaultHrSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<HrSettings>;
      return { ...defaultHrSettings, ...parsed };
    }
  } catch {
    // ignore invalid stored data
  }
  return defaultHrSettings;
}

export default function HrSettingsPage() {
  const [settings, setSettings] = useState<HrSettings>(defaultHrSettings);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function handleSave(next: HrSettings) {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <>
      <div className={cn(cardClassName, "p-6")}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">HR settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure HR policies and preferences.
            </p>
          </div>
          <Button
            className="shadow-none"
            onClick={() => setModalOpen(true)}
          >
            Edit settings
          </Button>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Company name</dt>
            <dd className="mt-1 text-sm font-medium">{settings.companyName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Default work hours</dt>
            <dd className="mt-1 text-sm font-medium">{settings.defaultWorkHours} hrs/week</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">PTO allowance</dt>
            <dd className="mt-1 text-sm font-medium">{settings.ptoAllowanceDays} days</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Probation period</dt>
            <dd className="mt-1 text-sm font-medium">{settings.probationPeriodDays} days</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Default currency</dt>
            <dd className="mt-1 text-sm font-medium">{settings.defaultCurrency}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">HR contact email</dt>
            <dd className="mt-1 text-sm font-medium">{settings.hrContactEmail}</dd>
          </div>
        </dl>
      </div>

      <HrSettingsFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        settings={settings}
        onSave={handleSave}
      />
    </>
  );
}
