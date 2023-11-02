import React from "react";

const Logs = ({ logs, isLoading }) => {
  if (isLoading) {
    return <div className="Message">Cargando pruebas...</div>;
  }

  if (!logs) return null;

  return (
    <div className="LogsContainer">
      <h2 className="LogsTitle">Logs de las Pruebas:</h2>
      <pre className="PreformattedText">{logs}</pre>
    </div>
  );
};

export default Logs;
