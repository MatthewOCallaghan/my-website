const setLayout = () => {

	// Header - used to make header-content fill remaining space in header-background, since replaced with flex
	// const headerContent = document.getElementById('header-content');
	// headerContent.style.height = null;
	// const navbarHeight = document.getElementById('navbar').offsetHeight;
	// const headerBackgroundHeight = document.getElementById('header-background').clientHeight;
	// headerContent.style.height = `${headerBackgroundHeight - navbarHeight}px`;


	// Adds left padding where required to each section to account for section-title
	Array.from(document.getElementsByTagName('section')).forEach(section => {
		const title = section.getElementsByClassName('section-title')[0];
		const container = section.getElementsByClassName('container')[0];
		const sectionPaddingLeft = window.getComputedStyle(section)['padding-left'];

		if(window.innerWidth > 800 && window.innerWidth > window.innerHeight) {
			container.style.paddingLeft = `${title.offsetHeight + parseInt(sectionPaddingLeft, 10)}px`;
		} else {
			container.style.paddingLeft = null;
		}
	});
	
}

// const positionBackground = () => {
// 	const distance = document.all ? iebody.scrollTop : pageYOffset;
// 	const headerBackground = document.getElementById('header-background');
// 	headerBackground.style.backgroundPositionY = `calc(50% + ${distance}px)`;
// }

// positionBackground();
setLayout();
window.addEventListener('resize', setLayout);
// window.addEventListener('scroll', positionBackground);
document.addEventListener('DOMContentLoaded', function(event) {
	setLayout();
	// positionBackground();
});
window.onload = setLayout;