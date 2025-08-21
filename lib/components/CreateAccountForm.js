import { useState } from 'react';
import { FrontCommandService } from '../services/ForntEndDemanderChangementAdresseService';

export default function CreateAccountForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountId = await FrontCommandService.createAccountAndAddress(name, address);
    setMessage(`Created accountId=${accountId}`);
  };

  return (
    <div className="card">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">Create Account</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
