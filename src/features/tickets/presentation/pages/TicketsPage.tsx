'use client';

import React, { useEffect, useState } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { useAuthStore } from '../../../auth/infrastructure/store/useAuthStore';
import { TicketFiltersBar } from '../../presentation/components/TicketFiltersBar';
import { TicketFormModal } from '../../presentation/components/TicketFormModal';
import { TicketDetailModal } from '../../presentation/components/TicketDetailModal';
import { Pagination } from '../../../../shared/presentation/components/Pagination';
import { Ticket, TicketFilters } from '../../domain/Ticket';
import styles from './TicketsPage.module.css';

export default function TicketsPage() {
  const { user, logout } = useAuthStore();

  // ── Una sola desestructuración del store ──────────────────
  const {
    tickets,
    stats,
    currentPage,
    totalPages,
    isLoading,
    fetchTickets,
    fetchStats,
    removeTicket,
    fetchTicketById,
    detailTicket,
    isFetchingDetail,
  } = useTicketStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchTickets(filters);
    fetchStats();
  }, [filters, fetchTickets, fetchStats]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Abre el detalle — click en la fila
  const handleRowClick = async (ticket: Ticket) => {
    setIsDetailOpen(true);
    await fetchTicketById(ticket.id);
  };

  // Editar — evita que el click llegue a handleRowClick
  const handleEditClick = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Eliminar — evita que el click llegue a handleRowClick
  const handleDelete = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation();
    if (confirm('¿Seguro que deseas eliminar este registro?')) {
      removeTicket(ticket.id);
    }
  };

  const handleCreateClick = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.layout}>

      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.pageTitle}>Mis Sorteos y Loterías</h1>
          <p className={styles.pageSubtitle}>
            Lleva el control de tus números jugados y nunca olvides revisar un premio
          </p>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
          <button onClick={logout} className={styles.btnLogout}>
            Salir
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Juegos Registrados</span>
          <p className={styles.statNumber}>{stats?.totalRegistered ?? 0}</p>
        </div>
        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <span className={styles.statLabel}>Próximos Sorteos</span>
          <p className={styles.statNumber}>{stats?.upcomingDrawsCount ?? 0}</p>
        </div>
        <div className={`${styles.statCard} ${styles.statDanger}`}>
          <span className={styles.statLabel}>Boletas Pendientes</span>
          <p className={styles.statNumber}>{stats?.pendingCount ?? 0}</p>
        </div>
      </section>

      <main className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Listado General</h2>
          <button className={styles.btnAdd} onClick={handleCreateClick}>
            + Registrar Boleta
          </button>
        </div>

        <TicketFiltersBar filters={filters} onFilterChange={setFilters} />

        {isLoading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} aria-hidden="true" />
            Conectando con la base de datos...
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titulo /Compra</th>
                  <th>Tipo</th>
                  <th>Número</th>
                  <th>Fecha de Sorteo</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      No tienes boletas registradas para este criterio de búsqueda.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    // ✅ onClick en los tr del tbody, cursor pointer via CSS
                    <tr
                      key={ticket.id}
                      className={styles.tableRow}
                      onClick={() => handleRowClick(ticket)}
                    >
                      <td>
                        <div className={styles.titleCell}>
                          <strong className={styles.ticketTitle}>
                            {ticket.title || 'Sorteo'}
                          </strong>
                          <span className={styles.ticketPlace}>
                            {ticket.purchasePlace || 'Lugar no especificado'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`${styles.badgeType} ${styles[ticket.gameType.toLowerCase().replace(' ', '_')]}`}>
                          {ticket.gameType}
                        </span>
                      </td>

                      <td className={styles.numberCell}>
                        {ticket.playedNumber || '----'}
                      </td>

                      <td>
                        <div className={styles.dateCell}>
                          <span>{new Date(ticket.drawDate).toLocaleDateString('es-CO')}</span>
                          <span className={styles.timeSub}>
                            {new Date(ticket.drawDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>

                      <td className={styles.amountCell}>
                        {ticket.betValue ? `$${ticket.betValue.toLocaleString('es-CO')}` : '$0'}
                      </td>

                      <td>
                        <span className={`${styles.statusPill} ${styles[ticket.status.toLowerCase()]}`}>
                          {ticket.status}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actionsCell}>
                          {/* ✅ stopPropagation para no disparar handleRowClick */}
                          <button
                            className={`${styles.btnAction} ${styles.btnEdit}`}
                            onClick={(e) => handleEditClick(e, ticket)}
                          >
                            Editar
                          </button>
                          <button
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            onClick={(e) => handleDelete(e, ticket)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <TicketDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        ticket={detailTicket}
        isLoading={isFetchingDetail}
      />

      <TicketFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketToEdit={selectedTicket}
      />
    </div>
  );
}