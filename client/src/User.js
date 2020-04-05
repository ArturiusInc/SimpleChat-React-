import React from "react";

export default React.memo(function User({ user }) {
  return (
    <li>
      <div className="room-user">
        <div className="room-name">{Object.entries(user)[0][1]}</div>
      </div>
    </li>
  );
});
