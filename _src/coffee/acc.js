var getAccText = require('./accText');

module.exports = function() {
  var u = document.querySelectorAll(".text-uppercase");

  for (var i = 0, l = u.length; i < l; i++) {
    u[i].innerHTML = getAccText(u[i].innerHTML);
  }
};
