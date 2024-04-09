import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Issue } from "../issueTypes";

export type IssueState = {
  todo: Issue[];
  inProgress: Issue[];
  done: Issue[];
};

interface RootState {
  repoUrl: string;
  issues: IssueState;
}

const initialState: RootState = {
  repoUrl: "",
  issues: {
    todo: [],
    inProgress: [],
    done: [],
  },
};

const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {
    setRepoUrl: (state, action: PayloadAction<string>) => {
      state.repoUrl = action.payload;
    },
    setIssues: (state, action: PayloadAction<IssueState>) => {
      state.issues = action.payload;
    },
  },
});

export const { setRepoUrl, setIssues } = githubSlice.actions;

export const githubReducer = githubSlice.reducer;
