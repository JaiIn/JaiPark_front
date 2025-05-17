/**
 * UI 컴포넌트 모듈
 * - 모든 UI 공통 컴포넌트를 한 곳에서 내보냄
 */

// 기본 UI 컴포넌트
export { default as Alert } from './Alert';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as LoadingSpinner } from './LoadingSpinner';

/**
 * 빈 상태 메시지 컴포넌트
 * - 데이터가 없을 때 표시하는 컴포넌트
 */
export const EmptyState = ({
  title = '데이터가 없습니다',
  description = '',
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`bg-white shadow-sm rounded-lg p-6 text-center ${className}`}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

/**
 * 페이지네이션 컴포넌트
 * - 페이지 기반 데이터 탐색 UI
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
  className = '',
}) => {
  if (totalPages <= 1) return null;
  
  // 표시할 페이지 번호 범위 계산
  const pageNumbersToShow = Math.min(maxPageButtons, totalPages);
  let startPage = Math.max(0, currentPage - Math.floor(pageNumbersToShow / 2));
  const endPage = Math.min(startPage + pageNumbersToShow - 1, totalPages - 1);
  
  // 표시할 페이지 수에 맞게 시작 페이지 조정
  if (endPage - startPage + 1 < pageNumbersToShow) {
    startPage = Math.max(0, endPage - pageNumbersToShow + 1);
  }
  
  // 페이지 번호 배열 생성
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  // 페이지네이션 버튼 컴포넌트
  const PaginationButton = ({ children, onClick, disabled, active }) => {
    const baseClasses = 'px-3 py-1 rounded focus:outline-none transition-colors';
    
    let stateClasses = 'bg-white text-indigo-600 hover:bg-indigo-50';
    
    if (active) {
      stateClasses = 'bg-indigo-600 text-white';
    } else if (disabled) {
      stateClasses = 'bg-gray-200 text-gray-500 cursor-not-allowed';
    }
    
    return (
      <button
        className={`${baseClasses} ${stateClasses}`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
  
  return (
    <div className={`flex justify-center space-x-2 mt-6 ${className}`}>
      {/* 처음 페이지로 이동 버튼 */}
      <PaginationButton
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
      >
        처음
      </PaginationButton>
      
      {/* 이전 페이지 버튼 */}
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &lt;
      </PaginationButton>
      
      {/* 페이지 번호 버튼 */}
      {pageNumbers.map(page => (
        <PaginationButton
          key={page}
          active={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page + 1}
        </PaginationButton>
      ))}
      
      {/* 다음 페이지 버튼 */}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        &gt;
      </PaginationButton>
      
      {/* 마지막 페이지로 이동 버튼 */}
      <PaginationButton
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
      >
        마지막
      </PaginationButton>
    </div>
  );
};
