// PATH: src/pages/admin/PromoteDemoteUser.jsx

import React, { useState } from 'react';
// import { Button, InputText } from 'primereact';
import axiosInstance from '../utils/axiosInstance';

const PromoteDemoteUser = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePromote = async () => {
    try {
      const res = await axiosInstance.post("/promote", { email }, { withCredentials: true });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error promoting user");
    }
  };

  const handleDemote = async () => {
    try {
      const res = await axiosInstance.post("/demote", { email }, { withCredentials: true });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error demoting user");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded-xl bg-white space-y-4">
      <h2 className="text-xl font-semibold text-center">Promote / Demote User</h2>
      <Input
        className="w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user's email"
      />
      <div className="flex justify-between space-x-4">
        <Button label="Promote to Admin" onClick={handlePromote} className="p-button-success" />
        <Button label="Demote to User" onClick={handleDemote} className="p-button-danger" />
      </div>
      {message && <p className="text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default PromoteDemoteUser;
