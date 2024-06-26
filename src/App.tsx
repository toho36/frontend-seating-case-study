import { Seat } from '@/components/Seat.tsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import './App.css';
import { useQuery } from 'react-query';
import { fetchEventDetails, fetchEventTickets } from './lib/api';
import { EventDetails, EventTickets } from './lib/api';
import { useState } from 'react';
import LoginModal from './components/login';
import CheckoutPopover from './components/ui/checkoutPopover';
import GuestCheckoutForm from './components/guestCheckoutForm';
import ChoicePopover from './components/choicePopOver';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}
interface CartItem {
  isInCart: boolean;
  seatId?: string;
  ticketTypeId?: string;
  row: number;
  place: number;
  name?: string;
  price?: number;
}
interface SeatInfo {
  seatId: string;
  place: number;
  ticketTypeId: string;
  name?: string;
  price?: number;
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const [showGuestCheckoutForm, setShowGuestCheckoutForm] = useState(false);
  const [showChoicePopover, setShowChoicePopover] = useState(false);

  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleChoicePopover = () => setShowChoicePopover(!showChoicePopover);
  const toggleGuestCheckoutForm = () =>
    setShowGuestCheckoutForm(!showGuestCheckoutForm);

  const handleRemoveTicket = (seatId: string) => {
    setCart((prev) => prev.filter((ticket) => ticket.seatId !== seatId));
  };
  const handleGuestCheckout = () => {
    setShowGuestCheckoutForm(false);
    setShowCheckout(true);
  };

  const { data: eventDetails } = useQuery<EventDetails>(
    'eventDetails',
    fetchEventDetails
  );

  const { data: eventTickets, isLoading: isTicketsLoading } =
    useQuery<EventTickets>(
      ['eventTickets', eventDetails?.eventId || ''],
      () => fetchEventTickets(eventDetails?.eventId || ''),
      {
        enabled: !!eventDetails,
        staleTime: Infinity,
      }
    );

  const sortedSeatRows = eventTickets?.seatRows.sort(
    (a, b) => a.seatRow - b.seatRow
  );
  sortedSeatRows?.forEach((row) => {
    row.seats.sort((a, b) => a.place - b.place);
  });

  const handleLoginSuccess = (user: User) => {
    setIsLoggedIn(true);
    setUser(user);
    setShowLoginModal(false);
  };

  if (isTicketsLoading) {
    return <div>Loading...</div>;
  }
  const handleCartChange = (
    seat: SeatInfo | undefined,
    add: boolean,
    row: number,
    place: number
  ) => {
    if (!seat) return;

    const ticketType = eventTickets?.ticketTypes.find(
      (t) => t.id === seat.ticketTypeId
    );
    const name = ticketType?.name;
    const price = ticketType?.price;
    setCart((prev) => {
      if (add) {
        const newCartItem: CartItem = {
          isInCart: true,
          seatId: seat.seatId,
          ticketTypeId: seat.ticketTypeId,
          row,
          place,
          name,
          price,
        };
        return [...prev, newCartItem];
      } else {
        return prev.filter((s) => s.seatId !== seat.seatId);
      }
    });
  };

  const maxRows =
    sortedSeatRows?.reduce((max, row) => Math.max(max, row.seatRow), 0) || 0;
  const maxPlaces =
    sortedSeatRows?.reduce(
      (max, row) => Math.max(max, ...row.seats.map((seat) => seat.place)),
      0
    ) || 0;

