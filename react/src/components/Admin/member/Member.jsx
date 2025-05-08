import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  SearchContainer,
  SearchInput,
  SearchButton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  RoleToggle,
  StatusBadge,
  GradeBadge,
  Pagination,
  PageButton,
  FilterContainer,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  ResetButton
} from './Member.styles';



const Member = () => {
  const itemsPerPage = 10;
  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchMember, setSearchMember] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    dateRange: '',
    grade: '',
    status: '',
    role: ''
  });

  // 마일리지에 따른 등급 구분
  const getGradeByMileage = (mileage) => {
    if (mileage > 30000) return '지구';
    if (mileage > 20000) return '숲';
    if (mileage > 5000) return '나무';
    return '새싹'; // 현재 마일리지가 없기에 새싹으로..
  };

  const fetchMembers = async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const params = new URLSearchParams();
    params.append('page', currentPage - 1);
    if (searchMember.trim()) params.append('keyword', searchMember);
    if (filters.dateRange) params.append('dateRange', filters.dateRange);
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.status) params.append('status', filters.status);
    if (filters.role) params.append('role', filters.role);

    try {
      const res = await fetch(`http://localhost:80/admin/members?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('회원 정보 불러오기 실패');
      const data = await res.json();
      setMembers(data.members);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, filters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMembers();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleReset = () => {
    setFilters({ dateRange: '', grade: '', status: '', role: '' });
    setSearchMember('');
    setCurrentPage(1);
    fetchMembers();
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'ROLE_USER' ? 'ROLE_ADMIN' : 'ROLE_USER';
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:80/admin/members/${id}/role?role=${newRole}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('권한 변경 실패');
      fetchMembers();
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const paginate = (page) => setCurrentPage(page);

  return (
    <Container>
      <Title>회원관리</Title>

      <SearchContainer>
        <SearchInput type="text" placeholder="검색" value={searchMember} onChange={(e) => setSearchMember(e.target.value)} />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </SearchContainer>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>가입일</FilterLabel>
          <FilterSelect name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
            <option value="">전체</option>
            <option value="1주일">1주일 이내</option>
            <option value="1개월">1개월 이내</option>
            <option value="3개월">3개월 이내</option>
            <option value="6개월">6개월 이내</option>
            <option value="1년">1년 이내</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>등급</FilterLabel>
          <FilterSelect name="grade" value={filters.grade} onChange={handleFilterChange}>
            <option value="">전체</option>
            <option value="새싹">새싹</option>
            <option value="나무">나무</option>
            <option value="숲">숲</option>
            <option value="지구">지구</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>상태</FilterLabel>
          <FilterSelect name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">전체</option>
            <option value="Y">회원</option>
            <option value="N">탈퇴</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>역할</FilterLabel>
          <FilterSelect name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">전체</option>
            <option value="ROLE_USER">사용자</option>
            <option value="ROLE_ADMIN">관리자</option>
          </FilterSelect>
        </FilterGroup>

        <ResetButton onClick={handleReset}>필터 초기화</ResetButton>
      </FilterContainer>

      <Table>
        <thead>
          <TableRow>
            <TableHeader>No</TableHeader>
            <TableHeader>아이디</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>가입일</TableHeader>
            <TableHeader>역할</TableHeader>
            <TableHeader>등급</TableHeader>
            <TableHeader>탈퇴</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {members.map((member, idx) => (
            <TableRow key={member.userId}>
              <TableCell>{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
              <TableCell>{member.userEmail}</TableCell>
              <TableCell>{member.userName}</TableCell>
              <TableCell>{member.joinDate}</TableCell>
              <TableCell>
                <RoleToggle
                  onClick={() => handleRoleToggle(member.userId, member.role)}
                  role={member.role === 'ROLE_ADMIN' ? '관리자' : '사용자'}
                >
                  {member.role === 'ROLE_ADMIN' ? '관리자' : '사용자'}
                </RoleToggle>
              </TableCell>
              <TableCell>
                {member.role === 'ROLE_ADMIN' ? (
                  <span>-</span>
                ) : (
                  <GradeBadge grade={getGradeByMileage(member.mileage)}>
                    {getGradeByMileage(member.mileage)} ({member.mileage?.toLocaleString()}원)
                  </GradeBadge>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={member.status === 'Y' ? '회원' : '탈퇴'}>
                  {member.status === 'Y' ? '회원' : '탈퇴'}
                </StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <PageButton onClick={goToFirstPage}>&laquo;</PageButton>
        <PageButton onClick={goToPreviousPage}>&lt;</PageButton>
        {[...Array(totalPages).keys()].map(i => (
          <PageButton key={i + 1} active={currentPage === i + 1} onClick={() => paginate(i + 1)}>
            {i + 1}
          </PageButton>
        ))}
        <PageButton onClick={goToNextPage}>&gt;</PageButton>
        <PageButton onClick={goToLastPage}>&raquo;</PageButton>
      </Pagination>
    </Container>
  );
};

export default Member;
