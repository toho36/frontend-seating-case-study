import React, { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { createOrder } from '@/lib/api';

interface OrderConfirmation {
  message: string;
  orderId: string;
  totalAmount: number;
  user?: User;
}

interface Ticket {
  seatId: string;
  price: number;
  row: number;
  place: number;
  ticketTypeId: string;
}
interface User {
  email: string;
  firstName: string;
  lastName: string;
}
interface CheckoutPopoverProps {
  isOpen: boolean;
  tickets: Ticket[];
  onRemove: (seatId: string) => void;
  onClose: () => void;
  user?: User;
  eventId: string;
}

const CheckoutPopover: React.FC<CheckoutPopoverProps> = ({
  isOpen,
  tickets,
  onRemove,
  onClose,
  user,
  eventId,
}) => {
  const [orderConfirmation, setOrderConfirmation] =
    useState<OrderConfirmation | null>(null);
  if (!isOpen) return null;

  const totalCost = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

  const handleBuyTickets = async () => {
    const orderData = {
      eventId,
      tickets: tickets.map(({ seatId, ticketTypeId }) => ({
        seatId,
        ticketTypeId,
      })),
      user,
    };
    const confirmation = await createOrder(orderData);
    setOrderConfirmation(confirmation);
  };

  return orderConfirmation ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Order Confirmation</h3>
        <p className="text-xl text-zinc-900 font-semibold">
          {orderConfirmation.message}
        </p>
        <p className="text-xl text-zinc-900 font-semibold">
          Order ID: {orderConfirmation.orderId}
        </p>
        <p className="text-xl text-zinc-900 font-semibold">
          Email: {orderConfirmation.user?.email}
        </p>
        <p className="text-xl text-zinc-900 font-semibold">
          Total Amount: {orderConfirmation.totalAmount} CZK
        </p>
        <div className="flex justify-end mt-2">
          <Button
            onClick={() => {
              setOrderConfirmation(null);
              onClose();
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Popover open={isOpen}>
      <PopoverTrigger>
        <PopoverContent className="p-2 bg-white rounded-md shadow-lg">
          <h3 className="text-lg font-semibold p-2">Your Tickets</h3>
          <ul>
            {tickets.map((ticket) => (
              <li
                key={ticket.seatId}
                className="flex justify-between items-center p-2 border-b"
              >
                <span className="flex justify-between items-center p-1">
                  Row: {ticket.row}, Place: {ticket.place}
                </span>
                <span className="flex justify-between items-center p-1 ">
                  {ticket.price} CZK
                </span>
                <Button variant="ghost" onClick={() => onRemove(ticket.seatId)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-2">
            <strong>Total Cost:</strong> {totalCost} CZK
            <div className="flex justify-end mt-2">
              <Button variant="default" onClick={handleBuyTickets}>
                Buy Tickets
              </Button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button onClick={onClose}>Close</Button>
          </div>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
};

export default CheckoutPopover;
