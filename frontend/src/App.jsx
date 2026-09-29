import {
  useEffect,
  useState
} from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Header from "./components/Header";
import SimulationBar from "./components/SimulationBar";

import CommandCenter from "./pages/CommandCenter";
import EmployeeSecurity from "./pages/EmployeeSecurity";
import IndustrialSafety from "./pages/IndustrialSafety";

import "./App.css";


function App() {

  const [factoryState, setFactoryState] = useState(null);


  const fetchState = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/state"
      );

      if (!response.ok) {
        throw new Error(
          "Backend unavailable"
        );
      }

      const data = await response.json();

      setFactoryState(data);

    } catch (error) {

      console.error(
        "Backend connection error:",
        error
      );
    }
  };


  useEffect(() => {

    fetchState();

    const interval = setInterval(
      fetchState,
      2000
    );

    return () => {
      clearInterval(interval);
    };

  }, []);


  return (

    <BrowserRouter>

      <Header
        factoryState={factoryState}
      />

      <SimulationBar
        factoryState={factoryState}
        refreshState={fetchState}
      />

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={
              <EmployeeSecurity
                factoryState={factoryState}
                refreshState={fetchState}
              />
            }
          />

          <Route
            path="/command"
            element={
              <CommandCenter
                factoryState={factoryState}
                refreshState={fetchState}
              />
            }
          />

          <Route
            path="/safety"
            element={
              <IndustrialSafety
                factoryState={factoryState}
              />
            }
          />

        </Routes>

      </main>

    </BrowserRouter>
  );
}


export default App;