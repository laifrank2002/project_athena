/**
	Stores all player based data. Stores it in a special data variable.
	A reminder to please only save AT THE END OF A TICK.
	Stores 
		- Money 
		- Time 
		- Map 
		- Inventory
		- Economy
 */
var State_manager = (
	function()
	{
		var data = {};
		var listeners = [];
		
		function State_listener(name,category,id,action)
		{
			this.name = name;
			this.category = category;
			this.id = id;
			this.action = action;
		}
		
		State_listener.prototype.trigger = function(category,id)
		{
			if(category === this.category && id === this.id)
			{
				this.action(category,id);
			}
		}
		
		return {
			get data() {return data},
			
			initialize: function()
			{
				/* takes the categories and initializes them */
				data["player"] = Player;
				data["world"] = World;
				
				// temp until saving and loading is figured out 
				State_manager.start_new_game();
			},
			
			// if there are no previous saves, population data with defaults.
			start_new_game: function()
			{
				var STARTING_MAP_NAME = "map1";
				var STARTING_CITY = "lancaster";
				
				data["world"] = World;
				
				for(var key in Defined_cities)
				{
					data["world"].cities[key] = new City(key);
				}
				
				data["world"].cities[STARTING_CITY];//TODO, add property
				
				data["player"] = {name: "Anonymous"
					,money: 48000
					,city: data["world"].cities[STARTING_CITY]
					,map_name: data["world"].cities[STARTING_CITY].real_estate[0].map_name
					,map: data["world"].cities[STARTING_CITY].real_estate[0].factory
					,factory: data["world"].cities[STARTING_CITY].real_estate[0].factory
					,credit_rating: "NR"
					,loaned_amount: 0};
				Player.load(data);
				
				data["history"] = {finance: null};
				data["settings"] = {industry:{autobuy:true}};
			},
			
			set_state: function(category,id,value)
			{
				if(data[category])
				{
					data[category][id] = value;
					listeners.forEach(listener => listener.trigger(category,id));
				}
				else 
				{
					Engine.log("Set Data: No such category: " + category + " exists.");
				}
			},
			
			/**
				For convienience
			 */
			add_state: function(category,id,value)
			{
				if(data[category])
				{
					if(typeof data[category][id] !== "object")
					{
						State_manager.set_state(category,id
							,State_manager.get_state(category,id) + value);
					}
				}
				else 
				{
					Engine.log("Add Data: No such category: " + category + " exists.");
				}
			},
			
			get_state: function(category,id)
			{
				if(data[category])
				{
					return data[category][id];
				}
				else 
				{
					Engine.log("Get Data: No such category: " + category + " exists.");
				}
			},
			
			/**
				Note, no two listeners should have the same name. 
			 */
			add_listener: function(name,category,id,action)
			{
				listeners.push(new State_listener(name,category,id,action));
			},
			
			/**
				Note, fails silently 
			 */
			remove_listener: function(name)
			{
				listeners = listeners.filter(listener => listener.name !== name);
			},
			
			load: function()
			{
				
			},
			
			save: function()
			{
				
			},
		}
	}
)();

/**
	The world is a representation of well, everything in the world.
	Everything that matters, that is.
 */
var World = {
	cities: {},
	time: 0,
};

/**
	The player is, well, the player.
 */
var Player = {
	name: null,
	city: null,
	factory: null,
	money: 0,
	credit_rating: "NR",
	loaned_amount: 0,
	
	load: function(data)
	{
		this.name = data.player.name;
		this.city = data.player.city;
		this.factory = data.player.factory;
		this.money = data.player.money;
		this.credit_rating = data.player.credit_rating;
		this.loaned_amount = data.player.loaned_amount;
	},
};