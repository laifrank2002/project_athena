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
		
		// components 
		var toolbar;
		var palette;
		var palette_list;
		
		var statusbar;
		
		var currently_selected;
		
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
				
				// own components
				toolbar = new UIPanel(null,null,panel.width,25);
				panel.addSubElement(toolbar,0,0);
				
				palette = new UIPanel(null,null,600,toolbar.height);
				// adding all of the buttons for the palette 
				palette_list = ["spinster"];
				for(var index = 0; index < palette_list.length; index++)
				{
					var producer = Producer.prototype.types[palette_list[index]];
					var icon_button = new UIButton(25,25,"");
					icon_button.icon = Engine.assets[producer.image];
					icon_button.palette_number = index;
					
					icon_button.paint = function(context,x,y)
					{
						var indent = UIElement.prototype.indent_size;
						context.drawImage(this.icon,x + indent,y + indent,25 - 2*indent,25 - 2*indent);
					};
					icon_button.onmouseclick = function()
					{
						Industry_handler.set_palette_selected(this.palette_number);
					};
					
					palette.addSubElement(icon_button,index * 25, 0);
					palette_list[index];
				}
				
				toolbar.addSubElement(palette);
				
				statusbar = new UIPanel(null,null,panel.width,25);
				panel.addSubElement(statusbar,0,panel.height - 25);
				// inited maps 
				
				current_map_name = "map1";
				
				var map = Maps[current_map_name];
				
				background = Engine.assets[map.background];
				map_offset = map.factory_position;
				viewport = new Viewport(0,0,map.width,map.height);
				current_map = new Map(map.factory_width, map.factory_height);
				
				State_manager.set_state("player","map_name",current_map_name);
				State_manager.set_state("player","map",current_map);
				
				viewport = new Viewport(0,0,panel.width,panel.height-50);
			},
			
			draw: function(context)
			{
				var x = panel.x;
				var y = panel.y + 25;
				
				var map_x = x + map_offset.x - viewport.x;
				var map_y = y + map_offset.y - viewport.y;
				
				// draw background 
				context.drawImage(background
					,viewport.x
					,viewport.y
					,viewport.width
					,viewport.height
					,x
					,y
					,viewport.width
					,viewport.height);
				// draw grid and objects 
				current_map.draw(context,map_x,map_y);
				
				// now draw thy mouse shadow
				if(Engine.mouseX >= map_x
					&& Engine.mouseY >= map_y
					&& Engine.mouseX < map_x + current_map.TILE_WIDTH * current_map.width
					&& Engine.mouseY < map_y + current_map.TILE_HEIGHT * current_map.height)
				{
					var grid_x = Math.floor((Engine.mouseX - map_x)/ current_map.TILE_WIDTH);
					var grid_y = Math.floor((Engine.mouseY - map_y)/ current_map.TILE_HEIGHT);
					
					if(!isNaN(currently_selected))
					{
						// a further plonk is required in the case of deselect
						if(Producer.prototype.types[palette_list[currently_selected]])
						{
							var image = Engine.assets[Producer.prototype.types[palette_list[currently_selected]].image];
							context.globalAlpha = 0.5;
							context.drawImage(image
								,map_x + grid_x * current_map.TILE_WIDTH
								,map_y + grid_y * current_map.TILE_HEIGHT
								,current_map.TILE_WIDTH
								,current_map.TILE_HEIGHT);
							context.globalAlpha = 1.0;
						}
						
					}
				}
			},
			
			tick: function()
			{
				current_map.tick();
			},
			
			/**
				Does a lot of things. 
				TODO
				Decompose
			 */
			handle_mouseclick: function(mouseX, mouseY)
			{
				console.log(`${mouseX},${mouseY}`);
				var x = panel.x;
				var y = panel.y + 25;
				
				var map_x = x + map_offset.x - viewport.x;
				var map_y = y + map_offset.y - viewport.y;
				// make a second check to make sure it's within the internal map frame as well.
				if(mouseX >= x 
					&& mouseY >= y 
					&& mouseX < x + panel.width
					&& mouseY < y + panel.height)
				{
					if(mouseX >= map_x
						&& mouseY >= map_y
						&& mouseX < map_x + current_map.TILE_WIDTH * current_map.width
						&& mouseY < map_y + current_map.TILE_HEIGHT * current_map.height)
					{
						var grid_x = Math.floor((mouseX - map_x)/ current_map.TILE_WIDTH);
						var grid_y = Math.floor((mouseY - map_y)/ current_map.TILE_HEIGHT);
						
						if(!isNaN(currently_selected) && currently_selected !== null)
						{
							Industry_handler.buy_and_plop(palette_list[currently_selected],grid_x,grid_y);
							Industry_handler.deselect_palette();
						}
					}
					else 
					{
						Industry_handler.deselect_palette();
					}
				}
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
			},
			
			/**
				Buys something
			 */
			buy_and_plop: function(producer_name,x,y)
			{
				if(State_manager.get_state("player","money") >= Producer.prototype.types[producer_name].price)
				{
					if(current_map.plopObject(new Producer(producer_name),x,y))
					{
						State_manager.add_state("player","money",-Producer.prototype.types[producer_name].price);
						return true;
					}
					else 
					{
						Engine.log("Unable to plop.");
						return false;
					}
				}
				else 
				{
					Engine.log("Not enough money to plop.");
					return false;
				}
			},
			
			set_palette_selected: function(index)
			{
				if(index >= 0 && index < palette_list.length)
				{
					currently_selected = index;
				}
			},
			
			deselect_palette: function()
			{
				currently_selected = null;
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