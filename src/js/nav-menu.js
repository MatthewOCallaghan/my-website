// Function to remove nav-open class from body
function removeNavOpenFromBody() {
	var body = document.getElementsByTagName('body')[0];
	// body.classList.remove('nav-open');
	body.classList.replace('nav-open', 'nav-no-close-transition');
}

// Add onclick to nav toggler
document.getElementById('nav-toggle').onclick = function() {
	var classes = document.getElementsByTagName('body')[0].classList;
	classes.toggle('nav-open');
	classes.remove('nav-no-close-transition');
};

// Only need to close nav menu when link clicked if this is landing page (due to links being on same page)
var nav = document.getElementsByTagName('nav')[0];
var landing = nav.classList.contains('landing');
if (landing) {
	Array.prototype.forEach.call(nav.getElementsByTagName('a'), function(link) {
		link.onclick = removeNavOpenFromBody;
	});
}

// Close nav menu if screen exceeds width of 550px
window.addEventListener('resize', function() {
	if (window.innerWidth > 550) {
		removeNavOpenFromBody();
	}
});