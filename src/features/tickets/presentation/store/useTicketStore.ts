// features/tickets/infrastructure/store/useTicketStore.ts
import { create } from 'zustand';
import { Ticket, TicketFilters } from '../../domain/Ticket';
import { ApiTicketRepository } from '../../infrastructure/ApiTicketRepository';
import { parseApiValidationError, FieldErrors } from '../../../../shared/infrastructure/api/errorMapper';

interface TicketState {
  tickets: Ticket[];
  totalTickets: number;
  currentPage: number;
  totalPages: number;
  stats: { totalRegistered: number; upcomingDrawsCount: number; pendingCount: number } | null;
  isLoading: boolean;
  globalError: string | null;
  fieldErrors: FieldErrors;
  detailTicket: Ticket | null;
isFetchingDetail: boolean;


  fetchTickets: (filters?: TicketFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  addTicket: (ticket: Omit<Ticket, 'id' | 'userId'>) => Promise<boolean>;
  editTicket: (id: string, ticket: Partial<Ticket>) => Promise<boolean>;
  removeTicket: (id: string) => Promise<boolean>;
  clearErrors: () => void;
  fetchTicketById: (id: string) => Promise<void>;

}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  totalTickets: 0,
  currentPage: 1,
  totalPages: 1,
  stats: null,
  isLoading: false,
  globalError: null,
  fieldErrors: {},
  detailTicket: null,
  isFetchingDetail: false,

  fetchTicketById: async (id: string) => {
    set({ isFetchingDetail: true });
    try {
      const ticket = await ApiTicketRepository.getById(id);
      set({ detailTicket: ticket });
    } catch (err) {
      set({ detailTicket: null });
    } finally {
      set({ isFetchingDetail: false });
    }},


  

  clearErrors: () => set({ globalError: null, fieldErrors: {} }),

  fetchTickets: async (filters) => {
    set({ isLoading: true, globalError: null });
    try {
      const result = await ApiTicketRepository.getAll(filters);
      set({
        tickets: result.data,
        totalTickets: result.total,
        currentPage: result.page,
        totalPages: result.totalPages,
        isLoading: false
      });
    } catch (err: any) {
      set({ 
        globalError: err.response?.data?.error || 'Error al cargar boletas', 
        isLoading: false 
      });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await ApiTicketRepository.getDashboardStats();
      set({ stats });
    } catch (err) {
      console.error('Error cargando estadísticas', err);
    }
  },

  addTicket: async (ticket) => {
    set({ isLoading: true, globalError: null, fieldErrors: {} });
    try {
      await ApiTicketRepository.create(ticket);
      await get().fetchTickets(); 
      await get().fetchStats();   
      return true;
    } catch (err: any) {
      const apiErrorString = err.response?.data?.error || 'Error al crear la boleta';
      
      if (err.response?.status === 400) {
        set({ 
          fieldErrors: parseApiValidationError(apiErrorString), 
          globalError: 'Verifica los datos del formulario.',
          isLoading: false 
        });
      } else {
        set({ globalError: apiErrorString, isLoading: false });
      }
      return false;
    }
  },

  editTicket: async (id, ticket) => {
    set({ isLoading: true, globalError: null, fieldErrors: {} });
    try {
      await ApiTicketRepository.update(id, ticket);
      await get().fetchTickets();
      await get().fetchStats();
      return true;
    } catch (err: any) {
      const apiErrorString = err.response?.data?.error || 'Error al editar la boleta';
      
      if (err.response?.status === 400) {
        set({ 
          fieldErrors: parseApiValidationError(apiErrorString), 
          globalError: 'Verifica los cambios introducidos.',
          isLoading: false 
        });
      } else {
        set({ globalError: apiErrorString, isLoading: false });
      }
      return false;
    }
  },

  removeTicket: async (id) => {
    set({ isLoading: true, globalError: null });
    try {
      await ApiTicketRepository.delete(id);
      await get().fetchTickets();
      await get().fetchStats();
      return true;
    } catch (err: any) {
      set({ 
        globalError: err.response?.data?.error || 'Error al eliminar la boleta', 
        isLoading: false 
      });
      return false;
    }
  }
}));