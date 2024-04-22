"use client"
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const IndexPage = () => {
  const [message, setMessage] = useState('');
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to fetch data');
      }
    };
    fetchData();

    const rws = new ReconnectingWebSocket('ws://localhost:8000/ws?client_id=client-id');
    setSocket(rws);

    return () => {
      rws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event: 'prompt', prompt: value }));
    } else {
      console.error('Socket not connected');
    }
  };

  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>Message from backend: {message}</p>
      <input className='border' value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default IndexPage;
