var City_handler = (
	function()
	{
		var panel;
		var title;
		
		var city_location_panels;
		var city_location_buttons;
		var city_location_buttons_panel;
		
		var cities;
		
		var background_image;
		
		return {
			get panel() {return panel},
			get cities() {return cities},
			
			get city() {return State_manager.get_state("player","city");},
			
			// this mess of a thing is due to UI programming. Blame it on the UI.
			initialize: function()
			{
				// init
				panel = new UIPanel(0,0,800,550);
				panel.paint = City_handler.draw;
				// add in own children first that need to be displayed first.
				// city location_panels
				city_location_panels = [];
				
				var money_lender = Money_lender_handler;
				money_lender.hide();
				panel.addSubElement(money_lender,100,100);
				city_location_panels.push(money_lender);
				
				var city_hall = City_hall_handler;
				city_hall.hide();
				panel.addSubElement(city_hall,0,0);
				city_location_panels.push(city_hall);
				
				// self
				title = new UILabel("City","center");
				title.font_size = 30;
				panel.addSubElement(title,panel.width/2,50);
				
				// buttons
				city_location_buttons_panel = new UIPanel(0,0,200,400);
				panel.addSubElement(city_location_buttons_panel,panel.width/2 - city_location_buttons_panel.width/2,100);
				
				city_location_buttons = {};
				
				city_location_buttons["city_hall"] = (new UIButton(150,25,"City Hall",()=>city_hall.show()));
				city_location_buttons["properties"] = (new UIButton(150,25,"Properties",null));
				city_location_buttons["money_lender"] = (new UIButton(150,25,"Market and Contracts",null));
				city_location_buttons["real_estate_agent"] = (new UIButton(150,25,"Real Estate Agent",null));
				city_location_buttons["market"] = (new UIButton(150,25,"Money Lender's",()=>money_lender.show()));
				city_location_buttons["port"] = (new UIButton(150,25,"Port",null));
				//city_location_buttons["properties"] = (new UIButton(150,25,"Properties",null));
				
				var count = 0;
				for(var key in city_location_buttons)
				{
					city_location_buttons_panel.addSubElement(city_location_buttons[key],25,25+50*count);
					count++;
				}
				
				// now add in all the cities we need 
				cities = State_manager.get_state("world","cities");
				
				for(var key in Defined_cities)
				{
					// in case we add new cities,
					if(!cities[key])
					{
						cities[key] = new City(key);
					}
				}
				
				background_image = Engine.assets[State_manager.get_state("player","city").city.map];
				City_handler.change_city(City_handler.city);
			},
			
			change_city: function(city)
			{
				title.setText(city.name);
				// add in all the stuff to the panel! or rather show 'em
				for(var location_key in city_location_buttons)
				{
					city_location_buttons[location_key].hide();
				}
				
				city.locations.forEach(location_key =>
				{
					if(city_location_buttons[location_key])
					{
						city_location_buttons[location_key].show();
					}
					else 
					{
						Engine.log(`Property '${location_key}' is not recognized.`);
					}
				});
				
			},
			
			get_city: function(city_key)
			{
				return cities[city_key];
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
			
			close_day: function(day)
			{
				for(var key in cities)
				{
					cities[key].close_day(day);
				}
			},
			
			close_week: function(week)
			{
				for(var key in cities)
				{
					cities[key].close_week(week);
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
	var city = Defined_cities[city_key];
	this.key = city_key;
	this.city = city;
	
	this.name = city.name;
	this.population = city.population;
	this.growth_rate = city.growth_rate;
	
	// each warehouse only adds to this blank inventory
	this.warehouse = new Inventory(0);
	// city's inventory
	this.market = new Economy(city_key);
	
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

City.prototype.close_day = function(day)
{
	
	//this.market.close_day(day);
}

City.prototype.close_week = function(week)
{
	this.population *= Math.pow(Math.E,this.city.growth_rate*(1/Time_converter.AVERAGE_WEEKS_PER_YEAR));
	this.market.close_week(week);
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
	},
	
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