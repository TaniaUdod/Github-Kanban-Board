import { FC } from "react";
import { useAppDispatch } from "../store/hooks";
import { IssueState, setIssues } from "../store/githubSlice";
import DragNDrop from "./DragNDrop";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

interface DragNDropWrapperProps {
  issues: IssueState;
  repoUrl: string;
}

const DragNDropWrapper: FC<DragNDropWrapperProps> = ({ issues, repoUrl }) => {
  const dispatch = useAppDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    const updatedIssues = { ...issues };

    if (sourceDroppableId === destinationDroppableId) {
      const columnIssues = [...updatedIssues[sourceDroppableId]];
      const [movedIssue] = columnIssues.splice(source.index, 1);
      columnIssues.splice(destination.index, 0, movedIssue);
      updatedIssues[sourceDroppableId] = columnIssues;
    } else {
      const sourceColumnIssues = [...updatedIssues[sourceDroppableId]];
      const destinationColumnIssues = [
        ...updatedIssues[destinationDroppableId],
      ];
      const [movedIssue] = sourceColumnIssues.splice(source.index, 1);
      destinationColumnIssues.splice(destination.index, 0, movedIssue);
      updatedIssues[sourceDroppableId] = sourceColumnIssues;
      updatedIssues[destinationDroppableId] = destinationColumnIssues;
    }

    dispatch(setIssues(updatedIssues));
    localStorage.setItem(`issues_${repoUrl}`, JSON.stringify(updatedIssues));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex" }}>
        {Object.entries(issues).map(([title, issueList]) => (
          <DragNDrop
            key={title}
            title={title as keyof IssueState}
            issues={issueList}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default DragNDropWrapper;
