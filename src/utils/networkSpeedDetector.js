/**
 * ============================================================================
 * SeCloudive Auto Network Speed & Telemetry Detector
 * Real-time connection quality, latency, downlink throughput, and jitter.
 * Operates purely in the background without disturbing the user or application.
 * ============================================================================
 */

let listeners = [];
let currentTelemetry = {
  effectiveType: '4g',
  downlink: 10, // Mbps
  rtt: 35, // ms
  saveData: false,
  statusGrade: 'EXCELLENT',
  statusColor: '#10b981',
  isOnline: true,
  lastPingTime: Date.now()
};

function evaluateGrade(rtt, downlink, isOnline) {
  if (!isOnline) {
    return { grade: 'OFFLINE', color: '#ef4444' };
  }
  if (rtt < 60 && downlink >= 10) {
    return { grade: 'OPTIMAL (4G/5G)', color: '#10b981' };
  }
  if (rtt < 120 && downlink >= 3) {
    return { grade: 'GOOD (BROADBAND)', color: '#38bdf8' };
  }
  if (rtt < 250 || downlink >= 1) {
    return { grade: 'FAIR (3G/CONGESTED)', color: '#f59e0b' };
  }
  return { grade: 'DEGRADED / SLOW', color: '#f43f5e' };
}

function updateTelemetry() {
  if (typeof navigator === 'undefined') return;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isOnline = typeof navigator.onLine === 'boolean' ? navigator.onLine : true;

  let effectiveType = '4g';
  let downlink = 10;
  let rtt = 30;
  let saveData = false;

  if (conn) {
    effectiveType = conn.effectiveType || '4g';
    downlink = typeof conn.downlink === 'number' ? conn.downlink : 10;
    rtt = typeof conn.rtt === 'number' ? conn.rtt : 30;
    saveData = !!conn.saveData;
  }

  const { grade, color } = evaluateGrade(rtt, downlink, isOnline);

  currentTelemetry = {
    effectiveType,
    downlink: Math.round(downlink * 10) / 10,
    rtt: Math.round(rtt),
    saveData,
    statusGrade: grade,
    statusColor: color,
    isOnline,
    lastPingTime: Date.now()
  };

  listeners.forEach(fn => fn(currentTelemetry));
}

// Active micro-ping to verify live connection latency
async function runActivePing() {
  if (typeof window === 'undefined' || !navigator.onLine) {
    updateTelemetry();
    return;
  }

  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    // Fetch favicon or local micro-asset with cache-busting
    await fetch(`/favicon.ico?_t=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeout);
    const measuredRtt = Math.round(performance.now() - start);

    if (measuredRtt > 0 && measuredRtt < 3000) {
      currentTelemetry.rtt = measuredRtt;
      const { grade, color } = evaluateGrade(measuredRtt, currentTelemetry.downlink, true);
      currentTelemetry.statusGrade = grade;
      currentTelemetry.statusColor = color;
      currentTelemetry.lastPingTime = Date.now();
      listeners.forEach(fn => fn(currentTelemetry));
    }
  } catch (err) {
    // If request fails or times out, fallback to connection API
    updateTelemetry();
  }
}

// Initialize listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', updateTelemetry);
  window.addEventListener('offline', updateTelemetry);

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    conn.addEventListener('change', updateTelemetry);
  }

  // Periodic subtle background check every 25 seconds
  setInterval(runActivePing, 25000);
  setTimeout(runActivePing, 1000);
}

export function getNetworkTelemetry() {
  return currentTelemetry;
}

export function subscribeNetworkSpeed(callback) {
  listeners.push(callback);
  callback(currentTelemetry);
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}
