/* Newsroom pages: require a session, then render.  MOCK SITE FOR TRAINING. */
(function () {
  'use strict';
  if (WFP.requireSession()) { WFP.render(); }
})();
