/**
	Takes some input and creates something out of it.
 */
function Producer(type_key)
{
	if(!this.types[type_key])
	{
		Engine.log(`Producer: there is no such producer ${type_key}.`);
		MapObject.call(this,1,1);
	}
	
	MapObject.call(this,this.types[type_key].width,this.types[type_key].height);
	this.type = this.types[type_key];
	this.image = Engine.assets[this.type.image];
	this.production_option = 0;
}

Producer.prototype = Object.create(MapObject.prototype);
Object.defineProperty(Producer.prototype, 'constructor', {
	value: Producer,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

Producer.prototype.types = {
	"spinster": {
		width: 1,
		height: 1,
		image: "spinster",
		icon: "spinster",
		// different options of production
		production: [
			{name: "Cotton -> Cotton Thread"
			,rate: 0.15
			,input: {"cotton":1}
			,output: {"cotton_thread":2}},
		],
		price: 0,
		upkeep: 18,
		type: "human",
	},
	// RR(Research Confirmed)
	// weaver: 0.67 cloth per day
	"weaver": {
		width: 1,
		height: 1,
		image: "weaver",
		icon: "weaver",
		production: [
			{name: "Cotton Thread -> Cotton Cloth"
			,rate: 0.06
			,input: {"cotton_thread":1}
			,output: {"cotton_cloth":1}},
		],
		price: 0,
		upkeep: 31,
		type: "human",
	},
	
	"tanner": {
		width: 2,
		height: 1,
		image: "tanner",
		icon: "tanner_icon",
		production: [
			{name: "Hides -> Leather"
			,rate: 0.04
			,input: {"hides":1}
			,output: {"leather":1}},
		],
		price: 0,
		upkeep: 31,
		type: "human",
	}
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

/**
	TODO
	DEPRECATE BY CENTRALIZING BY CATEGORIES
 */
Producer.prototype.tick = function()
{
	// production
	var production = this.type.production[this.production_option];
	var rate = production.rate;
	
	// limit rate based on availible inputs
	var limited_throughput_rate = 1.0;
	for(key in production.input)
	{
		limited_throughput_rate = Math.min(limited_throughput_rate,Inventory.get_item(key).count / (production.input[key] * rate));
	}
	rate = rate * limited_throughput_rate;
	
	// now start subtracting
	for(key in production.input)
	{
		Inventory.subtract_amount(key,production.input[key] * rate);
	}
	
	// and then producing!
	for(key in production.output)
	{
		Inventory.add_amount(key,production.output[key] * rate);
	}
}