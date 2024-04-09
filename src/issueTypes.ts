export type Issue = {
  id: number;
  title: string;
  assignee?: string;
  state: "open" | "closed";
};
