/**
	Stores an amount of each item up to a certain set capacity;
	Each inventory can be used in multiple settings,
	Responsible for 
		Capacity!
		Managing aggregate items 
 */
function Inventory(capacity, infinite_storage = false)
{
	this.capacity = capacity;
	this.utilized_capacity = 0;
	
	this.infinite_storage = infinite_storage;
	
	this.items = {};
	for (var key in Item.prototype.items)
	{
		this.items[key] = new Item(key);
	}
}

Inventory.prototype.set_capacity = function(capacity)
{
	if(capacity > 0)this.capacity = capacity;
}

Inventory.prototype.add_capacity = function(capacity)
{
	if(capacity > 0)this.capacity += capacity;
}

Inventory.prototype.remove_capacity = function(capacity)
{
	if(capacity > 0)this.capacity -= capacity;
	if(this.capacity < 0) this.capacity = 0;
}

// add_amount returns the amount of items actually added
Inventory.prototype.add_amount = function(key, amount, price = 0)
{
	var item = this.get_item(key);
	
	if(item)
	{
		var item_amount = amount;
		
		// determine how much to add  
		if(!this.infinite_storage)
		{
			if(this.utilized_capacity >= this.capacity && amount > 0 && !this.infinite_storage)
			{
				item_amount = 0;
			}
			else if(this.utilized_capacity + amount > this.capacity && !this.infinite_storage)
			{
				item_amount = this.capacity - this.utilized_capacity;
			}
		}
		
		if(item_amount > 0)
		{
			item.add_amount(item_amount, price);
		}
		else if(item_amount < 0)
		{
			// we set it again if the actual amount added is less because it'll break a 'less than 0 rule
			item_amount = -item.remove_amount(-item_amount, price);
		}
		this.utilized_capacity += item_amount;
		
		return item_amount;
	}
	else 
	{
		Engine.log(`Inventory.add_amount: item ${key} doesn't exist.`);
		return 0;
	}
}

Inventory.prototype.get_item = function(key)
{
	if(this.items[key])
	{
		return this.items[key];
	}
	else 
	{
		Engine.log(`Inventory.get_item: item ${key} doesn't exist.`);
	}
}

Inventory.prototype.get_amount = function(key)
{
	if(this.items[key])
	{
		return this.items[key].amount;
	}
	else 
	{
		Engine.log(`Inventory.get_amount: item ${key} doesn't exist.`);
	}
}

Inventory.prototype.get_total_value = function()
{
	var total_value = 0;
	for(var key in this.items)
	{
		total_value += this.items[key].get_total_market_value();
	}
	
	return total_value;
}

/**
	Used in re-integritizing
*/

Inventory.prototype.recalculate_utilized_capacity = function()
{
	this.utilized_capacity = 0;
	for(var key in this.Item.prototype.items)
	{
		this.utilized_capacity += this.items[key].amount;
	}
	
}

/**
	An item.
	Responsible for keeping track of how much we have, also adding and subtracting.
 */
function Item(key)
{
	var item = this.items[key];
	if(!item) 
	{
		// Silent failures aren't the best solution, but they're better than random game breaking.
		Engine.log(`Item: key '${key}' not found in Item.prototype.items`);
		return null;
	}
	this.key = key;
	this.name = item.name;
	this.amount = 0;
	this.price = item.market_value;
	this.average_price = 0;
	this.market_value = item.market_value;
}

Item.prototype.items = {
	"cotton": {
		"name": "Cotton",
		"type": "raw",
		"category": "raw_material",
		"market_value": 2,
		"icon": "resource_cotton",
	},
	"cotton_cloth": {
		"name": "Cotton Cloth",
		"type": "processed",
		"category": "tailoring_supplies",
		"market_value": 12,
		"icon": "resource_cotton_cloth",
	},
	"cotton_thread": {
		"name": "Cotton Thread",
		"type": "processed",
		"category": "tailoring_supplies",
		"market_value": 8,
		"icon": "resource_cotton_thread",
	},
	"cotton_shirt": { // based off of petticoat cost at 4s/6d
		"name": "Cotton Shirt",
		"type": "manufactured",
		"category": "shirt",
		"market_value": 60,
		"annual_demand_per_pop":2, 
		"icon": "resource_cotton_shirt",
	},
	"hides": {
		"name": "Hides",
		"type": "raw",
		"market_value": 18,
		"icon": "resource_hides",
	},
	"leather": {
		"name": "Leather",
		"type": "processed",
		"market_value": 28,
		"icon": "resource_leather",
	},
	"flax": {
		"name": "Flax",
		"type": "raw",
		"market_value": 2,
		"icon": "resource_cotton",
	},
	"linen_thread": {
		"name": "Linen Thread",
		"type": "processed",
		"market_value": 8,
		"icon": "resource_cotton",
	},
	"linens": {
		"name": "Linens",
		"type": "processed",
		"market_value": 10,
		"icon": "resource_cotton",
	},
	"velvet": {
		"name": "Velvet",
		"type": "processed",
		"market_value": 38,
		"icon": "resource_cotton",
	},
	"wool": {
		"name": "Wool",
		"type": "raw",
		"market_value": 2,
		"icon": "resource_cotton",
	},
	"yarn": {
		"name": "Yarn",
		"type": "processed",
		"market_value": 8,
		"icon": "resource_cotton",
	},	
}

Item.prototype.add_amount = function(amount, price = 0)
{
	if(amount < 0) return;
	
	this.average_price = ((this.average_price * this.amount) + (amount * price)) / (this.amount + amount);
	// for dividing by 0 (removing EVERYTHING) situations
	if(isNaN(this.average_price) || this.average_price === Infinity) this.average_price = 0;
	
	// add AFTER calculating average_price, otherwise we'd need an old_price
	this.amount += amount;
	
	return amount;
}

Item.prototype.remove_amount = function(amount)
{
	if(amount < 0) return;
	
	if(this.amount < amount)
	{
		var amount_removed = this.amount;
		this.amount = 0;
		
		return amount_removed;
	}
	
	this.amount -= amount;
	
	return amount;
}

Item.prototype.get_total_market_value = function()
{
	return this.amount * this.market_value;
}