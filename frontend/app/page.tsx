"use client"

import axios from 'axios';
import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const IndexPage = () => {
  const [message, setMessage] = useState<string>('');
  const [websocketMessage, setWebsocketMessage] = useState<string>('');

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

    rws.addEventListener('open', () => {
      console.log('WebSocket connected');
      rws.send(JSON.stringify({ event: 'connect', clientId: 'your-client-id' }));
    });

    rws.addEventListener('message', (event) => {
      console.log('Received:', event.data);
      setWebsocketMessage(event.data);
    });

    return () => {
      rws.close();
    };
  }, []);

  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>Message from backend: {message}</p>
      <p>Message from WebSocket: {websocketMessage}</p>
    </div>
  );
};

export default IndexPage;
