/**
	Market handler
 */

/**
	Markets, which conform to prices using supply and demand.
	Not only that, but it also handles money!
 */
function Market(city)
{
	this.city = city;
	this.money = Market.prototype.DEFAULT_MONEY * (1+Math.random());
	this.inventory = new Inventory(0,true);
}

Market.prototype.DEFAULT_MONEY = 1000000;

Market.prototype.AVERAGE_INCOME_PER_HOUSEHOLD_PER_DAY = 14;

Market.prototype.tick = function()
{
	
}

Market.prototype.close_day = function(day)
{
	// adds money based on the population of the city so that they'll have enough money to afford the goods. Approximately ahundred pence a week, or a 14d/day as in family income.
	// we'll assume an 8 person household.
	this.money += (this.city.population / 8) * Market.prototype.AVERAGE_INCOME_PER_HOUSEHOLD_PER_DAY;
	
	// remove and or add some goods to simulate consumption and production
}

Market.prototype.close_week = function(week)
{
	// refresh money to simulate getting paid.
	
}