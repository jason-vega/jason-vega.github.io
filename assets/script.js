function scrollToContent(elementId) {
  var offset = document.getElementById("navbar").offsetHeight;
  var element = document.getElementById(elementId);

  window.scrollTo(0, element.offsetTop - offset);
}
