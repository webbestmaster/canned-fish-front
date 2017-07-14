import es6Promise from 'es6-promise';
es6Promise.polyfill();

import FastClick from 'fastclick';

export default function initializeEnvironment() {
    FastClick.attach(document.body);
}
