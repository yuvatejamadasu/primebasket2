import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Search,
  UserPlus,
  BriefcaseBusiness,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from './context/EmployeeContext';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 'dots', totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, 'dots', totalPages - 1, totalPages];
  }

  return [1, 'dots', currentPage, 'dots-right', totalPages];
};

const EmployeesList = () => {
  const navigate = useNavigate();
  const { employees, error, loading } = useEmployees();
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return employees.filter((employee) => {
      return (
        !normalizedQuery ||
        employee.fullName.toLowerCase().includes(normalizedQuery) ||
        employee.employeeId.toLowerCase().includes(normalizedQuery) ||
        employee.designation.toLowerCase().includes(normalizedQuery) ||
        employee.email.toLowerCase().includes(normalizedQuery) ||
        employee.department.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [employees, query]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredEmployees.length);

  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEmployees, rowsPerPage, startIndex]);

  const pageItems = useMemo(
    () => buildPageItems(safeCurrentPage, totalPages),
    [safeCurrentPage, totalPages]
  );

  if (loading) {
    return (
      <div className="employee-empty card">
        <div className="card-body">
          <h3>Loading employees</h3>
          <p>The employee directory is being loaded into the dashboard.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-empty card">
        <div className="card-body">
          <h3>Unable to load employees</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employees-page">
      <div className="content-header employee-page-header">
        <div>
          <h2>Employees</h2>
          <p>Manage your staff and internal team members</p>
        </div>
        <div className="employee-toolbar">
          <label className="employee-search employee-search--toolbar">
            <Search size={15} />
            <input
              type="text"
              className="form-control"
              placeholder="Search employees..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <button type="button" className="btn btn-primary employee-create-btn" onClick={() => navigate('/employees/create')}>
            <UserPlus size={16} />
            Create Employee
          </button>
        </div>
      </div>

      <section className="card employee-table-card">
        <div className="card-body employee-table-shell">
          <div className="table-wrap">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee</th>
                  <th>Role / Dept</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length ? (
                  paginatedEmployees.map((employee) => {
                    const initials = employee.fullName
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase();

                    return (
                      <tr key={employee.id}>
                        <td className="employee-id-cell">{employee.employeeId}</td>
                        <td>
                          <div className="employee-name-cell">
                            <div className="employee-avatar employee-avatar--sm">{initials}</div>
                            <div>
                              <strong>{employee.fullName}</strong>
                              <span>{employee.employeeType || 'Employee'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="employee-role-cell">
                            <strong>{employee.designation || 'Not provided'}</strong>
                            <span>
                              <BriefcaseBusiness size={12} />
                              {employee.department || 'Not provided'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="employee-contact-cell">
                            <span>
                              <Phone size={12} />
                              {employee.phone}
                            </span>
                            <a href={`mailto:${employee.email}`}>
                              <Mail size={12} />
                              {employee.email}
                            </a>
                          </div>
                        </td>
                        <td className="employee-action-cell">
                          <button
                            type="button"
                            className="employee-action"
                            onClick={() => navigate(`/employees/${employee.id}`)}
                            aria-label={`View ${employee.fullName}`}
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="employee-empty employee-empty--inline">
                        <div className="card-body">
                          <h3>No matching employees</h3>
                          <p>Try another search term or adjust the selected filters.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length ? (
            <div className="employee-table-footer">
              <div className="employee-table-footer__left">
                <p className="employees-pagination-summary">
                  Showing {startIndex + 1} to {endIndex} of {filteredEmployees.length} entries
                </p>
                <select
                  className="form-select employee-page-size"
                  value={rowsPerPage}
                  onChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
              </div>

              <div className="employee-pagination">
                <button
                  type="button"
                  className="employee-pagination__btn"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                {pageItems.map((item) =>
                  typeof item === 'number' ? (
                    <button
                      key={item}
                      type="button"
                      className={`employee-pagination__btn${item === safeCurrentPage ? ' active' : ''}`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item} className="employee-pagination__dots">
                      ...
                    </span>
                  )
                )}
                <button
                  type="button"
                  className="employee-pagination__btn"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default EmployeesList;
