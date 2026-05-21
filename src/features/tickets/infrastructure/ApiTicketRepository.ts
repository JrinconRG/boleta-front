import { httpClient } from '../../../shared/infrastructure/api/httpClient';
import { Ticket, TicketFilters, PaginatedTickets } from '../domain/Ticket';
import { TicketRepository } from '../domain/TicketRepository';

const mapToDomain = (apiTicket: any): Ticket => ({
  id: apiTicket.id,
  userId: apiTicket.userId || '',
  title: apiTicket.title || 'Sin título', 
  playedNumber: apiTicket.gameNumber, // gameNumber -> playedNumber
  drawDate: apiTicket.gameDate,       // gameDate -> drawDate
  betValue: apiTicket.amount ? Number(apiTicket.amount) : undefined, // amount -> betValue
  purchasePlace: apiTicket.place || '', // place -> purchasePlace
  gameType: apiTicket.gameType,
  status: apiTicket.status,
  additionalNotes: apiTicket.notes,   // notes -> additionalNotes
});

const mapToApi = (domainTicket: Partial<Ticket>) => ({
  title: (domainTicket as any).title || 'Boleto de Sorteo', // El backend exige "title"
  gameType: domainTicket.gameType,
  gameNumber: domainTicket.playedNumber,
  gameDate: domainTicket.drawDate,
  amount: domainTicket.betValue,
  place: domainTicket.purchasePlace,
  status: domainTicket.status,
  notes: domainTicket.additionalNotes,
});

export const ApiTicketRepository: TicketRepository = {
  async getAll(filters?: TicketFilters): Promise<PaginatedTickets> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.q) params.append('q', filters.q);
      if (filters.status) params.append('status', filters.status);
      if (filters.gameType) params.append('gameType', filters.gameType);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.pageSize) {
        params.append('pageSize', String(filters.pageSize));
      }
    }

    const response = await httpClient.get(`/tickets?${params.toString()}`);
    const { data, meta } = response.data; 

    return {
      data: data.map(mapToDomain),
      total: meta?.total || data.length,
      page: meta?.page || 1,
      totalPages: meta?.totalPages || 20
    };
  },

  async getById(id: string): Promise<Ticket | null> {
    const response = await httpClient.get(`/tickets/${id}`);
    return mapToDomain(response.data.data);
  },

  async create(ticket: Omit<Ticket, 'id' | 'userId'>): Promise<Ticket> {
    const apiBody = mapToApi(ticket);
    const response = await httpClient.post('/tickets', apiBody);
    return mapToDomain(response.data.data);
  },

  async update(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const apiBody = mapToApi(ticket);
    const response = await httpClient.put(`/tickets/${id}`, apiBody);
    return mapToDomain(response.data.data);
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/tickets/${id}`);
  },

  async getDashboardStats() {
    const [allRes, pendingRes] = await Promise.all([
      httpClient.get('/tickets?pageSize=1'),
      httpClient.get('/tickets?status=Pendiente&pageSize=1')
    ]);

    const upcomingRes = await httpClient.get('/tickets?status=Pendiente&pageSize=100');
    const now = new Date();
    const upcomingCount = upcomingRes.data.data.filter((t: any) => new Date(t.gameDate) >= now).length;

    return {
      totalRegistered: allRes.data.meta?.total || allRes.data.data.length,
      upcomingDrawsCount: upcomingCount,
      pendingCount: pendingRes.data.meta?.total || pendingRes.data.data.length,
    };
  }
};