/**
	Economy handler
 */

/**
	Handles the economic aspects of a city, decision making, etc.
 */
 
/**
	Economys, which conform to prices using supply and demand.
	Not only that, but it also handles money!
 */
function Economy(city_key)
{
	Inventory.call(this,null,true); // an infinite inventory!
	this.city_key = city_key;
	this.money = Economy.prototype.DEFAULT_MONEY * (1+Math.random());
	
	for (var key in this.items)
	{
		var demand_and_supply = Defined_cities[this.city_key].demand_and_supply[key];
		if(demand_and_supply)
		{
			var ie = demand_and_supply.initial_equilibrium;
			var zpd = demand_and_supply.zero_price_demanded;
			
			var item = this.items[key];
			
			item.buyable = true;
			item.demand = new Line((ie.y - zpd.y) / (ie.x - zpd.x),zpd.y);
			item.supply = new Line((ie.y) / (ie.x),0);
			item.price = ie.x;
			
			item.sold_weekly = 0;
			item.sold_total = 0;
			item.bought_weekly = 0;
			item.bought_total = 0;
		}
		else 
		{
			this.items[key].buyable = false;
		}
	}
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
	// remove and or add some goods to simulate consumption and production
	for (var key in this.items)
	{
		if(this.items[key].buyable)
		{
			this.items[key].sold_weekly = 0;
			this.items[key].bought_weekly = 0;
		}
	}
}

/* Markets for a single good */
function Market(key)
{
	var demand_and_supply = Defined_cities[this.city_key].demand_and_supply[key];
	if(demand_and_supply)
	{
		var ie = demand_and_supply.initial_equilibrium;
		var zpd = demand_and_supply.zero_price_demanded;
		
		var item = this.Item.prototype.items[key];
		
		item.buyable = true;
		item.demand = new Line((ie.y - zpd.y) / (ie.x - zpd.x),zpd.y);
		item.supply = new Line((ie.y) / (ie.x),0);
		item.price = ie.x;
		
		item.sold_weekly = 0;
		item.sold_total = 0;
		item.bought_weekly = 0;
		item.bought_total = 0;
	}
	else 
	{
		this.Item.prototype.items[key].buyable = false;
	}	
}

Market.prototype.close_week = function()
{
	
}

/*
// buy item really means we SUBTRACT units from the market, or INCREASING DEMAND.
Economy.prototype.buy_item = function(name, amount)
{
	if(!this.Item.prototype.items[name] || amount < 0) return 0;
	var item_amount = amount;
	var money = State_manager.get_state("player","money");
	// we'll get AVERAGE price buy getting new price and old price.
	var item = this.Item.prototype.items[name];
	var old_price = item.price;
	var new_demand = new Line(item.demand.slope, item.demand.y_intercept + item_amount);
	var new_price = new_demand.get_intersection(item.supply);
	var average_price = (new_price + old_price)/2
	// let's not deal with actually figuring out optimal amount for now.
	if(money < average_price * item_amount) return 0; 
	
	item.demand = new_demand;
	item.bought_weekly += item_amount;
	item.bought_total += item_amount;
}

Economy.prototype.sell_item = function(name, amount)
{
	if(!this.Item.prototype.items[name] || amount < 0) return 0;
	var item_amount = amount;
	var money = State_manager.get_state("player","money");
	// we'll get AVERAGE price buy getting new price and old price.
	var item = this.Item.prototype.items[name];
	// can't sell more than 0 price demanded, else negative priced thing.
	// really: Item.prototype.items sold - Item.prototype.items bought < zero price quantity demanded 
	if(item_amount + item.sold_weekly > item.demand.y_intercept) item_amount = item.demand.y_intercept - item.sold_weekly;
	var old_price = item.price;
	var new_supply = new Line(item.supply.slope, item.supply.y_intercept + item_amount);
	var new_price = new_supply.get_intersection(item.demand);
	var average_price = (new_price + old_price)/2
	
	item.supply = new_supply;
	item.sold_weekly = item_amount;
	item.sold_total= item_amount;
}
*/
/**
	Returns average price of buying.
 *//*
Economy.prototype.get_total_buy_price = function(name, amount)
{
	if(!this.Item.prototype.items[name] || amount < 0) return -1;
	var item = this.Item.prototype.items[name];
	var old_price = item.price;
	var new_demand = new Line(item.demand.slope, item.demand.y_intercept + item_amount);
	var new_price = new_demand.get_intersection(item.supply);
	var average_price = (new_price + old_price)/2
	return average_price;
}
*/
/**
	Returns average price of selling.
 *//*
Economy.prototype.get_total_sell_price = function(name, amount)
{
	if(!this.Item.prototype.items[name] || amount < 0) return -1;
	var item = this.Item.prototype.items[name];
	var old_price = item.price;
	var new_supply = new Line(item.supply.slope, item.supply.y_intercept + item_amount);
	var new_price = new_supply.get_intersection(item.demand);
	var average_price = (new_price + old_price)/2
	return average_price;
}*/