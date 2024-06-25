import React, { useState } from 'react';
import { useMutation } from 'react-query';
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import Input from './ui/input';
import { login as apiLogin } from '@/lib/api'; // Import the login function

interface LoginResponse {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
interface User {
  firstName: string;
  lastName: string;
  email: string;
}
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void; // Add this line
}
const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess, // Add this line
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isLoading } = useMutation(
    () => apiLogin({ email, password }), // Use the imported login function
    {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        onLoginSuccess(data.user);
        onClose();
      },
      onError: (error: Error) => {
        console.error('Login failed:', error);
      },
    }
  );
  if (!isOpen) return null;

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverContent className="bg-white p-4 rounded-lg shadow-lg m-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white text-sm text-zinc-500"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white text-sm text-zinc-500"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </PopoverContent>
      <PopoverTrigger asChild>
        <button onClick={onClose}></button>
      </PopoverTrigger>
    </Popover>
  );
};

export default LoginModal;
