import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { IssueState, setIssues, setRepoUrl } from "./store/githubSlice";
import { Issue } from "./types/issueTypes";
import { formatNumber } from "./helpers/formatNumber";
import DragNDropWrapper from "./components/DragNDropWrapper";
import { Button, Input } from "antd";

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
      localStorage.setItem(`issues_${repoUrl}`, JSON.stringify(updatedIssues));
    } catch (error: any) {
      console.error("Error fetching issues:", error);
    }
  };

  const fetchRepoStars = useCallback(async () => {
    try {
      const repoName = repoUrl.split("github.com/")[1];
      const response = await axios.get(
        `https://api.github.com/repos/${repoName}`
      );
      setRepoStars(response.data.stargazers_count);
    } catch (error: any) {
      console.error("Error fetching repo stars:", error);
    }
  }, [repoUrl]);

  useEffect(() => {
    const savedIssues = JSON.parse(
      localStorage.getItem(`issues_${repoUrl}`) || "{}"
    );
    if (savedIssues) {
      dispatch(setIssues(savedIssues));
    }
    if (repoUrl) {
      fetchRepoStars();
    }
  }, [dispatch, repoUrl, fetchRepoStars]);

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

      <DragNDropWrapper issues={issues} repoUrl={repoUrl} />
    </div>
  );
};

export default App;
