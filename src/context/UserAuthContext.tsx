import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (displayName: string) => void;
}

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS_KEY = 'karaoke_users';
const LOCAL_USER_KEY = 'karaoke_current_user';

function getStoredUsers(): User[] {
  const users = localStorage.getItem(LOCAL_USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function setStoredUsers(users: User[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function getStoredUser(): User | null {
  const user = localStorage.getItem(LOCAL_USER_KEY);
  return user ? JSON.parse(user) : null;
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());

  const login = async (username: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.username === username);
    if (found && password === 'password') { // Mock password check
      setUser(found);
      setStoredUser(found);
      return true;
    }
    return false;
  };

  const register = async (username: string, password: string, displayName: string) => {
    let users = getStoredUsers();
    if (users.some(u => u.username === username)) return false;
    const newUser: User = {
      id: 'user-' + Date.now(),
      username,
      displayName,
    };
    users.push(newUser);
    setStoredUsers(users);
    setUser(newUser);
    setStoredUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
  };

  const updateProfile = (displayName: string) => {
    if (!user) return;
    const updated = { ...user, displayName };
    setUser(updated);
    setStoredUser(updated);
    const users = getStoredUsers().map(u => u.id === user.id ? updated : u);
    setStoredUsers(users);
  };

  return (
    <UserAuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
  return ctx;
}
