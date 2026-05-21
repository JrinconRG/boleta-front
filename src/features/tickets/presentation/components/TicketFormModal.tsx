import React, { useState, useEffect } from 'react';
import { Ticket, TicketType, TicketStatus } from '../../domain/Ticket';
import { useTicketStore } from '../store/useTicketStore';
import './TicketFormModal.css';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketToEdit?: Ticket | null; 
}

export const TicketFormModal = ({ isOpen, onClose, ticketToEdit }: TicketFormModalProps) => {
  const { addTicket, editTicket, fieldErrors, globalError, clearErrors, isLoading } = useTicketStore();

  const [title, setTitle] = useState('');
  const [gameType, setGameType] = useState<TicketType>('Lotería');
  const [playedNumber, setPlayedNumber] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [betValue, setBetValue] = useState<number | ''>('');
  const [purchasePlace, setPurchasePlace] = useState('');
  const [status, setStatus] = useState<TicketStatus>('Pendiente');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    clearErrors();
    if (ticketToEdit) {
      setTitle((ticketToEdit as any).title || ''); // Usamos fallback por si acaso
      setGameType(ticketToEdit.gameType);
      setPlayedNumber(ticketToEdit.playedNumber || '');
      setDrawDate(ticketToEdit.drawDate ? ticketToEdit.drawDate.substring(0, 16) : '');
      setBetValue(ticketToEdit.betValue ?? '');
      setPurchasePlace(ticketToEdit.purchasePlace || '');
      setStatus(ticketToEdit.status);
      setAdditionalNotes(ticketToEdit.additionalNotes || '');
    } else {
      setTitle('');
      setGameType('Lotería');
      setPlayedNumber('');
      setDrawDate('');
      setBetValue('');
      setPurchasePlace('');
      setStatus('Pendiente');
      setAdditionalNotes('');
    }
  }, [ticketToEdit, isOpen, clearErrors]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ticketData: any = {
      title,
      gameType,
      playedNumber: playedNumber || undefined,
      drawDate: new Date(drawDate).toISOString(), 
      betValue: betValue !== '' ? Number(betValue) : undefined,
      purchasePlace,
      status,
      additionalNotes: additionalNotes || undefined,
    };

    let success = false;
    if (ticketToEdit) {
      success = await editTicket(ticketToEdit.id, ticketData);
    } else {
      success = await addTicket(ticketData);
    }

    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{ticketToEdit ? 'Editar Sorteo' : 'Registrar Nuevo Sorteo'}</h2>
        
        {globalError && <div className="alert-error">{globalError}</div>}

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Nombre del Sorteo / Lotería *</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Lotería de Medellín, Rifa Pro-Fondos"
              className={fieldErrors.title ? 'input-error' : ''}
            />
            {fieldErrors.title && <span className="error-text">{fieldErrors.title}</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Juego *</label>
              <select value={gameType} onChange={(e) => setGameType(e.target.value as TicketType)}>
                <option value="Lotería">Lotería</option>
                <option value="Rifa">Rifa</option>
                <option value="Sorteo">Sorteo</option>
                <option value="Boleta">Boleta</option>
                <option value="Juego ocasional">Juego ocasional</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estado Inicial *</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)}>
                <option value="Pendiente">Pendiente</option>
                <option value="Ganado">Ganado</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Número Jugado (Opcional)</label>
              <input 
                type="text" 
                value={playedNumber} 
                onChange={(e) => setPlayedNumber(e.target.value)}
                placeholder="Ej: 1234"
                className={fieldErrors.gameNumber ? 'input-error' : ''}
              />
              {fieldErrors.gameNumber && <span className="error-text">{fieldErrors.gameNumber}</span>}
            </div>

            <div className="form-group">
              <label>Valor Apostado (Opcional)</label>
              <input 
                type="number" 
                value={betValue} 
                onChange={(e) => setBetValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ej: 5000"
                className={fieldErrors.amount ? 'input-error' : ''}
              />
              {fieldErrors.amount && <span className="error-text">{fieldErrors.amount}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Fecha del Sorteo *</label>
              <input 
                type="datetime-local" 
                required
                value={drawDate} 
                onChange={(e) => setDrawDate(e.target.value)}
                className={fieldErrors.gameDate ? 'input-error' : ''}
              />
              {fieldErrors.gameDate && <span className="error-text">{fieldErrors.gameDate}</span>}
            </div>

            <div className="form-group">
              <label>Lugar de Compra</label>
              <input 
                type="text" 
                value={purchasePlace} 
                onChange={(e) => setPurchasePlace(e.target.value)}
                placeholder="Ej: Paga Todo, Tienda la esquina"
                className={fieldErrors.place ? 'input-error' : ''}
              />
              {fieldErrors.place && <span className="error-text">{fieldErrors.place}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Notas Adicionales / Premio</label>
            <textarea 
              value={additionalNotes} 
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Ej: Se juega con las tres últimas cifras. Premio: Una Moto."
              rows={3}
              className={fieldErrors.notes ? 'input-error' : ''}
            />
            {fieldErrors.notes && <span className="error-text">{fieldErrors.notes}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Guardando...' : ticketToEdit ? 'Actualizar Cambios' : 'Registrar Boleto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};