const themes = [
	{
		image: 'london.jpg',
		colour: '#FF0000',
		location: 'London, United Kingdom'
	},
	{
		image: 'new-york.jpg',
		colour: '#FC8206',
		location: 'New York City, USA'
	},
	{
		image: 'venice.png',
		colour: '#00BFFF',
		location: 'Venice, Italy'
	},
	{
		image: 'malta.png',
		// colour: '#669A47',
		colour: '#4CBD08',
		location: 'Sliema, Malta'
	},
	{
		image: 'paris.png',
		colour: '#AF9348',
		location: 'Paris, France'
	},
	{
		image: 'naples.png',
		colour: '#E9CE14',
		location: 'Naples, Italy'
	}
];

const FILEPATH = 'images/themes/';

let nextTheme = 0;

const changeTheme = newThemeIndex => {
	const newTheme = themes[newThemeIndex];
	// document.getElementById('header-background-image').style.backgroundImage = `url("images/themes/${newTheme.image}")`;
	document.getElementById('image-location').innerHTML = newTheme.location;
	// Array.from(document.getElementsByClassName('section-title')).forEach(title => {
	// 	title.style.backgroundImage = `url("images/themes/${newTheme.image}")`;
	// });

	if(document.getElementsByTagName('style').length) {
		document.body.removeChild(document.getElementsByTagName('style')[0]);
	}
	const style = document.createElement('style');
	style.innerHTML = `header #header-background-image, .bg-ti, .section-title {background-image: url("${FILEPATH}${newTheme.image}");} .pc, a, .pc-hover:hover {color: ${newTheme.colour};} .bg-pc, .bg-pc-hover:hover {background-color: ${newTheme.colour};} .bc-pc, .bc-pc-hover:hover, header .theme-duration-bar::after {border-color: ${newTheme.colour};} header #header-background {background-color: ${newTheme.colour}1A} .outline-pc:focus {outline: auto ${newTheme.colour}}`;
	document.body.appendChild(style);
}

const manageTheme = () => {
	if(document.getElementById('header-background').classList) {
		document.getElementById('header-background').classList.remove('theme-duration-bar');
	}
	void document.getElementById('header-background').offsetWidth;
	document.getElementById('header-background').classList.add('theme-duration-bar');
	nextTheme++;
	if(nextTheme >= themes.length) {
		nextTheme = 0;
	}
	let imageLoaded = false;
	const nextImage = new Image();
	nextImage.onload = function() {
		imageLoaded = true;
	}
	nextImage.src = `${FILEPATH}${themes[nextTheme].image}`;
	setTimeout(function() {
		if(imageLoaded) {
			changeTheme(nextTheme);
			manageTheme();
		} else {
			nextImage.onload = function() {
				changeTheme(nextTheme);
	        	manageTheme();
			}
		}
		
    }, 30000);
}

document.addEventListener('DOMContentLoaded',function(event) {
	manageTheme();
});



// // Section title backgrounds
// var listenerAttached = false;

// var sectionTitles = document.getElementsByClassName('section-title');
// var lowestSetTitle = -1;

// function manageSectionTitleBackgrounds() {
// 	// Array.prototype.forEach.call(sectionTitles, title => {
// 	// 	if (title.getBoundingClientRect().top < 0) {

// 	// 	}

// 	for (var i = sectionTitles.length - 1; i >= 0; i--) {
// 		if (sectionTitles[i].getBoundingClientRect().top < 0) {
// 			for (var j = lowestSetTitle + 1; j <= i; j++) {
// 				sectionTitles[j].classList.add('bg-scroll');
// 			}
// 			for (var j = i + 1; j <= lowestSetTitle; j++) {
// 				sectionTitles[j].classList.remove('bg-scroll');
// 			}
// 			lowestSetTitle = i;
// 			break;
// 		} else if (i === 0) {
// 			for (var j = i; j <= lowestSetTitle; j++) {
// 				sectionTitles[j].classList.remove('bg-scroll');
// 			}
// 			lowestSetTitle = -1;
// 		}
// 	}
// }

// function manageScrollEventListener() {
// 	if (window.innerWidth > 800 && window.innerWidth > window.innerHeight) { // Only applies to landscape screens >800px wide
// 		if (!listenerAttached) {
// 			window.addEventListener('scroll', manageSectionTitleBackgrounds);
// 			listenerAttached = true;
// 		}
// 	} else {
// 		if (listenerAttached) {
// 			window.removeEventListener('scroll', manageSectionTitleBackgrounds);
// 			listenerAttached = false;
// 		}
// 	}
// }

// manageScrollEventListener();
// window.addEventListener('resize', manageScrollEventListener);