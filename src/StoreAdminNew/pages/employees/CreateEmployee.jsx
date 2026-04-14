import React from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { useEmployees } from './context/EmployeeContext';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const { addEmployee } = useEmployees();

  const handleSave = (employeeData) => {
    addEmployee(employeeData);
    navigate('/employees');
  };

  return (
    <div className="employee-form-page">
      <div className="content-header employee-page-header">
        <div>
          <button type="button" className="employee-back-link" onClick={() => navigate('/employees')}>
            <ArrowLeft size={16} />
            Back to employees
          </button>
          <h2>Create Employee</h2>
          <p>Add a new team member using the dashboard's default employee profile structure.</p>
        </div>
        <span className="employee-page-chip">
          <UserPlus size={16} />
          New Profile
        </span>
      </div>

      <EmployeeForm
        onCancel={() => navigate('/employees')}
        onSave={handleSave}
        submitLabel="Create Employee"
      />
    </div>
  );
};

export default CreateEmployee;
