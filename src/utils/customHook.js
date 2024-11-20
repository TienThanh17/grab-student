import { useEffect, useState } from "react";

// export const useDebounce = (callback, delay) => {
//   const debounceRef = useRef(null);

//   return (...args) => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };
// };

export const useDebouncedState = (initialValue, delay) => {
  const [value, setValue] = useState(initialValue);       // State được binding trực tiếp
  const [debouncedValue, setDebouncedValue] = useState(initialValue); // State sau khi debounce

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // Cập nhật debouncedValue sau khoảng thời gian delay
    }, delay);

    return () => {
      clearTimeout(handler); // Xóa timeout nếu value thay đổi trước khi debounce hoàn tất
    };
  }, [value, delay]);

  return [value, setValue, debouncedValue];
};

// export const useDebouncedEffect = (callback, delay, dependencies) => {
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       callback(); // Gọi callback sau delay
//     }, delay);

//     return () => {
//       clearTimeout(handler); // Xóa timeout nếu dependencies thay đổi trước khi delay kết thúc
//     };
//   }, [...dependencies, delay]);
// };

