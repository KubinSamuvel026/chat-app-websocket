import React from "react";
import type { UserStatus } from "../../store/types";


const StatusBadge: React.FC<{ status: UserStatus; size?: number; style?: React.CSSProperties }> = ({ status, size = 9 }) => {
  const color =
    status === "online" ? "var(--badge-online)" :
    status === "away" ? "var(--badge-away)" :
    "var(--badge-offline)";
  return (
    <span style={{
      position: "absolute",
      right: 2, bottom: 2,
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      border: "2px solid var(--panel)"
    }} aria-label={status} role="status" />
  );
};

export default StatusBadge;
