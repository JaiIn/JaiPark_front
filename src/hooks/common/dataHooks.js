import { useState, useCallback } from 'react';

/**
 * 데이터 로딩 상태를 관리하는 커스텀 훅
 * @param {Function} fetchFunction - 데이터를 가져오는 함수
 * @param {boolean} initialLoading - 초기 로딩 상태
 * @returns {Object} - 데이터, 로딩 상태, 에러, 데이터 로드 함수
 */
export function useDataFetching(fetchFunction, initialLoading = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || '데이터를 불러올 수 없습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  return { data, loading, error, fetchData };
}

/**
 * 페이지네이션 로직을 관리하는 커스텀 훅
 * @param {number} initialPage - 초기 페이지 번호
 * @param {number} initialPageSize - 페이지당 항목 수
 * @returns {Object} - 페이지네이션 상태 및 제어 함수
 */
export function usePagination(initialPage = 0, initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goToPage = useCallback((page) => {
    const validPage = Math.min(Math.max(0, page), totalPages - 1);
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(0);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages - 1);
  }, [totalPages, goToPage]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(0); // 페이지 크기 변경 시 첫 페이지로 이동
  }, []);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize
  };
}

/**
 * 폼 상태와 유효성 검사를 관리하는 커스텀 훅
 * @param {Object} initialValues - 초기 폼 값
 * @param {Function} validateFunction - 유효성 검사 함수
 * @param {Function} onSubmit - 제출 처리 함수
 * @returns {Object} - 폼 상태 및 제어 함수
 */
export function useForm(initialValues = {}, validateFunction = () => ({}), onSubmit = () => {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // 필드 포커스를 잃었을 때 해당 필드만 유효성 검사
    const fieldErrors = validateFunction({ [name]: values[name] });
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  }, [values, validateFunction]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // 모든 필드를 touched로 표시
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // 전체 폼 유효성 검사
    const formErrors = validateFunction(values);
    setErrors(formErrors);
    
    // 에러가 없으면 제출
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateFunction, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors
  };
}
