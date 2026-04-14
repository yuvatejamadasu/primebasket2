import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CircleUserRound,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { useEmployees } from './context/EmployeeContext';

const formatDate = (value) => {
  if (!value) {
    return 'Not provided';
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatCurrency = (value) => {
  if (!value) {
    return 'Not provided';
  }

  return `Rs ${Number(value).toLocaleString('en-IN')}`;
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="employee-detail-item">
    <div className="employee-detail-item__icon">
      <Icon size={16} />
    </div>
    <div>
      <span className="employee-detail-item__label">{label}</span>
      <strong className="employee-detail-item__value">{value || 'Not provided'}</strong>
    </div>
  </div>
);

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const { employees, loading, updateEmployee } = useEmployees();
  const [editing, setEditing] = useState(false);

  const employee = useMemo(
    () => employees.find((item) => item.id === employeeId) || null,
    [employeeId, employees]
  );

  if (!loading && !employee) {
    return (
      <div className="employee-empty card">
        <div className="card-body">
          <h3>Employee not found</h3>
          <p>The requested employee profile could not be found in the current directory.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/employees')}>
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="employee-empty card">
        <div className="card-body">
          <h3>Loading employee profile</h3>
          <p>Employee information is being prepared.</p>
        </div>
      </div>
    );
  }

  const initials = employee.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleSave = (updatedData) => {
    updateEmployee(employee.id, updatedData);
    setEditing(false);
  };

  return (
    <div className="employee-detail-page">
      <div className="content-header employee-page-header">
        <div>
          <button type="button" className="employee-back-link" onClick={() => navigate('/employees')}>
            <ArrowLeft size={16} />
            Back to employees
          </button>
          <h2>{editing ? `Edit ${employee.fullName}` : employee.fullName}</h2>
          <p>
            {employee.designation} in {employee.department}
          </p>
        </div>

        {!editing ? (
          <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
            <PencilLine size={16} />
            Edit Profile
          </button>
        ) : null}
      </div>

      {editing ? (
        <EmployeeForm
          initialData={employee}
          onCancel={() => setEditing(false)}
          onSave={handleSave}
          submitLabel="Update Employee"
        />
      ) : (
        <>
          <section className="employee-hero card">
            <div className="card-body employee-hero__body">
              <div className="employee-hero__identity">
                <div className="employee-avatar">{initials}</div>
                <div>
                  <div className="employee-hero__meta">
                    <span className="employee-page-chip">{employee.employeeId}</span>
                    <span className="employee-page-chip employee-page-chip--muted">
                      {employee.employeeType || 'Employee'}
                    </span>
                  </div>
                  <h3>{employee.fullName}</h3>
                  <p>{employee.email}</p>
                </div>
              </div>

              <div className="employee-hero__highlights">
                <div>
                  <span>Department</span>
                  <strong>{employee.department || 'Not provided'}</strong>
                </div>
                <div>
                  <span>Shift</span>
                  <strong>{employee.shiftTiming || 'Not provided'}</strong>
                </div>
                <div>
                  <span>Salary</span>
                  <strong>{formatCurrency(employee.salary)}</strong>
                </div>
              </div>
            </div>
          </section>

          <div className="employee-detail-grid">
            <section className="card employee-detail-section">
              <div className="card-header">
                <h3 className="card-title">Basic Details</h3>
              </div>
              <div className="card-body employee-detail-list">
                <DetailItem icon={CircleUserRound} label="Full Name" value={employee.fullName} />
                <DetailItem icon={CircleUserRound} label="Father / Guardian" value={employee.fatherName} />
                <DetailItem icon={CalendarDays} label="Date of Birth" value={formatDate(employee.dob)} />
                <DetailItem icon={Phone} label="Mobile Number" value={employee.phone} />
                <DetailItem icon={Mail} label="Email Address" value={employee.email} />
                <DetailItem icon={ShieldAlert} label="Emergency Contact" value={employee.emergencyContact} />
                <DetailItem icon={MapPin} label="Address" value={employee.address} />
              </div>
            </section>

            <section className="card employee-detail-section">
              <div className="card-header">
                <h3 className="card-title">Employment Details</h3>
              </div>
              <div className="card-body employee-detail-list">
                <DetailItem icon={BriefcaseBusiness} label="Department" value={employee.department} />
                <DetailItem icon={BriefcaseBusiness} label="Designation" value={employee.designation} />
                <DetailItem icon={CircleUserRound} label="Employee Type" value={employee.employeeType} />
                <DetailItem icon={CalendarDays} label="Joining Date" value={formatDate(employee.joiningDate)} />
                <DetailItem icon={CalendarDays} label="Shift Timing" value={employee.shiftTiming} />
                <DetailItem icon={Wallet} label="Salary / Wage" value={formatCurrency(employee.salary)} />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDetails;
