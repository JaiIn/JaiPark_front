/**
 * 카드 컴포넌트
 * - 게시글, 프로필, 통계 등에 사용되는 컨테이너
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @returns {JSX.Element} 카드 컴포넌트
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  bordered = true,
  shadow = true,
  padding = true,
  noDivider = false,
  header,
  footer,
  onClick,
  ...rest
}) => {
  // 카드 스타일 변형
  const variants = {
    default: 'bg-white',
    primary: 'bg-indigo-50',
    secondary: 'bg-gray-50',
    success: 'bg-green-50',
    danger: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  };
  
  // 기본 카드 클래스
  const baseClasses = `
    ${variants[variant]}
    ${bordered ? 'border border-gray-200' : ''}
    ${shadow ? 'shadow-sm' : ''}
    ${hoverable ? 'hover:shadow-md transition-shadow duration-300' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    rounded-lg overflow-hidden
  `;
  
  return (
    <div 
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {/* 카드 헤더 */}
      {header && (
        <div className="px-4 py-3 border-b border-gray-200">
          {header}
        </div>
      )}
      
      {/* 카드 내용 */}
      <div className={padding ? 'p-4' : ''}>
        {children}
      </div>
      
      {/* 카드 푸터 */}
      {footer && (
        <div className={`px-4 py-3 bg-gray-50 ${!noDivider ? 'border-t border-gray-200' : ''}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  /** 카드 내용 */
  children: PropTypes.node.isRequired,
  /** 추가 클래스 */
  className: PropTypes.string,
  /** 카드 스타일 변형 */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  /** 호버 효과 적용 여부 */
  hoverable: PropTypes.bool,
  /** 테두리 적용 여부 */
  bordered: PropTypes.bool,
  /** 그림자 적용 여부 */
  shadow: PropTypes.bool,
  /** 내부 패딩 적용 여부 */
  padding: PropTypes.bool,
  /** 구분선 제거 여부 */
  noDivider: PropTypes.bool,
  /** 카드 헤더 */
  header: PropTypes.node,
  /** 카드 푸터 */
  footer: PropTypes.node,
  /** 클릭 핸들러 */
  onClick: PropTypes.func,
};

export default Card;
