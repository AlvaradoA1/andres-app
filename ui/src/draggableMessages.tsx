import React from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableMessage = ({
    message,
    index,
    moveMessage,
    editMessage,
    deleteMessage,
    isSearchActive
  }: any) => {
    const [isHovered, setIsHovered] = React.useState(false);
   
  
    // mousee enter setButtonText("\u2713");
  

 
    // setButtonText("\u00D7");
 
    
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "message",
      item: { id: message.id, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedMessage, setEditedMessage] = React.useState(message.message);

    const [{ isOver }, drop] = useDrop(() => ({
      accept: "message",
      drop: (item: any) => moveMessage(item.index, index),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleTextFieldChange = (e: any) => {
      setEditedMessage(e.target.value);
    };

    const handleEditSave = () => {
      editMessage(message.id, editedMessage);
      setIsEditing(false);
    };

  
    return (
      <div
        ref={(node) => (isSearchActive ?  node : drag(drop(node)))}
        key={message.id}
        style={{
          backgroundColor: isDragging || isOver ? "#f0f0f0" : "#ffffff",
          borderColor: "#ffffff",
          borderStyle: "solid",
          borderWidth: "1px",
          padding: "10px",
          margin: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "200px",
          textAlign: "left",
          fontSize: "16px",
          color: "black",
        }}
      >
        {isEditing ? (
          <>
            <TextField
              value={editedMessage}
              onChange={handleTextFieldChange}
              autoFocus
              onBlur={handleEditSave}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" }, // Change outline color on hover
                },
              }}
            />
          </>
        ) : (
          <span onClick={handleEditClick}>{message.message}</span>
        )}
           <button
              onClick={() => deleteMessage(message.id)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: "14px",
                outline: "none",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
               {isHovered ? "\u2713" : "\u00D7"}
            </button>
      </div>
    );
  };

  export default DraggableMessage;