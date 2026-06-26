export default function ExplorePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Gerar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="mt-12 flex justify-center items-center gap-4">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-soft disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Números */}
      <div className="flex gap-2">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`dots-${idx}`} className="text-outline py-2 px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-full font-label-sm text-label-sm transition-soft ${
                currentPage === page
                  ? 'bg-primary text-on-primary'
                  : 'border border-border-light hover:border-primary'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Próximo */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-soft disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}