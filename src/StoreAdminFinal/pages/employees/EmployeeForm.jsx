import React, { useEffect, useMemo, useState } from 'react';
import { Save, X } from 'lucide-react';

const EMPTY_FORM = {
  employeeId: '',
  fullName: '',
  fatherName: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  emergencyContact: '',
  joiningDate: '',
  employeeType: '',
  department: '',
  designation: '',
  shiftTiming: '',
  salary: '',
};

const DEPARTMENTS = ['Operations', 'Sales', 'IT', 'Customer Support', 'Finance', 'HR'];
const EMPLOYEE_TYPES = ['Permanent', 'Contract', 'Temporary'];
const GENDERS = ['Male', 'Female', 'Other'];
const SHIFTS = ['9:00 AM - 6:00 PM', '10:00 AM - 7:00 PM', '2:00 PM - 11:00 PM', '10:00 PM - 7:00 AM'];

const EmployeeForm = ({ initialData, onCancel, onSave, submitLabel = 'Save Employee' }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
    setErrors({});
  }, [initialData]);

  const sections = useMemo(
    () => [
      {
        title: 'Basic Details',
        fields: [
          { name: 'employeeId', label: 'Employee ID', required: true, placeholder: 'EMP081' },
          { name: 'fullName', label: 'Full Name', required: true, placeholder: 'Employee full name' },
          { name: 'fatherName', label: 'Father / Guardian', placeholder: 'Guardian name' },
          { name: 'dob', label: 'Date of Birth', type: 'date' },
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            options: GENDERS,
            placeholder: 'Select gender',
          },
          { name: 'phone', label: 'Mobile Number', required: true, placeholder: '+91 98XXXXXXX' },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'name@primebasket.com',
          },
          { name: 'emergencyContact', label: 'Emergency Contact', placeholder: '+91 97XXXXXXX' },
          {
            name: 'address',
            label: 'Address',
            type: 'textarea',
            fullWidth: true,
            placeholder: 'Full residential address',
          },
        ],
      },
      {
        title: 'Employment Details',
        fields: [
          { name: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
          {
            name: 'employeeType',
            label: 'Employee Type',
            type: 'select',
            options: EMPLOYEE_TYPES,
            placeholder: 'Select type',
          },
          {
            name: 'department',
            label: 'Department',
            type: 'select',
            options: DEPARTMENTS,
            placeholder: 'Select department',
          },
          {
            name: 'designation',
            label: 'Designation',
            required: true,
            placeholder: 'Area Sales Manager',
          },
          {
            name: 'shiftTiming',
            label: 'Shift Timing',
            type: 'select',
            options: SHIFTS,
            placeholder: 'Select shift',
          },
          { name: 'salary', label: 'Salary / Wage', type: 'number', prefix: 'Rs', placeholder: '0' },
        ],
      },
    ],
    []
  );

  const validate = () => {
    const nextErrors = {};

    if (!formData.employeeId.trim()) nextErrors.employeeId = 'Employee ID is required.';
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!formData.phone.trim()) nextErrors.phone = 'Mobile number is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email address is required.';
    if (!formData.joiningDate.trim()) nextErrors.joiningDate = 'Joining date is required.';
    if (!formData.designation.trim()) nextErrors.designation = 'Designation is required.';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSave({
      ...formData,
      employeeId: formData.employeeId.trim(),
      fullName: formData.fullName.trim(),
      fatherName: formData.fatherName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      emergencyContact: formData.emergencyContact.trim(),
      designation: formData.designation.trim(),
      salary: formData.salary ? `${formData.salary}` : '',
    });
  };

  const renderField = (field) => {
    const fieldClass = `employee-field${field.fullWidth ? ' employee-field--full' : ''}`;
    const value = formData[field.name];

    return (
      <div key={field.name} className={fieldClass}>
        <label className="employee-field__label" htmlFor={field.name}>
          {field.label}
          {field.required ? <span className="employee-field__required">*</span> : null}
        </label>

        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            className={`form-select${errors[field.name] ? ' input-error' : ''}`}
            value={value}
            onChange={handleChange}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={field.name}
            name={field.name}
            rows="3"
            className={`form-control employee-field__textarea${errors[field.name] ? ' input-error' : ''}`}
            placeholder={field.placeholder}
            value={value}
            onChange={handleChange}
          />
        ) : field.prefix ? (
          <div className="employee-field__currency">
            <span>{field.prefix}</span>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              min={field.type === 'number' ? '0' : undefined}
              className={`form-control${errors[field.name] ? ' input-error' : ''}`}
              placeholder={field.placeholder}
              value={value}
              onChange={handleChange}
            />
          </div>
        ) : (
          <input
            id={field.name}
            name={field.name}
            type={field.type || 'text'}
            className={`form-control${errors[field.name] ? ' input-error' : ''}`}
            placeholder={field.placeholder}
            value={value}
            onChange={handleChange}
          />
        )}

        {errors[field.name] ? <p className="pb-error-msg">{errors[field.name]}</p> : null}
      </div>
    );
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      {sections.map((section) => (
        <section key={section.title} className="card employee-form-card">
          <div className="card-header">
            <h3 className="card-title">{section.title}</h3>
          </div>
          <div className="card-body">
            <div className="employee-form-grid">{section.fields.map(renderField)}</div>
          </div>
        </section>
      ))}

      <div className="employee-form__actions">
        {onCancel ? (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            <X size={16} />
            Cancel
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary">
          <Save size={16} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
