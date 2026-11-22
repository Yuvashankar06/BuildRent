import React, { useEffect, useState } from "react";
import "../../styles/users.scss";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(storedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    const userToDelete = users.find(
      (user) => user.id === id
    );

    if (userToDelete?.role === "admin") {
      alert("Admin account cannot be deleted.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedUsers = users.filter(
      (user) => user.id !== id
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);
  };

  return (
    <section className="admin-users">

      <div className="admin-page-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Users</h1>
          <p>
            Manage registered users and equipment owners.
          </p>
        </div>

        <div className="user-count">
          {users.length} Users
        </div>
      </div>

      <div className="admin-users-card">

        <div className="admin-table-wrapper">

          {users.length === 0 ? (
            <div className="empty-users">
              <h3>No users found</h3>
              <p>
                Registered users will appear here.
              </p>
            </div>
          ) : (
            <table className="admin-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>

                    <td>{index + 1}</td>

                    <td>
                      <div className="user-name">
                        <div className="user-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      {user.phone || "Not provided"}
                    </td>

                    <td>
                      <span
                        className={`role-badge ${user.role}`}
                      >
                        {user.role === "admin"
                          ? "Admin"
                          : user.role === "owner"
                          ? "Owner"
                          : "User"}
                      </span>
                    </td>

                    <td>
                      {user.role === "admin" ? (
                        <span className="protected-user">
                          Protected
                        </span>
                      ) : (
                        <button
                          className="delete-user-btn"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </div>

    </section>
  );
}

export default AdminUsers;