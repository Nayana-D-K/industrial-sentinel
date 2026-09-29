from flask import Flask, jsonify
from flask_cors import CORS

from data import (
    factory_state,
    create_initial_state,
    current_time
)

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------

def next_alert_id():

    if not factory_state["alerts"]:
        return 1

    return max(
        alert["id"]
        for alert in factory_state["alerts"]
    ) + 1


def add_event(message, event_type="SIMULATION"):

    factory_state["last_event"] = {
        "time": current_time(),
        "message": message,
        "type": event_type
    }


def update_factory_status():

    active_alerts = [
        alert
        for alert in factory_state["alerts"]
        if not alert["acknowledged"]
    ]

    if any(
        alert["severity"] == "CRITICAL"
        for alert in active_alerts
    ):
        factory_state["factory_status"] = "CRITICAL HAZARD"

    elif any(
        alert["severity"] == "HIGH"
        for alert in active_alerts
    ):
        factory_state["factory_status"] = "ATTENTION NEEDED"

    elif factory_state["safety"]["gas"] >= 50:
        factory_state["factory_status"] = "ATTENTION NEEDED"

    else:
        factory_state["factory_status"] = "NORMAL OPERATIONS"


# --------------------------------------------------
# GET FACTORY STATE
# --------------------------------------------------

@app.get("/api/state")
def get_state():

    return jsonify(factory_state)


# --------------------------------------------------
# AUTHORIZED ENTRY
# --------------------------------------------------

@app.post("/api/simulate/employee-entry")
def employee_entry():

    event_time = current_time()

    employee = {
        "time": event_time,
        "id": "EMP0884",
        "name": "Suresh Verma",
        "department": "Maintenance",
        "location": "Zone B (Hazard)",
        "shift": "Shift A",
        "permission": "Allowed",
        "status": "Authorized Entry"
    }

    factory_state["current_employee"] = {
        "id": "EMP0884",
        "name": "Suresh Verma",
        "department": "Maintenance",
        "location": "Zone B (Hazard)",
        "shift": "Shift A",
        "access": "Allowed",
        "status": "Authorized Entry"
    }

    factory_state["employees"].insert(
        0,
        employee
    )

    factory_state["employees_inside"] += 1

    factory_state["zones"]["Zone B"]["workers"] = 1

    add_event(
        "Suresh Verma (EMP0884) authorized entry detected in Zone B."
    )

    update_factory_status()

    return jsonify({
        "success": True,
        "message": "Authorized entry simulated"
    })


# --------------------------------------------------
# UNAUTHORIZED ENTRY
# --------------------------------------------------

@app.post("/api/simulate/unauthorized-entry")
def unauthorized_entry():

    event_time = current_time()

    factory_state["current_employee"] = {
        "id": "EMP1024",
        "name": "Ramesh Kumar",
        "department": "Packaging",
        "location": "Zone B (Hazard)",
        "shift": "Shift A",
        "access": "Not Allowed",
        "status": "Unauthorized Entry"
    }

    factory_state["employees_inside"] += 1

    factory_state["machines"]["Machine 03"]["status"] = "Running"

    factory_state["machines"]["Machine 03"]["nearby_people"] = 2

    factory_state["zones"]["Zone B"]["status"] = "VIOLATION"

    factory_state["zones"]["Zone B"]["workers"] = 2

    factory_state["employees"].insert(
        0,
        {
            "time": event_time,
            "id": "EMP1024",
            "name": "Ramesh Kumar",
            "department": "Packaging",
            "location": "Zone B (Hazard)",
            "shift": "Shift A",
            "permission": "Not Allowed",
            "status": "Unauthorized Entry"
        }
    )

    alert = {
        "id": next_alert_id(),

        "severity": "HIGH",

        "category": "SECURITY",

        "title": "Unauthorized Entry in Zone B",

        "description":
            "Employee Ramesh Kumar entered Zone B "
            "without authorization while heavy stamping "
            "machinery is operating.",

        "location":
            "Zone B (Heavy Stamping & Hazard Perimeter)",

        "machine":
            "Machine 03 — Stamping Press — RUNNING",

        "access":
            "Not Authorized",

        "risk": "HIGH",

        "time": event_time,

        "acknowledged": False,

        "reasons": [
            "Ramesh Kumar (EMP1024) has no permission for Zone B.",
            "Employee was detected inside the Hazard Zone.",
            "Machine 03 — Stamping Press — is currently RUNNING.",
            "2 employees are currently near the operating machine.",
            "Packaging clearance is restricted to authorized production zones."
        ]
    }

    factory_state["alerts"].insert(
        0,
        alert
    )

    add_event(
        "Ramesh Kumar (EMP1024) detected in Zone B. "
        "HIGH risk alert raised by Correlation Engine."
    )

    update_factory_status()

    return jsonify({
        "success": True,
        "message": "Unauthorized entry simulated"
    })


