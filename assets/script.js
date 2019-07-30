function adjustSpacer(spacerId, contentId, offsetMultiplier) {
  var spacer = document.getElementById(spacerId);
  var content = document.getElementById(contentId);
  var contentTop = content.getBoundingClientRect().top;
  var bodyTop = document.body.getBoundingClientRect().top;
  var spacerHeight = 56;

  spacer.style.position = "absolute";
  spacer.style.top = (contentTop - bodyTop - spacerHeight * offsetMultiplier) +
    "px";
}

function adjustSpacers(offsetMultiplier) {
  adjustSpacer("about", "aboutContent", offsetMultiplier);
  adjustSpacer("projects", "projectsContent", offsetMultiplier);
  adjustSpacer("contact", "contactContent", offsetMultiplier);
}
