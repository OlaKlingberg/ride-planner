let environment = {
  api: "",
  demoMode: false,
  googleMapsKey: "AIzaSyDcbNgBS0ykcFj8em8xT5WcDHZbFiVL5Ok",
  production: true
};

// Todo: Hardcoding these tests might not be the best solution.
if (window.location.host === "https://ride-planner.herokuapp.com") {
  environment.api = "https://ride-planner-backend.herokuapp.com";
  environment.demoMode = false;
}

if (window.location.host === "https://ride-planner-demo.herokuapp.com") {
  environment.api = "https://ride-planner-demo-backend.herokuapp.com";
  environment.demoMode = true;
}

Object.freeze(environment);

export { environment }


