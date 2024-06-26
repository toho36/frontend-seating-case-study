import React, { useState } from 'react';
import { Button } from './ui/button';
import Input from './ui/input';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
interface Props {
  onGuestCheckout: (guestInfo: {
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const GuestCheckoutFormWithPopover: React.FC<Props> = ({
  onGuestCheckout,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onGuestCheckout({ email, firstName, lastName });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <button onClick={onClose}></button>
      </PopoverTrigger>
      <PopoverContent className="bg-white p-4 rounded-lg shadow-lg m-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-sm text-zinc-500"
          />
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white text-sm text-zinc-500"
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white text-sm text-zinc-500"
          />
          <Button type="submit">Proceed to Checkout</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default GuestCheckoutFormWithPopover;
