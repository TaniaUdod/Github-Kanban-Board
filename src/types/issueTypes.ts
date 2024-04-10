export type Issue = {
  id: number;
  title: string;
  assignee?: string;
  state: "open" | "closed";
  created_at: string;
  user: { login: string };
  comments: number;
};
