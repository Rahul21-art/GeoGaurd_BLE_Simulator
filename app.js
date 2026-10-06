
/* =========================================================
   GEOGUARD
   PART 1 - PHONE A LIVE TRACKER SIMULATOR
   ========================================================= */


/* =========================================================
   BLE CONFIGURATION
   ========================================================= */

const BLE_CONFIG = {

    deviceName: "GEOGUARD_TRACKER_001",

    serviceUUID:
        "00009001-0000-1000-8000-00805f9b34fb",

    characteristicUUID:
        "00009002-0000-1000-8000-00805f9b34fb"

};


/* =========================================================
   DEFAULT DATA
   ========================================================= */

const DEFAULT_TRACKER_DATA = {

    studentId: "ST001",

    latitude: 18.1065,

    longitude: 83.3955,

    battery: 87,

    sos: false

};


/* =========================================================
   CURRENT DATA
   ========================================================= */

let trackerData = {
    ...DEFAULT_TRACKER_DATA
};


/* =========================================================
   LIVE SIMULATION VARIABLES
   ========================================================= */

let simulationTimer = null;

let simulationRunning = false;

let routeIndex = 0;


/* =========================================================
   DEMO ROUTE
   =========================================================

   Each point represents the tracker moving to a
   different GPS position.

   The Student App will receive a new location
   continuously.

   ========================================================= */

const demoRoute = [

    {
        latitude: 18.1065,
        longitude: 83.3955
    },

    {
        latitude: 18.1072,
        longitude: 83.3963
    },

    {
        latitude: 18.1080,
        longitude: 83.3971
    },

    {
        latitude: 18.1088,
        longitude: 83.3980
    },

    {
        latitude: 18.1096,
        longitude: 83.3988
    },

    {
        latitude: 18.1104,
        longitude: 83.3997
    },

    {
        latitude: 18.1112,
        longitude: 83.4005
    },

    {
        latitude: 18.1120,
        longitude: 83.4014
    },

    {
        latitude: 18.1128,
        longitude: 83.4022
    },

    {
        latitude: 18.1136,
        longitude: 83.4031
    },

    {
        latitude: 18.1144,
        longitude: 83.4040
    },

    {
        latitude: 18.1152,
        longitude: 83.4049
    },

    {
        latitude: 18.1160,
        longitude: 83.4058
    },

    {
        latitude: 18.1168,
        longitude: 83.4067
    },

    {
        latitude: 18.1176,
        longitude: 83.4076
    }

];


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSimulator
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeSimulator() {

    loadConfiguration();

    loadTrackerIntoInputs();

    displayTrackerData();

    setStatus(
        "Simulator Ready",
        false
    );

    addLog(
        "GeoGaurd simulator initialized."
    );

    addLog(
        "Tracker ID: ST001"
    );

    addLog(
        "Ready for live tracking."
    );

}


/* =========================================================
   LOAD CONFIGURATION
   ========================================================= */

function loadConfiguration() {

    const deviceName =
        document.getElementById("deviceName");

    const serviceUUID =
        document.getElementById("serviceUUID");

    const characteristicUUID =
        document.getElementById("characteristicUUID");


    if (deviceName) {

        deviceName.value =
            BLE_CONFIG.deviceName;

    }


    if (serviceUUID) {

        serviceUUID.value =
            BLE_CONFIG.serviceUUID;

    }


    if (characteristicUUID) {

        characteristicUUID.value =
            BLE_CONFIG.characteristicUUID;

    }

}


/* =========================================================
   LOAD TRACKER INTO INPUTS
   ========================================================= */

function loadTrackerIntoInputs() {

    const studentId =
        document.getElementById("studentId");

    const latitude =
        document.getElementById("latitude");

    const longitude =
        document.getElementById("longitude");

    const battery =
        document.getElementById("battery");

    const sos =
        document.getElementById("sos");


    if (studentId) {

        studentId.value =
            trackerData.studentId;

    }


    if (latitude) {

        latitude.value =
            trackerData.latitude;

    }


    if (longitude) {

        longitude.value =
            trackerData.longitude;

    }


    if (battery) {

        battery.value =
            trackerData.battery;

    }


    if (sos) {

        sos.value =
            trackerData.sos
                ? "true"
                : "false";

    }

}


