// Adds [className] to class list of #work-list when it is wide enough to lay out work-item horizontally
// Its width is dependent on both screen width and height (due to section titles being affected by height) so I could not find a way to do this in CSS (media queries) alone

const className = "row-layout"

function setOrder() {
    var workList = document.getElementById("work-list");
    if (workList) {
        if (workList.offsetWidth * 0.4 < 240) { // Both halves of .work-item have a min width of 240 and they have padding either side of 5%, thus 40% of #work-list width needs to be >=240
            workList.classList.remove(className);
        } else {
            workList.classList.add(className);
        }
    }
    
}

setOrder();
window.addEventListener('resize', setOrder);
document.addEventListener('DOMContentLoaded', function(event) {
	setOrder();
});
window.onload = setOrder;