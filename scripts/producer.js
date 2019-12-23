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
		production: ["cotton_thread"],
		productivity: 0.15,
		price: 0,
		upkeep: 18,
		type: "human",
		skill: "skilled",
		description: "A humble spinster to turn fiber into thread. 18d/day",
		palette: true,
	},
	// RR(Research Confirmed)
	// weaver: 0.67 cloth per day
	"weaver": {
		name: "Weaver",
		width: 1,
		height: 1,
		image: "weaver",
		icon: "weaver",
		production: ["cotton_cloth"],
		productivity: 0.06,
		price: 0,
		upkeep: 31,
		type: "human",
		skill: "skilled",
		description: "How many weaves can a weaver weave if a weaver could weave wool? 31d/day",
		palette: true,
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
		palette: false,
	}
	
	// tailor: 26
}

Producer.prototype.recipes = {
	"cotton_thread": 
	{
		name: "Cotton -> Cotton Thread",
		input: {"cotton":1},
		output: {"cotton_thread":2},
	},
	"cotton_cloth": 
	{
		name: "Cotton Thread -> Cotton Cloth",
		input: {"cotton_thread":1},
		output: {"cotton_cloth":1},
	},
	"cotton_shirt":
	{
		name: "Cotton Cloth -> Cotton Shirt",
		input: {"cotton_cloth":4.6},
		output: {"cotton_shirt":1},
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

Producer.prototype.lookupRecipe = function(key)
{
	return Producer.prototype.recipes[key];
}

Producer.prototype.lookupType = function(key)
{
	return Producer.prototype.types[key];
}