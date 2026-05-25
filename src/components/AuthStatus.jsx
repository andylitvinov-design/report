import React from "react";

export default function AuthStatus({ user, onCreate }) {
  if (!user) return null;

  return (
    <div className="auth-bar" role="status">
      <span>Signed in: {user.email}</span>
      <button type="button" onClick={onCreate}>New analysis</button>
    </div>
  );
}
