// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  api: "http://localhost:3051",
  // dummyPosition: true,
  // dummyMovement: false,
  // dummyLatInc:          Math.random() * .0002 - .0001,
  // dummyLatInitialAdd:   Math.random() * .00006 - .00003,
  // dummyLngInc:          Math.random() * .0002 - .0001,
  // dummyLngInitialAdd:   Math.random() * .00006 - .00001,
  // dummyUpdateFrequency: Math.random() * 3000 + 500,
  // fadeNav: 4000,
  googleMapsKey: "AIzaSyDcbNgBS0ykcFj8em8xT5WcDHZbFiVL5Ok",
  production: false,
  // refreshOnMapPage: 180000,
  // refreshOnNavigation: 1800000,
  // removeLongDisconnectedRiders: 1800000,
  storage: sessionStorage
};



