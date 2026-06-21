export type PositionStatus = "open" | "closed";

export type Position = {
  id: string;
  title: string;
  department: string;
  colorKey: string;
  status: PositionStatus;
  createdAt: string;
};
