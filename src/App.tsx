import { FC, useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { IssueState, setIssues, setRepoUrl } from "./store/githubSlice";
import DragNDrop from "./components/DragNDrop";
import { Issue } from "./types/issueTypes";
import { Button, Input } from "antd";
import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import { formatNumber } from "./helpers/formatNumber";

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [repoStars, setRepoStars] = useState<number | null>(null);

  const { repoUrl, issues } = useAppSelector(
    (state: RootState) => ({
      repoUrl: state.repoUrl,
      issues: state.issues,
    }),
    (prev, curr) => prev.repoUrl === curr.repoUrl && prev.issues === curr.issues
  );

  useEffect(() => {
    const savedIssues = JSON.parse(localStorage.getItem("issues") || "{}");
    if (savedIssues) {
      dispatch(setIssues(savedIssues));
    }
    if (repoUrl) {
      fetchRepoStars();
    }
  }, [dispatch, repoUrl]);

  const fetchIssues = async () => {
    try {
      const repoName = repoUrl.split("github.com/")[1];
      const response = await axios.get(
        `https://api.github.com/repos/${repoName}/issues?state=all`
      );

      const mappedIssues: Issue[] = response.data.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        assignee: issue.assignee ? issue.assignee.login : undefined,
        state: issue.state === "open" ? "open" : "closed",
        created_at: issue.created_at,
        user: {
          login: issue.user ? issue.user.login : "Unknown",
        },
        comments: issue.comments,
      }));

      const updatedIssues: IssueState = {
        todo: mappedIssues.filter(
          (issue) => issue.state === "open" && !issue.assignee
        ),
        inProgress: mappedIssues.filter(
          (issue) => issue.state === "open" && issue.assignee
        ),
        done: mappedIssues.filter((issue) => issue.state === "closed"),
      };

      dispatch(setIssues(updatedIssues));
      localStorage.setItem("issues", JSON.stringify(updatedIssues));
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const fetchRepoStars = async () => {
    try {
      const repoName = repoUrl.split("github.com/")[1];
      const response = await axios.get(
        `https://api.github.com/repos/${repoName}`
      );
      setRepoStars(response.data.stargazers_count);
    } catch (error) {
      console.error("Error fetching repo stars:", error);
    }
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedTodo = [...issues.todo];
    const updatedInProgress = [...issues.inProgress];
    const updatedDone = [...issues.done];

    const [movedIssue] = updatedTodo.splice(source.index, 1);

    if (destination.droppableId === "todo") {
      updatedTodo.splice(destination.index, 0, movedIssue);
    } else if (destination.droppableId === "inProgress") {
      updatedInProgress.splice(destination.index, 0, movedIssue);
    } else if (destination.droppableId === "done") {
      updatedDone.splice(destination.index, 0, movedIssue);
    }

    const updatedIssues: IssueState = {
      todo: updatedTodo,
      inProgress: updatedInProgress,
      done: updatedDone,
    };

    dispatch(setIssues(updatedIssues));
    localStorage.setItem("issues", JSON.stringify(updatedIssues));
  };

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: "15px" }}>
        <Input
          placeholder="Enter GitHub Repo URL"
          value={repoUrl}
          onChange={(e) => dispatch(setRepoUrl(e.target.value))}
        />
        <Button type="primary" onClick={fetchIssues}>
          Load issues
        </Button>
      </div>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        {repoUrl && (
          <>
            <a
              href={`https://github.com/${
                repoUrl.split("github.com/")[1].split("/")[0]
              }`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {repoUrl
                .split("github.com/")[1]
                .split("/")[0]
                .charAt(0)
                .toUpperCase() +
                repoUrl.split("github.com/")[1].split("/")[0].slice(1)}
            </a>{" "}
            {" > "}
            <a
              href={`https://github.com/${repoUrl.split("github.com/")[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                marginRight: "20px",
              }}
            >
              {repoUrl
                .split("github.com/")[1]
                .split("/")[1]
                .charAt(0)
                .toUpperCase() +
                repoUrl.split("github.com/")[1].split("/")[1].slice(1)}
            </a>
            {repoStars && `⭐ ${formatNumber(repoStars)} stars`}
          </>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex" }}>
          <DragNDrop
            title="todo"
            issues={issues.todo}
            handleDragEnd={handleDragEnd}
          />
          <DragNDrop
            title="inProgress"
            issues={issues.inProgress}
            handleDragEnd={handleDragEnd}
          />
          <DragNDrop
            title="done"
            issues={issues.done}
            handleDragEnd={handleDragEnd}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
