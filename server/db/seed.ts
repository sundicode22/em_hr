import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  candidates,
  employees,
  payrollRecords,
  pipelineEvents,
  positions,
  roles,
  userRoles,
  users,
  workflows,
} from "@/server/db/schema";
import { hashPassword } from "@/server/lib/password";
import {
  ensurePermission,
  ensureRole,
  linkRolePermission,
} from "@/server/services/permission.service";
import type { PipelineStage } from "@/types/pipeline";
import {
  DEFAULT_ROLE_PERMISSIONS,
  ROLES,
} from "@/types/permissions";

const POSITIONS = [
  { title: "Software Engineer", department: "Engineering", colorKey: "chart-1" },
  { title: "Copywriter", department: "Marketing", colorKey: "chart-2" },
  { title: "UIUX Designer", department: "Design", colorKey: "chart-3" },
  { title: "Data Analyst", department: "Analytics", colorKey: "chart-4" },
  { title: "Graphic Designer", department: "Design", colorKey: "chart-5" },
];

const POSITION_STAGE_COUNTS: Record<string, Partial<Record<PipelineStage, number>>> = {
  "Software Engineer": { reviewed: 15, accepted: 10, outreached: 8, email_opened: 6, replied: 4, interested: 3, scheduled: 2 },
  Copywriter: { reviewed: 8, accepted: 5, outreached: 4, email_opened: 3, replied: 2, interested: 1, scheduled: 1 },
  "UIUX Designer": { reviewed: 6, accepted: 4, outreached: 3, email_opened: 2, replied: 1, interested: 1, scheduled: 0 },
  "Data Analyst": { reviewed: 5, accepted: 3, outreached: 2, email_opened: 1, replied: 1, interested: 0, scheduled: 0 },
  "Graphic Designer": { reviewed: 4, accepted: 2, outreached: 2, email_opened: 1, replied: 0, interested: 0, scheduled: 0 },
};

async function seedRolesAndPermissions() {
  for (const roleName of Object.values(ROLES)) {
    const roleId = await ensureRole(roleName);
    for (const permName of DEFAULT_ROLE_PERMISSIONS[roleName]) {
      const permId = await ensurePermission(permName);
      await linkRolePermission(roleId, permId);
    }
  }
}

async function seedUser(
  email: string,
  name: string,
  password: string,
  roleName: typeof ROLES.ADMIN | typeof ROLES.USER,
) {
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.log(`User ${email} already exists, skipping.`);
    return existing;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ email, name, passwordHash })
    .returning();

  const [role] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);

  if (role) {
    await db
      .insert(userRoles)
      .values({ userId: user.id, roleId: role.id })
      .onConflictDoNothing();
  }

  console.log(`Seeded user: ${email} / ${password}`);
  return user;
}

async function seedPositionsAndPipeline() {
  const [existingPosition] = await db.select().from(positions).limit(1);
  if (existingPosition) {
    console.log("Positions already seeded, skipping.");
    return;
  }

  const baseDate = new Date("2026-05-06");
  const stageOrder: PipelineStage[] = [
    "reviewed",
    "accepted",
    "outreached",
    "email_opened",
    "replied",
    "interested",
    "scheduled",
  ];

  for (const pos of POSITIONS) {
    const [position] = await db.insert(positions).values(pos).returning();
    const stageCounts = POSITION_STAGE_COUNTS[pos.title] ?? {};
    const candidateTotal = stageCounts.reviewed ?? 0;

    for (let i = 0; i < candidateTotal; i++) {
      const [candidate] = await db
        .insert(candidates)
        .values({
          positionId: position.id,
          name: `${pos.title} Candidate ${i + 1}`,
          email: `${pos.title.toLowerCase().replace(/\s/g, ".")}${i + 1}@example.com`,
          source: i % 2 === 0 ? "linkedin" : "referral",
        })
        .returning();

      let dayOffset = i;

      for (const stage of stageOrder) {
        const stageLimit = stageCounts[stage] ?? 0;
        if (i >= stageLimit) break;

        const eventDate = new Date(baseDate);
        eventDate.setDate(eventDate.getDate() + dayOffset);

        await db.insert(pipelineEvents).values({
          candidateId: candidate.id,
          stage,
          occurredAt: eventDate,
        });

        dayOffset += 1;
      }
    }
  }

  console.log("Seeded positions, candidates, and pipeline events.");
}

async function seedEmployeesAndPayroll() {
  const [existing] = await db.select().from(employees).limit(1);
  if (existing) {
    console.log("Employees already seeded, skipping.");
    return;
  }

  const employeeData = [
    { firstName: "Sarah", lastName: "Chen", email: "sarah.chen@company.com", department: "Engineering", jobTitle: "Senior Engineer", hireDate: "2024-03-15" },
    { firstName: "Marcus", lastName: "Johnson", email: "marcus.j@company.com", department: "Marketing", jobTitle: "Marketing Lead", hireDate: "2023-08-01" },
    { firstName: "Elena", lastName: "Rodriguez", email: "elena.r@company.com", department: "Design", jobTitle: "Design Director", hireDate: "2022-11-20" },
  ];

  for (const emp of employeeData) {
    const [employee] = await db.insert(employees).values(emp).returning();
    await db.insert(payrollRecords).values({
      employeeId: employee.id,
      periodStart: "2026-05-01",
      periodEnd: "2026-05-31",
      grossPay: "8500.00",
      netPay: "6200.00",
      status: "paid",
    });
  }

  console.log("Seeded employees and payroll records.");
}

async function seedWorkflows() {
  const [existing] = await db.select().from(workflows).limit(1);
  if (existing) {
    console.log("Workflows already seeded, skipping.");
    return;
  }

  await db.insert(workflows).values([
    { name: "New candidate notification", trigger: "candidate.reviewed", action: "send.email", enabled: true },
    { name: "Interview scheduling", trigger: "candidate.interested", action: "create.calendar", enabled: true },
    { name: "Offer letter automation", trigger: "candidate.scheduled", action: "generate.document", enabled: false },
  ]);

  console.log("Seeded workflows.");
}

async function main() {
  console.log("Seeding roles and permissions...");
  await seedRolesAndPermissions();

  console.log("Seeding auth users...");
  await seedUser("admin@example.com", "Admin User", "Admin123!", ROLES.ADMIN);
  await seedUser("user@example.com", "Regular User", "User123!", ROLES.USER);
  await seedUser("reader@example.com", "Reader User", "User123!", ROLES.USER);

  console.log("Seeding domain data...");
  await seedPositionsAndPipeline();
  await seedEmployeesAndPayroll();
  await seedWorkflows();

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
