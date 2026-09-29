import {
  useEffect,
  useState
} from "react";

import {
  NavLink
} from "react-router-dom";


function Header({ factoryState }) {

  const [now, setNow] =
    useState(new Date());


  useEffect(() => {

    const timer = setInterval(() => {

      setNow(
        new Date()
      );

    }, 1000);


    return () => {

      clearInterval(timer);

    };

  }, []);


  const activeAlerts =
    factoryState?.alerts?.filter(
      alert => !alert.acknowledged
    ) || [];


  const status =
    factoryState?.factory_status ||
    "NORMAL OPERATIONS";


  const statusClass =
    status
      .toLowerCase()
      .replaceAll(" ", "-");


  return (

    <>

      <header className="top-header">

        <div className="brand-section">

          <div className="brand-logo">
            IS
          </div>

          <div>

            <div className="brand-title">

              INDUSTRIAL SENTINEL

              <span className="plant-badge">
                PLANT #4
              </span>

            </div>

            <div className="brand-subtitle">
              Operations & Safety Control Console
            </div>

          </div>

        </div>


        <div className="header-right">

          <div
            className={
              `factory-status-badge ${statusClass}`
            }
          >
            {status}
          </div>


          <div className="live-clock">

            <strong>

              {now.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false
                }
              )}

            </strong>

            <small>
              Shift A (06:00 - 14:30)
            </small>

          </div>

        </div>

      </header>


      <nav className="main-navigation">

        <NavLink
          to="/command"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >

          ◫ Command Center

          {activeAlerts.length > 0 && (

            <span className="nav-alert-count">
              {activeAlerts.length}
            </span>

          )}

        </NavLink>


        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          ♙ Employee & Security
        </NavLink>


        <NavLink
          to="/safety"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
        >
          ♢ Industrial Safety
        </NavLink>

      </nav>

    </>

  );
}


export default Header;