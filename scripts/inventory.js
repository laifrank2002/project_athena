/**
	Stores an amount of each item up to a certain set capacity;
	Each inventory can be used in multiple settings.
	Ie
		Player
		City Warehouses
		Ships?
 */
function Inventory(capacity, infinite_storage = false)
{
	this.capacity = capacity;
	this.utilized_capacity = 0;
	
	this.infinite_storage = infinite_storage;
	
	this.items = {};
	for (var key in items)
	{
		this.items[key] = {key: key
			,name: items[key].name
			,count: 0
			,price: items[key].market_value
			,average_price: 0
			,market_value: items[key].market_value};
	}
}

Inventory.prototype.setCapacity = function(capacity)
{
	if(capacity > 0)
	{
		this.capacity = capacity;
	}
}

Inventory.prototype.addCapacity = function(capacity)
{
	if(capacity > 0)
	{
		this.capacity += capacity;
	}
}

Inventory.prototype.removeCapacity = function(capacity)
{
	if(capacity > 0)
	{
		this.capacity -= capacity;
	}
	
	if(this.capacity < 0) this.capacity = 0;
}

// todo, migrate in order for a more friendly market solution
/*
Inventory.prototype.buyItem = function(name, amount, price)
{
	if(amount < 0) return false;
	
	if(State_manager.get_state("player","money") >= price * amount)
	{
		// You CAN'T buy items over limit.
		var item_amount = amount;
		if(this.utilized_capacity + amount > this.capacity)
		{
			item_amount = this.capacity - this.utilized_capacity;
		}
		
		if(this.addAmount(name,item_amount,price))
		{
			State_manager.add_state("player","money",-price*item_amount);
			return true;
		}	
	}
}
*/
/*
Inventory.prototype.sellItem = function(name, amount, price)
{
	if(amount < 0) return false;
	
	var item_amount = this.getItem(name).count;
	if(item_amount < amount)
	{
		if(this.addAmount(name, -item_amount))
		{
			State_manager.add_state("player","money",price * item_amount);
		}
	}
	else 
	{
		if(this.addAmount(name, -amount))
		{
			State_manager.add_state("player","money",price * amount);
		}
	}
}
*/
/**
	Attempts to transfer some amount from one inventory to another.
	Will transfer FROM PASSED inventory TO THIS inventory.
 */
/*
Inventory.prototype.transferAmount = function(key, amount, price = 0, inventory)
{
	var first_item = this.getItem(key);
	var second_item = inventory.getItem(key);
	// validate first 
	if(!first_item || !second_item)
	{
		Engine.log(`Inventory.transferAmount: item ${key} doesn't exist in one or more inventories.`);
	}
	
	var item_amount = amount;
	if(second_item.count < item_amount)
	{
		item_amount = second_item.count;
	}
	
	this.addAmount(key,item_amount,price);
	inventory.addAmount(key,-item_amount,price);
}
*/
// addAmount returns the amount of items actually added
Inventory.prototype.addAmount = function(key, amount, price = 0)
{
	var item = this.items[key];
	
	if(item)
	{
		item.average_price = (item.average_price * item.count + amount * price) / (item.count + amount);
		
		// safeguard on avg. price
		if(isNaN(item.average_price) || item.average_price === Infinity) 
		{
			item.average_price = 0;
		}
		
		// if already exceed capacity AND trying to add something , then do nothing
		if(this.utilized_capacity >= this.capacity && amount > 0)
		{
			return 0;
		}
		else if(this.utilized_capacity + amount > this.capacity && !this.infinite_storage)
		{
			// else  add items && discard overlimit if set to limited storage 
			var item_amount = this.capacity - this.utilized_capacity;
			item.count += item_amount;
			this.utilized_capacity += item_amount;
			
			return item_amount;
		}
		else 
		{
			item.count += amount;
			this.utilized_capacity += amount;
			
			return amount;
		}
		
		// safeguard on item count
		if(item.count < 0 || isNaN(item.count))
		{
			item.count = 0;
		}
	}
	else 
	{
		Engine.log(`Inventory.addAmount: item ${key} doesn't exist.`);
		return 0;
	}
}

Inventory.prototype.getItem = function(key)
{
	if(this.items[key])
	{
		return this.items[key];
	}
	else 
	{
		Engine.log(`Inventory.getItem: item ${key} doesn't exist.`);
	}
}
Inventory.prototype.getTotalValue = function()
{
	var total_value = 0;
	for(var key in this.items)
	{
		total_value += this.items[key].count * this.items[key].market_value;
	}
	
	return total_value;
}

/**
	Used in verifying integrity during
		Saving
		Loading
 */

Inventory.prototype.recalculate_utilized_capacity = function()
{
	this.utilized_capacity = 0;
	for(var key in this.items)
	{
		this.utilized_capacity += this.items[key].count;
	}
	
}

/**
	An item.
	Pure data.
 */
function Item()
{
	
}
/*
	Where all the items are defined, with the following *IMPORTANT* properties
		name - display name 
		market_value - base price 
		elasticity - %change, so then for every %change in price, there is a %elasticity change in price.
			raw resources are low, finished goods are high elasticities. 
		icon - image icon 
 */
var items = {
	"cotton": {
		"name": "Cotton",
		"market_value": 2,
		"elasticity": 0.1,
		"icon": "resource_cotton",
	},
	"cotton_cloth": {
		"name": "Cotton Cloth",
		"market_value": 12,
		"elasticity": 0.9,
		"icon": "resource_cotton_cloth",
	},
	"cotton_thread": {
		"name": "Cotton Thread",
		"market_value": 8,
		"elasticity": 0.7,
		"icon": "resource_cotton_thread",
	},
	
	"flax": {
		"name": "Flax",
		"market_value": 2,
		"elasticity": 0.2,
		"icon": "resource_cotton",
	},
	"linen_thread": {
		"name": "Linen Thread",
		"market_value": 8,
		"elasticity": 0.6,
		"icon": "resource_cotton",
	},
	"linens": {
		"name": "Linens",
		"market_value": 10,
		"elasticity": 1.2,
		"icon": "resource_cotton",
	},
	"velvet": {
		"name": "Velvet",
		"market_value": 38,
		"elasticity": 4.2,
		"icon": "resource_cotton",
	},
	"wool": {
		"name": "Wool",
		"market_value": 2,
		"elasticity": 0.05,
		"icon": "resource_cotton",
	},
	"yarn": {
		"name": "Yarn",
		"market_value": 8,
		"elasticity": 0.3,
		"icon": "resource_cotton",
	},
	"hides": {
		"name": "Hides",
		"market_value": 18,
		"elasticity": 0.01,
		"icon": "resource_cotton",
	},
	"leather": {
		"name": "Leather",
		"market_value": 28,
		"elasticity": 0.5,
		"icon": "resource_cotton",
	},
	
}