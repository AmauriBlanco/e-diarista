import { useMemo, useState } from 'react';

export default function usePagination(itemsList: unknown[], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1),
    totalPage = useMemo(() => {
      if (itemsList.length > itemsPerPage) {
        return Math.ceil(itemsList.length / itemsPerPage);
      }
      return 1;
    }, [itemsList, itemsPerPage]);
  return {
    currentPage,
    setCurrentPage,
    totalPage,
    itemsPerPage,
  };
}
