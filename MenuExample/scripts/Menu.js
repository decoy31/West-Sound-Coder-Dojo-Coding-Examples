"use strict";

/**
 * Creates a new instance of the `MenuItem` class.
 *
 * @param {string} title Title of the menu item.
 * @param {string} url Url of the menu item.
 * @constructor
 */
function MenuItem (title, url) {
	this.title = title;
	this.url = url;
}

/**
 * Creates a new instance of the `Menu` class.
 *
 * @constructor
 */
function Menu (menuItems) {
	/**
	 * Menu items array.
	 *
	 * @type {Array<MenuItem>}
	 */
	this.items = menuItems || [];

	var menuElement = document.createElement('ul');
	menuElement.setAttribute('class', 'Menu');

	/**
	 * DOM element that represents our `Menu` instance.
	 * 
	 * @type {Element}
	 */
	this.menuElement = menuElement;

	// Update the menu with the new menu items.
	this._updateMenu();
}

Menu.prototype = {
	/**
	 * Adds an item to the `Menu`.
	 *
	 * @param {string} title
	 * @param {string} url
	 */
	addItem: function (title, url) {
		var menuItem = new MenuItem(title, url);
		this.items.push(menuItem);
		this._updateMenu();
	},

	/**
	 * Removes an item from the `Menu`.
	 *
	 * @param {string} title Title of the item to be removed.
	 */
	removeItem: function (title) {
		for (var index = 0; index < this.items.length; index++) {
			if (this.items[index].title === title) {
				this.items.splice(index, 1);
				this._updateMenu();
				break;
			}
		}
	},

	/**
	 * Iterates over the menu items and updates the DOM representation of the menu instance accordingly.
	 * 
	 * @private
	 */
	_updateMenu: function () {
		this.menuElement.innerHTML = '';
		
		for (var index = 0; index < this.items.length; index++) {
			// Create the link element that will represent our menu item.
			var linkElement = document.createElement('a');
			linkElement.setAttribute('href', this.items[index].url);
			linkElement.setAttribute('class', 'MenuItem');
			linkElement.setAttribute('data-index', index);
			linkElement.innerHTML = this.items[index].title;

			// Create the list item container element to hold our menu item.
			var listItemElement = document.createElement('li');
			listItemElement.setAttribute('class', 'MenuItemContainer');

			// Add the menu item to list item container.
			listItemElement.appendChild(linkElement);
			this.menuElement.appendChild(listItemElement);
		}
	}
};

/**
 * Initializes an instance of the `Menu` class.
 *
 * @param {Element} menuContainerElement
 * @param {Array<MenuItem>} [menuItems] Array of `MenuItems`.
 */
window.initMenu = function (menuContainerElement, menuItems) {
	var menu = new Menu(menuItems);

	// Add the menu to the container.
	menuContainerElement.appendChild(menu.menuElement);
};
