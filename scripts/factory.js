/**
	An implementation of a Factory, intended to replace Industry_handler.
	All that's needed in a preset map_name.
 */
function Factory(map_name)
{
	if(!this.maps[map_name])
	{
		Engine.log(`Factory.constructor: No such map ${map_name} exists`);
		return null;
	}
	
	this.type = this.maps[map_name];
	this.map_name = map_name;
	
	this.name = this.type.name;
	
	this.background_width = this.type.background_width;
	this.background_height = this.type.background_height;
	this.background_image = this.type.factory_image;
	
	this.skyline_day_image = this.type.skyline_day;
	this.skyline_night_image = this.type.skyline_night;
	
	this.factory_position = this.type.factory_position;
	
	// actual data;
	this.producers = {};
	
	this.auto_buy = true;
	
	for(var key in Producer.prototype.types)
	{
		var producer = this.producers[key];
		if(producer)
		{
			// add other properties
			// TODO
		}
		else 
		{
			this.producers[key] = {name:key,count:0, options:{}};
			
			var productions = Producer.prototype.types[key].production.forEach(recipe => this.producers[key].options[recipe] = {count: 0,total_productivity:0});
		}
	}
	
	Map.call(this,this.type.factory_width,this.type.factory_height);
}

Factory.prototype = Object.create(Map.prototype);
Object.defineProperty(Factory.prototype, 'constructor', {
	value: Factory,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
/* preset maps */
Factory.prototype.maps = {
	"small_mill_a": {
		name: "Testing",
		factory_image: "map1",
		skyline_day: "background1_day",
		skyline_night: "background1_night",
		background_width: 800,
		background_height: 600,
		
		factory_position: {x: 200, y: 200},
		factory_width: 10,
		factory_height: 6,
	},
}

Factory.prototype.getTotalWages = function()
{
	var total_wages = 0;
	this.getObjects().forEach(object => {if(object.type){ total_wages += object.type.upkeep}});
	return total_wages;
}

Factory.prototype.getProducers = function()
{
	return this.producers;
}

Factory.prototype.getProducer = function(type)
{
	if(!this.producers[type])
	{
		Engine.log(`Factory.getProducer: producer ${type} does not exist.`);
		return null;
	}
	
	return this.producers[type];
}

Factory.prototype.plopProducer = function(producer,x=0,y=0)
{
	if(this.plopObject(producer,x,y))
	{
		this.addProducer(producer.type_key,producer.recipe);
		return true;
	}
}

Factory.prototype.unplopProducer = function(producer)
{
	if(this.unplopObject(producer))
	{
		this.removeProducer(producer.type_key,producer.recipe);
		return true;
	}
}

Factory.prototype.addProducer = function(type,option)
{
	if(!this.producers[type])
	{
		Engine.log(`Factory.addProducer: producer ${type} does not exist.`);
		return false;
	}
	
	if(!this.producers[type].options[option])
	{
		Engine.log(`Factory.addProducer: producer ${type}'s production option ${option} does not exist.`);
		return false;
	}
	
	this.producers[type].count++;
	this.producers[type].options[option].count++;
	return true;
}

Factory.prototype.removeProducer = function(type,option)
{
	if(!this.producers[type])
	{
		Engine.log(`Factory.removeProducer: producer ${type} does not exist.`);
		return false;
	}
	
	if(!this.producers[type].options[option])
	{
		Engine.log(`Factory.addProducer: producer ${type}'s production option ${option} does not exist.`);
		return false;
	}
	
	this.producers[type].count--;
	this.producers[type].options[option].count--;
	return true;
}

Factory.prototype.tick = function(time, inventory)
{
	//this.objects.forEach(object => object.tick());
	// get time of day 
	if(Time_handler.get_day_stage() === "night") return;
	// handle each as its own category
	for(var key in this.producers)
	{
		var category = this.producers[key];
		if(category.count <= 0) continue;
		var type = Producer.prototype.lookupType(key);
		if(!type) continue;
		
		// handle each option by its self.
		for(var option in category.options)
		{
			var recipe = category.options[option];
			if(recipe.count <= 0) continue;
			
			var production = Producer.prototype.lookupRecipe(option);
			if(!production) continue;
			// naive sum (FOR NOW!)
			var productivity = recipe.count * type.productivity;
			
			var limited_throughput_rate = this.produce(inventory, production, productivity);
			
			Engine.log(limited_throughput_rate);
		}
	}
}

/**
	Naive production.
 */
Factory.prototype.produce = function(inventory, recipe, productivity)
{
	var limited_throughput_rate = productivity;
	
	for(var key in recipe.input)
	{
		// manual check 
		limited_throughput_rate = Math.min(limited_throughput_rate, (inventory.get_amount(key) / (recipe.input[key] * productivity)) * productivity);
	}
	
	if(limited_throughput_rate <= 0) return 0;
	
	for(var key in recipe.input)
	{
		inventory.add_amount(key,-recipe.input[key] * limited_throughput_rate);
	}
	
	for(var key in recipe.output)
	{
		inventory.add_amount(key,recipe.output[key] * limited_throughput_rate);
	}
	
	return limited_throughput_rate;
}