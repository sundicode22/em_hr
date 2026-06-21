export type EmployeeStatus = "active" | "inactive" | "on_leave";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  status: EmployeeStatus;
  hireDate: string;
  createdAt: string;
};

export type EmployeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  status: EmployeeStatus;
  hireDate: string;
};

export type EmployeeFormValues = EmployeeInput;

export function employeeToFormValues(employee: Employee): EmployeeFormValues {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    department: employee.department,
    jobTitle: employee.jobTitle,
    status: employee.status,
    hireDate: employee.hireDate,
  };
}

export const emptyEmployeeForm: EmployeeFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  jobTitle: "",
  status: "active",
  hireDate: new Date().toISOString().slice(0, 10),
};
