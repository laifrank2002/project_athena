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
					inventory[key] = {name: items[key].name, count: 0, average_price: 0, market_value: items[key].market_value};
				}
			},
			
			/**
				Use a negative amount in order to substract.
				Also updates the inventory_handler
			 */
			add_amount: function(key, amount)
			{
				if(inventory[key])
				{
					inventory[key].count += amount;
					if(inventory[key].count < 0) inventory[key].count = 0; 
					
					Inventory_handler.update();
				}
				else 
				{
					Engine.log("Add Amount: item " + key + " doesn't exist.");
				}
			}
		}
	}
)();

var items = {
	"cotton": {
		"name": "Cotton",
		"market_value": 2,
	},
	"cotton_fabric": {
		"name": "Cotton Fabric",
		"market_value": 12,
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
	"thread": {
		"name": "Thread",
		"market_value": 8,
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
}