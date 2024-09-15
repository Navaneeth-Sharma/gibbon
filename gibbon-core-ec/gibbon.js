import axios from "axios";
import pako from "pako";
import CryptoJS from "crypto-js";

console.log("gibbon script is loaded!!");

let GLOBAL_DATA = {
  events: [],
};

function getDeviceBrowserInfo() {
  const userAgent = navigator.userAgent;

  let device = "Unknown";
  let browser = "Unknown";

  // Detecting device type
  if (/mobile/i.test(userAgent)) {
    device = "Mobile";
  } else if (/tablet/i.test(userAgent)) {
    device = "Tablet";
  } else {
    device = "Desktop";
  }

  // Detecting browser type
  if (/Chrome/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    browser = "Safari";
  } else if (/Firefox/i.test(userAgent)) {
    browser = "Firefox";
  } else if (/Edge/i.test(userAgent)) {
    browser = "Edge";
  } else if (/MSIE|Trident/i.test(userAgent)) {
    browser = "Internet Explorer";
  }

  GLOBAL_DATA["device"] = device;
  GLOBAL_DATA["browser"] = browser;

  return { device, browser };
}

const info = getDeviceBrowserInfo();
console.log(info); // { device: 'Desktop', browser: 'Chrome' }

// Function to generate a session ID (dummy example)
const generateSessionId = () => {
  return "xxxx-xxxx-xxxx-xxxx".replace(/[x]/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
};

function compareTime(dateString, now) {
  const dateFromStorage = new Date(parseInt(dateString, 10)); // Convert to Date object
  const currentDate = new Date(parseInt(now, 10)); // Convert to Date object
  const diffInMilliseconds = currentDate - dateFromStorage;
  const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
  return diffInMinutes;
}

const setSessionId = () => {
  var object = JSON.parse(localStorage.getItem("sessionId"));

  if (object) {
    const dateString = object.timestamp;
    const now = new Date().getTime().toString();

    // Compare the time difference
    const timeDifference = compareTime(dateString, now);

    if (timeDifference > 30) {
      const sessionId = object.sessionId;
      console.log("New session ID:", sessionId);

      // Update GLOBAL_DATA and localStorage
      GLOBAL_DATA["sessionId"] = sessionId;
      var newObject = { sessionId: sessionId, timestamp: new Date().getTime() };
      localStorage.setItem("key", JSON.stringify(newObject));
    } else {
      console.log("Session ID remains unchanged.");
    }
  } else {
    // If no object exists in localStorage, create a new sessionId and store it
    const sessionId = generateSessionId();
    console.log("New session ID:", sessionId);

    GLOBAL_DATA["sessionId"] = sessionId;
    var newObject = { sessionId: sessionId, timestamp: new Date().getTime() };
    localStorage.setItem("key", JSON.stringify(newObject));
  }
};

// Example usage
setSessionId();

const gzipCompress = (data) => {
  const compressed = pako.gzip(data);
  return compressed;
};

// let elems = document.body.getElementsByTagName("*");

console.log(GLOBAL_DATA);

console.log(document.getElementsByTagName("div"));
console.log(document.querySelectorAll("*")[0].children);
const allElements = document.querySelectorAll("*");

// Loop through each element and add an event listener

const captureEvent = (event) => {
  GLOBAL_DATA.events.push({
    eventType: event.type,
    eventTargetTagName: event.target.tagName,
    eventTargetId: event.target.id,
    eventTargetClass: event.target.className,
    timestamp: Date.now(),
  });
  console.log(GLOBAL_DATA);
};

const eventsToCapture = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'keydown',
  'keyup',
  'focus',
  'blur',
  'change',
  'submit'
];

allElements.forEach((element) => {
  eventsToCapture.forEach((eventType) => {
    element.addEventListener(eventType, captureEvent, { capture: true, passive: true });
  });
});

// Capture scroll events on window
window.addEventListener('scroll', (event) => {
  captureEvent({
    type: 'scroll',
    target: {
      tagName: 'WINDOW',
      id: '',
      className: ''
    }
  });
}, { passive: true });

const sendEventsToServer = async () => {
  try {
    // Gzip the payload
    const gzippedData = pako.gzip(JSON.stringify(GLOBAL_DATA));

    // Send the gzipped data to the backend
    const { data } = await axios.post(
      "http://localhost:7543/event",
      gzippedData, // Send the gzipped payload
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
        },
      }
    );

    // Reset GLOBAL_DATA events
    GLOBAL_DATA.events = [];
  } catch (error) {
    console.error("Error sending events to server:", error);
  }
};

setInterval(() => {
  sendEventsToServer();
}, 10000);
