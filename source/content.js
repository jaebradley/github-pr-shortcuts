/* eslint no-undef: 0 */
/* eslint no-restricted-globals: 0 */

import elementReady from 'element-ready';
import domLoaded from 'dom-loaded';
import { check as isReserved } from 'github-reserved-names';

// From refined-github: https://github.com/sindresorhus/refined-github/blob/master/source/libs/page-detect.js

const safeElementReady = (selector) => {
  const waiting = elementReady(selector);

  domLoaded.then(() => requestAnimationFrame(() => waiting.cancel()));

  return waiting.catch(() => null);
};

const getCleanPathname = () => location.pathname.replace(/^[/]|[/]$/g, '');

const getOwnerAndRepo = () => {
  const [, ownerName, repoName] = location.pathname.split('/');
  return { ownerName, repoName };
};

const isDashboard = () => /^$|^(orgs[/][^/]+[/])?dashboard([/]|$)/.test(getCleanPathname());

const isNotifications = () => /^([^/]+[/][^/]+\/)?notifications/.test(getCleanPathname());

const isGist = () => location.hostname.startsWith('gist.') || location.pathname.startsWith('gist/');

const isRepo = () => /^[^/]+\/[^/]+/.test(getCleanPathname()) &&
  !isReserved(getOwnerAndRepo().ownerName) &&
  !isNotifications() &&
  !isDashboard() &&
  !isGist();

const getRepoPath = () => {
  if (!isRepo()) {
    return false;
  }
  const match = /^[^/]+[/][^/]+[/]?(.*)$/.exec(getCleanPathname());
  return match && match[1];
};

const is404 = () => document.title === 'Page not found · GitHub';

const is500 = () => document.title === 'Server Error · GitHub';

const isLoggedOut = () => document.body.classList.contains('logged-out');

const isPRPage = () => /^pull\/\d+/.test(getRepoPath());

const isPR = url => /pull\/\d+/.test(url);

const isPRCommit = url => /pull\/\d+\/commits/.test(url);

const isPRFiles = url => /pull\/\d+\/files/.test(url);

const initialize = () => (
  safeElementReady('body')
    .then(() => {
      if (is404() || is500()) {
        throw new Error('Error page detected');
      }

      if (isLoggedOut()) {
        throw new Error('Is logged out');
      }
    }).then(() => {
      if (isPRPage()) {
        const tabs = Array.from(document.getElementsByClassName('tabnav-tab js-pjax-history-navigate'));

        if (tabs) {
          tabs.forEach((tab) => {
            if (isPRFiles(tab.href)) {
              tab.setAttribute('data-hotkey', 'r f');
            } else if (isPRCommit(tab.href)) {
              tab.setAttribute('data-hotkey', 'r c');
            } else if (isPR(tab.href)) {
              tab.setAttribute('data-hotkey', 'r d');
            }
          });
        }
      }
    })
);

initialize();
