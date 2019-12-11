/**
	Takes some input and creates something out of it.
 */
function Producer(type_key, production_option = 0)
{
	if(!this.types[type_key])
	{
		Engine.log(`Producer: there is no such producer ${type_key}.`);
		MapObject.call(this,1,1);
	}
	
	MapObject.call(this,this.types[type_key].width,this.types[type_key].height);
	this.type_key = type_key;
	this.type = this.types[type_key];
	this.image = Engine.assets[this.type.image];
	this.productivity = this.type.productivity;
	this.recipe = this.type.production[production_option];
}

Producer.prototype = Object.create(MapObject.prototype);
Object.defineProperty(Producer.prototype, 'constructor', {
	value: Producer,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

Producer.prototype.types = {
	"spinster": {
		name: "Spinster",
		width: 1,
		height: 1,
		image: "spinster",
		icon: "spinster",
		// different options of production with recipes 
		production: ["thread"],
		productivity: 0.15,
		price: 0,
		upkeep: 18,
		type: "human",
		skill: "skilled",
		description: "A humble spinster to turn fiber into thread. 18d/day",
	},
	// RR(Research Confirmed)
	// weaver: 0.67 cloth per day
	"weaver": {
		name: "Weaver",
		width: 1,
		height: 1,
		image: "weaver",
		icon: "weaver",
		production: ["cloth"],
		productivity: 0.06,
		price: 0,
		upkeep: 31,
		type: "human",
		skill: "skilled",
		description: "How many weaves can a weaver weave if a weaver could weave wool? 31d/day",
	},
	"tanner": {
		name: "Tanner",
		width: 2,
		height: 1,
		image: "tanner",
		icon: "tanner_icon",
		production: ["leather"],
		productivity: 0.04,
		price: 0,
		upkeep: 31,
		type: "human",
		skill: "skilled",
		description: "Strong, tough, and covered in tannins. 31d/day",
	}
}

Producer.prototype.recipes = {
	"thread": 
	{
		name: "Cotton -> Cotton Thread",
		input: {"cotton":1},
		output: {"cotton_thread":2},
	},
	"cloth": 
	{
		name: "Cotton Thread -> Cotton Cloth",
		input: {"cotton_thread":1},
		output: {"cotton_cloth":1},
	},
	"leather": 
	{
		name: "Hides -> Leather",
		input: {"hides":1},
		output: {"leather":1},
	},
}

Producer.prototype.ANIMATION_COOLDOWN = 1000;

Producer.prototype.draw = function(context,x,y)
{
	if(this.occupiedTiles)
	{
		var grid_x = this.occupiedTiles[0].x;
		var grid_y = this.occupiedTiles[0].y;
		if(this.image)
		{
			context.drawImage(this.image
				,x + grid_x * Map.prototype.TILE_WIDTH
				,y + grid_y * Map.prototype.TILE_HEIGHT
				,Map.prototype.TILE_WIDTH * this.width 
				,Map.prototype.TILE_HEIGHT * this.height);
		}
	}
}

/*
	TODO
	DEPRECATE BY CENTRALIZING THROUGH CATEGORIES IN Industry_handler
	ALSO PRODUCTION OPTIONS
 */
/*
Producer.prototype.tick = function()
{
	// get time of day 
	if(Time_handler.get_day_stage() === "night") return;
	// production
	var production = this.lookupRecipe(this.recipe);
	
	// limit rate based on availible inputs
	var productivity = this.productivity;
	var limited_throughput_rate = productivity;
	for(key in production.input)
	{
		// or, if autobuy is on...
		if(Inventory_handler.inventory.get_item(key).amount < production.input[key] * productivity)
		{
			if(Industry_handler.settings.autobuy)
			{
				var missing_amount = production.input[key] * productivity - Inventory_handler.inventory.get_item(key).amount;
				Inventory_handler.buy_item(key, missing_amount, Inventory_handler.inventory.get_item(key).price);
			}
		}
		
		limited_throughput_rate = Math.min(limited_throughput_rate,Inventory_handler.inventory.get_item(key).amount / (production.input[key] * productivity))
	}
	
	// now start subtracting
	for(key in production.input)
	{
		Inventory_handler.inventory.add_amount(key,-production.input[key] * limited_throughput_rate);
	}
	
	// and then producing!
	for(key in production.output)
	{
		Inventory_handler.inventory.add_amount(key,production.output[key] * limited_throughput_rate);
	}
}

*/

Producer.prototype.lookupRecipe = function(key)
{
	return Producer.prototype.recipes[key];
}

Producer.prototype.lookupType = function(key)
{
	return Producer.prototype.types[key];
}