import React from 'react';
import { Users, BookOpen, AlertCircle, Eye, Trash2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const usersData = [
    { name: 'Sarah Johnson', email: 'sarah@email.com', status: 'Active', joined: '2025-01-15' },
    { name: 'Mike Chen', email: 'mike@email.com', status: 'Active', joined: '2025-02-03' },
    { name: 'Emily Davis', email: 'emily@email.com', status: 'Active', joined: '2025-03-12' },
    { name: 'David Kumar', email: 'david@email.com', status: 'Inactive', joined: '2024-12-20' },
  ];

  return (
    <div className="admin-container py-5">
      <div className="container">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted mb-5">Manage users, skills, and platform content</p>

        {/* Stats Row */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="admin-stat-card shadow-sm">
              <div>
                <div className="text-muted small">Total Users</div>
                <h3 className="fw-bold m-0">1,234</h3>
              </div>
              <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                <Users size={24} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-stat-card shadow-sm">
              <div>
                <div className="text-muted small">Active Skills</div>
                <h3 className="fw-bold m-0">156</h3>
              </div>
              <div className="bg-success-subtle p-3 rounded-circle text-success">
                <BookOpen size={24} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-stat-card shadow-sm">
              <div>
                <div className="text-muted small">Pending Reports</div>
                <h3 className="fw-bold m-0">3</h3>
              </div>
              <div className="bg-warning-subtle p-3 rounded-circle text-warning">
                <AlertCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="admin-table-container shadow-sm">
          <ul className="nav nav-tabs mb-4 border-bottom-0">
            <li className="nav-item">
              <a className="nav-link active fw-bold border-0 border-bottom border-primary border-2" href="#">Users</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-muted border-0" href="#">Skills</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-muted border-0" href="#">Reports</a>
            </li>
          </ul>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="border-0">Name</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Joined</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user, idx) => (
                  <tr key={idx}>
                    <td className="fw-medium">{user.name}</td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                      <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-muted">{user.joined}</td>
                    <td>
                      <Eye size={18} className="action-icon" />
                      <Trash2 size={18} className="action-icon delete-icon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