/* =========================================================
   READ INPUT DATA
   ========================================================= */

function readInputData() {

    const studentId =
        document.getElementById("studentId").value.trim();

    const latitude =
        parseFloat(
            document.getElementById("latitude").value
        );

    const longitude =
        parseFloat(
            document.getElementById("longitude").value
        );

    const battery =
        parseInt(
            document.getElementById("battery").value,
            10
        );

    const sos =
        document.getElementById("sos").value === "true";


    if (!studentId) {

        alert("Student ID cannot be empty.");

        return false;

    }


    if (
        Number.isNaN(latitude) ||
        latitude < -90 ||
        latitude > 90
    ) {

        alert("Invalid latitude.");

        return false;

    }


    if (
        Number.isNaN(longitude) ||
        longitude < -180 ||
        longitude > 180
    ) {

        alert("Invalid longitude.");

        return false;

    }


    if (
        Number.isNaN(battery) ||
        battery < 0 ||
        battery > 100
    ) {

        alert("Battery must be between 0 and 100.");

        return false;

    }


    trackerData = {

        studentId,

        latitude,

        longitude,

        battery,

        sos

    };


    return true;

}


/* =========================================================
   UPDATE TRACKER
   ========================================================= */

function updateData() {

    if (!readInputData()) {

        return;

    }


    displayTrackerData();


    setStatus(
        "Tracker Updated",
        true
    );


    addLog(
        "Tracker data manually updated."
    );

}


/* =========================================================
   DISPLAY DATA
   ========================================================= */

function displayTrackerData() {

    const student =
        document.getElementById("displayStudent");

    const battery =
        document.getElementById("displayBattery");

    const sos =
        document.getElementById("displaySOS");

    const location =
        document.getElementById("displayLocation");

    const json =
        document.getElementById("jsonOutput");


    if (student) {

        student.textContent =
            trackerData.studentId;

    }


    if (battery) {

        battery.textContent =
            trackerData.battery + "%";

    }


    if (sos) {

        sos.textContent =
            trackerData.sos
                ? "ON"
                : "OFF";


        sos.className =
            trackerData.sos
                ? "value sos-on"
                : "value sos-off";

    }


    if (location) {

        location.textContent =
            trackerData.latitude.toFixed(6)
            + ", "
            + trackerData.longitude.toFixed(6);

    }


    if (json) {

        json.textContent =
            JSON.stringify(
                trackerData,
                null,
                4
            );

    }

}


/* =========================================================
   START LIVE TRACKING
   ========================================================= */

function startSimulation() {

    if (simulationRunning) {

        addLog(
            "Live tracking is already running."
        );

        return;

    }


    /*
     * Make sure current form data is valid.
     */

    if (!readInputData()) {

        return;

    }


    simulationRunning = true;


    /*
     * Start from the current route position.
     */

    routeIndex = 0;


    /*
     * Get update interval.
     */

    const intervalInput =
        document.getElementById(
            "simulationInterval"
        );


    let intervalSeconds = 2;


    if (intervalInput) {

        intervalSeconds =
            parseInt(
                intervalInput.value,
                10
            );

    }


    if (
        Number.isNaN(intervalSeconds) ||
        intervalSeconds < 1
    ) {

        intervalSeconds = 2;

    }


    const intervalMilliseconds =
        intervalSeconds * 1000;


    /*
     * Update immediately.
     */

    sendNextLocation();


    /*
     * Continue updating.
     */

    simulationTimer =
        setInterval(
            sendNextLocation,
            intervalMilliseconds
        );


    setStatus(
        "Live Tracking Active",
        true
    );


    addLog(
        "▶ Live tracking started."
    );


    addLog(
        "Updating location every "
        + intervalSeconds
        + " seconds."
    );

}


