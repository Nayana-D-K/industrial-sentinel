import {
  useState
} from "react";


function CommandCenter({
  factoryState,
  refreshState
}) {

  const [
    expandedAlert,
    setExpandedAlert
  ] = useState(null);


  if (!factoryState) {

    return (
      <div className="loading">
        Connecting to factory control system...
      </div>
    );

  }


  const activeAlerts =
    factoryState.alerts
      .filter(
        alert => !alert.acknowledged
      )
      .sort((a, b) => {

        const priority = {
          CRITICAL: 1,
          HIGH: 2,
          MODERATE: 3
        };

        return (
          priority[a.severity] -
          priority[b.severity]
        );

      });


  const securityAlerts =
    activeAlerts.filter(
      alert =>
        alert.category === "SECURITY"
    );


  const safetyAlerts =
    activeAlerts.filter(
      alert =>
        alert.category === "SAFETY"
    );


  const runningMachines =
    Object.values(
      factoryState.machines
    ).filter(
      machine =>
        machine.status === "Running"
    ).length;


  const acknowledgeAlert =
    async alertId => {

      try {

        const response =
          await fetch(
            `http://127.0.0.1:5000/api/alerts/${alertId}/acknowledge`,
            {
              method: "POST"
            }
          );


        if (!response.ok) {

          throw new Error(
            "Acknowledge failed"
          );

        }


        setExpandedAlert(null);

        await refreshState();


      } catch (error) {

        console.error(error);

        alert(
          "Could not acknowledge the alert."
        );

      }

    };


  const toggleDetails =
    alertId => {

      setExpandedAlert(
        expandedAlert === alertId
          ? null
          : alertId
      );

    };


  return (

    <div className="page-container">

      {/* HEADING */}

      <div className="page-heading">

        <div>

          <h1>
            Command Center
          </h1>

          <p>
            Factory-wide security and safety overview
          </p>

        </div>


        <div className="command-status">

          <span></span>

          {factoryState.factory_status}

        </div>

      </div>


      {/* EVENT */}

      {factoryState.last_event && (

        <div className="event-notification">

          <span>
            ⚠
          </span>

          <strong>
            {factoryState.last_event.message}
          </strong>

          <time>
            {factoryState.last_event.time}
          </time>

        </div>

      )}


      {/* SUMMARY */}

      <div className="summary-grid">

        <div className="summary-card">

          <span className="summary-label">
            EMPLOYEES INSIDE
          </span>

          <strong>
            {factoryState.employees_inside}
          </strong>

          <small>
            All zones tracked
          </small>

        </div>


        <div className="summary-card">

          <span className="summary-label">
            MACHINES RUNNING
          </span>

          <strong>
            {runningMachines} / 3
          </strong>

          <small>
            {3 - runningMachines} idle / maintenance
          </small>

        </div>


        <div className="summary-card">

          <span className="summary-label">
            SECURITY ALERTS
          </span>

          <strong className="red-number">
            {securityAlerts.length}
          </strong>

          <small className="alert-label">
            Action Required
          </small>

        </div>


        <div className="summary-card">

          <span className="summary-label">
            SAFETY ALERTS
          </span>

          <strong className="orange-number">
            {safetyAlerts.length}
          </strong>

          <small className="monitor-label">
            Monitored
          </small>

        </div>

      </div>


      {/* PRIORITY ACTION FEED */}

      <section className="priority-card">

        <div className="priority-header">

          <div>

            <strong>
              PRIORITY ACTION FEED
            </strong>

            <span>
              Ordered by risk importance
            </span>

          </div>

          <small>
            Correlated automatically across
            security & machine sensors
          </small>

        </div>


        {activeAlerts.length === 0 ? (

          <div className="empty-alerts">

            <div className="empty-check">
              ✓
            </div>

            <strong>
              No active alerts
            </strong>

            <p>
              All current factory conditions
              are within the monitored state.
            </p>

          </div>

        ) : (

          <div className="alert-feed">

            {activeAlerts.map(
              alert => (

                <article
                  key={alert.id}
                  className={
                    `priority-alert ${
                      alert.severity.toLowerCase()
                    }`
                  }
                >

                  <div className="alert-content">

                    <div className="alert-title-row">

                      <span className="severity-badge">
                        {alert.severity}
                      </span>

                      <h3>

                        {alert.severity === "CRITICAL"
                          ? "CRITICAL — "
                          : alert.severity === "HIGH"
                          ? "HIGH — "
                          : "ELEVATED — "
                        }

                        {alert.title}

                      </h3>

                    </div>


                    <p className="alert-description">
                      {alert.description}
                    </p>


                    {/* COLLAPSED REASONS */}

                    {expandedAlert !== alert.id && (

                      <div className="mini-reasons">

                        <strong>
                          Why is this important?
                        </strong>

                        <span>
                          • Location:{" "}
                          {alert.location}
                        </span>

                        <span>
                          • Active Machine:{" "}
                          {alert.machine}
                        </span>

                        <span>
                          • Access:{" "}
                          {alert.access}
                        </span>

                      </div>

                    )}


                    {/* EXPANDED REASONS */}

                    {expandedAlert === alert.id && (

                      <div className="reason-panel">

                        <strong>
                          Why is this important?
                        </strong>


                        <ul>

                          {alert.reasons?.map(
                            (reason, index) => (

                              <li key={index}>
                                {reason}
                              </li>

                            )
                          )}

                        </ul>


                        <div className="correlation-box">

                          <strong>
                            Correlation Engine Result
                          </strong>

                          <p>
                            The system correlated
                            employee access,
                            location, machine state
                            and safety conditions
                            to determine the risk
                            level of this event.
                          </p>

                        </div>

                      </div>

                    )}

                  </div>


                  {/* ACTION BUTTONS */}

                  <div className="alert-actions">

                    <button
                      className="acknowledge-button"
                      onClick={() =>
                        acknowledgeAlert(
                          alert.id
                        )
                      }
                    >
                      Acknowledge
                    </button>


                    <button
                      className={
                        `details-button ${
                          expandedAlert === alert.id
                            ? "opened"
                            : ""
                        }`
                      }
                      onClick={() =>
                        toggleDetails(
                          alert.id
                        )
                      }
                    >

                      {expandedAlert === alert.id
                        ? "Hide Details"
                        : "View Details & Reasons"
                      }

                      <span>
                        ›
                      </span>

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>


      {/* PROTOCOL */}

      <div className="protocol-note">

        <strong>
          Supervisory Protocol
        </strong>

        <span>
          Review high-severity alerts promptly.
          Acknowledging an alert records that the
          responsible officer has reviewed the event.
        </span>

      </div>

    </div>

  );
}


export default CommandCenter;