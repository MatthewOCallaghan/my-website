function checkIfInView() {
	if (window.innerHeight + window.scrollY >= distance && !element.classList.contains('in-view')) {
		element.classList.add('in-view');
		window.removeEventListener('scroll', checkIfInView, { passive: true });
	}
}

var element = document.getElementsByClassName('icons-div')[0];
var distance = element.getBoundingClientRect().top + element.offsetHeight;
window.addEventListener('scroll', checkIfInView, { passive: true });
checkIfInView();