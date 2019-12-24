/**
	Economy handler
	Handles the economic aspects of a city, decision making, etc.
 */
function Economy(city_key)
{
	Inventory.call(this,null,true); // an infinite inventory!
	this.city_key = city_key;
	this.money = Economy.prototype.DEFAULT_MONEY * (1+Math.random());
	
	this.imports = Defined_cities[city_key].imports;
}

Economy.prototype = Object.create(Inventory.prototype);
Object.defineProperty(Economy.prototype, 'constructor', {
	value: Economy,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

Economy.prototype.DEFAULT_MONEY = 1000000;
Economy.prototype.AVERAGE_INCOME_PER_HOUSEHOLD_PER_DAY = 14;

Economy.prototype.tick = function()
{
	
}

Economy.prototype.close_day = function(day)
{
	// adds money based on the population of the city so that they'll have enough money to afford the goods. Approximately ahundred pence a week, or a 14d/day as in family income.
	// we'll assume an 8 person household.
	this.money += (City_handler.get_city(this.city_key).population / 8) * Economy.prototype.AVERAGE_INCOME_PER_HOUSEHOLD_PER_DAY;
}

Economy.prototype.close_week = function(week)
{
	// handle imports 
	// cities CAN have negative money, so we won't deal with this for now.
	for(var index = 0; index < this.imports.length; index++)
	{
		this.money -= this.imports[index].count * this.imports[index].price;
		this.add_amount(this.imports[index].key, this.imports[index].amount, this.imports[index].price);
	}
}

Economy.prototype.get_price = function(key)
{
	var item = this.get_item(key);
	
	if(!item)
	{
		Engine.log(`Inventory.get_price: item ${key} doesn't exist.`);
		return 0;
	}
	
	return item.price;
}