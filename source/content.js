import elementReady from 'element-ready';

import {
  shouldSetShortcuts,
  setShortcut,
} from './utilities';


const execute = async () => {
  await elementReady('body');

  if (shouldSetShortcuts()) {
    const tabs = Array.from(document.getElementsByClassName('tabnav-tab js-pjax-history-navigate'));

    if (tabs) {
      tabs.forEach(tab => setShortcut(tab));
    }
  }
};

execute();
