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

function addProject(project, projectListContainer, background, justifyImage) {
  var projectHtml = '<div class="card rounded-0 bg-' + background + ' border-' +
    background + ' text-' + (background == 'dark' ? 'light' : 'dark') + 
    ' fade"><div class="row no-gutters justify-content-center mt-3 d-block ' + 
    'd-sm-none"><div class="col-auto text-center"><img src="' +
    project.imageUrl + '" class="project-preview-sm rounded-circle shadow" ' + 
    'alt="' + project.title + '"></div></div><div class="row no-gutters ' +
    'align-items-center">';

  if (justifyImage == "left") {
    projectHtml += '<div class="col-auto d-none d-sm-block"><img class="' +
      'card-img rounded-0 project-preview" src="' + project.imageUrl + 
      '" alt="' + project.title + '"></div>';
  }
  
  projectHtml += '<div class="col-sm"><div class="card-body"><h5 ' +
    'class="card-title">' + project.title + '</h5><p class="card-text">' + 
    project.description + '</p>';

  for (var i = 0; i < project.links.length; i++) {
    var link = project.links[i];

    projectHtml += '<a class="card-link" href="' + link.url + '">' + 
      link.title + '</a>';
  }

  if (project.contribution != null) {
    var contributionId = camelize(project.title) + "Contribution";

    projectHtml += '<a class="card-link" data-toggle="collapse" href="#' +
      contributionId + '">My contribution</a><p class="' +
      'card-text mt-3 collapse" id="' + contributionId + '">';

    for (var i = 0; i < project.contribution.length; i++) {
      var text = project.contribution[i];

      projectHtml += "- " + text;

      if (i != project.contribution.length - 1) {
        projectHtml += "<br>";
      }
    }

    projectHtml += '</p>';
  }

  if (project.technologies != null) {
    projectHtml += '<p class="card-text mt-3 mb-2">';

    for (text of project.technologies) {
      projectHtml += '<span class="badge badge-secondary">' + text + 
        '</span> ';
    }

    projectHtml += '</p>';
  }

  projectHtml += '</div></div>';

  if (justifyImage == "right") {
    projectHtml += '<div class="col-auto d-none d-sm-block"><img src="' + 
      project.imageUrl + '" class="card-img rounded-0 project-preview" ' + 
      'alt="' + project.title + '"></div>';
  }

  projectHtml += '</div></div>';

  projectsListContainer.insertAdjacentHTML('beforeend', projectHtml);
}

function adjustSpacer(spacerId, contentId) {
  var spacer = document.getElementById(spacerId);
  var content = document.getElementById(contentId);
  var contentTop = content.getBoundingClientRect().top;
  var bodyTop = document.body.getBoundingClientRect().top;
  var spacerHeight = getNavbarHeight("navbar");

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
  var spacerHeight = getNavbarHeight("navbar");
  var contentHeight = windowHeight - spacerHeight - yPadding;

  content.children[0].style.minHeight = contentHeight + "px";
}

function adjustAllContent() {
  adjustContent("name");
  adjustContent("aboutContent");
  adjustContent("projectsContent");
  adjustContent("contactContent");
}

function adjustSpacerHeight() {
  var spacerHeight = getNavbarHeight("navbar");
  var spacers = document.getElementsByClassName("spacer");

  for (var i = 0; i < spacers.length; i++) {
    spacers[i].style.height = spacerHeight + "px";
  }
}

function camelize(text) {
  var textSplit = text.split(" ");
  var result = "";

  for (var i = 0; i < textSplit.length; i++) {
    var word = textSplit[i];

    result += (i == 0 ? word.charAt(0).toLowerCase() : 
      word.charAt(0).toUpperCase()) + word.slice(1).toLowerCase();
  }

  return result;
}

