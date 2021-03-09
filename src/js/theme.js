var themes = [
	{
		image: 'images/themes/london.jpg',
		colour: '#FF0000',
		location: 'London, United Kingdom'
	},
	{
		image: 'images/themes/new-york.jpg',
		colour: '#FC8206',
		location: 'New York City, USA'
	},
	{
		image: 'images/themes/venice.png',
		colour: '#00BFFF',
		location: 'Venice, Italy'
	},
	{
		image: 'images/themes/malta.png',
		colour: '#4CBD08',
		location: 'Sliema, Malta'
	},
	{
		image: 'images/themes/paris.png',
		colour: '#AF9348',
		location: 'Paris, France'
	},
	{
		image: 'images/themes/naples.png',
		colour: '#E9CE14',
		location: 'Naples, Italy'
	}
];

var nextTheme = 0;

function changeTheme(newThemeIndex) {
	var newTheme = themes[newThemeIndex];

	document.getElementById('image-location').innerHTML = newTheme.location;

	if(document.getElementsByTagName('style').length) {
		document.body.removeChild(document.getElementsByTagName('style')[0]);
	}
	var style = document.createElement('style');
	style.innerHTML = `header #header-background-image, .bg-ti, .section-title {background-image: url("${newTheme.image}");} .pc, a, .pc-hover:hover {color: ${newTheme.colour};} .bg-pc, .bg-pc-hover:hover {background-color: ${newTheme.colour};} .bc-pc, .bc-pc-hover:hover, header .theme-duration-bar::after {border-color: ${newTheme.colour};} header #header-background {background-color: ${newTheme.colour}1A} .outline-pc:focus {outline: auto ${newTheme.colour}}`;
	document.body.appendChild(style);
}

function manageTheme() {
	if(document.getElementById('header-background').classList) {
		document.getElementById('header-background').classList.remove('theme-duration-bar');
	}
	
	// Forces browser to remove theme-duration-bar before continuing with script (this is because it must make changes in order to calculate offsetWidth)
	// Otherwise browser would only make changes at end of script and it would see class has been removed and added again, so nothing has changed, so it would do nothing
	void document.getElementById('header-background').offsetWidth; 


	document.getElementById('header-background').classList.add('theme-duration-bar');
	nextTheme++;
	if(nextTheme >= themes.length) {
		nextTheme = 0;
	}
	var imageLoaded = false;
	var nextImage = new Image();
	nextImage.onload = function() {
		imageLoaded = true;
	}
	nextImage.src = themes[nextTheme].image;
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

document.addEventListener('DOMContentLoaded', function(event) {
	manageTheme();
});