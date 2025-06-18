import { Pagination } from "react-bootstrap";

const PaginationBar = ({ currentPage, totalPages, onPageChange }) => (
  <Pagination>
    <Pagination.Prev
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    />
    {[...Array(totalPages)].map((_, idx) => (
      <Pagination.Item
        key={idx + 1}
        active={currentPage === idx + 1}
        onClick={() => onPageChange(idx + 1)}
      >
        {idx + 1}
      </Pagination.Item>
    ))}
    <Pagination.Next
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    />
  </Pagination>
);

export default PaginationBar;
