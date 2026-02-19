interface BookingState {
  selectedDate?: string | null;
  selectedTime?: string | null;
  horarioId?: number | null;

  participants?: {
    adults: number;
    children: number;
  };

  tracking?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    gclid?: string;
    referrer?: string;
  };
}

interface Window {
  bookingState?: BookingState;
}