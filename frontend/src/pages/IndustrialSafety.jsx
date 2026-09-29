function IndustrialSafety({
  factoryState
}) {

  if (!factoryState) {

    return (
      <div className="loading">
        Loading industrial safety telemetry...
      </div>
    );

  }


  const safety =
    factoryState.safety;


  const machine3 =
    factoryState.machines["Machine 03"];


  const gasCritical =
    safety.gas >= 50;


  const machineRisk =
    machine3.status === "Running" &&
    machine3.nearby_people > 0;


  return (

    <div className="page-container">

      {/* HEADING */}

      <div className="page-heading">

        <div>

          <h1>
            Industrial Safety
          </h1>

          <p>
            Environmental conditions,
            zones and machinery monitoring
          </p>

        </div>

        <span className="last-updated">
          Last event:
          {" "}
          {factoryState.last_event.time}
        </span>

      </div>


      {/* ENVIRONMENT */}

      <section>

        <div className="section-title">
          ENVIRONMENTAL SAFETY CONDITIONS
        </div>


        <div className="environment-grid">

          {/* TEMPERATURE */}

          <div className="environment-card">

            <span>
              TEMPERATURE
            </span>

            <strong>
              {safety.temperature} °C
            </strong>

            <small>
              Threshold: 35.0 °C
            </small>

            <b className="normal-badge">
              Normal
            </b>

          </div>


          {/* GAS */}

          <div
            className={
              `environment-card ${
                gasCritical
                  ? "critical-card"
                  : ""
              }`
            }
          >

            <span>
              GAS LEVEL (LEL)
            </span>

            <strong>
              {safety.gas} ppm
            </strong>

            <small>
              Zone B sensor array
            </small>

            <b
              className={
                gasCritical
                  ? "critical-badge"
                  : "normal-badge"
              }
            >
              {gasCritical
                ? "Critical High"
                : "Normal"
              }
            </b>

          </div>


          {/* SMOKE */}

          <div className="environment-card">

            <span>
              SMOKE DETECTION
            </span>

            <strong>
              {safety.smoke.toFixed(2)} %/m
            </strong>

            <small>
              Optical smoke heads
            </small>

            <b className="normal-badge">
              Not Detected
            </b>

          </div>


          {/* VIBRATION */}

          <div className="environment-card">

            <span>
              VIBRATION (M3)
            </span>

            <strong>
              {safety.vibration} mm/s
            </strong>

            <small>
              ISO 10816 Zone A
            </small>

            <b className="normal-badge">
              Normal
            </b>

          </div>


          {/* SENSOR */}

          <div className="environment-card">

            <span>
              SENSOR TELEMETRY
            </span>

            <strong>
              {safety.sensor_health}
            </strong>

            <small>
              Heartbeat: &lt; 200ms
            </small>

            <b className="normal-badge">
              All Online
            </b>

          </div>

        </div>

      </section>


      {/* PROXIMITY */}

      {machineRisk && (

        <div className="proximity-warning">

          <div className="warning-symbol">
            ⚠
          </div>


          <div>

            <strong>
              PEOPLE NEAR OPERATING MACHINES
            </strong>

            <p>

              {machine3.nearby_people}
              {" "}
              employees currently near
              Machine 03 (Stamping Press).

              {factoryState.current_employee.status ===
                "Unauthorized Entry" &&
                " 1 employee is UNAUTHORIZED for this zone."
              }

              {" "}
              Machine is actively RUNNING.

            </p>

          </div>


          <button>
            Review Proximity Safety Rule
          </button>

        </div>

      )}


      {/* SAFETY MAIN */}

      <div className="safety-main-grid">

        {/* ZONES */}

        <section className="zone-panel">

          <div className="panel-heading">

            <div>

              <strong>
                FACTORY FLOOR LAYOUT & ZONE STATUS
              </strong>

              <p>
                Live human occupancy &
                hazard designations
              </p>

            </div>


            <div className="legend">

              <span>
                ● Safe
              </span>

              <span>
                ● Caution
              </span>

              <span>
                ● Restricted/Violation
              </span>

            </div>

          </div>


          <div className="zone-grid">

            {Object.entries(
              factoryState.zones
            ).map(
              ([key, zone]) => (

                <div
                  key={key}
                  className={
                    `zone-card ${
                      zone.status === "VIOLATION"
                        ? "zone-danger"
                        : zone.status === "LOCKED"
                        ? "zone-locked"
                        : ""
                    }`
                  }
                >

                  <div className="zone-title">

                    <strong>
                      {key}:{" "}
                      {zone.name.toUpperCase()}
                    </strong>

                    <span>
                      {zone.status}
                    </span>

                  </div>


                  <p>

                    {key === "Zone A" &&
                      "General assembly, Machine 01 & 02"
                    }

                    {key === "Zone B" &&
                      "Heavy Stamping Press #03 & Flammables"
                    }

                    {key === "Zone C" &&
                      "Pallet racks & forklift path"
                    }

                    {key === "Zone D" &&
                      "Primary Electrical & Generator"
                    }

                  </p>


                  {key === "Zone B" &&
                    factoryState.current_employee.status ===
                    "Unauthorized Entry" && (

                      <div className="zone-warning">

                        ⚠{" "}
                        {factoryState.current_employee.name}
                        {" "}
                        (
                        {factoryState.current_employee.id}
                        )
                        {" "}
                        unauthorized entry

                      </div>

                    )}


                  <div className="zone-workers">

                    <span>
                      Active Workers:
                    </span>

                    <strong>
                      {zone.workers}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* MACHINES */}

        <section className="machine-panel">

          <div className="panel-heading">

            <div>

              <strong>
                INDUSTRIAL MACHINERY STATUS
              </strong>

            </div>

            <span>
              Live Telemetry
            </span>

          </div>


          <div className="machine-list">

            {Object.entries(
              factoryState.machines
            ).map(
              ([key, machine]) => (

                <div
                  key={key}
                  className={
                    `machine-card ${
                      key === "Machine 03" &&
                      machineRisk
                        ? "machine-danger"
                        : ""
                    }`
                  }
                >

                  <div className="machine-top">

                    <strong>
                      {key} — {machine.name}
                    </strong>


                    <span
                      className={
                        machine.status === "Running"
                          ? "machine-running"
                          : machine.status ===
                            "Maintenance"
                          ? "machine-maintenance"
                          : "machine-idle"
                      }
                    >
                      {machine.status}
                    </span>

                  </div>


                  <small>
                    Location:
                    {" "}
                    {machine.location}
                  </small>


                  <div className="machine-people">

                    <span>
                      Nearby Personnel:
                    </span>

                    <strong>

                      {machine.nearby_people === 0
                        ? "0 operators nearby"
                        : `${machine.nearby_people} employees near operating machine`
                      }

                    </strong>

                  </div>


                  {key === "Machine 03" &&
                    machineRisk && (

                      <div className="machine-warning">

                        ⚠ Correlated safety condition:
                        Personnel detected without
                        high-risk zone clearance.

                      </div>

                    )}

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </div>

  );
}


export default IndustrialSafety;