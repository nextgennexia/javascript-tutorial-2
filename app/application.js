import './assets/stylesheets/package.scss';
import './assets/javascripts/package.js';

$(document).ready(function() {
  for (let module in app.modules) {
    app.modules[module].ready && app.modules[module].ready();
  }
});

$(window).load(function() {
  setTimeout(function() {
    for (let module in app.modules) {
      app.modules[module].load && app.modules[module].load();
    }
  }, 10);
});
