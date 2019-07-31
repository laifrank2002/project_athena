/**
	Stores
		- industry panel 
	Performs
		- accept mouse input
		- convert UI elements to relative
 */

var Industry_handler = (
	function()
	{
		var panel;
		var current_map;
		var current_map_name;
		
		var background;
		var map_offset;
		var viewport;

		return {
			get current_map() {return current_map},
			
			get panel() {return panel},
			get viewport() {return viewport},
			
			initialize: function()
			{
				panel = new UIElement(0,0,800,575,"generic",Industry_handler.handle_mouseclick);
				panel.paint = Industry_handler.draw;
				
				// inited maps 
				
				current_map_name = "map1";
				
				var map = Maps[current_map_name];
				
				background = Engine.assets[map.background];
				map_offset = map.factory_position;
				viewport = new Viewport(0,0,map.width,map.height);
				current_map = new Map(map.factory_width, map.factory_height);
				
				State_manager.set_state("player","map_name",current_map_name);
				State_manager.set_state("player","map",current_map);
			},
			
			draw: function(context)
			{
				var x = panel.x;
				var y = panel.y;
				var width = panel.width;
				var height = panel.height;
				
				// draw background 
				context.drawImage(background
					,-viewport.x
					,-viewport.y
					,viewport.width
					,viewport.height
					,x
					,y
					,viewport.width
					,viewport.height);
				// draw grid and objects 
				current_map.draw(context
					,x + map_offset.x - viewport.x
					,y + map_offset.y + viewport.y);
				
			},
			
			tick: function()
			{
				current_map.tick();
			},
			
			/**
				TODO
				Remember that true mouse clicks are actually different depending on viewport.
				Minus the viewport results when using.
			 */
			handle_mouseclick: function(mouseX, mouseY)
			{
				
			},
			
			/**
				Load data
			 */
			load_data: function(data)
			{
				current_map_name = data["player"].current_map_name;
				current_map = data["player"].current_map;
				
				var map = Maps[current_map_name];
				
				background = Engine.assets[map.background];
				map_offset = map.factory_position;
				viewport = new Viewport(0,0,map.width,map.height);
			},
		}
	}
)();

/**
	Defined maps that make it easier on saving and loading 
 */
var Maps = {
	"map1": {
		name: "Testing",
		background: "map1",
		width: 800,
		height: 600,
		factory_position: {x: 200, y: 200},
		factory_width: 10,
		factory_height: 6,
	},
}