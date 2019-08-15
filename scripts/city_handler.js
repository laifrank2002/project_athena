var City_handler = (
	function()
	{
		var cities = {};
		return {
			initialize: function()
			{
				// in case we add new cities, and also to take the load off of state_manager new game state.
				cities = State_manager.get_state("world","cities");
				
				for(var key in Cities)
				{
					if(!cities[key])
					{
						cities[key] = new City(key);
					}
				}
			}
		}
	}
)();

/**
	A full blown city!
	Really just statistics.
	Takes data from a preset dataset.
 */
function City(city_key)
{
	var city = Cities[city_key];
	
	this.city = city;
	
	this.name = city.name;
	this.population = city.population;
	this.growth_rate = city.growth_rate;
	
	this.map = Maps[this.city.map];
	this.factory = new Map(this.map.factory_width,this.map.factory_height);
	
	this.purchased_factory = false;
}

City.prototype.tick = function()
{
	this.population *= Math.pow(Math.E,this.city.growth_rate*(1/Time_converter.DAYS_PER_AVERAGE_YEAR));
}

var Cities = {
	"lancaster": {
		name: "Lancaster",
		county: "Lancashire",
		population: 23818,
		growth_rate: 0.0081,
		map: "small_mill_a",
		unlock_year: 1800, 
	},
	
	"manchester": {
		name: "Manchester",
		county: "Lancashire",
		population: 89000,
		growth_rate:0.0306,
		map: "small_mill_a",
		unlock_year: 1800, 
	},
}