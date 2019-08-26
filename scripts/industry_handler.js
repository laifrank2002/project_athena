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
		var DISPLAY_POSITION = {x:0,y:0};
		var display_width = 800;
		var display_height = 475;
		
		var panel;
				
		var current_map;
		var current_map_name;
		
		// components
		var resource_bar;
		
		var toolbar;
		var palette;
		var palette_list;
		
		var statusbar;
		var statusbar_text;
		
		var background_factory;
		var background_day;
		var background_night;
		var map_offset;
		var viewport;
		
		var settings = {};
		var currently_selected;
		
		/**
			Returns map x and map y
		 */
		function getMapPosition()
		{
			return new Point(panel.x + map_offset.x - viewport.x + DISPLAY_POSITION.x, panel.y + map_offset.y - viewport.y + DISPLAY_POSITION.y);
		}
		
		return {
			get current_map() {return current_map},
			
			get panel() {return panel},
			get viewport() {return viewport},
			
			get settings() {return settings},
			
			initialize: function()
			{
				panel = new UIElement(0,0,800,550,"generic",Industry_handler.handle_mouseclick);
				panel.paint = Industry_handler.draw;
				
				// own components
				resource_bar = new UIWindow(null,null,800,75,"Resources",true,true);
				
				// adding all of the resource bar components
				panel.addSubElement(resource_bar,0,0);
				
				toolbar = new UIPanel(null,null,panel.width,25);
				// wrap it in another function in order to establish THIS, this function, as the context
				var resource_bar_button = new UIButton(25,25,"",() => {resource_bar.show()});
				resource_bar_button.paint = function(context,x,y)
				{
					context.strokeStyle = this.default_colour;
					context.lineWidth = 3;
					context.beginPath();
					context.moveTo(x + 5, y + 5);
					context.lineTo(x + 5, y + 20);
					context.lineTo(x + 20, y + 20);
					context.lineTo(x + 20, y + 5);
					context.closePath();
					context.stroke();
					context.fill();
					
					context.lineWidth = 2;
					context.beginPath();
					context.moveTo(x + 5, y + 5);
					context.lineTo(x + 20, y + 20);
					context.moveTo(x + 20, y + 5);
					context.lineTo(x + 5, y + 20);
					context.closePath();
					context.stroke();
				}
				toolbar.addSubElement(resource_bar_button,400,0);
				panel.addSubElement(toolbar,0,panel.height - 50);
				
				
				palette = new UIPanel(null,null,400,toolbar.height);
				// adding all of the buttons for the palette 
				palette_list = ["spinster","weaver","tanner"];
				for(var index = 0; index < palette_list.length; index++)
				{
					var producer = Producer.prototype.types[palette_list[index]];
					var icon_button = new UIButton(25,25,"");
					icon_button.icon = Engine.assets[producer.icon];
					icon_button.producer = producer;
					icon_button.palette_number = index;
					
					icon_button.paint = function(context,x,y)
					{
						var indent = UIElement.prototype.indent_size;
						context.drawImage(this.icon,x + indent,y + indent,25 - 2*indent,25 - 2*indent);
						
						// also check if mouse is in borders, counts as hover in hovertext.
						if(this.isInBounds(Engine.mouseX,Engine.mouseY))
						{
							Industry_handler.set_statusbar_text(this.producer.name + ": " + this.producer.description);
						}
					};
					icon_button.onmouseclick = function()
					{
						Industry_handler.set_palette_selected(this.palette_number);
					};
					
					palette.addSubElement(icon_button,100 + index * 25, 0);
				}
				// special 
				var cursor_button = new UIButton(25,25,"");
				cursor_button.paint = function(context,x,y)
				{
					var indent = UIElement.prototype.indent_size;
					
					context.beginPath();
					context.moveTo(x + indent + 3,y + indent + 3);
					context.lineTo(x + 15 + indent + 3,y + 5 + indent + 3);
					context.lineTo(x + 5 + indent + 3,y + 15 + indent + 3);
					context.closePath();
					context.strokeStyle = "black";
					context.fillStyle = "white";
					context.stroke();
					context.fill();
				}
				cursor_button.onmouseclick = function()
				{
					Industry_handler.deselect_palette();
				};
				palette.addSubElement(cursor_button,0,0);
				
				var delete_button = new UIButton(25,25,"");
				delete_button.paint = function(context,x,y)
				{
					var indent = UIElement.prototype.indent_size;
					
					context.drawImage(Engine.assets["trashbin"]
						,x
						,y
						,this.width
						,this.height)
				}
				delete_button.onmouseclick = function()
				{
					currently_selected = "delete";
				};
				palette.addSubElement(delete_button,75,0);
				
				// palette add to toolbar
				toolbar.addSubElement(palette);
				// status bar
				statusbar = new UIPanel(null,null,panel.width,25);
				statusbar_text = new UILabel(`...`,"left");
				statusbar.addSubElement(statusbar_text,5,5);
				panel.addSubElement(statusbar,0,panel.height - 25);
				
				viewport = new Viewport(0,0,panel.width,panel.height-50);
				
				// data
				current_map_name = State_manager.get_state("player","map_name");
				
				background_factory = Engine.assets[Maps[current_map_name].factory_image];
				background_day = Engine.assets[Maps[current_map_name].skyline_day];
				background_night = Engine.assets[Maps[current_map_name].skyline_night];
				
				map_offset = Maps[current_map_name].factory_position;
				current_map = State_manager.get_state("player","map");
				current_map.initialize();
				
				settings = State_manager.get_state("settings","industry");

			},
			
			draw: function(context)
			{
				var x = panel.x + DISPLAY_POSITION.x;
				var y = panel.y + DISPLAY_POSITION.y;
				
				var map_position = getMapPosition();

				// draw background 
				// changes based on time.
				if(Time_handler.get_day_stage() === "day")
				{
					context.drawImage(background_day
						,viewport.x
						,viewport.y
						,viewport.width
						,viewport.height
						,x
						,y
						,viewport.width
						,viewport.height);
				}
				else if (Time_handler.get_day_stage() === "night")
				{
					context.drawImage(background_night
						,viewport.x
						,viewport.y
						,viewport.width
						,viewport.height
						,x
						,y
						,viewport.width
						,viewport.height);
				}
				context.drawImage(background_factory
					,viewport.x
					,viewport.y
					,viewport.width
					,viewport.height
					,x
					,y
					,viewport.width
					,viewport.height);
				// draw grid and objects 
				current_map.draw(context,map_position.x,map_position.y);
				
				// now draw thy mouse shadow
				if(currently_selected !== null)
				{
					// a further check is required in the case of deselect
					var image;
					var producer = Producer.prototype.types[palette_list[currently_selected]]; 
					if(typeof currently_selected === "number")
					{
						if(producer)
						{
							image = Engine.assets[Producer.prototype.types[palette_list[currently_selected]].image];
						}
					}
					else 
					{
						if(currently_selected === "query")
						{
							image = Engine.assets["question_mark"];
						}
						else if (currently_selected === "move")
						{
							image = Engine.assets["cursor_move"];
						}
						else if (currently_selected === "delete")
						{
							image = Engine.assets["trashbin"];
						}
					}
					
					if(image)
					{
						var width = 1;
						var height = 1;
						context.globalAlpha = 0.5;
						if(producer)
						{
							width = producer.width;
							height = producer.height;
						}
						
						if(Industry_handler.is_in_map_bounds(Engine.mouseX,Engine.mouseY))
						{
							var grid_position = Industry_handler.get_grid_position(Engine.mouseX,Engine.mouseY);
							context.drawImage(image
								,map_position.x + grid_position.x * current_map.TILE_WIDTH
								,map_position.y + grid_position.y * current_map.TILE_HEIGHT
								,current_map.TILE_WIDTH * width
								,current_map.TILE_HEIGHT * height);
						}
						else 
						{
							context.drawImage(image
								,Engine.mouseX
								,Engine.mouseY
								,current_map.TILE_WIDTH * width
								,current_map.TILE_HEIGHT * height);
						}
						context.globalAlpha = 1.0;
					}
				}
			},
			
			tick: function()
			{
				current_map.tick();
				// get producers 
				var producers = current_map.getProducers();
				for(var key in producers)
				{
					
				}
				// it turned out that with the amount of computations that we have to do, it is more efficient to update per tick than to update per transaction.
				Inventory_handler.update();
			},
			
			// handle the day 
			close_day: function()
			{
				// naive paying
				var producers = current_map.getProducers();
				for(var key in producers)
				{
					State_manager.add_state("player","money",-Producer.prototype.types[key].upkeep * producers[key].count);
				}
			},
			/**
				Handles the mouseclick for EVERYTHING
				TODO
				Make a wrapper for da map.
			 */
			handle_mouseclick: function(mouseX, mouseY)
			{
				var x = panel.x + DISPLAY_POSITION.x;
				var y = panel.y + DISPLAY_POSITION.y;

				if(mouseX >= x 
					&& mouseY >= y 
					&& mouseX < x + panel.width
					&& mouseY < y + panel.height)
				{
					if(Industry_handler.is_in_map_bounds(mouseX,mouseY))
					{
						var current_grid_position = Industry_handler.get_grid_position(mouseX,mouseY);
						var last_grid_position = Industry_handler.get_grid_position(panel.mousedown.x,panel.mousedown.y);
						
						if(current_grid_position.equals(last_grid_position))
						{
							if(!isNaN(currently_selected) && currently_selected !== null)
							{
								Industry_handler.buy_and_plop(palette_list[currently_selected]
									,current_grid_position.x
									,current_grid_position.y);
									
							}
							else if (currently_selected === "query")
							{
								
							}
							else if(currently_selected === "move")
							{
								
							}
							else if(currently_selected === "delete")
							{
								Industry_handler.unplop(current_grid_position.x,current_grid_position.y);
							}
							
							if(!Engine.keysPressed["shift"]) Industry_handler.deselect_palette();
						}
						else 
						{
							if(!Engine.keysPressed["shift"]) Industry_handler.deselect_palette();
						}
						
					}
					else 
					{
						if(!Engine.keysPressed["shift"]) Industry_handler.deselect_palette();
					}
				}
			},
			
			/**
				Buys something
			 */
			buy_and_plop: function(producer_name,x,y)
			{
				if(State_manager.get_state("player","money") >= Producer.prototype.types[producer_name].price)
				{
					var producer = new Producer(producer_name);
					if(current_map.plopObject(producer,x,y))
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
			// unplop
			unplop: function(x,y)
			{
				var tile = current_map.getTile(x,y);
				if(tile.occupied)
				{
					if(current_map.unplopObject(tile.occupied))
					{
						return true;
					}
				}
				return false;
			},
			// for buttons 
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
			
			set_statusbar_text: function(text)
			{
				statusbar_text.setText(text);
			},
			
			// for data
			get_total_wages: function()
			{
				var total_wages = 0;
				current_map.getObjects().forEach(object => {if(object.type){ total_wages += object.type.upkeep}});
				return total_wages;
			},
			
			/* UTILITY */
			/**
				Takes an ABSOLUTE mouse position, and returns a grid position.
			 */
			get_grid_position: function(mouseX,mouseY)
			{
				var map_position = getMapPosition();
				if(Industry_handler.is_in_map_bounds(mouseX,mouseY))
				{
					return new Point(Math.floor((mouseX - map_position.x)/ current_map.TILE_WIDTH),Math.floor((mouseY - map_position.y)/ current_map.TILE_HEIGHT));
				}
				else 
				{
					return false;
				}
			},
			/**
				Takes an ABSOLUTE mouse position, and returns true if is within current map bounds
			 */
			is_in_map_bounds: function(x,y)
			{
				var map_position = getMapPosition();
				if(x >= map_position.x
					&& y >= map_position.y
					&& x < map_position.x + current_map.TILE_WIDTH * current_map.width
					&& y < map_position.y + current_map.TILE_HEIGHT * current_map.height)
				{
					return true;
				}
				return false;
			},
		}
	}
)();

/**
	Defined maps that make it easier on saving and loading 
 */
var Maps = {
	"small_mill_a": {
		name: "Testing",
		factory_image: "map1",
		skyline_day: "background1_day",
		skyline_night: "background1_night",
		width: 800,
		height: 600,
		factory_position: {x: 200, y: 200},
		factory_width: 10,
		factory_height: 6,
	},
}