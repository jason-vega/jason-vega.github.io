function addEvent(object, type, callback) {
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  }
  else if (object.attachEvent) {
    object.attachEvent("on" + type, callback);
  }
  else {
    object["on" + type] = callback;
  }
}

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
  var paddingTop = parseFloat(window.getComputedStyle(content, null)
    .getPropertyValue("padding-top")
    .replace(/px/, ""));
  var paddingBottom = parseFloat(window.getComputedStyle(content, null)
    .getPropertyValue("padding-top")
    .replace(/px/, ""));
  var yPadding = paddingTop + paddingBottom;
  var windowHeight = window.innerHeight;
  var spacerHeight = 56;
  var contentHeight = windowHeight - spacerHeight - yPadding;

  content.children[0].style.minHeight = contentHeight + "px";
}

function adjustAllContent() {
  adjustContent("name");
  adjustContent("aboutContent");
  adjustContent("projectsContent");
  adjustContent("contactContent");
}

function drawNameBackground(elementId) {
  var container = document.getElementById(elementId);
  var containerStyle = window.getComputedStyle(container, null);
  var containerWidth = parseFloat(containerStyle
    .getPropertyValue("width")
    .replace(/px/, ""));
  var containerHeight = parseFloat(containerStyle
    .getPropertyValue("height")
    .replace(/px/, ""));

  var fov = 75;
  var aspect = containerWidth / containerHeight;
  var near = 0.1;
  var far = 1000;

  var cameraX = 0;
  var cameraY = 0;
  var cameraZ = 5;
  var cameraLookAtX = 0;
  var cameraLookAtY = 0;
  var cameraLookAtZ = 0;

  var radius = 4.5;
  var tube = 0.5;
  var tubularSegments = 64;
  var radialSegments = 8;
  var maxTorusValue = 13;
  var vals = getTorusValues(maxTorusValue);
  var p = vals[0];
  var q = vals[1];

  console.log(p, q);

  var rotationRate = 0.0015;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(cameraX, cameraY, cameraZ);
  camera.lookAt(cameraLookAtX, cameraLookAtY, cameraLookAtZ);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(containerWidth, containerHeight);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  var torusKnotGeometry = new THREE.TorusKnotGeometry(radius, tube, 
    tubularSegments, radialSegments, p, q);
  var torusKnotMaterial = new THREE.MeshNormalMaterial({
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });
  var torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
  scene.add(torusKnot);

  var edgeGeometry = new THREE.WireframeGeometry(torusKnotGeometry);
  var edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  scene.add(edges);

  var animate = function() {
    requestAnimationFrame(animate);

    torusKnot.rotation.x += rotationRate;
    torusKnot.rotation.y += rotationRate;
    edges.rotation.x += rotationRate;
    edges.rotation.y += rotationRate;

    renderer.render(scene, camera);
  }

  animate();

  addEvent(window,"resize", () => {
    containerStyle = window.getComputedStyle(container, null);
    containerWidth = parseFloat(containerStyle
      .getPropertyValue("width")
      .replace(/px/, ""));
    containerHeight = parseFloat(containerStyle
      .getPropertyValue("height")
      .replace(/px/, ""));

    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
  });
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

function getPrimes(n) {
  var filter = [];
  var primes = [];

  for (var i = 0; i <= n; i++) {
    filter.push(true);
  }

  for (var i = 2; i * i <= n; i++) {
    if (filter[i]) {
      for (var j = i * i; j <= n; j += i) {
        filter[j] = false;
      }
    }
  }

  for (var i = 2; i <= n; i++) {
    if (filter[i]) {
      primes.push(i);
    }
  }

  return primes;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getTorusValues(n) {
  var primes = getPrimes(n);
  var p = primes.splice(getRandomInt(0, primes.length), 1)[0];
  var q = primes[getRandomInt(0, primes.length)];

  return [p, q];
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
  var nameBackground = "nameBackground";
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

  drawNameBackground(nameBackground);

  fadeContent();

  addEvent(window, "resize", () => {
    adjustAllContent();
    adjustSpacers();
  });
}
