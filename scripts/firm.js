/**
	A thingy that makes a thingy.
	Basically a GIANT producer. (but not really).
	Actually a giant factory instead.
 */
function Firm(type = "undefined", name = "New Firm", money = 0)
{
	if(!this.types[type])
	{
		Engine.log(`Firm: there is no such factory ${type}.`);
		return null;
	}
	this.type = type;
	this.name = name;
	this.money = money;
	
	this.warehouse = new Inventory(0,true);
	
	this.productivity = this.types[this.type].productivity;
	this.recipe = this.types[this.type].recipe;
}

// FIRM productivity is different than regular productivity, in that it's PER DAY instead of PER HOUR.
Firm.prototype.types = {
	"spinning_mill": {
		"name": "Spinning Mill",
		"productivity": 9,
		"recipe": "cotton_thread",
	},
	"undefined": {
		"name": "UNDEFINED",
	},
}

Firm.prototype.tick = function(time, city)
{
	
}

Firm.prototype.produce = function(inventory, recipe, productivity)
{
	return Factory.prototype.produce.call(this,inventory,recipe,productivity);
	/*
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
	*/
}