/* =========================================================
   STOP LIVE TRACKING
   ========================================================= */

function stopSimulation() {

    if (simulationTimer !== null) {

        clearInterval(
            simulationTimer
        );

    }


    simulationTimer = null;

    simulationRunning = false;


    setStatus(
        "Tracking Stopped",
        false
    );


    addLog(
        "⏹ Live tracking stopped."
    );

}


/* =========================================================
   SEND NEXT LOCATION
   ========================================================= */

function sendNextLocation() {

    if (
        routeIndex >= demoRoute.length
    ) {

        /*
         * Restart the route.
         */

        routeIndex = 0;


        addLog(
            "🔄 Route completed. Restarting."
        );

    }


    const point =
        demoRoute[routeIndex];


    /*
     * Update GPS position.
     */

    trackerData.latitude =
        point.latitude;

    trackerData.longitude =
        point.longitude;


    /*
     * Update input boxes.
     */

    const latitudeInput =
        document.getElementById("latitude");

    const longitudeInput =
        document.getElementById("longitude");


    if (latitudeInput) {

        latitudeInput.value =
            point.latitude;

    }


    if (longitudeInput) {

        longitudeInput.value =
            point.longitude;

    }


    /*
     * Display new position.
     */

    displayTrackerData();


    /*
     * Create BLE payload.
     */

    const payload =
        createBLEPayload();


    /*
     * Log position.
     */

    addLog(
        "📍 GPS update #"
        + (routeIndex + 1)
        + " → "
        + point.latitude.toFixed(6)
        + ", "
        + point.longitude.toFixed(6)
    );


    /*
     * Simulate BLE transmission.
     */

    simulateBLETransmission(
        payload
    );


    /*
     * Move to next point.
     */

    routeIndex++;

}


/* =========================================================
   CREATE BLE PAYLOAD
   ========================================================= */

function createBLEPayload() {

    return {

        studentId:
            trackerData.studentId,

        latitude:
            trackerData.latitude,

        longitude:
            trackerData.longitude,

        battery:
            trackerData.battery,

        sos:
            trackerData.sos

    };

}


/* =========================================================
   SIMULATE BLE TRANSMISSION
   ========================================================= */

function simulateBLETransmission(
    payload
) {

    /*
     * This is the important part of the architecture.
     *
     * The Student App should eventually receive
     * exactly this type of data from the ESP32.
     */

    console.log(
        "BLE → Student App:",
        payload
    );


    /*
     * Create browser event.
     *
     * This allows another web application during
     * development to listen for tracker updates.
     */

    const event =
        new CustomEvent(
            "geoguard:BLE_DATA",
            {
                detail: payload
            }
        );


    window.dispatchEvent(event);

}


/* =========================================================
   SIMULATE BLE UPDATE MANUALLY
   ========================================================= */

function simulateBLE() {

    if (!readInputData()) {

        return;

    }


    const payload =
        createBLEPayload();


    displayTrackerData();


    setStatus(
        "BLE Data Ready",
        true
    );


    addLog(
        "📡 BLE data prepared."
    );


    addLog(
        "Sending tracker data..."
    );


    simulateBLETransmission(
        payload
    );


    addLog(
        "Tracker data sent to BLE layer."
    );

}


/* =========================================================
   SOS
   ========================================================= */

function triggerSOS() {

    trackerData.sos = true;


    const sos =
        document.getElementById("sos");


    if (sos) {

        sos.value = "true";

    }


    displayTrackerData();


    setStatus(
        "SOS ACTIVE",
        true
    );


    addLog(
        "🚨 SOS ALERT TRIGGERED!"
    );


    /*
     * Immediately send SOS data.
     */

    const payload =
        createBLEPayload();


    simulateBLETransmission(
        payload
    );

}


/* =========================================================
   CLEAR SOS
   ========================================================= */

