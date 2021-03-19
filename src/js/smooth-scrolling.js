// Adapted from CSS Tricks
$(document).ready(function() {

	// Select all links with hashes
	$('a.smooth-scroll[href*="#"]')
	
		// Remove links that don't actually link to anything
		.not('[href="#"]')
		.click(function(event) {

	  		// On-page links
			if (
			    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
			    && 
			    location.hostname == this.hostname
			) {

			    // Find element to scroll to
				var hash = this.hash;
			    var target = $(hash);
			    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			    
			    if (target.length) {

					console.log(target.offset().top);

			    	// Only prevent default if animation is actually going to happen
			    	event.preventDefault();
			    	$('html, body').animate({
			    	  scrollTop: target.offset().top
			    	}, 1000, function() {
			    		// Set URL
			    		window.location.hash = hash;

			    		// Set focus
			    		var $target = $(target);
			    		$target.focus();
			    		if ($target.is(":focus")) { // Checking if the target was focused
			    			return false;
			    		} else {
			    			$target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
			    			$target.focus(); // Set focus again
			    		}
			    	});
			    }
	    	}
		});
});