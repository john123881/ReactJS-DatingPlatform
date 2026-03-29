import { useState, useEffect } from 'react';
import AccountLayout from '@/components/account-center/account-layout';
import RecordToggle from '@/components/account-center/record/record-toggle';
import RecordFilterBar from '@/components/account-center/record/record-filter-bar';
import RecordTable from '@/components/account-center/record/record-table';
import RecordPagination from '@/components/account-center/record/record-pagination';
import { useAccountRecords } from '@/hooks/account/use-account-records';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

export default function AccountRecord({ onPageChange }) {
  const currentPage = '紀錄查詢';
  const {
    isLoading,
    gameRecordOpen,
    setGameRecordOpen,
    pointSource,
    setPointSource,
    valueDateBegin,
    setValueDateBegin,
    valueDateEnd,
    setValueDateEnd,
    dateSortToggle,
    setDateSortToggle,
    pointRecords,
    gameRecords,
    updateQuery
  } = useAccountRecords();

  const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    onPageChange('會員中心');
  }, [onPageChange]);

  const pointColumns = [
    { 
      key: 'created_at', 
      label: (
        <span className="flex items-center justify-center gap-1">
          日期
          <div className="relative w-4 h-4">
            <MdArrowDropUp className={`absolute top-[-2px] ${dateSortToggle ? 'text-slate-600' : ''}`} />
            <MdArrowDropDown className={`absolute top-[6px] ${dateSortToggle ? '' : 'text-slate-600'}`} />
          </div>
        </span>
      ),
      sortable: true
    },
    { key: 'points_increase', label: '紅利積分' },
    { key: 'reason', label: '獲得來源' }
  ];

  const gameColumns = [
    { key: 'created_at', label: '日期', sortable: true },
    { key: 'game_score', label: '遊戲分數', sortable: true },
    { 
      key: 'game_time', 
      label: '遊戲時間', 
      sortable: true,
      render: (row) => row.game_time?.includes('T') ? row.game_time.split('T')[1].substring(0, 8) : row.game_time
    }
  ];

  return (
    <AccountLayout currentPage={currentPage}>
      <RecordToggle 
        checked={gameRecordOpen} 
        onChange={(e) => setGameRecordOpen(e.target.checked)}
        onReset={() => {
          setPointSource('全部');
          setDateSortToggle(false);
          setValueDateBegin('');
          setValueDateEnd('');
          updateQuery({ page: 1, selectedValue: '全部', date_begin: '', date_end: '' });
        }}
      />

      <RecordFilterBar 
        showSource={!gameRecordOpen}
        source={pointSource}
        onSourceChange={(e) => {
          setPointSource(e.target.value);
          updateQuery({ selectedValue: e.target.value, page: 1 });
        }}
        dateBegin={valueDateBegin}
        onDateBeginChange={(e) => {
          setValueDateBegin(e.target.value);
          updateQuery({ date_begin: e.target.value, page: 1 });
        }}
        dateEnd={valueDateEnd}
        onDateEndChange={(e) => {
          setValueDateEnd(e.target.value);
          updateQuery({ date_end: e.target.value, page: 1 });
        }}
        currentDate={currentDate}
      />

      <div className="mt-4 flex flex-col justify-between w-full h-[580px] lg:mx-1 xl:mx-1 bg-base-300 rounded-box place-items-center">
        <RecordTable 
          columns={gameRecordOpen ? gameColumns : pointColumns}
          rows={gameRecordOpen ? gameRecords.rows : pointRecords.rows}
          isLoading={isLoading}
          type={gameRecordOpen ? 'game_record' : 'points'}
          onSort={() => {
            if (!gameRecordOpen) {
              const newSort = !dateSortToggle;
              setDateSortToggle(newSort);
              updateQuery({ sortDate: newSort ? 'ASC' : 'DESC', page: 1 });
            }
          }}
        />

        <RecordPagination 
          page={gameRecordOpen ? gameRecords.page : pointRecords.page}
          totalPages={gameRecordOpen ? gameRecords.totalPages : pointRecords.totalPages}
          onPageChange={(p) => updateQuery({ page: p })}
        />
      </div>
    </AccountLayout>
  );
}