function cancelSOS() {

    trackerData.sos = false;


    const sos =
        document.getElementById("sos");


    if (sos) {

        sos.value = "false";

    }


    displayTrackerData();


    setStatus(
        "SOS Cleared",
        false
    );


    addLog(
        "✓ SOS cleared."
    );


    simulateBLETransmission(
        createBLEPayload()
    );

}


/* =========================================================
   RESET
   ========================================================= */

function resetData() {

    stopSimulation();


    trackerData = {
        ...DEFAULT_TRACKER_DATA
    };


    routeIndex = 0;


    loadTrackerIntoInputs();

    displayTrackerData();


    setStatus(
        "Simulator Ready",
        false
    );


    addLog(
        "Tracker reset."
    );

}


/* =========================================================
   DEMO LOCATION FUNCTIONS
   ========================================================= */

function testLocation(
    latitude,
    longitude
) {

    trackerData.latitude =
        latitude;

    trackerData.longitude =
        longitude;


    const latitudeInput =
        document.getElementById("latitude");

    const longitudeInput =
        document.getElementById("longitude");


    if (latitudeInput) {

        latitudeInput.value =
            latitude;

    }


    if (longitudeInput) {

        longitudeInput.value =
            longitude;

    }


    displayTrackerData();


    addLog(
        "📍 Location changed to "
        + latitude
        + ", "
        + longitude
    );


    simulateBLETransmission(
        createBLEPayload()
    );

}


function demoLocation1() {

    testLocation(
        18.1065,
        83.3955
    );

}


function demoLocation2() {

    testLocation(
        18.1100,
        83.4000
    );

}


function demoLocation3() {

    testLocation(
        18.1200,
        83.4100
    );

}


/* =========================================================
   BATTERY TEST
   ========================================================= */

function setBattery(
    percentage
) {

    trackerData.battery =
        percentage;


    const batteryInput =
        document.getElementById("battery");


    if (batteryInput) {

        batteryInput.value =
            percentage;

    }


    displayTrackerData();


    addLog(
        "🔋 Battery: "
        + percentage
        + "%"
    );


    simulateBLETransmission(
        createBLEPayload()
    );

}


function lowBatteryTest() {

    setBattery(15);

}


function fullBatteryTest() {

    setBattery(100);

}


/* =========================================================
   STATUS
   ========================================================= */

function setStatus(
    message,
    active
) {

    const statusText =
        document.getElementById("statusText");

    const statusDot =
        document.getElementById("statusDot");


    if (statusText) {

        statusText.textContent =
            message;

    }


    if (statusDot) {

        if (active) {

            statusDot.classList.add(
                "active"
            );

        } else {

            statusDot.classList.remove(
                "active"
            );

        }

    }

}


/* =========================================================
   EVENT LOG
   ========================================================= */

function addLog(
    message
) {

    const log =
        document.getElementById("eventLog");


    if (!log) {

        return;

    }


    const entry =
        document.createElement("div");


    entry.className =
        "log-entry";


    const time =
        new Date()
            .toLocaleTimeString();


    entry.textContent =
        "["
        + time
        + "] "
        + message;


    log.prepend(entry);


    /*
     * Keep log small.
     */

    while (
        log.children.length > 50
    ) {

        log.removeChild(
            log.lastChild
        );

    }

}


/* =========================================================
   WINDOW EXPORTS
   ========================================================= */

window.updateData =
    updateData;

window.triggerSOS =
    triggerSOS;

window.cancelSOS =
    cancelSOS;

window.resetData =
    resetData;

window.simulateBLE =
    simulateBLE;

window.startSimulation =
    startSimulation;

window.stopSimulation =
    stopSimulation;

window.testLocation =
    testLocation;

window.demoLocation1 =
    demoLocation1;

window.demoLocation2 =
    demoLocation2;

window.demoLocation3 =
    demoLocation3;

window.setBattery =
    setBattery;

window.lowBatteryTest =
    lowBatteryTest;

window.fullBatteryTest =
    fullBatteryTest;
