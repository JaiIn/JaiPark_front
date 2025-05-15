import React from 'react';

/**
 * 로딩 스피너 컴포넌트
 */
export const LoadingSpinner = ({ size = 'medium', className = '', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  const spinnerClass = `animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 ${sizeClasses[size]} ${className}`;
  
  if (fullScreen) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-75 z-50">
        <div className={spinnerClass}></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center py-4">
      <div className={spinnerClass}></div>
    </div>
  );
};

/**
 * 알림 메시지 컴포넌트
 */
export const Alert = ({ type = 'info', children, dismissible = false, onClose }) => {
  const typeClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };
  
  return (
    <div className={`${typeClasses[type]} px-4 py-3 rounded relative mb-4`} role="alert">
      <div className="flex items-center">
        <div className="flex-grow">{children}</div>
        {dismissible && (
          <button
            className="ml-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            type="button"
            aria-label="닫기"
          >
            <span className="text-xl">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * 페이지네이션 컴포넌트
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

/**
 * 빈 상태 메시지 컴포넌트
 */
export const EmptyState = ({
  title = '데이터가 없습니다',
  description = '',
  icon,
  action,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

/**
 * 버튼 컴포넌트
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...rest
}) => {
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };
  
  return (
    <button
      type={type}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
