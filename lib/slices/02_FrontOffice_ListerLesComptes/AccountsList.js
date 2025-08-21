"use client";

import { useState, useEffect } from 'react';
import { AccountsProjection } from './AccountsProjection';

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    const accounts = await AccountsProjection.getAll();
    setAccounts(accounts);
  };

  useEffect(() => {
    fetchAccounts();
    const interval = setInterval(fetchAccounts, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Liste des comptes</h2>
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
