import React from "react";
import { IssueState } from "../store/githubSlice";
import { Issue } from "../types/issueTypes";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { calculateDaysAgo } from "../helpers/calculateDaysAgo";

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
  let displayTitle = "";

  switch (title) {
    case "todo":
      displayTitle = "ToDo";
      break;
    case "inProgress":
      displayTitle = "In Progress";
      break;
    case "done":
      displayTitle = "Done";
      break;
    default:
      break;
  }

  return (
    <div
      style={{
        margin: "10px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        width: "100%",
      }}
    >
      <h2
        style={{
          textAlign: "center",
        }}
      >
        {displayTitle}
      </h2>
      <Droppable droppableId={title}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {issues.map((issue, index) =>
              issue && issue.id ? (
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
                        marginBottom: "15px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <h3>{issue.title}</h3>
                      <p>
                        #{issue.id} opened {calculateDaysAgo(issue.created_at)}{" "}
                        days ago
                        <br />
                        {issue.user.login}{" "}
                        <span
                          style={{
                            border: "1px solid rgb(93 90 90)",
                            margin: "0px 5px",
                            height: "10px",
                            display: "inline-block",
                          }}
                        ></span>{" "}
                        Comments: {issue.comments}
                      </p>
                    </div>
                  )}
                </Draggable>
              ) : null
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DragNDrop;
