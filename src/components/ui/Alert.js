/**
 * 알림 메시지 컴포넌트
 * - 사용자에게 다양한 유형의 알림 메시지 표시
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Alert 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element|null} 알림 메시지 컴포넌트 또는 null(닫힌 경우)
 */
const Alert = ({
  children,
  type = 'info',
  title,
  message,
  dismissible = false,
  autoClose = false,
  autoCloseTime = 5000,
  onClose,
  className = '',
  icon,
  action,
  ...rest
}) => {
  // 알림 표시 상태
  const [visible, setVisible] = useState(true);
  
  // 자동 닫기 효과
  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, visible]);
  
  // 닫기 처리
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  // 알림 유형별 스타일
  const typeStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-700',
      icon: 'bg-blue-100 text-blue-700',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: 'bg-green-100 text-green-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: 'bg-yellow-100 text-yellow-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: 'bg-red-100 text-red-700',
    },
    neutral: {
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      text: 'text-gray-700',
      icon: 'bg-gray-100 text-gray-700',
    },
  };
  
  // 알림이 닫힌 경우 렌더링하지 않음
  if (!visible) return null;
  
  // 스타일 변수
  const style = typeStyles[type] || typeStyles.info;
  
  return (
    <div
      className={`
        ${style.bg} 
        ${style.border} 
        ${style.text} 
        border 
        rounded-lg 
        p-4 
        mb-4
        ${className}
      `}
      role="alert"
      {...rest}
    >
      <div className="flex">
        {/* 아이콘 영역 */}
        {icon && (
          <div className={`flex-shrink-0 mr-3 ${style.icon}`}>
            {icon}
          </div>
        )}
        
        {/* 내용 영역 */}
        <div className="flex-grow">
          {/* 제목 */}
          {title && (
            <h3 className="font-medium">{title}</h3>
          )}
          
          {/* 메시지 또는 자식 요소 */}
          <div className="text-sm">
            {message || children}
          </div>
          
          {/* 액션 영역 */}
          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>
        
        {/* 닫기 버튼 */}
        {dismissible && (
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 ${style.bg} ${style.text} rounded-lg focus:ring-2 p-1.5 hover:${style.bg} inline-flex h-8 w-8`}
            onClick={handleClose}
            aria-label="닫기"
          >
            <span className="sr-only">닫기</span>
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  /** 알림 내용 */
  children: PropTypes.node,
  /** 알림 유형 */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'neutral']),
  /** 알림 제목 */
  title: PropTypes.string,
  /** 알림 메시지 (children 대신 사용 가능) */
  message: PropTypes.string,
  /** 닫기 버튼 표시 여부 */
  dismissible: PropTypes.bool,
  /** 자동 닫기 여부 */
  autoClose: PropTypes.bool,
  /** 자동 닫기 시간 (밀리초) */
  autoCloseTime: PropTypes.number,
  /** 닫기 핸들러 */
  onClose: PropTypes.func,
  /** 추가 클래스 */
  className: PropTypes.string,
  /** 아이콘 */
  icon: PropTypes.node,
  /** 액션 버튼/링크 */
  action: PropTypes.node,
};

export default Alert;
