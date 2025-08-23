"use client";
import { useState, useEffect } from 'react';
import { AccountsProjection } from './AccountsProjection';
import { BuildAccountsProjection } from '../08_FrontOffice_AjouterAdresseOfficielleProjection/reBuildProjection';

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAccounts = async () => {
    const accounts = await AccountsProjection.getAll();
    setAccounts([...accounts].reverse());
  };

  const handleRebuild = async () => {
    try {
      await BuildAccountsProjection.rebuild();
      await fetchAccounts();
    } catch (err) {
      console.error("Failed to rebuild projection:", err);
    }
  };

  const handleEmptyDB = async () => {
    try {
      await AccountsProjection.clear();
      setMessage("DB emptied");
      setTimeout(() => setMessage(''), 500); // Clear message after 0.5s
      await fetchAccounts();
    } catch (err) {
      console.error("Failed to empty DB:", err);
      setMessage("Failed to empty DB");
      setTimeout(() => setMessage(''), 500);
    }
  };

  useEffect(() => {
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Liste des comptes</h2>
      {message && (
        <div style={{
          padding: '8px',
          backgroundColor: '#ffeb3b',
          marginBottom: '8px',
          textAlign: 'center',
          borderRadius: '4px',
        }}>
          {message}
        </div>
      )}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={handleRebuild}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Rebuild Accounts Projection
        </button>
        <button
          onClick={handleEmptyDB}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Empty DB
        </button>
      </div>
      <ul>
        {accounts.map(account => (
          <li key={account.accountId} className="account-item">
            <p><strong>Numéro de compte:</strong> {account.accountId}</p>
            <p><strong>Nom:</strong> {account.name}</p>
            <p><strong>Adresse:</strong> {account.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
