import React, { Component } from "react";
import axios from "axios";
import IframeComponent from "./IframeComponent";

const TEST_TO_PORT_MAPPING = {
  "cypress/e2e/screens/prueba/prueba.cy.js": 4001,
  "cypress/e2e/screens/prueba-2/prueba-2.cy.js": 4002,
  "cypress/e2e/screens/prueba-3/prueba-3.cy.js": 4003,
};

class App extends Component {
  state = {
    logs: "",
    selectedTest: "cypress/e2e/screens/prueba/prueba.cy.js",
    availableTests: [
      "cypress/e2e/screens/prueba/prueba.cy.js",
      "cypress/e2e/screens/prueba-2/prueba-2.cy.js",
      "cypress/e2e/screens/prueba-3/prueba-3.cy.js",
    ],
    selectedScreen: "http://localhost:3001",
    isLoading: false,
    error: null,
  };

  handleTestChange = (event) => {
    this.setState({ selectedTest: event.target.value });
  };

  startTests = async () => {
    this.setState({ logs: "", isLoading: true, error: null });
    try {
      const selectedTest = this.state.selectedTest;
      const port = this.getPortBasedOnTest(selectedTest);
      this.setState({ selectedScreen: `http://localhost:${port}` });
        
      const response = await axios.post("http://localhost:8080/api/tests/start", {
        test: selectedTest,
        port,
      });
      console.log("Pruebas iniciadas:", response.data);
      
      if (response.data && response.data.logs) {
        this.setState({ logs: response.data.logs });
      }
    } catch (error) {
      console.error("Error al iniciar las pruebas:", error);
      this.setState({ error: "Error al iniciar las pruebas. Por favor, intente de nuevo." });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  getPortBasedOnTest = (test) => {
    const port = TEST_TO_PORT_MAPPING[test];
    if (!port) {
      console.error("No se encontró el puerto para la prueba seleccionada:", test);
      throw new Error("No se encontró el puerto para la prueba seleccionada.");
    }
    return port;
  };

  renderLogs() {
    const { logs, isLoading } = this.state;

    if (isLoading) {
      return <div>Cargando pruebas...</div>;
    }

    if (!logs) return null;

    return (
      <div>
        <h2>Logs de las Pruebas:</h2>
        <pre>{logs}</pre>
      </div>
    );
  }

  renderError() {
    if (!this.state.error) return null;

    return <div style={{ color: "red" }}>{this.state.error}</div>;
  }

  render() {
    return (
      <div className="App">
        <h1>Cypress Test App</h1>
        <div>
          <label htmlFor="testSelector">Seleccione un test: </label>
          <select
            id="testSelector"
            value={this.state.selectedTest}
            onChange={this.handleTestChange}
          >
            {this.state.availableTests.map((test) => (
              <option key={test} value={test}>
                {test}
              </option>
            ))}
          </select>
        </div>
        <button onClick={this.startTests} disabled={this.state.isLoading}>
          Iniciar Pruebas
        </button>
        {this.renderError()}
        {this.renderLogs()}
        <IframeComponent src={this.state.selectedScreen} />
      </div>
    );
  }
}

export default App;
