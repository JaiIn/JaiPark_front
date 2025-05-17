/**
 * 로딩 스피너 컴포넌트
 * - 로딩 상태를 시각적으로 표시
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} 로딩 스피너 컴포넌트
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'indigo',
  fullScreen = false,
  message = '',
  className = '',
  ...rest
}) => {
  // 스피너 크기
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // 스피너 색상
  const colors = {
    gray: 'border-gray-500',
    indigo: 'border-indigo-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    pink: 'border-pink-500',
  };
  
  // 기본 스피너 클래스
  const spinnerClass = `
    animate-spin
    rounded-full
    border-2
    border-t-transparent
    ${sizes[size]}
    ${colors[color]}
    ${className}
  `;
  
  // 전체 화면 로딩
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <div className={spinnerClass} {...rest} />
          {message && (
            <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
          )}
        </div>
      </div>
    );
  }
  
  // 인라인 로딩
  if (message) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className={spinnerClass} {...rest} />
        <p className="mt-2 text-gray-600 text-sm">{message}</p>
      </div>
    );
  }
  
  // 기본 로딩 스피너
  return (
    <div className="flex justify-center py-4">
      <div className={spinnerClass} {...rest} />
    </div>
  );
};

LoadingSpinner.propTypes = {
  /** 스피너 크기 */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** 스피너 색상 */
  color: PropTypes.oneOf(['gray', 'indigo', 'blue', 'green', 'red', 'yellow', 'purple', 'pink']),
  /** 전체 화면 로딩 여부 */
  fullScreen: PropTypes.bool,
  /** 로딩 메시지 */
  message: PropTypes.string,
  /** 추가 클래스 */
  className: PropTypes.string,
};

export default LoadingSpinner;
