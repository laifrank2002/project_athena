
/**
	A full blown city!
	Really just statistics.
	Takes data from a preset dataset.
 */
function City(city_key)
{
	var city = Defined_cities[city_key];
	this.key = city_key;
	this.city = city;
	
	this.name = city.name;
	this.population = city.population;
	this.growth_rate = city.growth_rate;
	
	// each warehouse only adds to this blank inventory
	this.warehouse = new Inventory(0);
	// city's inventory
	this.economy = new Economy(city_key);
	
	// owned properties 
	this.real_estate = [];
	this.city.prebuilt_realestate.forEach(key =>
		{
			var real_estate = new Real_estate(key);
			this.real_estate.push(real_estate);
			this.warehouse.add_capacity(real_estate.capacity);
		}
	);
	
	// locations 
	this.locations = city.locations;
}

City.prototype.tick = function(time)
{
	for(var index = 0; index < this.real_estate.length; index++)
	{
		this.real_estate[index].tick(time,this.warehouse);
	}
}

City.prototype.close_day = function(day)
{
	//this.market.close_day(day);
}

City.prototype.close_week = function(week)
{
	this.population *= Math.pow(Math.E,this.city.growth_rate*(1/Time_converter.AVERAGE_WEEKS_PER_YEAR));
	this.economy.close_week(week);
}

/**
	Max locations = sqrt(CITIES.population)/100;
 */
var Defined_cities = {
	"lancaster": {
		name: "Lancaster",
		county: "Lancashire",
		population: 23818,
		growth_rate: 0.0081,
		map: "city1",
		unlock_year: 1800, 
		locations: ["city_hall","properties","money_lender","real_estate_agent","market","port"],
		prebuilt_realestate:["small_mill_a"],
		
		/*
		// demand and supply per WEEK.
		// 3.6 thread per spinster per day 
		// 216 thread per factory per day 
		// 1512 thread per factory per week 
		// assume 20 factories in lancaster 
		
		// thus, how ever many stuff the player brings into the price per week is reset weekly.
		// x - price, y - quantity
		// can't sell more than zpd.y (people don't demand 'nuff!)
		demand_and_supply: {
			"cotton": {
				zero_price_demanded: {x:0, y: 40000},
				initial_equilibrium: {x: 2, y: 30000},
			},
			
			"cotton_thread": {
				zero_price_demanded: {x:0, y: 35000},
				initial_equilibrium: {x: 8, y: 25000},
			},
			
			"cotton_cloth": {
				zero_price_demanded: {x:0, y: 30000},
				initial_equilibrium: {x: 12, y: 20000},
			},
		}
		*/
	},
	/*
	"manchester": {
		name: "Manchester",
		county: "Lancashire",
		population: 89000,
		growth_rate:0.0306,
		map: "city1",
		unlock_year: 1800, 
		locations: ["city_hall","properties","money_lender","real_estate_agent","market","port"],
		
		prebuilt_realestate:[],
		
		demand_and_supply: {
			"cotton": {
				zero_price_demanded: {x:0, y: 40000},
				initial_equilibrium: {x: 2, y: 30000},
			},
			
			"cotton_thread": {
				zero_price_demanded: {x:0, y: 35000},
				initial_equilibrium: {x: 8, y: 25000},
			},
			
			"cotton_cloth": {
				zero_price_demanded: {x:0, y: 30000},
				initial_equilibrium: {x: 12, y: 20000},
			},
		}
	},
	*/
}

// real estate!
/**
	Types
		Warehouses (Just adds to overall warehouse)
		Factories
		Resource Extractors
 */
function Real_estate(type)
{
	this.name = "";
	this.type = type;
	this.building = this.buildings[type];
	
	this.capacity = 0;
	if(this.building.capacity) this.capacity = this.building.capacity;
	
	if(this.building.type === "factory")
	{
		this.map = Maps[this.building.map];
		this.map_name = this.building.map;
		this.factory = new Factory(this.building.map);
	}
	
}

Real_estate.prototype.buildings = {
	"small_mill_a":{
		"icon": null,
		"type": "factory",
		"price": 800*240,
		"map": "small_mill_a",
		
		"capacity": 1000,
	},
	"small_warehouse": {
		"icon": null,
		"type": "warehouse",
		"price": 600*240,
		
		"capacity": 10000,
	},
};

Real_estate.prototype.tick = function(time,inventory)
{
	if(this.factory) this.factory.tick(time,inventory);
}