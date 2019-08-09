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
		var statusbar_text;
		
		var background_factory;
		var background_day;
		var background_night;
		var map_offset;
		var viewport;
		
		var settings = {};
		var currently_selected;
		
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
				toolbar = new UIPanel(null,null,panel.width,25);
				panel.addSubElement(toolbar,0,0);
				
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
				
				toolbar.addSubElement(palette);
				
				statusbar = new UIPanel(null,null,panel.width,25);
				statusbar_text = new UILabel(`...`,"left");
				statusbar.addSubElement(statusbar_text,5,5);
				panel.addSubElement(statusbar,0,panel.height - 25);
				
				viewport = new Viewport(0,0,panel.width,panel.height-50);
				
				// data
				
				current_map_name = State_manager.get_state("player","map_name");
				
				background_factory = Engine.assets[Maps[current_map_name].factory];
				background_day = Engine.assets[Maps[current_map_name].skyline_day];
				background_night = Engine.assets[Maps[current_map_name].skyline_night];
				
				map_offset = Maps[current_map_name].factory_position;
				current_map = State_manager.get_state("player","map");
				
				settings = State_manager.get_state("settings","industry");

			},
			
			draw: function(context)
			{
				var x = panel.x;
				var y = panel.y + 25;
				
				var map_x = x + map_offset.x - viewport.x;
				var map_y = y + map_offset.y - viewport.y;
				
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
				current_map.draw(context,map_x,map_y);
				
				// now draw thy mouse shadow
				var grid_x = Math.floor((Engine.mouseX - map_x)/ current_map.TILE_WIDTH);
				var grid_y = Math.floor((Engine.mouseY - map_y)/ current_map.TILE_HEIGHT);
				
				if(!isNaN(currently_selected))
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
					
					if(producer)
					{
						context.globalAlpha = 0.5;
						if(Engine.mouseX >= map_x
							&& Engine.mouseY >= map_y
							&& Engine.mouseX < map_x + current_map.TILE_WIDTH * current_map.width
							&& Engine.mouseY < map_y + current_map.TILE_HEIGHT * current_map.height)
						{
							context.drawImage(image
							,map_x + grid_x * current_map.TILE_WIDTH
							,map_y + grid_y * current_map.TILE_HEIGHT
							,current_map.TILE_WIDTH * producer.width
							,current_map.TILE_HEIGHT * producer.height);
						}
						else 
						{
							context.drawImage(image
							,Engine.mouseX
							,Engine.mouseY
							,current_map.TILE_WIDTH * producer.width
							,current_map.TILE_HEIGHT * producer.height);
						}
						context.globalAlpha = 1.0;
					}
					
				}
				
			},
			
			tick: function()
			{
				current_map.tick();
			},
			
			// handle the day 
			close_day: function()
			{
				// update stats
				
				// pay your employees
				current_map.close_day();
			},
			/**
				Does a lot of things. 
				TODO
				Decompose
			 */
			handle_mouseclick: function(mouseX, mouseY)
			{
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
							// third check that last mouse down was on the same grid to make sure so that if the user mouses away, they don't accidentally build something there.
							var last_grid_x = Math.floor((panel.mousedown.x - map_x)/ current_map.TILE_WIDTH);
							var last_grid_y = Math.floor((panel.mousedown.y - map_y)/ current_map.TILE_HEIGHT);
							if(last_grid_x === grid_x && last_grid_y === grid_y)
							{							
								Industry_handler.buy_and_plop(palette_list[currently_selected],grid_x,grid_y);
								if(!Engine.keysPressed["shift"])
								{
									Industry_handler.deselect_palette();
								}
							}
							else 
							{
								if(!Engine.keysPressed["shift"])
								{
									Industry_handler.deselect_palette();
								}
							}
						}
					}
					else 
					{
						if(!Engine.keysPressed["shift"])
						{
							Industry_handler.deselect_palette();
						}
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
		}
	}
)();
