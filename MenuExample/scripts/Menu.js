"use strict";

/**
 * @author Tim Duffey
 */

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
	this.isSelected = false;
}

/**
 * Creates a new instance of the `Menu` class.
 *
 * @constructor
 */
function Menu (menuItems, selectedMenuItemIndex) {
	/**
	 * Menu items array.
	 *
	 * @type {Array<MenuItem>}
	 */
	this.items = menuItems || [];
	this.selectItem(selectedMenuItemIndex, true);

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
			var menuItem = this.items[index];

			if (menuItem.title === title) {
				this.items.splice(index, 1);
				this._updateMenu();
				break;
			}
		}
	},

	selectItem: function (menuItemIndex, stopUpdateMenu) {
		var selMenuItemIndex = parseInt(menuItemIndex, 10) || 0;

		if (isNaN(selMenuItemIndex) || selMenuItemIndex >= this.items.length || selMenuItemIndex < 0) {
			selMenuItemIndex = this.items.length - 1;
		}

		for (var index = 0; index < this.items.length; index++) {
			var menuItem = this.items[index];
			menuItem.isSelected = index === selMenuItemIndex;
		}

		if (!stopUpdateMenu) {
			this._updateMenu();
		}
	},

	selectItemByUrl: function (url, stopUpdateMenu) {
		for (var index = 0; index < this.items.length; index++) {
			var menuItem = this.items[index];
			menuItem.isSelected = menuItem.url === url;
		}

		if (!stopUpdateMenu) {
			this._updateMenu();
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
			var menuItem = this.items[index];

			// Create the link element that will represent our menu item.
			var linkElement = document.createElement('a');
			linkElement.setAttribute('href', menuItem.url);
			linkElement.setAttribute('class', 'MenuItem');
			linkElement.setAttribute('data-index', index);
			linkElement.innerHTML = menuItem.title;

			// Create the list item container element to hold our menu item.
			var listItemElement = document.createElement('li');
			var classes = 'MenuItemContainer';
			if (menuItem.isSelected) {
				classes += ' selected';
			}
			listItemElement.setAttribute('class', classes);
			listItemElement.onclick = this._onMenuItemClick.bind(this);

			// Add the menu item to list item container.
			listItemElement.appendChild(linkElement);
			this.menuElement.appendChild(listItemElement);
		}
	},

	/**
	 * Menu item click handler.
	 *
	 * @param {Event} e Event object.
	 * @private
	 */
	_onMenuItemClick: function (e) {
		e.stopPropagation();
		var targetElement = e.currentTarget || e.target;
		var linkElement = targetElement.firstChild;
		window.location.href = linkElement.href;

		var menuItemIndex = linkElement.getAttribute('data-index');
		this.selectItem(menuItemIndex);
	}
};

/**
 * Creates and initializes an instance of the `Menu` class.
 *
 * @param {Element} menuContainerElement
 * @param {Array<MenuItem>} [menuItems] Array of `MenuItems`.
 * @returns {Menu} Returns the instance of `Menu` that gets created and initialized.
 */
window.initMenu = function (menuContainerElement, menuItems) {
	var menu = new Menu(menuItems);

	// Add the menu to the container.
	menuContainerElement.appendChild(menu.menuElement);

	return menu;
};
