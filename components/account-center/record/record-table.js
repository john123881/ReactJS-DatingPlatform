import PageLoader from '@/components/ui/loader/page-loader';

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
  onSort
}) {
  return (
    <table className="container table py-4 bg-base-300">
      <thead className="w-full ">
        <tr className="border-b border-slate-500 min-h-[52px]">
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => col.sortable && onSort && onSort(col.key)}
              className={`text-lg text-center text-light ${col.sortable ? 'cursor-pointer hover:text-neongreen' : ''} ${col.className || ''}`}
            >
              {col.label}
              {col.sortable && (
                <span className="relative ml-1">
                  {/* 可以加入排序圖示 */}
                </span>
              )}
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
