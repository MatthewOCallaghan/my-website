document.addEventListener('DOMContentLoaded',function(event){

  const firstLine = "Hi,";
  const secondLine = "I'm_Matthew!";

  function typeEffect(i) {
    var html;
    if (i < firstLine.length) {
      html = firstLine.substring(0, i+1) +'<span id="cursor" aria-hidden="true"></span><br><br>';
    } else {
      html = firstLine + '<br>' + secondLine.substring(0, i-2) + (i > firstLine.length + secondLine.length - 2 ? '' : '<span id="cursor" aria-hidden="true"></span>')
    }
    document.getElementById('type-effect').innerHTML = html.replace('_', '&nbsp;');
    if (i === firstLine.length + secondLine.length - 1) {
      setTimeout(function() {
        typeEffect(-1);
      }, 5000);
    } else {
      setTimeout(function() {
        typeEffect(i+1);
      }, 200);
    }
  }

  typeEffect(-1);
});