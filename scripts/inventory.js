var Inventory = (
	function()
	{
		var capacity = 500;
		var inventory = {};
		return {
			get inventory() {return inventory},
			
			initialize: function()
			{
				for (var key in items)
				{
					inventory[key] = {key: key, name: items[key].name, count: 0, average_price: 0, market_value: items[key].market_value};
				}
			},
			
			/**
				Buy'n'sell
			 */
			buy_item: function(name, amount, price)
			{
				if(amount < 0) return false;
				
				if(State_manager.get_state("player","money") >= price * amount)
				{
					if(Inventory.add_amount(name, amount, price))
					{
						State_manager.add_state("player","money",-price * amount);
					}
				}
			},
			
			sell_item: function(name, amount, price)
			{
				if(amount < 0) return false;
				
				// sell up to.
				var item_amount = Inventory.get_item(name).count;
				if(item_amount < amount)
				{
					if(Inventory.subtract_amount(name, item_amount))
					{
						State_manager.add_state("player","money",price * item_amount);
					}
				}
				else 
				{
					if(Inventory.subtract_amount(name, amount))
					{
						State_manager.add_state("player","money",price * amount);
					}
				}
			},
			
			/**
				Also updates the inventory_handler
			 */
			add_amount: function(key, amount, price = 0)
			{
				if(inventory[key])
				{
					inventory[key].average_price = (inventory[key].average_price * inventory[key].count + amount * price) / (inventory[key].count + amount);
					// safeguard
					if(isNaN(inventory[key].average_price)) inventory[key].average_price = 0;
					inventory[key].count += amount;
					// just in case
					if(inventory[key].count < 0 || isNaN(inventory[key].count)) 
					{
						inventory[key].count = 0; 
					}
					Inventory_handler.update();
					return true;
				}
				else 
				{
					Engine.log("Add Amount: item " + key + " doesn't exist.");
					return false;
				}
			},
			
			subtract_amount: function(key, amount)
			{
				if(inventory[key])
				{
					if(inventory[key].count >= amount)
					{
						inventory[key].count -= amount;
						if(inventory[key].count < 0) 
						{
							inventory[key].count = 0; 
						}
						Inventory_handler.update();
						return true;
					}
					else 
					{
						Engine.log("Subtract Amount: There aren't enough items to subtract.");
						return false;
					}
				}
				else 
				{
					Engine.log("Subtract Amount: item " + key + " doesn't exist.");
					return false;
				}
			},
			
			get_item: function(key)
			{
				if(inventory[key])
				{
					return inventory[key];
				}
				else 
				{
					Engine.log("Get Item: item " + key + " doesn't exist.");
				}
			}
		}
	}
)();

var items = {
	"cotton": {
		"name": "Cotton",
		"market_value": 2,
		"units": "bushels",
	},
	"cotton_cloth": {
		"name": "Cotton Cloth",
		"market_value": 12,
	},
	"cotton_thread": {
		"name": "Cotton Thread",
		"market_value": 8,
	},
	"flax": {
		"name": "Flax",
		"market_value": 2,
	},
	"linen_thread": {
		"name": "Linen Thread",
		"market_value": 8,
	},
	"linens": {
		"name": "Linens",
		"market_value": 10,
	},
	"velvet": {
		"name": "Velvet",
		"market_value": 38,
	},
	"wool": {
		"name": "Wool",
		"market_value": 2,
	},
	"yarn": {
		"name": "Yarn",
		"market_value": 8,
	},
	"hides": {
		"name": "Hides",
		"market_value": 18,
	},
	"leather": {
		"name": "Leather",
		"market_value": 28,
	},
}