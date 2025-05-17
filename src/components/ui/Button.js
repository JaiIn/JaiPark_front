/**
 * 버튼 컴포넌트
 * - 다양한 스타일과 크기의 버튼을 표시
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} 버튼 컴포넌트
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon = null,
  iconPosition = 'left',
  isLoading = false,
  onClick,
  ...rest
}) => {
  // 버튼 스타일 변형
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    link: 'bg-transparent text-indigo-600 hover:underline hover:text-indigo-800 focus:ring-0 p-0',
  };
  
  // 버튼 크기
  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // 링크 스타일이 아닌 경우에만 크기 적용
  const sizeClass = variant === 'link' ? '' : sizes[size];
  
  // 로딩 스피너 크기
  const spinnerSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  return (
    <button
      type={type}
      className={`
        ${variants[variant]} 
        ${sizeClass}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${variant !== 'link' ? 'rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2' : ''}
        inline-flex items-center justify-center
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {/* 로딩 스피너 */}
      {isLoading && (
        <span className="mr-2">
          <svg 
            className={`animate-spin ${spinnerSizes[size]} text-current`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      
      {/* 왼쪽 아이콘 */}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* 버튼 텍스트 */}
      {children}
      
      {/* 오른쪽 아이콘 */}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  /** 버튼 내용 */
  children: PropTypes.node.isRequired,
  /** 버튼 타입 */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** 버튼 스타일 변형 */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success', 'warning', 'info', 'link']),
  /** 버튼 크기 */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** 전체 너비 적용 여부 */
  fullWidth: PropTypes.bool,
  /** 비활성화 여부 */
  disabled: PropTypes.bool,
  /** 추가 클래스 */
  className: PropTypes.string,
  /** 아이콘 */
  icon: PropTypes.node,
  /** 아이콘 위치 */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** 로딩 상태 */
  isLoading: PropTypes.bool,
  /** 클릭 핸들러 */
  onClick: PropTypes.func,
};

export default Button;
