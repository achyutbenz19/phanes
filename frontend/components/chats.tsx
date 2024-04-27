"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/functions/process-logs";
import { useEffect, useRef, useState } from "react";

const Chats = () => {
  const [messages, setMessages] = useState<any>([]);
  const containerRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket();
  console.log(containerRef)

  const handleClick = (event: any) => {
    console.log('clicked')
    const id = event.target.getAttribute('special-id')
    console.log('clicked', id)

    if (!socket) {
      console.log('No socket to send handleClick')
      return
    }


    socket.send(JSON.stringify({
      event: 'userAction',
      id: id,
      element: 'button',
      value: undefined
    }))
  }

  useEffect(() => {
    const handleClick = (event: any) => {
      const id = event.target.getAttribute('special-id')
      console.log('clicked', id)

      if (!socket) {
        console.log('No socket to send handleClick')
        return
      }


      socket.send(JSON.stringify({
        event: 'userAction',
        id: id,
        element: 'button',
        value: undefined
      }))
    }

    const handleChange = (event: any) => {
      const id = event.target.getAttribute('special-id')
      console.log('changed', id, event)

      if (!socket) {
        console.log('No socket to send handleChange')
        return
      }

      socket.send(JSON.stringify({
        event: 'userAction',
        id: id,
        element: 'input',
        value: event.currentTarget.value
      }))
    }

    if (!containerRef.current) {
      return
    }

    const clickables =
      containerRef.current.querySelectorAll('button[special-id]')
    const inputtables =
      containerRef.current.querySelectorAll('input[special-id]')
    // console.log(containerRef.current, clickables, inputtables)

    clickables.forEach((clickable: Element) => {
      console.log('clickable:', clickable)
      clickable.addEventListener('click', handleClick)
    })

    inputtables.forEach((inputtable: Element) => {
      console.log('inputtable:', inputtable)
      inputtable.addEventListener('change', handleChange)
    })

    return () => {
      clickables.forEach((clickable: Element) => {
        clickable.removeEventListener('click', handleClick)
      })

      inputtables.forEach((inputtable: Element) => {
        console.log('inputtable:', inputtable)
        inputtable.removeEventListener('change', handleChange)
      })
    }
  }, [containerRef, socket])

  if (socket) {
    socket.onmessage = function (event) {
      const { html, thought } = processLogs(event.data);
      setMessages((currentMessages: any) => [
        ...currentMessages,
        {
          display: thought ? (
            <div>{thought}</div>
          ) : html ? (
            <div>
              <div className="border" onClick={handleClick} ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ) : null,
        },
      ]);
    };
  }

  return (
    <div>
      {messages.map((message: any, index: number) => (
        <div key={index}>{message.display}</div>
      ))}
    </div>
  );
};

export default Chats;
