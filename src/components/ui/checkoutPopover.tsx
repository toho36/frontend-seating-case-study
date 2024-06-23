import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";

interface Ticket {
  seatId: string;
  price: number;
}

interface CheckoutPopoverProps {
  isOpen: boolean;
  tickets: Ticket[];
  onRemove: (seatId: string) => void;
  onClose: () => void;
}

const CheckoutPopover: React.FC<CheckoutPopoverProps> = ({
  isOpen,
  tickets,
  onRemove,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalCost = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <Button variant="default">Checkout Now</Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 bg-white rounded-md shadow-lg">
        <h3 className="text-lg font-semibold">Your Tickets</h3>
        <ul>
          {tickets.map((ticket) => (
            <li
              key={ticket.seatId}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>Seat ID: {ticket.seatId}</span>
              <span>{ticket.price} CZK</span>
              <Button variant="ghost" onClick={() => onRemove(ticket.seatId)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-4 p-2">
          <strong>Total Cost:</strong> {totalCost} CZK
        </div>
        <div className="flex justify-end mt-2">
          <Button onClick={onClose}>Close</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CheckoutPopover;
