import { useRef, useEffect, useCallback, useState } from 'react';
import { PERFORMANCE_CONFIG } from '../config/appConfig';

/**
 * 컴포넌트 렌더링 성능을 측정하는 훅
 * @param {string} componentName - 컴포넌트 이름
 * @returns {void}
 */
export const useRenderPerformance = (componentName) => {
  // 개발 환경에서만 동작
  if (!PERFORMANCE_CONFIG.ENABLE_LOGGING) return;
  
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (PERFORMANCE_CONFIG.LOG_SLOW_RENDERS && 
        renderTime > PERFORMANCE_CONFIG.SLOW_RENDER_THRESHOLD) {
      console.warn(
        `[Performance] Slow render in ${componentName}: ${renderTime.toFixed(2)}ms ` +
        `(render count: ${renderCount.current})`
      );
    }
    
    // 다음 렌더링 측정을 위한 초기화
    startTime.current = performance.now();
    
    return () => {
      if (renderCount.current === 1) {
        const unmountTime = performance.now() - startTime.current;
        console.log(
          `[Performance] ${componentName} unmounted after ${unmountTime.toFixed(2)}ms ` +
          `(total renders: ${renderCount.current})`
        );
      }
    };
  });
};

/**
 * 함수가 변경되었는지 비교하고 변경되었을 때 콜백을 실행하는 훅
 * @param {Function} fn - 모니터링할 함수
 * @param {Array} deps - 의존성 배열
 * @param {Function} onChange - 함수가 변경되었을 때 실행할 콜백
 * @returns {Function} - 메모이제이션된 함수
 */
export const useDeepCallback = (fn, deps, onChange = () => {}) => {
  const fnRef = useRef(fn);
  const depsRef = useRef(deps);
  
  // 의존성 변경 확인
  const depsChanged = !depsRef.current || deps.some((dep, i) => {
    return JSON.stringify(dep) !== JSON.stringify(depsRef.current[i]);
  });
  
  // 함수나 의존성이 변경되었을 때 업데이트
  if (fnRef.current !== fn || depsChanged) {
    fnRef.current = fn;
    depsRef.current = deps;
    onChange(fn, deps);
  }
  
  return useCallback((...args) => {
    return fnRef.current(...args);
  }, []);
};

/**
 * 이전 값과 현재 값을 비교하는 훅
 * @param {any} value - 비교할 값
 * @returns {any} - 이전 값
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

/**
 * 특정 시간 동안 값이 변경되지 않을 때까지 기다린 후 값을 업데이트하는 훅
 * @param {any} value - 원본 값
 * @param {number} delay - 딜레이 시간 (ms)
 * @returns {any} - 안정화된 값
 */
export const useStableValue = (value, delay = 500) => {
  const [stableValue, setStableValue] = useState(value);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // 이전 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 새로운 타이머 설정
    timeoutRef.current = setTimeout(() => {
      setStableValue(value);
    }, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);
  
  return stableValue;
};



/**
 * 지연 로딩된 값을 사용하는 훅
 * @param {Function} factory - 값을 생성하는 팩토리 함수
 * @returns {any} - 생성된 값
 */
export const useLazyValue = (factory) => {
  const [value, setValue] = useState(null);
  const initialized = useRef(false);
  
  if (!initialized.current) {
    setValue(factory());
    initialized.current = true;
  }
  
  return value;
};

/**
 * 컴포넌트가 마운트되었는지 확인하는 훅
 * @returns {boolean} - 마운트 여부
 */
export const useMounted = () => {
  const mounted = useRef(false);
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  
  return mounted.current;
};

/**
 * 비동기 작업의 상태를 관리하는 훅
 * @param {Function} asyncFunction - 비동기 함수
 * @param {Array} deps - 의존성 배열
 * @returns {Object} - 상태 객체 (loading, error, data, execute)
 */
export const useAsync = (asyncFunction, deps = []) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null
  });
  
  const execute = useCallback(async (...args) => {
    setState({ loading: true, error: null, data: null });
    
    try {
      const data = await asyncFunction(...args);
      setState({ loading: false, error: null, data });
      return { data };
    } catch (error) {
      setState({ loading: false, error, data: null });
      return { error };
    }
  }, deps);
  
  return { ...state, execute };
};
