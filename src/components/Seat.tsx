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
  name?: string;
  price?: number;
  status: 'available' | 'not-available';
  place: number;
  className?: string;
  row: number;
  isInCart: boolean;
  onCartChange: (seat: SeatProps['seat'], add: boolean) => void;
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(
  (props, ref) => {
    const { seat, status, place, row, isInCart, onCartChange, name, price } =
      props;

    const color = isInCart
      ? 'orange'
      : status === 'available'
      ? 'lightgreen'
      : 'lightgrey';

    const toggleCart = () => {
      onCartChange(seat, !isInCart);
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
            <div className="text-sm">
              <p>
                Row: {row}, Place: {place}
              </p>
              {name && <p>Name: {name}</p>}
              {price && <p>Price: ${price}</p>}
            </div>

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
