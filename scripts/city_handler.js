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
			
			tick: function(time)
			{
				for(var key in cities)
				{
					cities[key].tick(time);
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