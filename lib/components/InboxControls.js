"use client";

import { InboxProcessor } from '../processors/InboxProcessor';

export default function InboxControls() {
  const handleProcessInbox = async () => {
    const inboxProcessor = new InboxProcessor();
    await inboxProcessor.process();
  };

  return (
    <div className="infracard">
      <h2>Inbox Controls</h2>
      <button onClick={handleProcessInbox} className="button">
        Process Inbox
      </button>
    </div>
  );
}
