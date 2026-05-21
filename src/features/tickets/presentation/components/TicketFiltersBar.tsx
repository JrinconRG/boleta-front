import React from 'react';
import { TicketFilters, TicketType, TicketStatus } from '../../domain/Ticket';
import './TicketFiltersBar.css';
interface FiltersBarProps {
  filters: TicketFilters;
  onFilterChange: (newFilters: TicketFilters) => void;
}

export const TicketFiltersBar = ({ filters, onFilterChange }: FiltersBarProps) => {
  
  const handleQueryChange = (text: string) => {
  onFilterChange({
    ...filters,
    page: 1,
    q: text || undefined
  });
};

  const handleDropdownChange = (field: 'gameType' | 'status', value: string) => {
    onFilterChange({
      ...filters,
      page: 1,
      [field]: value || undefined
    });
  };

  return (
    <div className="filters-bar">
      <div className="filter-input-wrapper">
        <input
          type="text"
          placeholder="Buscar por titulo o número jugado..."
            value={filters.q || ''}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-select-wrapper">
        <select 
          value={filters.gameType || ''} 
          onChange={(e) => handleDropdownChange('gameType', e.target.value)}
          className="select-filter"
        >
          <option value="">Todos los tipos de juego</option>
          <option value="Lotería">Lotería</option>
          <option value="Rifa">Rifa</option>
          <option value="Sorteo">Sorteo</option>
          <option value="Boleta">Boleta</option>
          <option value="Juego ocasional">Juego ocasional</option>
        </select>
      </div>

      <div className="filter-select-wrapper">
        <select 
          value={filters.status || ''} 
          onChange={(e) => handleDropdownChange('status', e.target.value)}
          className="select-filter"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Ganado">Ganado</option>
          <option value="Perdido">Perdido</option>
        </select>
      </div>
    </div>
  );
};