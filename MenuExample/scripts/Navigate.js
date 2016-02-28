"use strict";

/**
 * @author Tim Duffey
 */

/**
 * Applies the "hidden" class to all section type elements on the page.
 */
function hideAllSectionElements () {
	var sectionElements = document.getElementsByTagName('section');

	for (var index = 0; index < sectionElements.length; index++) {
		var sectionElement = sectionElements[index];

		if (sectionElement.className.indexOf('hidden') === -1) {
			sectionElement.className += ' hidden';
		}
	}
}

/**
 * Gets the associated section element on the page that has a `data-hash-key` attribute that matches the passed in value
 * in the `urlHashKey` parameter.
 *
 * @param {string} urlHashKey A string that begins with the hash/pound symbol ("#").
 * @returns {Element} Returns the associated DOM section element.
 */
function getAssociatedSectionElement (urlHashKey) {
	var sectionElements = document.getElementsByTagName('section');
	var associatedSectionElement;

	// Iterate over the section elements on the page and find the associated section element that has a `data-hash-key`
	// attribute that matches the `urlHashKey`.
	for (var index = 0; index < sectionElements.length; index++) {
		var sectionElement = sectionElements[index];

		if (sectionElement) {
			var elementHashKey = '#' + sectionElement.getAttribute('data-hash-key');

			if (elementHashKey === urlHashKey) {
				associatedSectionElement = sectionElement;
				break;
			}
		}
	}

	if (!associatedSectionElement) {
		// If no associated section elements were found, use the first section element.
		associatedSectionElement = sectionElements[0];
	}

	return associatedSectionElement;
}

/**
 * Shows the section element associated with the passed in hash key.
 *
 * @param {string} urlHashKey A string that begins with the hash/pound symbol ("#").
 */
function showAssociatedSectionElement (urlHashKey) {
	var associatedSectionElement = getAssociatedSectionElement(urlHashKey);

	if (associatedSectionElement.className.indexOf('hidden') >= 0) {
		// Show the associated section element.
		associatedSectionElement.className = associatedSectionElement.className.replace(' hidden', '');
	}
}

/**
 * Selects the menu item associated with the hash key.
 *
 * @param {Menu} menu `Menu` class instance.
 * @param {string} hashKey A string that begins with the hash/pound symbol ("#").
 */
function selectMenuItemByHashKey (menu, hashKey) {
	menu.selectItemByUrl(hashKey);
}

/**
 * Handler for a location hash change event.
 */
function onLocationHashChanged () {
	hideAllSectionElements();
	var urlHashKey = window.location.hash;
	showAssociatedSectionElement(urlHashKey);
}

/**
 * Initializes the navigation handlers for the page.
 *
 * @param {Menu} menu `Menu` class instance.
 */
window.initNavigation = function (menu) {
	if ('onhashchange' in window) {
		// Wait for the hash to change in the URL, then execute our handler.
		window.onhashchange = onLocationHashChanged;
	}

	hideAllSectionElements();
	showAssociatedSectionElement(window.location.hash);

	if (menu) {
		selectMenuItemByHashKey(menu, window.location.hash);
	}
};
