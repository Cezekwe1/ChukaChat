import React from "react";

export default function ringer({ answerCall, caller }) {
  return (
    <div className="ringer rounded shadow-lg">
      <h3>{caller} is calling</h3>
      <div>
        <button
          onClick={() => answerCall(true)}
          className="btn btn-sm mr-2 btn-success"
        >
          Answer
        </button>
        <button
          onClick={() => answerCall(false)}
          className="btn btn-sm btn-danger"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
