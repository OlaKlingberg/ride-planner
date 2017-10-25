let api;
let demoMode;

// Todo: Hardcoding these tests might not be the best solution.
if (window.location.host === "https://ride-planner.herokuapp.com") {
  api = "https://ride-planner-backend.herokuapp.com";
  demoMode = false;
}

if (window.location.host === "https://ride-planner-demo.herokuapp.com") {
  api = "https://ride-planner-demo-backend.herokuapp.com";
  demoMode = true;
}

const environment = {
  api: api,
  demoMode: demoMode,
  googleMapsKey: "AIzaSyDcbNgBS0ykcFj8em8xT5WcDHZbFiVL5Ok",
  production: true
};

export { api, demoMode, environment }

