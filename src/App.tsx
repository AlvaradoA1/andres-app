import React from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
  const [messages, setMessages] = React.useState<{message: string}[]>();

React.useEffect(() => {
  fetchMessages()
}, [])

const fetchMessages = async () => {
  const response = await fetch('http://localhost:3000/api/messages')
  setMessages(await response.json())
}
  return (
    <div className="App">
      {messages?.map(message => <div>{message.message}</div>)}
    
    </div>
  );
}

export default App;