  const totalPrice = cart.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <div className="flex flex-col grow">
      {/* header (wrapper) */}
      <nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center flex-wrap">
        {/* inner content */}
        <div className="max-w-screen-lg p-4 grow flex flex-col md:flex-row items-center justify-between gap-3">
          {/* application/author image/logo placeholder */}
          <div className="max-w-[250px] w-full flex">
            <div className="bg-zinc-100 rounded-md size-12" />
          </div>
          {/* app/author title/name placeholder */}
          <div className="bg-zinc-100 rounded-md h-8 w-[200px] flex items-center justify-center">
            <p className="text-xl text-zinc-900 font-semibold">To Hoang Viet</p>
          </div>
          {/* user menu */}
          <div className="max-w-[250px] w-full flex justify-end">
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={`https://source.boringavatars.com/marble/120/${user.email}?colors=25106C,7F46DB`}
                        />
                        <AvatarFallback>
                          {user.firstName[0] + user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[250px]">
                  <DropdownMenuLabel>
                    {user.firstName} {user.lastName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={toggleLoginModal} variant="secondary">
                Login or register
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* main body (wrapper) */}
      <main className="grow flex flex-col justify-center">
        {/* inner content */}

        <div className="max-w-screen-lg m-auto p-4 flex flex-col md:flex-row items-start grow gap-3 w-full">
          {/* seating card */}
          <div className="bg-white rounded-md grow p-4 shadow-sm flex flex-col">
            {/*	seating map */}
            {Array.from({ length: maxRows }).map((_, rowIndex) => (
              <div key={rowIndex} className="seat-row flex m-auto p-1 gap-2">
                <div className="text-zinc-400 font-medium pr-3">
                  {rowIndex + 1}
                </div>
                {Array.from({ length: maxPlaces }).map((_, placeIndex) => {
                  const seatRow = sortedSeatRows?.find(
                    (row) => row.seatRow === rowIndex + 1
                  );
                  const seat = seatRow?.seats.find(
                    (seat) => seat.place === placeIndex + 1
                  );
                  const isInCart = cart.some((s) => s.seatId === seat?.seatId);
                  const ticketType = seat
                    ? eventTickets?.ticketTypes.find(
                        (t) => t.id === seat.ticketTypeId
                      )
                    : undefined;
                  const name = ticketType?.name;
                  const price = ticketType?.price;
                  return (
                    <Seat
                      key={seat?.seatId || `${rowIndex}-${placeIndex}`}
                      seat={seat}
                      className="not-available"
                      status={seat ? 'available' : 'not-available'}
                      place={placeIndex + 1}
                      row={rowIndex + 1}
                      name={name}
                      price={price}
                      isInCart={isInCart}
                      onCartChange={(seatInfo, add) =>
                        handleCartChange(
                          seatInfo,
                          add,
                          rowIndex + 1,
                          placeIndex + 1
                        )
                      }
                    />
                  );
                })}
                <div className=" text-zinc-400 font-medium pl-3">
                  {rowIndex + 1}
                </div>
              </div>
            ))}
          </div>

          {/* event info */}

          <aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
            {/* event header image */}
            <div className="bg-zinc-100 rounded-md h-32 w-full overflow-hidden">
              <img
                src={eventDetails?.headerImageUrl}
                alt="Event header"
                className="w-full h-full object-cover"
              />
            </div>

            {/* event name */}
            <h1 className="text-xl text-zinc-900 font-semibold pt-4 md:pt-6 ">
              {eventDetails?.namePub}
            </h1>
            {/* event description */}
            <p className="text-sm text-zinc-500">{eventDetails?.description}</p>
            {/* add to calendar button */}
            <Button variant="secondary" disabled>
              Add to calendar
            </Button>
          </aside>
        </div>
      </main>
      {showChoicePopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <ChoicePopover
            onLogin={() => {
              setShowChoicePopover(false);
              toggleLoginModal(); // Show login modal
            }}
            onGuest={() => {
              setShowChoicePopover(false);
              setShowGuestCheckoutForm(true); // Show guest checkout form
            }}
            isOpen={showChoicePopover}
            onClose={toggleChoicePopover}
          />
        </div>
      )}
      {showGuestCheckoutForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <GuestCheckoutForm
            isOpen={showGuestCheckoutForm}
            onClose={toggleGuestCheckoutForm}
            onGuestCheckout={handleGuestCheckout}
          />
        </div>
      )}
      {/* Optionally render the LoginModal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <LoginModal
            isOpen={showLoginModal}
            onClose={toggleLoginModal}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
      <CheckoutPopover
        isOpen={showCheckout}
        tickets={cart.map((item) => ({
          seatId: item.seatId as string,
          price: item.price ?? 0, // Assuming a fixed price, adjust as necessary
          row: item.row,
          place: item.place,
          ticketTypeId: item.ticketTypeId as string, // Ensure ticketTypeId is included
        }))}
        onRemove={handleRemoveTicket}
        onClose={() => setShowCheckout(false)}
        user={user || { firstName: '', lastName: '', email: '' }}
        eventId={eventDetails?.eventId || ''}
      />

      {/* bottom cart affix (wrapper) */}
      <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
        {/* inner content */}
        <div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
          {/* total in cart state */}
          <div className="flex flex-col">
            <span className="text-xl text-zinc-900 font-semibold">
              Total for {cart.length} tickets
            </span>
            <span className="text-xl text-zinc-900 font-semibold">
              {totalPrice} CZK
            </span>
          </div>

          {/* checkout button */}
          <Button
            onClick={() => {
              if (!isLoggedIn) {
                setShowChoicePopover(true); // Show the choice popover
              } else {
                setShowCheckout(!showCheckout);
              }
            }}
            disabled={cart.length === 0}
            variant="default"
          >
            Checkout now
          </Button>

          {/* Checkout Popover */}
        </div>
      </nav>
    </div>
  );
}

export default App;
