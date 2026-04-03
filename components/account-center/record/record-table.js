import PageLoader from '@/components/ui/loader/page-loader';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

/**
 * RecordTable - 通用紀錄表格
 * @param {Array} rows - 資料列表
 * @param {Array} columns - 欄位定義 [{ key, label, className, sortable }]
 * @param {boolean} isLoading - 是否加載中
 * @param {string} type - 紀錄類型 (用於 Loader)
 * @param {Function} onSort - 點擊表頭排序回呼
 */
export default function RecordTable({ 
  rows = [], 
  columns = [], 
  isLoading = false, 
  type = 'records',
  onSort,
  sortKey: currentSortKey,
  sortOrder: currentSortOrder
}) {
  return (
    <table className="container table table-fixed py-4 bg-base-300">
      <thead className="w-full ">
        <tr className="border-b border-slate-500 min-h-[52px]">
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => col.sortable && onSort && onSort(col.key)}
              className={`text-lg text-center text-light ${col.sortable ? 'cursor-pointer hover:text-neongreen' : ''} ${col.className || ''}`}
            >
              <div className="flex items-center justify-center min-h-[40px]">
                {col.label}
                {col.sortable && (
                  <div className="relative w-4 h-4 ml-1 flex-shrink-0 flex items-center justify-center">
                    <MdArrowDropUp 
                      className={`absolute top-[-3px] text-lg transition-all duration-200 ${
                        currentSortKey === col.key && currentSortOrder === 'ASC' 
                          ? 'text-neongreen opacity-100 scale-125' 
                          : 'text-slate-500 opacity-40 hover:opacity-100'
                      }`} 
                    />
                    <MdArrowDropDown 
                      className={`absolute bottom-[-3px] text-lg transition-all duration-200 ${
                        currentSortKey === col.key && currentSortOrder === 'DESC' 
                          ? 'text-neongreen opacity-100 scale-125' 
                          : 'text-slate-500 opacity-40 hover:opacity-100'
                      }`} 
                    />
                  </div>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="relative">
        {isLoading ? (
          <tr>
            <td colSpan={columns.length} className="p-0 border-0">
              <PageLoader type={type} minHeight="450px" />
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-20 text-slate-500">
              無相關紀錄
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className="text-slate-400 hover:text-primary">
              {columns.map((col) => (
                <td key={col.key} className="text-base text-center ">
                  {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
