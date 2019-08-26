var City_handler = (
	function()
	{
		var panel;
		var cities;
		
		var background_image;
		
		return {
			get panel() {return panel},
			get cities() {return cities},
			
			initialize: function()
			{
				panel = new UIPanel(0,0,800,550);
				panel.paint = City_handler.draw;
				
				// in case we add new cities, also shortens state_manager.start_new_game
				cities = State_manager.get_state("world","cities");
				
				for(var key in Cities)
				{
					if(!cities[key])
					{
						cities[key] = new City(key);
					}
				}
				
				background_image = Engine.assets[State_manager.get_state("player","city").city.map];
			},
			
			draw: function(context)
			{
				if(background_image)
				{
					context.drawImage(background_image
						,panel.x
						,panel.y);
				}
			},
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
	
	// each warehouse only adds to this blank inventory
	this.warehouse = new Inventory(0);
	// city's inventory
	this.market = new Market();
	
	
	// owned properties 
	this.real_estate = [];
	this.city.prebuilt_realestate.forEach(key =>
		{
			this.real_estate.push(new Real_estate(key));
		}
	);
}

City.prototype.tick = function()
{
	this.population *= Math.pow(Math.E,this.city.growth_rate*(1/Time_converter.DAYS_PER_AVERAGE_YEAR));
}

/**
	Max buildings = sqrt(CITIES.population)/100;
 */
var Cities = {
	"lancaster": {
		name: "Lancaster",
		county: "Lancashire",
		population: 23818,
		growth_rate: 0.0081,
		map: "city1",
		unlock_year: 1800, 
		prebuilt_realestate:["small_mill_a"],
		
		initial_deals:[{"key":"cotton","amount":100}],
	},
	
	"manchester": {
		name: "Manchester",
		county: "Lancashire",
		population: 89000,
		growth_rate:0.0306,
		map: "city1",
		unlock_year: 1800, 
		prebuilt_realestate:[],
	},
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
	
	if(this.building.type === "factory")
	{
		this.map = Maps[this.building.map];
		this.map_name = this.building.map;
		this.factory = new Map(this.map.factory_width, this.map.factory_height);
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

/**
	Imports and Export deals
		types && fees (depending on)
			IMPORT FOREIGN
				25%
			EXPORT FOREIGN
				15%
			IMPORT DOMESTIC
				5%
			EXPORT DOMESTIC
				5%
 */
function City_deal(resource, amount, type, origin)
{
	
}

City_deal.prototype.types = {
	"domestic_import": {
		fee: 0.25,
	},
	"domestic_export": {
		fee: 0.15,
	},
	"foreign_import": {
		fee: 0.05,
	},
	"foreign_export": {
		fee: 0.05,
	},
};

/**
	Trading partners
 */
function Trading_partner()
{
	
}

/**
	Markets, which conform to prices using supply and demand.
	Not only that, but it also handles money!
 */
function Market()
{
	this.money = 0;
	this.inventory = new Inventory(0,true);
}