import React, { createContext, useContext, useState } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState(''); // or set to a default value

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => useContext(EmailContext);