function changeUrl() {
  var about = document.getElementById("about");
  var projects = document.getElementById("projects");
  var contact = document.getElementById("contact");
  var aboutTop = about.getBoundingClientRect().top;
  var projectsTop = projects.getBoundingClientRect().top;
  var contactTop = contact.getBoundingClientRect().top;
  var title = "Jason Vega";
  var currentHash = window.location.hash.replace(/#/, "");

  if (contactTop <= 1) {
    if (history.pushState && currentHash != "contact") {
      document.title = "Jason Vega - Contact";
      history.replaceState(null, document.title, "#contact");
    }
  }
  else if (projectsTop <= 1) {
    if (history.pushState && currentHash != "projects") {
      document.title = "Jason Vega - Projects";
      history.replaceState(null, document.title + " - Projects", "#projects");
    }
  }
  else if (aboutTop <= 1) {
    if (history.pushState && currentHash != "about") {
      document.title = "Jason Vega - About";
      history.replaceState(null, document.title + "- About", "#about");
    }
  }
  else if (currentHash != "") {
    document.title = "Jason Vega";
    history.replaceState("", document.title, "index.html");
  }
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
  var cameraZ = 4.5;
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
  var spacerHeight = getNavbarHeight("navbar");

  for (var i = 0; i < fadeElements.length; i++) {
    var elementTop = fadeElements[i].getBoundingClientRect().top;
    var currentOpacity = parseFloat(window
      .getComputedStyle(fadeElements[i], null)
      .getPropertyValue('opacity'));
    var threshold = window.innerHeight;
  
    if (elementTop <= threshold) {
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

function getCoprimes(p, n) {
  var filter = [];
  var coprimes = [];

  for (var i = 0; i <= n; i++) {
    filter.push(true);
  }

  for (var i = 2; i <= p; i++) {
    if (filter[i] && p % i == 0) {
      for (var j = i; j <= n; j += i) {
        filter[j] = false;
      }
    }
  }

  for (var i = 2; i <= n; i++) {
    if (filter[i]) {
      coprimes.push(i);
    }
  }

  return coprimes;
}

function getDocumentHeight() {
  return Math.max(document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNavbarHeight(navbarId) {
  var navbar = document.getElementById(navbarId);
  var navbarHeight = parseFloat(window.getComputedStyle(navbar, null)
    .getPropertyValue("height").replace(/px/, ""));

  return navbarHeight;
}

function getTorusValues(n) {
  var p = getRandomInt(2, n);
  var coprimes = getCoprimes(p, n);
  var q = coprimes[getRandomInt(0, coprimes.length)];

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
        window.location.hash = "#" + elementId;
      }
      else {
        history.replaceState("", document.title, window.location.pathname);
      }
    }
  })();
}

function titleFromElementId(id) {
  var baseName = "Jason Vega";
  var capitalized = id.charAt(0).toUpperCase() + id.slice(1);

  return baseName + " - " + capitalized;
}

window.onload = function() {
  var topNavLink = document.getElementById("topNavLink");
  var aboutNavLink = document.getElementById("aboutNavLink");
  var aboutNavLinkCollapsed = document.getElementById("aboutNavLinkCollapsed");
  var projectsNavLink = document.getElementById("projectsNavLink");
  var projectsNavLinkCollapsed = 
    document.getElementById("projectsNavLinkCollapsed");
  var contactNavLink = document.getElementById("contactNavLink");
  var contactNavLinkCollapsed = 
    document.getElementById("contactNavLinkCollapsed");
  var projectsListContainer = document.getElementById("projectsListContainer");
  var bioText = document.getElementById("bioText");
  var nameBackground = "nameBackground";
  var dataFile = "assets/js/data.json";
  var scrollSpeed = 100;
  var initialHash = window.location.hash;
  var request = new XMLHttpRequest();
  var scrollSpeed = 100;

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

  addEvent(window, "resize", () => {
    adjustSpacerHeight();
    adjustAllContent();
    adjustSpacers();
  });

  addEvent(window, "scroll", () => {
    fadeContent();
    changeUrl();
  });

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      bioText.innerHTML = data.bio;

      for (var i = 0; i < data.projects.length; i++) {
        addProject(data.projects[i], projectsListContainer, 
          (i % 2 == 0 ? "light" : "dark"),
          (i % 2 == 0 ? "right" : "left"));
      }

      adjustSpacerHeight();
      adjustAllContent();
      adjustSpacers();

      drawNameBackground(nameBackground);

      if (initialHash != "") {
        window.location.hash = initialHash;
        document.getElementById(initialHash.replace(/#/, "")).scrollIntoView();
        document.title = titleFromElementId(initialHash.replace(/#/, ""));
      }

      fadeContent();
    }
  }

  request.open("GET", dataFile, true);
  request.send();
}
