const API_BASE_URL =
  'https://nfctron-frontend-seating-case-study-2024.vercel.app';

export interface EventDetails {
  eventId: string;
  namePub: string;
  description: string;
  currencyIso: string;
  dateFrom: string;
  dateTo: string;
  headerImageUrl: string;
  place: string;
}

export interface Seat {
  seatId: string;
  place: number;
  ticketTypeId: string;
}

export interface SeatRow {
  seatRow: number;
  seats: Seat[];
}

export interface EventTickets {
  ticketTypes: { id: string; name: string; price: number }[];
  seatRows: SeatRow[];
}

export const fetchEventDetails = async () => {
  const response = await fetch(`${API_BASE_URL}/event`);
  const data = await response.json();
  return data;
};

export const fetchEventTickets = async (eventId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/event-tickets?eventId=${eventId}`
  );
  const data = await response.json();
  return data;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
};

export const createOrder = async (orderData: any) => {
  const response = await fetch(`${API_BASE_URL}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  return data;
};
