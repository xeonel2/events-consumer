// this a subset of the features that CS:GO events provides - however,
// when writing an app that consumes events - it is best if you request
// only those features that you want to handle.
//
// NOTE: in the future we'll have a wildcard option to allow retreiving all
// features
var g_interestedInFeatures = ['death', 'kill'];

function registerEvents() {
  // general events errors
  overwolf.games.events.onError.addListener(function(info) {
    console.log("Error:");
    console.log(info)
  });

  // "static" data changed (total kills, username, steam-id)
  // This will also be triggered the first time we register
  // for events and will contain all the current information
  overwolf.games.events.onInfoUpdates.addListener(function(info) {
    console.log("Info UPDATE:");
    console.log(info)
  });

  // an event triggerd
  overwolf.games.events.onNewEvents.addListener(function(info) {
    console.log("EVENT FIRED", info);
  });
}

function gameLaunched(gameInfoResult) {
  if (!gameInfoResult) {
    return false;
  }

  if (!gameInfoResult.gameInfo) {
    return false;
  }

  if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
    return false;
  }

  if (!gameInfoResult.gameInfo.isRunning) {
    return false;
  }

  // NOTE: we divide by 10 to get the game class id without it's sequence number
  if ((gameInfoResult.gameInfo.id/10) != 7764) {
    return false;
  }

  console.log("CS:GO Launched");
  return true;
}

function setFeatures() {
  // register the requested ("required") features - so that Overwolf filters
  // the features that you aren't interested in receiving
  overwolf.games.events.setRequiredFeatures(
    g_interestedInFeatures, function(info) {

    // TODO: check that all required features exist in the info object returned
    // in some cases, we may not be able to provide specific features and the
    // consuming app should react upon this
    if (info.status == "error") {
      // this error could occur if the game is not currently running or
      // does not support events for the currently running game
      console.log("Could not set required features: ", info.reason);

      // although we will usually get launched automaticaly with the game,
      // however, for testing purposes, we added code that registers features
      // once the game is launched
      overwolf.games.onGameInfoUpdated.addListener(function(result) {
        if (!gameLaunched(result)) {
          return;
        }

        return setFeatures();
      });

      return;
    }

    console.log("Set required features: ", info);
  });
};

// Start here
registerEvents();
setFeatures();
