/**
 * RecordPagination - 通用分頁組件
 */
export default function RecordPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mb-3 join bg-base-200">
      <button
        className={`${page > 1 ? '' : 'btn-disabled'} join-item btn border-slate-700 hover:bg-primary btn-xs`}
        onClick={() => onPageChange(page - 1)}
      >
        «
      </button>

      {[...Array(Math.min(5, totalPages))].map((_, i) => {
        let p = page <= 3 ? 1 + i : page - 2 + i;
        if (p < 1 || p > totalPages) return null;

        return (
          <button
            key={p}
            className={`${p === page ? 'text-neongreen' : ''} join-item btn max-w-[25px] border-slate-700 hover:bg-primary hover:text-dark btn-xs`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        );
      })}

      <button
        className={`${page === totalPages ? 'btn-disabled' : ''} join-item btn border-slate-700 hover:bg-primary btn-xs`}
        onClick={() => onPageChange(page + 1)}
      >
        »
      </button>
    </div>
  );
}
