"use strict";

var ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {

	var siteMenuClone = function () {
		// Copy menu to mobile menu
		document.querySelectorAll('.js-clone-nav').forEach(function (element) {
			const newElement = element.cloneNode(true);
			const targetElement = document.querySelector('.site-mobile-menu-body');
			newElement.setAttribute('class', 'site-nav-wrap');
			targetElement.appendChild(newElement);
		});

		const handleCollapsing = function(e) {
			const collapse = e.target.closest('li').querySelector('.collapse');
			if (collapse.classList.contains('show')) {
				collapse.classList.remove('show');
			} else {
				collapse.classList.add('show');
			}
			e.preventDefault();
		};

		// Enable collapsing of child-menus
		setTimeout(function () {
			var counter = 0;
			document.querySelectorAll('.site-mobile-menu .has-children').forEach(function (element) {
				const arrow = document.createElement("span");
				arrow.className = 'arrow-collapse collapsed';
				arrow.setAttribute('data-toggle', 'collapse');
				arrow.setAttribute('data-target', '#collapseItem' + counter);
				arrow.addEventListener('click', handleCollapsing);
				element.prepend(arrow);

				const ul = element.querySelector('ul');
				ul.setAttribute('class', 'collapse');
				ul.setAttribute('id', 'collapseItem' + counter);

				counter++;
			});

			document.querySelectorAll('.site-mobile-menu .collapse-link').forEach(function(element) {
				element.addEventListener('click', handleCollapsing);
			});
		}, 1000);

		// Close mobile menu when resizing to tablet
		window.addEventListener('resize', function(e) {
			if (window.innerWidth > 992) {
				document.body.classList.remove('offcanvas-menu');
			}
		});

		// Open and close mobile menu
		document.querySelectorAll('.js-menu-toggle').forEach(function (element) {
			element.addEventListener('click', function(e) {
				e.preventDefault();
	
				if (document.body.classList.contains('offcanvas-menu')) {
					document.body.classList.remove('offcanvas-menu');
					e.target.classList.remove('active');
				} else {
					document.body.classList.add('offcanvas-menu');
					e.target.classList.add('active');
				}
			});
		});
		
		// Closing the mobile menu by clicking outside
		document.addEventListener('mouseup', function(e) {
			const container = document.querySelector('.site-mobile-menu');
			if (!container.contains(e.target)) {
				if (document.body.classList.contains('offcanvas-menu')) {
					document.body.classList.remove('offcanvas-menu');
				}
			}
		});
	};
	siteMenuClone();
});