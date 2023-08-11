import React from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableMessage from "./draggableMessages"

function App() {
  const [messages, setMessages] = React.useState<
    { message: string; id: number }[]
  >([]);
  const [input, setInput] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");


  React.useEffect(() => {
    fetchMessages();
  }, [searchInput]);

  

  const fetchMessages = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/messages${searchInput ? "?search=" + searchInput : ""}`
    );
    const responseBody = await response.json();
    setMessages(responseBody);

  };

  const deleteMessages = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
  };

  const deleteMessage = async (id: any) => {
    await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
  };



  const editMessage = async (id: any, newMessage: any) => {
    const updatedMessage = { message: newMessage, id: id };
    await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, {
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
    const newMessage = { message: input, id: uuidv4(), };

    await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
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

  const handleSearchChange = (e: any) => {
    setSearchInput(e.target.value);

  };
  const handleSearchClear = () => {
    setSearchInput("");

  }

  const updateMessagesOrder = async (newMessages: any) => {
    await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
      method: "PUT",
      body: JSON.stringify(newMessages),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchMessages();
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
        style={{
          display: "flex",
          justifyContent: "flex-end",


          backgroundColor: "#282c34",

        }}>
        <TextField
          id="search-message"
          label="Search Items"
          variant="filled"
          value={searchInput}

          onChange={handleSearchChange}

          InputProps={{
            style: {
              backgroundColor: "#1183ca",
              color: "black"
            }
          }} />

        <button
          onClick={handleSearchClear}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontSize: "18px",
            outline: "none",
          }}

        >
          {"\u21BB"}
        </button>
      </div>

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
        {messages.map((message, index) => (
          <div style={{
            display: "flex",



            backgroundColor: "#282c34",

          }}>
            <DraggableMessage
              key={message.id}
              message={message}
              index={index}
              moveMessage={moveMessage}
              editMessage={editMessage}
              deleteMessage={deleteMessage}
              isSearchActive= {searchInput.length>0}
            />
        
          </div>
        ))}
      </div>
    </DndProvider>
  );
}

export default App;
