import { Ticket, TicketFilters, PaginatedTickets } from './Ticket';

export interface TicketRepository {
  getAll(filters?: TicketFilters): Promise<PaginatedTickets>; 
  getById(id: string): Promise<Ticket | null>;
  create(ticket: Omit<Ticket, 'id' | 'userId'>): Promise<Ticket>;
  update(id: string, ticket: Partial<Ticket>): Promise<Ticket>;
  delete(id: string): Promise<void>;
  
  getDashboardStats(): Promise<{
    totalRegistered: number;
    upcomingDrawsCount: number;
    pendingCount: number;
  }>;
}
