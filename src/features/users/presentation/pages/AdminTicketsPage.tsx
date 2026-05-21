'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/infrastructure/store/useAuthStore';
import { httpClient } from '../../../../shared/infrastructure/api/httpClient';
import { Pagination } from '../../../../shared/presentation/components/Pagination';
import { AdminTicket } from '../../../tickets/domain/Ticket';
import './AdminTicketsPage.css';


export const AdminTicketsPage = () => {
  const { user, logout } = useAuthStore();

  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchAdminTickets = async () => {
      setIsLoading(true);
      setGlobalError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('pageSize', '5');
        if (debouncedQuery) params.append('q', debouncedQuery);
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('gameType', typeFilter);

        const response = await httpClient.get(`/admin/tickets?${params.toString()}`);
        const { data, meta } = response.data;

        setTickets(data);
        setTotal(meta?.total ?? data.length);
        setTotalPages(meta?.totalPages ?? 1);
      } catch (err: any) {
        const status = err.response?.status;
        if (status === 403) {
          setGlobalError('403 Forbidden — No tienes permisos de administrador.');
        } else {
          setGlobalError(err.response?.data?.error || 'Error al cargar el panel de administración.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminTickets();
  }, [page, debouncedQuery, statusFilter, typeFilter, user]);

  if (user?.role !== 'admin') {
    return (
      <div className="admin-forbidden">
        <span className="forbidden-code">403</span>
        <p>No tienes autorización para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      <header className="admin-header">
        <div className="admin-header-title">
          <h1 className="admin-page-title">Panel de Administración</h1>
          <p className="admin-page-subtitle">
            Visualización global de todas las boletas de la plataforma
          </p>
        </div>
        <div className="admin-header-right">
          <div className="badge-admin">
            <span className="badge-admin-dot" aria-hidden="true" />
            Admin: {user?.name}
          </div>
          <button onClick={logout} className="btn-admin-logout">
            Salir
          </button>
        </div>
      </header>

      {globalError && (
        <div className="admin-alert-error" role="alert">
          {globalError}
        </div>
      )}

      <section className="admin-filters-card">
        <div className="admin-search-box">
          <label htmlFor="admin-search">Búsqueda global</label>
          <div className="admin-search-wrapper">
            <input
              id="admin-search"
              type="text"
              placeholder="Número, sorteo, usuario o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-filter-dropdown">
          <label htmlFor="admin-status">Estado</label>
          <select
            id="admin-status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Ganado">Ganado</option>
            <option value="Perdido">Perdido</option>
          </select>
        </div>

        <div className="admin-filter-dropdown">
          <label htmlFor="admin-type">Tipo de juego</label>
          <select
            id="admin-type"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">Todos los tipos</option>
            <option value="Lotería">Lotería</option>
            <option value="Rifa">Rifa</option>
            <option value="Sorteo">Sorteo</option>
            <option value="Boleta">Boleta</option>
            <option value="Juego ocasional">Juego ocasional</option>
          </select>
        </div>
      </section>

      {/* Resumen */}
      <div className="admin-stats-summary">
        {isLoading
          ? 'Consultando base de datos...'
          : <>Se encontraron <strong>{total}</strong> boletas en el sistema.</>
        }
      </div>

      {/* Tabla */}
      <section className="admin-main-card">
        {isLoading ? (
          <div className="admin-loading">
            <span className="admin-spinner" aria-hidden="true" />
            Consultando base de datos global...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario (dueño)</th>
                  <th>Detalle sorteo</th>
                  <th>Tipo</th>
                  <th>Número</th>
                  <th>Fecha sorteo</th>
                  <th>Valor apostado</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-empty-row">
                      Ningún registro coincide con los filtros de búsqueda.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="admin-table-row">
                      <td>
                        <div className="owner-info">
                          <strong className="owner-name">{ticket.owner?.name}</strong>
                          <span className="owner-email">{ticket.owner?.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ticket-title">{ticket.title}</span>
                      </td>
                      <td>
                        <span className={`admin-badge-type ${ticket.gameType.toLowerCase().replace(' ', '_')}`}>
                          {ticket.gameType}
                        </span>
                      </td>
                      <td className="admin-number-cell">
                        {ticket.gameNumber || '------'}
                      </td>
                      <td className="admin-date-cell">
                        {new Date(ticket.gameDate).toLocaleDateString('es-CO')}
                      </td>
                      <td className="admin-amount-cell">
                        {ticket.amount ? `$${Number(ticket.amount).toLocaleString('es-CO')}` : 'N/A'}
                      </td>
                      <td>
                        <span className={`admin-status-pill ${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </section>
    </div>
  );
};