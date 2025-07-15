import React, { createContext, useContext, useState } from "react";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatarVersion, setAvatarVersion] = useState(0);

  const updateAvatarVersion = () => {
    setAvatarVersion((v) => v + 1); // Mỗi lần gọi sẽ tăng version → re-render
  };

  return (
    <AvatarContext.Provider value={{ avatarVersion, updateAvatarVersion }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
