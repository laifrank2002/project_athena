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