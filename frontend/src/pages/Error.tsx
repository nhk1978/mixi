import React from "react";

const Error = ({ error }: { error: string }) => {
  return <div className="error">{error}</div>;
};

export default Error;
