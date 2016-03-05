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

	/**
	 * Select a `MenuItem` by index.
	 *
	 * @param {number} [menuItemIndex=0] Index of the `MenuItem` to select.
	 * @param {boolean} [stopUpdateMenu=false] If true, stops the HTML of the `Menu` from being updated. This is a flag
	 *      used for performance so we don't constantly update the DOM in the browser.
	 * @returns {MenuItem} Returns the selected `MenuItem`.
	 */
	selectItem: function (menuItemIndex, stopUpdateMenu) {
		var selMenuItem;
		var selMenuItemIndex = parseInt(menuItemIndex, 10) || 0;

		if (isNaN(selMenuItemIndex) || selMenuItemIndex < 0) {
			// If no valid menu index was given, select the first menu item.
			selMenuItemIndex = 0;
		} else if (selMenuItemIndex >= this.items.length) {
			// If the given menu index is greater than the number of items in the menu, default to the last menu item.
			selMenuItemIndex = this.items.length - 1;
		}

		for (var index = 0; index < this.items.length; index++) {
			var menuItem = this.items[index];
			menuItem.isSelected = index === selMenuItemIndex;

			if (menuItem.isSelected) {
				selMenuItem = menuItem;
			}
		}

		if (!stopUpdateMenu) {
			this._updateMenu();
		}

		return selMenuItem;
	},

	/**
	 * Select a `MenuItem` by its URL.
	 *
	 * @param {string} [url] URL of the `MenuItem` to select.
	 * @param {boolean} [stopUpdateMenu=false] If true, stops the HTML of the `Menu` from being updated. This is a flag
	 *      used for performance so we don't constantly update the DOM in the browser.
	 * @returns {MenuItem} Returns the selected `MenuItem`.
	 */
	selectItemByUrl: function (url, stopUpdateMenu) {
		var selMenuItem;

		for (var index = 0; index < this.items.length; index++) {
			var menuItem = this.items[index];
			menuItem.isSelected = menuItem.url === url;

			if (menuItem.isSelected) {
				selMenuItem = menuItem;
			}
		}

		if (!selMenuItem) {
			selMenuItem = this.items[0];
			selMenuItem.isSelected = true;
		}

		if (!stopUpdateMenu) {
			this._updateMenu();
		}

		return selMenuItem;
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
 * @param {number} [selectedMenuItemIndex] Index of the `MenuItem` to select when the `Menu` is initialized.
 * @returns {Menu} Returns the instance of `Menu` that gets created and initialized.
 */
window.initMenu = function (menuContainerElement, menuItems, selectedMenuItemIndex) {
	selectedMenuItemIndex = selectedMenuItemIndex || 0;
	var menu = new Menu(menuItems, selectedMenuItemIndex);

	// Add the menu to the container.
	menuContainerElement.appendChild(menu.menuElement);

	return menu;
};
