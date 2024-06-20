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
function App() {
  const isLoggedIn = true;

  const {
    data: eventDetails,
    isLoading,
    error,
  } = useQuery<EventDetails>('eventDetails', fetchEventDetails);

  const {
    data: eventTickets,
    isLoading: isTicketsLoading,
    error: ticketsError,
  } = useQuery<EventTickets>(
    ['eventTickets', eventDetails?.eventId || ''],
    () => fetchEventTickets(eventDetails?.eventId || ''),
    { enabled: !!eventDetails }
  );

  const sortedSeatRows = eventTickets?.seatRows.sort(
    (a, b) => a.seatRow - b.seatRow
  );
  sortedSeatRows?.forEach((row) => {
    row.seats.sort((a, b) => a.place - b.place);
  });
  if (isTicketsLoading) {
    return <div>Loading...</div>;
  }
  console.log(sortedSeatRows);
  return (
    <div className="flex flex-col grow">
      {/* header (wrapper) */}
      <nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
        {/* inner content */}
        <div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
          {/* application/author image/logo placeholder */}
          <div className="max-w-[250px] w-full flex">
            <div className="bg-zinc-100 rounded-md size-12" />
          </div>
          {/* app/author title/name placeholder */}
          <div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
          {/* user menu */}
          <div className="max-w-[250px] w-full flex justify-end">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">John Doe</span>
                        <span className="text-xs text-zinc-500">
                          john.doe@nfctron.com
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[250px]">
                  <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem disabled>Logout</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button disabled variant="secondary">
                Login or register
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* main body (wrapper) */}
      <main className="grow flex flex-col justify-center">
        {/* inner content */}
        <aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
          {/* event header image */}
          <img
            src={eventDetails?.headerImageUrl}
            alt="Event header"
            className="bg-zinc-100 rounded-md h-32"
          />
          {/* event name */}
          <h1 className="text-xl text-zinc-900 font-semibold">
            {eventDetails?.namePub}
          </h1>
          {/* event description */}
          <p className="text-sm text-zinc-500">{eventDetails?.description}</p>
          {/* add to calendar button */}
          <Button variant="secondary" disabled>
            Add to calendar
          </Button>
        </aside>
        <div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
          {/* seating card */}
          <div className="bg-white rounded-md grow p-3 self-stretch shadow-sm flex flex-col">
            {/*	seating map */}
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <div key={rowIndex} className="seat-row flex">
                {Array.from({ length: 13 }).map((_, placeIndex) => {
                  const seatRow = sortedSeatRows?.find(
                    (row) => row.seatRow === rowIndex + 1
                  );
                  const seat = seatRow?.seats.find(
                    (seat) => seat.place === placeIndex + 1
                  );
                  if (seat) {
                    return (
                      <>
                        <p>test</p>
                        <Seat
                          key={seat.seatId}
                          seat={seat}
                          className="available"
                        />
                      </>
                    ); // Available seat
                  } else {
                    return (
                      <div
                        key={`${rowIndex}-${placeIndex}`}
                        className="seat not-available"
                        style={{
                          backgroundColor: 'red',
                          width: '40px',
                          height: '40px',
                        }}
                      />
                    ); // Not available seat
                  }
                })}
              </div>
            ))}
          </div>

          {/* event info */}
          <aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
            {/* event header image placeholder */}
            <div className="bg-zinc-100 rounded-md h-32" />
            {/* event name */}
            <h1 className="text-xl text-zinc-900 font-semibold">
              [event-name]
            </h1>
            {/* event description */}
            <p className="text-sm text-zinc-500">
              [event-description]: Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Aliquam aliquid asperiores beatae deserunt dicta
              dolorem eius eos fuga laborum nisi officia pariatur quidem
              repellendus, reprehenderit sapiente, sed tenetur vel voluptatibus?
            </p>
            {/* add to calendar button */}
            <Button variant="secondary" disabled>
              Add to calendar
            </Button>
          </aside>
        </div>
      </main>

      {/* bottom cart affix (wrapper) */}
      <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
        {/* inner content */}
        <div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
          {/* total in cart state */}
          <div className="flex flex-col">
            <span>Total for [?] tickets</span>
            <span className="text-2xl font-semibold">[?] CZK</span>
          </div>

          {/* checkout button */}
          <Button disabled variant="default">
            Checkout now
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default App;
