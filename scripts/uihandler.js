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
				
				ui = [];
				
				// Introduction!
				var introduction = new UIWindow(100,100,600,400,"Uncle's Letter",false,true);
				introduction.addSubElement(new UIImage(128,256,Engine.assets["uncle_moneybags_portrait"]),10,10);
				var text = `To My Most Gracious Nephew, \n \nHow goes your health? I trust that you are doing well. \n \nIf you are reading this letter, it means that unfortunately, I am no longer with you in this world. Do not be saddened by my departure. Instead, think of this as an opportunity. \n \nYou were kind to me in my waning years, and in my many years of life I have acquired many things which I had no use for. Consider then this a debt repaid. \n \nIt is for you to do with as you please, a brand new mill that has gone up with everything it needs except a manager. Go on then, and make your uncle proud. \n \nSir Horace Cecil Anthony Moneybags Sr. KBE`;
				var introduction_textbox = new UITextArea(440,310,text);
				introduction_textbox.line_spacing = 4;
				introduction.addSubElement(introduction_textbox,150,10)
				var introduction_button = new UIButton(200,30,"Alea Iacta Est");
				introduction_button.onmouseclick = () => {introduction.hide();Engine.log("Alea Iacta Est")};
				introduction.addSubElement(introduction_button,200,330);
				
				ui.push(introduction);
				
				var main = new UIWindow(0,0,800,600,"Project Athena");
				ui.push(main);
				
				var content = new UITabbedPanel(0,0,800,575);
				main.addSubElement(content,0,0);
				// tabs
				content.addSubPanel("City",City_handler.panel);
				content.addSubPanel("Factory",Industry_handler.panel);
				content.addSubPanel("Warehouse",Inventory_handler.panel);
				content.addSubPanel("Reports",Reports_handler.panel);
				//var settings_tab = new UIPanel();
				//content.addSubPanel("Settings",settings_tab);
				
				// info display 
				var info_display = new UIPanel(0,0,100,25);
				
				var money_display = new UILabel(`${Currency_converter.displayFull(State_manager.get_state("player","money"))}`,"left");
				State_manager.add_listener("money_listener","player","money",()=>money_display.setText(Currency_converter.displayFull(State_manager.get_state("player","money"))));
				info_display.addSubElement(money_display,10,5);

				content.tab_bar.addSubElement(info_display,400,0);
				content.tab_bar.addSubElement(Time_handler.panel,500,0);
				
				content.hideAllTabs();
				
				// temp 
				City_handler.panel.show();
			},
			
			draw: function(context)
			{
				// draw in reverse order to reflect the order of click propagation
				var elements_to_draw = [...ui].reverse();
				elements_to_draw.forEach(element => element.draw(context));
				/*
				for(uielement in ui)
				{
					ui[uielement].draw(context);
				}
				*/
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
					}
				}
			},
			
			handle_keydown: function(character)
			{
				for(uielement in ui)
				{
					if(ui[uielement].handle_keydown(character))
					{
						return true;
					}
				}
			},
			
			handle_keyup: function(character)
			{
				for(uielement in ui)
				{
					if(ui[uielement].handle_keyup(character))
					{
						
					}
				}
			},
		}
	}
)();

/**
	Viewport object allows further 
	custom functions in the future made generic
	Cuts down on code overhead.
		Ex: getting objects in frame
 */
function Viewport(x,y,width,height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

/**
	Viewport's isInBounds takes the WHOLE object
	instead of just an x,y point into consideration
 */
Viewport.prototype.isInBounds = function(object)
{
	if(object.x + object.width > this.x
		&& object.y + object.height > this.y 
		&& object.x < this.x + this.width 
		&& object.y < this.y + this.height)
	{
		return true;
	}
	return false;
}

Viewport.prototype.move = function(x,y)
{
	this.x += x;
	this.y += y;
}

Viewport.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
}

Viewport.prototype.resize = function(width,height)
{
	if(!isNaN(width)) this.width = width;
	if(!isNaN(height)) this.height = height;
}