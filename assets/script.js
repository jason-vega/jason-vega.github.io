function adjustSpacer(spacerId, contentId) {
  var spacer = document.getElementById(spacerId);
  var content = document.getElementById(contentId);
  var contentTop = content.getBoundingClientRect().top;
  var bodyTop = document.body.getBoundingClientRect().top;
  var spacerHeight = 56;

  spacer.style.top = (contentTop - bodyTop - spacerHeight) + "px";
}

function adjustSpacers() {
  adjustSpacer("about", "aboutContent");
  adjustSpacer("projects", "projectsContent");
  adjustSpacer("contact", "contactContent");
}

function getDelta(currentScroll, targetScroll, maxDelta) {
  var x = currentScroll / targetScroll;
  var y = Math.sqrt(Math.pow(0.5, 2) - Math.pow(x - 0.5, 2));

  return y * (maxDelta - 1) / 0.5 + 1;
}

function getDocumentHeight() {
  return Math.max(document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight);
}

function scrollToElement(elementId, maxSpeed, urlChange="#" + elementId) {
  var element = document.getElementById(elementId);
  var elementTop = element.getBoundingClientRect().top;
  var lastTop = 0;
  var speed = Math.abs(elementTop) * maxSpeed / getDocumentHeight();
  var animationDelay = 10;

  var animate = window.setInterval(function () {
    var currentTop = element.getBoundingClientRect().top;
    var deltaScroll = elementTop - currentTop

    var delta = Math.sign(elementTop) * getDelta(deltaScroll, 
      elementTop, speed);

    if (currentTop != lastTop && Math.abs(currentTop) >= Math.abs(delta)) {
      window.scrollBy(0, delta);
      lastTop = currentTop;
    }
    else {
      window.clearInterval(animate);
      window.location.replace(urlChange);
    }
  }, animationDelay);
}

window.onload = function() {
  var topNavLink = document.getElementById("topNavLink");
  var aboutNavLink = document.getElementById("aboutNavLink");
  var projectsNavLink = document.getElementById("projectsNavLink");
  var contactNavLink = document.getElementById("contactNavLink");
  var scrollSpeed = 75;

  topNavLink.onclick = function() {
    scrollToElement("top", scrollSpeed, "#");
  };

  aboutNavLink.onclick = function() {
    scrollToElement("about", scrollSpeed);
  };

  projectsNavLink.onclick = function() {
    scrollToElement("projects", scrollSpeed);
  };

  contactNavLink.onclick = function() {
    scrollToElement("contact", scrollSpeed);
  };

  adjustSpacers();
}
