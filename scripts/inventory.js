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
// todo, migrate in order for a more friendly market solution

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

/**
	Attempts to transfer some amount from one inventory to another.
	Will transfer FROM PASSED inventory TO THIS inventory.
 */
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

Inventory.prototype.addAmount = function(key, amount, price = 0)
{
	var item = this.items[key];
	
	if(item)
	{
		item.average_price = (item.average_price * item.count + amount * price) / (item.count + amount);
		
		// safeguard on avg. price
		if(isNaN(item.average_price) || item.average_price === Infinity) item.average_price = 0;
		
		// add items && discard overlimit if set to limited storage 
		if(this.utilized_capacity + amount > this.capacity && !this.infinite_storage)
		{
			var item_amount = this.capacity - this.utilized_capacity;
			item.count += item_amount;
			this.utilized_capacity += item_amount;
		}
		else 
		{
			item.count += amount;
			this.utilized_capacity += amount;
		}
		// safeguard on item count 
		if(item.count < 0 || isNaN(item.count))
		{
			item.count = 0;
		}
		return true;
	}
	else 
	{
		Engine.log(`Inventory.addAmount: item ${key} doesn't exist.`);
		return false;
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

var items = {
	"cotton": {
		"name": "Cotton",
		"market_value": 2,
		"icon": "resource_cotton",
	},
	"cotton_cloth": {
		"name": "Cotton Cloth",
		"market_value": 12,
		"icon": "resource_cotton_cloth",
	},
	"cotton_thread": {
		"name": "Cotton Thread",
		"market_value": 8,
		"icon": "resource_cotton_thread",
	},
	/*
	"flax": {
		"name": "Flax",
		"market_value": 2,
		"icon": "resource_cotton",
	},
	"linen_thread": {
		"name": "Linen Thread",
		"market_value": 8,
		"icon": "resource_cotton",
	},
	"linens": {
		"name": "Linens",
		"market_value": 10,
		"icon": "resource_cotton",
	},
	"velvet": {
		"name": "Velvet",
		"market_value": 38,
		"icon": "resource_cotton",
	},
	"wool": {
		"name": "Wool",
		"market_value": 2,
		"icon": "resource_cotton",
	},
	"yarn": {
		"name": "Yarn",
		"market_value": 8,
		"icon": "resource_cotton",
	},
	"hides": {
		"name": "Hides",
		"market_value": 18,
		"icon": "resource_cotton",
	},
	"leather": {
		"name": "Leather",
		"market_value": 28,
		"icon": "resource_cotton",
	},
	*/
}