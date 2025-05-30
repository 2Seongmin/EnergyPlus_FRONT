import { Pagination, PageBtn } from "../TableStyle/Table.style";

const CustomPagination = ({ page, totalPages, onPageChange, blockSize = 5 }) => {
  const currentBlock = Math.floor(page / blockSize);
  const startPage = currentBlock * blockSize;
  const endPage = Math.min(startPage + blockSize, totalPages);

  return (
    <Pagination>
      <PageBtn onClick={() => onPageChange(0)} disabled={page === 0}>≪</PageBtn>
      <PageBtn onClick={() => onPageChange(Math.max(page - 1, 0))} disabled={page === 0}>{"<"}</PageBtn>

      {Array.from({ length: endPage - startPage }, (_, i) => {
        const pageNumber = startPage + i;
        return (
          <PageBtn
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            active={page === pageNumber}
          >
            {pageNumber + 1}
          </PageBtn>
        );
      })}

      <PageBtn
        onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
        disabled={page === totalPages - 1}
      >
        {">"}
      </PageBtn>
      <PageBtn
        onClick={() => onPageChange(totalPages - 1)}
        disabled={page === totalPages - 1}
      >
        ≫
      </PageBtn>
    </Pagination>
  );
};

export default CustomPagination;
