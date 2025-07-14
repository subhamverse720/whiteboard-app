import { useChat } from '@livekit/components-react';

import '@livekit/components-styles';

export default function Room() {
    
    const {chatMessages, send , isSending} = useChat();

    return (
        <div>
      {chatMessages.map((msg) => (
        <div key={msg.timestamp}>
          {msg.from?.identity}: {msg.message}
        </div>
      ))}
      <button disabled={isSending} onClick={() => send("Hello!")}>
        Send Message
      </button>
    </div>
    );
}