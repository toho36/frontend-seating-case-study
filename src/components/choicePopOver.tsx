import React from 'react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
interface ChoicePopoverProps {
  onLogin: () => void;
  onGuest: () => void;
  isOpen: boolean;
  onClose: () => void;
}
const ChoicePopover: React.FC<ChoicePopoverProps> = ({
  onLogin,
  onGuest,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverContent
        className="popover-container"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #ccc',
          padding: '10px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'fit-content',
          boxSizing: 'border-box',
        }}
      >
        <p>How would you like to proceed?</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Button onClick={onLogin}>Log In</Button>
          <Button onClick={onGuest}>Proceed as Guest</Button>
        </div>
      </PopoverContent>
      <PopoverTrigger asChild>
        <button onClick={onClose}></button>
      </PopoverTrigger>
    </Popover>
  );
};

export default ChoicePopover;
