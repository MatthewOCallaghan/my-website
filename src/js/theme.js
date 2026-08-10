var themes = [
	{
		image: '/images/themes/london.jpg',
		colour: '#FF0000',
		location: 'London, United Kingdom'
	},
	{
		image: '/images/themes/new-york.jpg',
		colour: '#FC8206',
		location: 'New York City, USA'
	},
	{
		image: '/images/themes/venice.png',
		colour: '#00BFFF',
		location: 'Venice, Italy'
	},
	{
		image: '/images/themes/malta.png',
		colour: '#4CBD08',
		location: 'Sliema, Malta'
	},
	{
		image: '/images/themes/paris.png',
		colour: '#AF9348',
		location: 'Paris, France'
	},
	{
		image: '/images/themes/naples.png',
		colour: '#E9CE14',
		location: 'Naples, Italy'
	}
];

var nextTheme = 0;

// scripts/generate-webp.js generates a .webp sibling for every jpg/png at build time.
function webpImage(image) {
	return image.replace(/\.(jpe?g|png)$/i, '.webp');
}

// Resolving the format here (rather than via CSS image-set()) matters: --background-image
// only ever holds a plain url(), which keeps `transition: background-image` working. Chromium
// doesn't animate background-image at all once the value is an image-set() (tested directly:
// no transitionstart/transitionend fires), so image-set() can't be used on this property.
function supportsWebp() {
	var canvas = document.createElement('canvas');
	if (!(canvas.getContext && canvas.getContext('2d'))) return false;
	return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

var webpSupported = supportsWebp();

function themeImage(theme) {
	return webpSupported ? webpImage(theme.image) : theme.image;
}

function changeTheme(newThemeIndex) {
	var newTheme = themes[newThemeIndex];

	document.getElementById('image-location').innerHTML = newTheme.location;

	if(document.getElementsByTagName('style').length) {
		document.getElementsByTagName('style')[0].remove();
	}
	var style = document.createElement('style');
	style.innerHTML = `:root { --colour: ${newTheme.colour}; --background-image: url("${themeImage(newTheme)}"); } header #header-background {background-color: ${newTheme.colour}1A}`;
	document.body.appendChild(style);
}

function manageTheme() {
	
	// Browser optimisations mess with my removing and re-adding the class theme-duration-bar
	// `offsetWidth` forces a reflow and we do this before and after removing the class to ensure all changes are flushed
	// Safari was particularly difficult and required both these steps, whereas Chrome only required the second
	void document.getElementById('header-background').offsetWidth;

	if(document.getElementById('header-background').classList) {
		document.getElementById('header-background').classList.remove('theme-duration-bar');
	}
	
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
	nextImage.src = themeImage(themes[nextTheme]);
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