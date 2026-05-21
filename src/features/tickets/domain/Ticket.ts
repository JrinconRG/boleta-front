export type TicketType = 'Lotería' | 'Rifa' | 'Sorteo' | 'Boleta' | 'Juego ocasional';
export type TicketStatus = 'Pendiente' | 'Ganado' | 'Perdido';

export interface Ticket {
  id: string;
  userId: string;     
   title: string;     
  playedNumber?: string;  
  drawDate: string;      
  betValue?: number;      
  purchasePlace: string;   
  gameType: TicketType;  
  status: TicketStatus;   
  additionalNotes?: string
}

export interface TicketFilters {
  q?: string;
  status?: TicketStatus;
  gameType?: TicketType;
  page?: number;
  pageSize?: number;
}

export interface PaginatedTickets {
  data: Ticket[];
  total: number;
  page: number;
  totalPages: number;
}
