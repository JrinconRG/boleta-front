import React from 'react';
import { Ticket } from '../../domain/Ticket';
import './TicketDetailModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  isLoading: boolean;
}

const statusLabel: Record<string, string> = {
  Pendiente: 'pendiente',
  Ganado: 'ganado',
  Perdido: 'perdido',
};

export const TicketDetailModal = ({ isOpen, onClose, ticket, isLoading }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div className="detail-content" onClick={(e) => e.stopPropagation()}>

        <div className="detail-header">
          <h2 className="detail-title">
            {isLoading ? 'Cargando...' : ticket?.title || 'Detalle del sorteo'}
          </h2>
          <button className="detail-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="detail-loading">
            <span className="detail-spinner" />
            Obteniendo información...
          </div>
        ) : ticket ? (
          <>
            {/* Estado y tipo como badge destacado */}
            <div className="detail-badges">
              <span className="detail-badge-type">{ticket.gameType}</span>
              <span className={`detail-status ${statusLabel[ticket.status] || 'pendiente'}`}>
                {ticket.status}
              </span>
            </div>

            {/* Número jugado — protagonista visual */}
            {ticket.playedNumber && (
              <div className="detail-number-block">
                <span className="detail-number-label">Número jugado</span>
                <span className="detail-number-value">{ticket.playedNumber}</span>
              </div>
            )}

            {/* Datos en grid */}
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-item-label">Fecha del sorteo</span>
                <span className="detail-item-value">
                  {new Date(ticket.drawDate).toLocaleDateString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="detail-item-sub">
                  {new Date(ticket.drawDate).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-item-label">Valor apostado</span>
                <span className="detail-item-value">
                  {ticket.betValue
                    ? `$${ticket.betValue.toLocaleString('es-CO')}`
                    : 'No registrado'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-item-label">Lugar de compra</span>
                <span className="detail-item-value">
                  {ticket.purchasePlace || 'No especificado'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-item-label">ID del registro</span>
                <span className="detail-item-value detail-id">{ticket.id}</span>
              </div>
            </div>

            {ticket.additionalNotes && (
              <div className="detail-notes">
                <span className="detail-item-label">Notas / Premio</span>
                <p className="detail-notes-text">{ticket.additionalNotes}</p>
              </div>
            )}
          </>
        ) : (
          <p className="detail-empty">No se encontró información del sorteo.</p>
        )}

      </div>
    </div>
  );
};