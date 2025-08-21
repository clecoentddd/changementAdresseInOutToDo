"use client";

import { useState } from "react";
import { TodoCommandHandler } from "../commands/TodoCommandHandler";
import { IdGenerator } from "../utils/IdGenerator";

export default function ChangeAddressCommandForm() {
  const [accountId, setAccountId] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const event = {
        trackingId: IdGenerator.generate(),
        eventId: "backoffice",
        type: "ChangeAdresseCommand",
        payload: { accountId, address },
      };

      console.log("[ChangeAddressCommandForm] Sending event:", event);

      const result = await TodoCommandHandler.handleTodoAdded(event);

      if (result.ok) {
        setMessage(`✅ Command processed successfully (trackingId=${event.trackingId})`);
        setAccountId("");
        setAddress("");
      } else {
        setMessage(`❌ Failed: ${result.error}`);
      }
    } catch (err) {
      console.error("[ChangeAddressCommandForm] Error:", err);
      setMessage("❌ Exception: " + err.message);
    }
  };

  return (
    <div className="card">
      <h2>Change Address (Command)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="New Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">Submit Command</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
