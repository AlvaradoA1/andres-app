import React from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [messages, setMessages] = React.useState<
    { message: string; id: number }[]
  >([]);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/api/messages");
    const responseBody = await response.json();
    setMessages(responseBody);
  };

  const deleteMessages = async () => {
    await fetch(`http://localhost:3000/api/messages`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
  };

  const deleteMessage = async (id: any) => {
    await fetch(`http://localhost:3000/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
  };

  const editMessage = async (id: any, newMessage: any) => {
    const updatedMessage = { message: newMessage, id: id };
    await fetch(`http://localhost:3000/api/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedMessage),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
  };

  const handleClick = async () => {
    await createMessage();

    setInput("");
  };

  const createMessage = async () => {
    const newMessage = { message: input, id: uuidv4() };

    await fetch(`http://localhost:3000/api/messages`, {
      method: "POST",
      body: JSON.stringify(newMessage),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const DraggableMessage = ({
    message,
    index,
    moveMessage,
    editMessage,
  }: any) => {
    const [buttonText, setButtonText] = React.useState("\u00D7");
    const handleMouseEnter = () => {
      setButtonText("\u2713");
    };

    const handleMouseLeave = () => {
      setButtonText("\u00D7");
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
        ref={(node) => drag(drop(node))}
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
          {buttonText}
        </button>
      </div>
    );
  };

  const updateMessagesOrder = async (newMessages: any) => {
    await fetch("http://localhost:3000/api/messages", {
      method: "PUT",
      body: JSON.stringify(newMessages),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const moveMessage = (dragIndex: any, hoverIndex: any) => {
    const draggedMessage = messages[dragIndex];
    const newMessages = [...messages];
    newMessages.splice(dragIndex, 1);
    newMessages.splice(hoverIndex, 0, draggedMessage);
    setMessages(newMessages);
    updateMessagesOrder(newMessages);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#282c34",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>The Great To Do List</h1>
        <TextField
          id="Enter message"
          label="Add Item To Do"
          variant="outlined"
          style={{ marginBottom: "10px" }}
          value={input}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick();
            }
          }}
          sx={{
            "& label": { color: "#4E8282" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#4E8282" },
              "&:hover fieldset": { borderColor: "#4E8282" }, // Change outline color on hover
            },
            "& input": { color: "#4E8282" },
          }}
        />
        <div>
          <Button
            variant="contained"
            style={{
              marginBottom: "10px",
              width: "80px",
              height: "30px",
              marginLeft: "4px",
            }}
            onClick={deleteMessages}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            style={{
              marginBottom: "10px",
              marginLeft: "4px",
              width: "80px",
              height: "30px",
            }}
            onClick={handleClick}
          >
            Submit{" "}
          </Button>
        </div>
        {messages?.map((message, index) => (
          <DraggableMessage
            key={message.id}
            message={message}
            index={index}
            moveMessage={moveMessage}
            editMessage={editMessage}
          />
        ))}
      </div>
    </DndProvider>
  );
}

export default App;
