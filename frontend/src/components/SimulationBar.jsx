import {
  useState
} from "react";


function SimulationBar({
  refreshState,
  factoryState
}) {

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState("Simulation ready");


  const simulate = async (
    endpoint,
    label
  ) => {

    if (busy) return;

    setBusy(true);

    setMessage(
      `Running: ${label}...`
    );


    try {

      const response = await fetch(
        `http://127.0.0.1:5000${endpoint}`,
        {
          method: "POST"
        }
      );


      if (!response.ok) {

        throw new Error(
          "Simulation failed"
        );

      }


      await refreshState();


      setMessage(
        `${label} completed`
      );


    } catch (error) {

      console.error(error);

      setMessage(
        "Backend connection failed. Start Flask first."
      );


    } finally {

      setBusy(false);

    }

  };


  const lastEvent =
    factoryState?.last_event;


  return (

    <>

      <div className="simulation-bar">

        <div className="simulation-title">

          ◉ SIMULATION CONTROLS:

          <span>
            test realistic factory conditions
          </span>

        </div>


        <div className="simulation-buttons">

          <button
            onClick={() =>
              simulate(
                "/api/simulate/employee-entry",
                "Authorized Entry"
              )
            }
          >
            + Auth. Entry
          </button>


          <button
            className="danger-btn"
            onClick={() =>
              simulate(
                "/api/simulate/unauthorized-entry",
                "Unauthorized Entry"
              )
            }
          >
            ● Simulate Unauthorized Entry
          </button>


          <button
            className="warning-btn"
            onClick={() =>
              simulate(
                "/api/simulate/high-gas",
                "Gas Hazard"
              )
            }
          >
            Simulate Gas Hazard
          </button>


          <button
            onClick={() =>
              simulate(
                "/api/simulate/machine-running",
                "Run Machine 03"
              )
            }
          >
            Run Machine 03
          </button>


          <button
            onClick={() =>
              simulate(
                "/api/simulate/maintenance",
                "Schedule Maintenance"
              )
            }
          >
            Schedule Maintenance
          </button>


          <button
            className="reset-btn"
            onClick={() =>
              simulate(
                "/api/reset",
                "Factory Reset"
              )
            }
          >
            Reset Factory
          </button>

        </div>

      </div>


      <div className="simulation-event-strip">

        <span className="event-icon">
          ◉
        </span>


        <div>

          <strong>
            {message}
          </strong>

          {lastEvent && (

            <span>
              {" "}
              — Last event:{" "}
              {lastEvent.message}
            </span>

          )}

        </div>


        {lastEvent && (

          <time>
            {lastEvent.time}
          </time>

        )}

      </div>

    </>

  );
}


export default SimulationBar;