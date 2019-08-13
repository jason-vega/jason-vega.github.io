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

function adjustContent(contentId) {
  var content = document.getElementById(contentId);
  var windowHeight = window.innerHeight;
  var yMargin = 
    parseFloat(window.getComputedStyle(content, null)
      .getPropertyValue('margin-top')
      .replace(/px/, ""));
  var spacerHeight = 56;
  var contentHeight = windowHeight - 2 * yMargin - spacerHeight;

  content.children[0].style.minHeight = contentHeight + "px";
}

function adjustAllContent() {
  adjustContent("name");
  adjustContent("aboutContent");
  adjustContent("projectsContent");
  adjustContent("contactContent");
}

function fadeContent() {
  var fadeElements = document.getElementsByClassName("fade");
  var spacerHeight = 56;

  for (var i = 0; i < fadeElements.length; i++) {
    var elementTop = fadeElements[i].getBoundingClientRect().top;
    var currentOpacity = parseFloat(window
      .getComputedStyle(fadeElements[i], null)
      .getPropertyValue('opacity'));
  
    if (elementTop - 4 * spacerHeight <= 0) {
      if (currentOpacity == 0) {
        fadeIn(fadeElements[i]);
      }
    }
    else {
      if (currentOpacity == 1) {
        fadeOut(fadeElements[i]);
      }
    }
  }
}

function fadeIn(element) {
  if (element.classList.contains("fade-out")) {
    element.classList.remove("fade-out");
  }

  if (!element.classList.contains("fade-in")) {
    element.classList.add("fade-in");
  }
}

function fadeOut(element) {
  if (element.classList.contains("fade-in")) {
    element.classList.remove("fade-in");
  }

  if (!element.classList.contains("fade-out")) {
    element.classList.add("fade-out");
  }
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

function scrollToElement(elementId, maxSpeed, showUrl=true) {
  var element = document.getElementById(elementId);
  var elementTop = element.getBoundingClientRect().top;
  var lastTop = 0;
  var speed = Math.abs(elementTop) * maxSpeed / getDocumentHeight();
  var animationDelay = 10;

  (function scroll() {
    var currentTop = element.getBoundingClientRect().top;
    var deltaScroll = elementTop - currentTop

    var delta = Math.sign(elementTop) * getDelta(deltaScroll, 
      elementTop, speed);

    if (currentTop != lastTop && Math.abs(currentTop) >= Math.abs(delta)) {
      window.scrollBy(0, delta);
      lastTop = currentTop;
      window.requestAnimationFrame(scroll);
    }
    else {
      if (showUrl) {
        window.location.hash = elementId;
      }
      else {
        history.pushState("", document.title, window.location.pathname);
      }
    }
  })();
}

window.onload = function() {
  var topNavLink = document.getElementById("topNavLink");
  var aboutNavLink = document.getElementById("aboutNavLink");
  var aboutNavLinkCollapsed = document.getElementById("aboutNavLinkCollapsed");
  var projectsNavLink = document.getElementById("projectsNavLink");
  var projectsNavLinkCollapsed = 
    document.getElementById("projectsNavLinkCollapsed");
  var contactNavLink = document.getElementById("contactNavLink");
  var contactNavLinkCollapsed = document.getElementById("contactNavLinkCollapsed");
  var scrollSpeed = 50;

  topNavLink.onclick = function(e) {
    e.preventDefault();
    scrollToElement("top", scrollSpeed, false);
  };

  aboutNavLink.onclick = function(e) {
    e.preventDefault();
    scrollToElement("about", scrollSpeed);
  };

  aboutNavLinkCollapsed.onclick = function(e) {
    scrollToElement("about", scrollSpeed);
  };

  projectsNavLink.onclick = function(e) {
    e.preventDefault();
    scrollToElement("projects", scrollSpeed);
  };

  projectsNavLinkCollapsed.onclick = function(e) {
    scrollToElement("projects", scrollSpeed);
  };

  contactNavLink.onclick = function(e) {
    e.preventDefault();
    scrollToElement("contact", scrollSpeed);
  };

  contactNavLinkCollapsed.onclick = function(e) {
    scrollToElement("contact", scrollSpeed);
  };

  adjustAllContent();
  adjustSpacers();

  fadeContent();
}
