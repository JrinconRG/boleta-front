import React from 'react';
import './Pagination.css';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn-page"
        >
        Anterior
    </button>
      
      <span className="page-indicator">
        Página {currentPage} de {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="btn-page"
      >
        Siguiente
      </button>
    </div>
  );
};