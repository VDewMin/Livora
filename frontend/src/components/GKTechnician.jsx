import React from "react";

const technicians = {
  Electrical: [
    { id: 1, name: "John Electrician" },
    { id: 2, name: "Sarah Sparks" },
  ],
  Plumbing: [
    { id: 3, name: "Mike Plumber" },
    { id: 4, name: "Linda Pipes" },
  ],
  Cleaning: [
    { id: 5, name: "Alice Clean" },
    { id: 6, name: "Bob Scrub" },
  ],
  Other: [
    { id: 7, name: "General Helper 1" },
    { id: 8, name: "General Helper 2" },
  ],
};

// ✅ Export as default so you can import anywhere
export default technicians;
