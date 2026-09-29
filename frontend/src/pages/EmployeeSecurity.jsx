function EmployeeSecurity({
  factoryState,
  refreshState
}) {

  if (!factoryState) {

    return (
      <div className="loading">
        Loading security monitoring...
      </div>
    );

  }


  const employee =
    factoryState.current_employee;


  const unauthorized =
    employee.status ===
    "Unauthorized Entry";


  const simulate =
    async endpoint => {

      try {

        await fetch(
          `http://127.0.0.1:5000${endpoint}`,
          {
            method: "POST"
          }
        );

        await refreshState();

      } catch (error) {

        console.error(error);

      }

    };


  return (

    <div className="page-container">

      {/* HEADING */}

      <div className="page-heading">

        <div>

          <h1>
            Employee & Security
          </h1>

          <p>
            Access control and personnel verification
          </p>

        </div>

      </div>


      {/* ACCESS BANNER */}

      <section className="access-banner">

        <div>

          <strong>
            ACCESS CONTROL & ENTRY VERIFICATION
          </strong>

          <p>
            Monitor turnstiles, badge scans,
            zone and perimeter detection.
          </p>

        </div>


        <div className="banner-buttons">

          <button
            onClick={() =>
              simulate(
                "/api/simulate/employee-entry"
              )
            }
          >
            + Simulate Employee Entry
          </button>


          <button
            className="danger-solid"
            onClick={() =>
              simulate(
                "/api/simulate/unauthorized-entry"
              )
            }
          >
            ⚠ Simulate Unauthorized Entry
          </button>

        </div>

      </section>


      <div className="security-layout">

        {/* CAMERA */}

        <div>

          <div className="camera-card">

            <div className="camera-header">

              <span className="live-dot"></span>

              CAM 04 - Zone B Perimeter
              (Simulated)

              <span className="camera-meta">
                15 FPS • LIVE
              </span>

            </div>


            <div className="camera-screen">

              <div className="camera-top">

                <span>
                  FEED: ZONE_B_SEC_NORTH
                </span>

                <span>
                  {factoryState.last_event.time}
                </span>

              </div>


              {unauthorized ? (

                <div className="person-detection">

                  <span>
                    [ BOUNDING BOX: #01 ]
                  </span>

                  <strong>
                    {employee.name}
                  </strong>

                  <small>
                    {employee.id}
                    {" "}
                    • NO PERMISSION
                  </small>

                </div>

              ) : (

                <div className="waiting-detection">
                  WAITING FOR PERSON DETECTION
                </div>

              )}


              <div className="camera-bottom">

                <span>
                  OPTICAL SENSOR: OK
                </span>

                <span>
                  MOTION: ACTIVE
                </span>

              </div>

            </div>


            <div className="camera-details">

              <div>

                <span>
                  Current Zone:
                </span>

                <strong>
                  {employee.location}
                </strong>

              </div>


              <div>

                <span>
                  Optical Person Count:
                </span>

                <strong>
                  {unauthorized
                    ? "1 person inside restricted zone"
                    : "0"
                  }
                </strong>

              </div>


              <div>

                <span>
                  Access Status:
                </span>

                <strong
                  className={
                    unauthorized
                      ? "access-denied"
                      : "access-allowed"
                  }
                >
                  {employee.status}
                </strong>

              </div>

            </div>

          </div>


          {/* SECURITY ATTENTION */}

          {unauthorized && (

            <div className="security-attention">

              <strong>
                ⚠ Security Officer Attention
              </strong>

              <p>

                {employee.name}
                {" "}
                ({employee.id})
                detected in Zone B without valid
                clearance. Please direct nearest
                floor marshal to intervene.

              </p>

            </div>

          )}

        </div>


        {/* PERSONNEL TABLE */}

        <section className="personnel-card">

          <div className="personnel-header">

            <div>

              <strong>
                LIVE PERSONNEL & ACCESS
                VERIFICATION LOG
              </strong>

              <p>
                Chronological badge swipes
                and zone transitions
              </p>

            </div>

            <span>
              Showing Last 8 Events
            </span>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Time
                  </th>

                  <th>
                    Employee ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Shift Timing
                  </th>

                  <th>
                    Permission
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {factoryState.employees
                  .slice(0, 8)
                  .map(
                    (person, index) => (

                      <tr
                        key={
                          `${person.id}-${index}`
                        }
                      >

                        <td>
                          {person.time}
                        </td>

                        <td>
                          <strong>
                            {person.id}
                          </strong>
                        </td>

                        <td>
                          {person.name}
                        </td>

                        <td>
                          {person.department}
                        </td>

                        <td>
                          {person.location}
                        </td>

                        <td>
                          {person.shift}
                        </td>

                        <td>

                          <span
                            className={
                              person.permission ===
                              "Allowed"
                                ? "permission allowed"
                                : "permission denied"
                            }
                          >
                            {person.permission}
                          </span>

                        </td>

                        <td>

                          <span
                            className={
                              person.status ===
                              "Authorized Entry"
                                ? "entry-status authorized"
                                : "entry-status unauthorized"
                            }
                          >
                            ● {person.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </div>

  );
}


export default EmployeeSecurity;