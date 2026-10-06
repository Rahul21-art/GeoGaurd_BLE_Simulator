/* =========================================================
   GeoGaurd shared backend helper (Firebase Realtime Database, REST)
   Same file is used by the student app, the dashboard and the simulator.
   Data lives at: /students/<studentId>
   ========================================================= */

const DB_URL = "https://geo-gaurd-default-rtdb.asia-southeast1.firebasedatabase.app";
const VIEW_POLL_MS = 2000;      // dashboard refresh
const STALE_AFTER_MS = 15000;   // student shown "Offline" if no update for this long

function backendReady() {
    return /^https:\/\//.test(DB_URL);
}

/* Firebase keys cannot contain . # $ [ ] / */
function safeKey(id) {
    return encodeURIComponent(String(id).replace(/[.#$\[\]\/]/g, "_"));
}

/* Create / update one student. Returns true on success. */
async function publishStudent(data) {
    if (!backendReady() || !data || !data.studentId) return false;
    try {
        const res = await fetch(`${DB_URL}/students/${safeKey(data.studentId)}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() })
        });
        return res.ok;
    } catch (e) {
        console.warn("publishStudent failed:", e);
        return false;
    }
}

async function deleteStudent(studentId) {
    if (!backendReady()) return false;
    try {
        const res = await fetch(`${DB_URL}/students/${safeKey(studentId)}.json`, { method: "DELETE" });
        return res.ok;
    } catch (e) {
        console.warn("deleteStudent failed:", e);
        return false;
    }
}

async function clearAllStudents() {
    if (!backendReady()) return false;
    try {
        const res = await fetch(`${DB_URL}/students.json`, { method: "DELETE" });
        return res.ok;
    } catch (e) {
        console.warn("clearAllStudents failed:", e);
        return false;
    }
}

/* Live table of every student (used by dashboard.html) */
function startStudentsView(containerId, statusId) {
    const box = document.getElementById(containerId);
    const status = statusId ? document.getElementById(statusId) : null;

    const esc = (v) => String(v ?? "--").replace(/[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    function setStatus(cls, text) {
        if (!status) return;
        status.textContent = text;
        status.classList.remove("connected", "connecting", "disconnected");
        status.classList.add(cls);
    }

    function render(students) {
        const list = Object.keys(students || {}).map((k) => ({ key: k, ...(students[k] || {}) }));
        if (list.length === 0) {
            box.textContent = "No students yet.";
            return;
        }
        const isSOS = (s) => ["ON", "ACTIVE", "TRUE"].includes(String(s.sos).toUpperCase());
        list.sort((a, b) => (isSOS(b) - isSOS(a)) || String(a.studentId || a.key).localeCompare(String(b.studentId || b.key)));

        const th = "text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#64748b;white-space:nowrap;";
        const td = "padding:8px;border-bottom:1px solid #f1f5f9;font-size:13px;white-space:nowrap;";
        const num = (v) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Number(v).toFixed(6) : "--");

        let html = `<table style="width:100%;border-collapse:collapse"><tr>
            <th style="${th}">Student</th><th style="${th}">Latitude</th><th style="${th}">Longitude</th>
            <th style="${th}">Battery</th><th style="${th}">SOS</th><th style="${th}">Status</th><th style="${th}">Updated</th></tr>`;

        list.forEach((s) => {
            const sos = isSOS(s);
            const age = s.updatedAt ? Date.now() - Date.parse(s.updatedAt) : Infinity;
            const live = age <= STALE_AFTER_MS;
            const t = s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString() : "--";
            const bg = sos ? "background:#fef2f2;" : "";
            html += `<tr style="${bg}">
                <td style="${td}"><strong>${esc(s.studentId || s.key)}</strong></td>
                <td style="${td}">${num(s.latitude)}</td>
                <td style="${td}">${num(s.longitude)}</td>
                <td style="${td}">${Number.isFinite(Number(s.battery)) ? Number(s.battery) + "%" : "--"}</td>
                <td style="${td}color:${sos ? "#dc2626" : "#15803d"};font-weight:700">${sos ? "SOS ACTIVE" : "OFF"}</td>
                <td style="${td}color:${live ? "#15803d" : "#9ca3af"}">&#9679; ${live ? "Live" : "Offline"}</td>
                <td style="${td}">${esc(t)}</td></tr>`;
        });
        box.innerHTML = html + "</table>";
    }

    async function tick() {
        if (!backendReady()) {
            setStatus("disconnected", "Set DB_URL");
            box.textContent = "Set DB_URL in backend.js";
            return;
        }
        try {
            const res = await fetch(`${DB_URL}/students.json`, { cache: "no-store" });
            if (!res.ok) throw new Error("HTTP " + res.status);
            render(await res.json());
            setStatus("connected", "Live");
        } catch (e) {
            console.warn("students fetch failed:", e);
            setStatus("disconnected", "Offline");
        }
    }

    tick();
    return setInterval(tick, VIEW_POLL_MS);
}
