import React from "react";
import { IssueState } from "../store/githubSlice";
import { Issue } from "../issueTypes";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface DragNDropProps {
  title: keyof IssueState;
  issues: Issue[];
  handleDragEnd: (result: any) => void;
}

const DragNDrop: React.FC<DragNDropProps> = ({
  title,
  issues,
  handleDragEnd,
}) => {
  return (
    <div
      style={{
        flex: "1",
        margin: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>{title.toUpperCase()}</h2>
      <Droppable droppableId={title}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {issues.map((issue, index) => (
              <Draggable
                key={issue.id.toString()}
                draggableId={issue.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      margin: "5px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <span>{issue.title}</span>
                    {issue.assignee && (
                      <span style={{ marginLeft: "10px" }}>
                        Assignee: {issue.assignee}
                      </span>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DragNDrop;
