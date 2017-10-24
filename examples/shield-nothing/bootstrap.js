"use strict";

/* global  __SCRIPT_URI_SPEC__  */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(startup|shutdown|install|uninstall)" }]*/

const { utils: Cu } = Components;
Cu.import("resource://gre/modules/Console.jsm");

// get the configuration
const CONFIGPATH = `${__SCRIPT_URI_SPEC__}/../Config.jsm`;
const { config } = Cu.import(CONFIGPATH, {});
const studyConfig = config.study;

const STUDYUTILSPATH = `${__SCRIPT_URI_SPEC__}/../StudyUtils.jsm`;
const { studyUtils } = Cu.import(STUDYUTILSPATH, {});

const { REASONS } = studyUtils;

/** Phases of a study:

"Install"
- `enter`  (first-time seen)
- attempt install
  - if `ineligible` => `endStudy('ineligible')` => `exit`
  - else 'install'

"Startup"
- no special processes or telemetry pings.

"Endings"
- Endings, triggered by user events
  - (various study-defined) => endStudy('<that reason') => `exit`
  - user-disable  => exit


All users `enter`.   All users (eventually) `exit`
*/



async function startup(addonData, reason) {
  // addonData: Array [ "id", "version", "installPath", "resourceURI", "instanceID", "webExtension" ]  bootstrap.js:48
  console.log("startup", REASONS[reason] || reason);

  // setup the studyUtils so that Telemetry is valid
  studyUtils.setup({
    ...config,
    addon: { id: addonData.id, version: addonData.version },
  });

  // choose the variation for this particular user, then set it.
  const variation = (studyConfig.forceVariation ||
    await studyUtils.deterministicVariation(
      studyConfig.weightedVariations
    )
  );
  studyUtils.setVariation(variation);


  // addon_install:  note first seen, check eligible
  if ((REASONS[reason]) === "ADDON_INSTALL") {
    studyUtils.firstSeen(); // sends telemetry "enter"
    const eligible = await config.isEligible(); // addon-specific
    if (!eligible) {
      // uses config.endings.ineligible.url if any,
      // sends UT for "ineligible"
      // then uninstalls addon
      await studyUtils.endStudy({reason: "ineligible"});
      return;
    }
  }

  // for all 'eligible' users, startup.
  await studyUtils.startup({reason});

  // log what the study variation and other info is.
  console.log(`info ${JSON.stringify(studyUtils.info())}`);
}



function shutdown(addonData, reason) {
  console.log("shutdown", REASONS[reason] || reason);
  // FRAGILE: handle uninstalls initiated by USER or by addon
  if (reason === REASONS.ADDON_UNINSTALL || reason === REASONS.ADDON_DISABLE) {
    console.log("uninstall or disable");
    if (!studyUtils._isEnding) {
      // we are the first 'uninstall' requestor => must be user action.
      console.log("user requested shutdown");
      studyUtils.endStudy({reason: "user-disable"});
      return;
    }
    // normal shutdown, or 2nd uninstall request
    console.log("Jsms unloading");

    // QA NOTE:  unload addon-specific modules here.

    // clean up our modules.
    Cu.unload(CONFIGPATH);
    Cu.unload(STUDYUTILSPATH);
  }
}

