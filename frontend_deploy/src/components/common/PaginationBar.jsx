import { Pagination } from "react-bootstrap";
import styles from "./PaginationBar.module.css";

const PaginationBar = ({ currentPage, totalPages, onPageChange, btnClass, barClass }) => {
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
  const btnStyle = btnClass || styles.paginationBtn;
  const barStyle = barClass || styles.paginationBar;

  return (
    <div className={barStyle}>
      <div className={styles.paginationWrapper}>
        <Pagination>
          <Pagination.First
            className={btnStyle}
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
          <Pagination.Prev
            className={btnStyle}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          {pages.map((page) => (
            <Pagination.Item
              key={page}
              active={currentPage === page}
              className={`${btnStyle} ${currentPage === page ? styles.active : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next
            className={btnStyle}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
          <Pagination.Last
            className={btnStyle}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationBar;
