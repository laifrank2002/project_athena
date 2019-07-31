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
		return {
			get data() {return data},
			
			initialize: function()
			{
				/* takes the categories and initializes them */
				data["player"] = {};
				data["world"] = {};
			},
			
			// if there are no previous saves, population data with defaults.
			start_new_game: function()
			{
			},
			
			set_state: function(category,id,value)
			{
				if(data[category])
				{
					data[category][id] = value;
				}
				else 
				{
					Engine.log("Set Data: No such category: " + category + " exists.");
				}
			},
			
			get_state: function(category,id,value)
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
			
			// load AFTER everything else is initialized to prevent overrides
			load: function()
			{
				
			},
			
			save: function()
			{
				
			},
		}
	}
)();