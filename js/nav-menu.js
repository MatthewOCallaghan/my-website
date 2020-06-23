// Function to remove nav-open class from body
function removeNavOpenFromBody() {
	document.getElementsByTagName('body')[0].classList.remove('nav-open');
}

// Add onclick to nav toggler
document.getElementById('nav-toggle').onclick = () => document.getElementsByTagName('body')[0].classList.toggle('nav-open');

// Close nav menu when link clicked
var nav = document.getElementsByTagName('nav')[0];
var landing = nav.classList.contains('landing');
if (landing) {
	Array.prototype.forEach.call(nav.getElementsByTagName('a'), link => {
		link.onclick = removeNavOpenFromBody;
	});
}

// Close nav menu if screen exceeds width of 550px
window.addEventListener('resize', () => {
	if (window.innerWidth > 550) {
		removeNavOpenFromBody();
	}
});