# --------------------------------------------------
# GAS HAZARD
# --------------------------------------------------

@app.post("/api/simulate/high-gas")
def high_gas():

    event_time = current_time()

    factory_state["safety"]["gas"] = 68

    factory_state["zones"]["Zone B"]["status"] = "VIOLATION"

    critical_alert = {
        "id": next_alert_id(),

        "severity": "CRITICAL",

        "category": "SAFETY",

        "title": "Gas Level High in Hazard Zone",

        "description":
            "LEL sensors in Zone B report 68 ppm, "
            "exceeding the 50 ppm monitoring limit.",

        "location":
            "Zone B Hazard Zone (Exhaust Trench)",

        "machine":
            "Machine 03 — Exhaust fans running",

        "access":
            "Zone cleared for certified emergency staff only",

        "risk": "CRITICAL",

        "time": event_time,

        "acknowledged": False,

        "reasons": [
            "Gas concentration is 68 ppm.",
            "Configured monitoring limit is 50 ppm.",
            "Gas sensor is located in Hazard Zone B.",
            "Machine 03 is operating in the same zone.",
            "Personnel presence increases the safety risk."
        ]
    }

    factory_state["alerts"].insert(
        0,
        critical_alert
    )

    moderate_alert = {
        "id": next_alert_id(),

        "severity": "MODERATE",

        "category": "SAFETY",

        "title": "Ambient Hazard Monitor in Zone B",

        "description":
            "Sensor array #04 reports slightly elevated "
            "atmospheric trace under the monitoring threshold.",

        "location":
            "Zone B Chemical & Press Duct",

        "machine":
            "Machine 03 — Running",

        "access":
            "Suresh Verma (Maintenance) holds Gas Handling Certification",

        "risk": "MODERATE",

        "time": event_time,

        "acknowledged": False,

        "reasons": [
            "Sensor array #04 detected an elevated atmospheric trace.",
            "Reading is below the emergency shutdown threshold.",
            "Machine 03 is running in the monitored area.",
            "Certified maintenance staff are required for intervention."
        ]
    }

    factory_state["alerts"].append(
        moderate_alert
    )

    add_event(
        "Gas level reached 68 ppm in Zone B. "
        "CRITICAL safety alert raised."
    )

    update_factory_status()

    return jsonify({
        "success": True,
        "message": "Gas hazard simulated"
    })


# --------------------------------------------------
# MACHINE RUNNING
# --------------------------------------------------

@app.post("/api/simulate/machine-running")
def machine_running():

    factory_state["machines"]["Machine 03"]["status"] = "Running"

    factory_state["machines"]["Machine 03"]["nearby_people"] = 2

    add_event(
        "Machine 03 — Stamping Press started. "
        "2 people detected nearby."
    )

    update_factory_status()

    return jsonify({
        "success": True,
        "message": "Machine 03 is running"
    })


# --------------------------------------------------
# MAINTENANCE
# --------------------------------------------------

@app.post("/api/simulate/maintenance")
def maintenance():

    factory_state["machines"]["Machine 03"]["status"] = "Maintenance"

    factory_state["machines"]["Machine 03"]["nearby_people"] = 0

    factory_state["zones"]["Zone B"]["workers"] = 0

    factory_state["zones"]["Zone B"]["status"] = "SAFE"

    add_event(
        "Machine 03 scheduled for maintenance. "
        "Operating personnel cleared."
    )

    update_factory_status()

    return jsonify({
        "success": True,
        "message": "Maintenance scheduled"
    })


# --------------------------------------------------
# ACKNOWLEDGE ALERT
# --------------------------------------------------

@app.post("/api/alerts/<int:alert_id>/acknowledge")
def acknowledge_alert(alert_id):

    for alert in factory_state["alerts"]:

        if alert["id"] == alert_id:

            alert["acknowledged"] = True

            add_event(
                f'{alert["title"]} acknowledged by responsible officer.',
                "ACKNOWLEDGED"
            )

            update_factory_status()

            return jsonify({
                "success": True,
                "message": "Alert acknowledged"
            })

    return jsonify({
        "success": False,
        "message": "Alert not found"
    }), 404


# --------------------------------------------------
# RESET
# --------------------------------------------------

@app.post("/api/reset")
def reset_factory():

    new_state = create_initial_state()

    factory_state.clear()

    factory_state.update(
        new_state
    )

    add_event(
        "Factory monitoring reset to normal operating state.",
        "RESET"
    )

    return jsonify({
        "success": True,
        "message": "Factory reset"
    })


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )