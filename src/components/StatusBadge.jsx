import React from "react";
import "../styles/statusBadge.scss";

function StatusBadge({ status }) {
  const statusClass = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge;