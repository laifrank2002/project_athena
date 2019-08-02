var UIHandler = (
	function()
	{
		var mousedown;
		var ui;
		
		return {
			
			get mousedown() { return mousedown },
			get ui() { return ui },
			
			initialize: function()
			{
				mousedown = null;
				ui = {};	
				
				ui["content"] = new UITabbedPanel(0,0,800,600);
				
				ui["content"].addSubPanel("Factory",Industry_handler.panel);
				ui["content"].addSubPanel("Warehouse",Inventory_handler.panel);
				var settings_tab = new UIPanel();
				ui["content"].addSubPanel("Settings",settings_tab);
				
				var info_display = new UIPanel(0,0,300,25);
				
				var money_display = new UILabel(`${Currency_converter.displayFull(State_manager.get_state("player","money"))}`,"left");
				State_manager.add_listener("money_listener","player","money",()=>money_display.setText(Currency_converter.displayFull(State_manager.get_state("player","money"))));
				info_display.addSubElement(money_display,10,5);
				
				var time_speed_pause = new UIButton(25,25,"",Time_handler.pause);
				time_speed_pause.paint = function(context,x,y)
				{
					context.fillStyle = UIElement.prototype.darker_colour;
					context.beginPath();
					context.rect(x+6,y+6,4,13);
					context.rect(x+15,y+6,4,13);
					context.fill();
					context.stroke();
				}
				info_display.addSubElement(time_speed_pause,100,0);
				var time_speed_play = new UIButton(25,25,"",Time_handler.play);
				time_speed_play.paint = function(context,x,y)
				{
					context.fillStyle = UIElement.prototype.darker_colour;
					context.beginPath();
					context.moveTo(x+5,y+5);
					context.lineTo(x+5,y+20);
					context.lineTo(x+17,y+12);
					context.closePath();
					context.fill();
				}
				info_display.addSubElement(time_speed_play,125,0);
				var time_speed_fast = new UIButton(25,25,"",Time_handler.fast);
				time_speed_fast.paint = function(context,x,y)
				{
					context.fillStyle = UIElement.prototype.darker_colour;
					context.beginPath();
					context.moveTo(x+7,y+5);
					context.lineTo(x+7,y+20);
					context.lineTo(x+13,y+12);
					context.closePath();
					context.fill();
					context.stroke();
					context.beginPath();
					context.moveTo(x+13,y+5);
					context.lineTo(x+13,y+20);
					context.lineTo(x+19,y+12);
					context.closePath();
					context.fill();
					context.stroke();
				}
				info_display.addSubElement(time_speed_fast,150,0);
				
				var time_display = new UILabel(`Day: ${State_manager.get_state("world","time")}`,"left")
				info_display.addSubElement(time_display,175+5,5);
				
				ui["content"].addSubElement(info_display,500,0);
				
				ui["content"].hideAllTabs();
				
				// tabs or pseudopages				
				// process this element last, as it is special
				// ui["shop"] = Shop;
				
			},
			
			draw: function(context)
			{
				for(uielement in ui)
				{
					ui[uielement].draw(context);
				}
			},
			
			handle_mousedown: function(mouseX,mouseY)
			{
				for(uielement in ui)
				{
					// if any one of the ui first registers propagation
					// return true as only one mouse down should be registered.
					if(ui[uielement].handle_mousedown(mouseX,mouseY))
					{
						mousedown = new Point(mouseX, mouseY);
						return true;
					}
				}
				// if nothing, then return 
				return false;
			},
			
			handle_mouseup: function(mouseX,mouseY)
			{
				for(uielement in ui)
				{
					// register mouseup for all ui elements to remove last_mousedown
					if(ui[uielement].handle_mouseup(mouseX,mouseY))
					{
						mousedown = null;
						return true;
					}
				}
			},
			
		}
	}
)();