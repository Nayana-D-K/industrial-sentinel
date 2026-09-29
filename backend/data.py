from datetime import datetime, timedelta


def current_time():
    return datetime.now().strftime("%H:%M:%S")


def create_initial_state():

    now = datetime.now()

    return {
        "factory_status": "NORMAL OPERATIONS",

        "employees_inside": 24,

        "machines": {
            "Machine 01": {
                "name": "CNC Mill Alpha",
                "status": "Running",
                "location": "Production Zone A",
                "nearby_people": 4
            },

            "Machine 02": {
                "name": "Conveyor Line 2",
                "status": "Idle",
                "location": "Production Zone A",
                "nearby_people": 0
            },

            "Machine 03": {
                "name": "Stamping Press",
                "status": "Idle",
                "location": "Hazard Zone B",
                "nearby_people": 0
            }
        },

        "safety": {
            "temperature": 26.4,
            "gas": 12,
            "smoke": 0,
            "vibration": 1.8,
            "sensor_health": "18 / 18"
        },

        "zones": {
            "Zone A": {
                "name": "Production Area",
                "status": "SAFE",
                "workers": 16
            },

            "Zone B": {
                "name": "Hazard Zone",
                "status": "SAFE",
                "workers": 0
            },

            "Zone C": {
                "name": "Storage & Logistics",
                "status": "SAFE",
                "workers": 4
            },

            "Zone D": {
                "name": "Restricted Substation",
                "status": "LOCKED",
                "workers": 0
            }
        },

        "current_employee": {
            "id": "—",
            "name": "No active detection",
            "department": "—",
            "location": "—",
            "shift": "Shift A",
            "access": "—",
            "status": "Waiting for event"
        },

        "employees": [
            {
                "time": (now - timedelta(minutes=2)).strftime("%H:%M:%S"),
                "id": "EMP0884",
                "name": "Suresh Verma",
                "department": "Maintenance",
                "location": "Zone B (Hazard)",
                "shift": "Shift A",
                "permission": "Allowed",
                "status": "Authorized Entry"
            },

            {
                "time": (now - timedelta(minutes=5)).strftime("%H:%M:%S"),
                "id": "EMP0542",
                "name": "Ananya Sharma",
                "department": "Operations",
                "location": "Zone A (Production)",
                "shift": "Shift A",
                "permission": "Allowed",
                "status": "Authorized Entry"
            },

            {
                "time": (now - timedelta(minutes=8)).strftime("%H:%M:%S"),
                "id": "EMP0921",
                "name": "Pooja Nair",
                "department": "Quality Assurance",
                "location": "Zone C (Storage)",
                "shift": "Shift A",
                "permission": "Allowed",
                "status": "Authorized Entry"
            },

            {
                "time": (now - timedelta(minutes=11)).strftime("%H:%M:%S"),
                "id": "EMP0311",
                "name": "Vikram Singh",
                "department": "Operations",
                "location": "Zone A (Production)",
                "shift": "Shift A",
                "permission": "Allowed",
                "status": "Authorized Entry"
            },

            {
                "time": (now - timedelta(minutes=14)).strftime("%H:%M:%S"),
                "id": "EMP1102",
                "name": "Kavita Rao",
                "department": "Logistics",
                "location": "Zone C (Storage)",
                "shift": "Shift A",
                "permission": "Allowed",
                "status": "Authorized Entry"
            }
        ],

        "alerts": [],

        "last_event": {
            "time": current_time(),
            "message": "Factory monitoring initialized",
            "type": "SYSTEM"
        }
    }


factory_state = create_initial_state()