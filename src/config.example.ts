export default {
  serverUrl: 'ws://localhost:' + process.env.REACT_APP_ROBOFLEET_SERVER_PORT,
  // serverUrl: 'ws://localhost:8081',
  mapUrl: (mapName: string) =>
    `https://amrl.cs.utexas.edu/amrl_maps/${mapName}/${mapName}.vectormap.json`,
  navGraphUrl: (mapName: string) =>
    `https://amrl.cs.utexas.edu/amrl_maps/${mapName}/${mapName}.navigation.json`,
  mapDirUrl: `https://amrl.cs.utexas.edu/amrl_maps/map_directory.json`,
  // get a Google Client OAuth ID as documented here:
  // https://developers.google.com/identity/sign-in/web/sign-in#create_authorization_credentials
  // note that you *can* configure it to support localhost; specify this on the
  // "Credentials" page and use some real domain on the "Consent screen" page.
  googleClientId: null,
};
