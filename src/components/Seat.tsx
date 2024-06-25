import { Button } from '@/components/ui/button.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
  seat?: {
    seatId: string;
    place: number;
    ticketTypeId: string;
  };
  status: 'available' | 'not-available';
  place: number;
  className?: string;
  row: number;
  isInCart: boolean; // Added type for isInCart
  onCartChange: (seat: SeatProps['seat'], add: boolean) => void; // Added type for onCartChange
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(
  (props, ref) => {
    const { seat, status, place, row, isInCart, onCartChange } = props; // Destructured new props

    // Change color based on availability and cart status
    const color = isInCart
      ? 'orange'
      : status === 'available'
      ? 'lightgreen'
      : 'lightgrey';

    const toggleCart = () => {
      onCartChange(seat, !isInCart); // Use onCartChange callback instead of local state
    };
    return (
      <Popover>
        <PopoverTrigger>
          <div
            className={cn(
              'size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-color',
              props.className
            )}
            style={{ backgroundColor: color }}
            ref={ref}
          >
            <span className="text-xs text-white-400 font-medium">{place}</span>
          </div>
        </PopoverTrigger>
        {status === 'available' && (
          <PopoverContent>
            <pre>{JSON.stringify({ row, place }, null, 2)}</pre>

            <footer className="flex flex-col">
              {isInCart ? (
                <Button variant="destructive" size="sm" onClick={toggleCart}>
                  Remove from cart
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={toggleCart}>
                  Add to cart
                </Button>
              )}
            </footer>
          </PopoverContent>
        )}
      </Popover>
    );
  }
);
