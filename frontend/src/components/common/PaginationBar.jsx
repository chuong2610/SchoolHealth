import { Pagination } from "react-bootstrap";

const PaginationBar = ({ currentPage, totalPages, onPageChange }) => {
  // Logic to determine the range of page numbers to display
  const getPageRange = () => {
    const pageLimit = 3; // As requested, show 3 page links
    let startPage, endPage;

    if (totalPages <= pageLimit) {
      // Total pages are less than or equal to the limit, so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Total pages are more than the limit, calculate the sliding window
      const maxPagesBeforeCurrent = Math.floor(pageLimit / 2);
      const maxPagesAfterCurrent = Math.ceil(pageLimit / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent + 1) {
        // Near the beginning
        startPage = 1;
        endPage = pageLimit;
      } else if (currentPage >= totalPages - maxPagesAfterCurrent) {
        // Near the end
        startPage = totalPages - pageLimit + 1;
        endPage = totalPages;
      } else {
        // In the middle
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pages = getPageRange();

  return (
    <Pagination className="justify-content-center">
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      />
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {pages.map((page) => (
        <Pagination.Item
          key={page}
          active={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    </Pagination>
  );
};

export default PaginationBar;
