import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AccountLayout from '@/components/account-center/account-layout';
import RecordToggle from '@/components/account-center/record/record-toggle';
import RecordFilterBar from '@/components/account-center/record/record-filter-bar';
import RecordTable from '@/components/account-center/record/record-table';
import RecordPagination from '@/components/account-center/record/record-pagination';
import { useAccountRecords } from '@/hooks/account/use-account-records';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

export default function AccountRecord({ onPageChange }) {
  const router = useRouter();
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
      label: '日期',
      sortable: true,
      className: 'w-[35%]'
    },
    { key: 'points_increase', label: '紅利積分', className: 'w-[30%]' },
    { key: 'reason', label: '獲得來源', className: 'w-[35%]' }
  ];

  const gameColumns = [
    { key: 'created_at', label: '日期', sortable: true, className: 'w-[35%]' },
    { key: 'game_score', label: '遊戲分數', sortable: true, className: 'w-[30%]' },
    { 
      key: 'game_time', 
      label: '遊戲時間', 
      sortable: true,
      className: 'w-[35%]',
      render: (row) => row.game_time?.includes('T') ? row.game_time.split('T')[1].substring(0, 8) : row.game_time
    }
  ];

  return (
    <AccountLayout currentPage={currentPage}>
      <RecordToggle 
        checked={gameRecordOpen} 
        onChange={(e) => {
          const isChecked = e.target.checked;
          setGameRecordOpen(isChecked);
          // 切換時重置篩選與排序狀態
          setPointSource('全部');
          setDateSortToggle(false);
          setValueDateBegin('');
          setValueDateEnd('');
          updateQuery({ 
            page: 1, 
            selectedValue: '全部', 
            date_begin: '', 
            date_end: '',
            sortKey: undefined,
            sortOrder: undefined,
            sortDate: undefined
          });
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

      <div className="mt-4 flex flex-col justify-between w-full h-[640px] pb-6 lg:mx-1 xl:mx-1 bg-base-300 rounded-box items-center">
        <div className="flex-1 w-full">
          <RecordTable 
            columns={gameRecordOpen ? gameColumns : pointColumns}
            rows={gameRecordOpen ? gameRecords.rows : pointRecords.rows}
            isLoading={isLoading}
            type={gameRecordOpen ? 'game_record' : 'points'}
            sortKey={router.query.sortKey}
            sortOrder={router.query.sortOrder}
            onSort={(key) => {
              // 支援多欄位排序 (日期, 分數, 時間)
              const isSameKey = router.query.sortKey === key;
              const newOrder = isSameKey && router.query.sortOrder === 'DESC' ? 'ASC' : 'DESC';
              
              updateQuery({ 
                sortKey: key, 
                sortOrder: newOrder,
                // 向下相容舊有的 sortDate 參數
                sortDate: key === 'created_at' ? newOrder : undefined, 
                page: 1 
              });
            }}
          />
        </div>

        <RecordPagination 
          page={gameRecordOpen ? gameRecords.page : pointRecords.page}
          totalPages={gameRecordOpen ? gameRecords.totalPages : pointRecords.totalPages}
          onPageChange={(p) => updateQuery({ page: p })}
        />
      </div>
    </AccountLayout>
  );
}
