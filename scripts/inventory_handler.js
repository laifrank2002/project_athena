/**
	Periodically updates the inventory tab.
 */
var Inventory_handler = (
	function()
	{
		var DISPLAY_WIDTH = 775;
		var DISPLAY_HEIGHT = 100;
		
		var inventory;
		var displays = [];
		var panel;
		return {
			get panel() {return panel},

			initialize: function()
			{
				panel = new UIScrollPanel(0,0,800,575,800);
				inventory = Inventory.inventory;
				for(var key in inventory)
				{
					Inventory_handler.create_item_display(inventory[key]);
				}
				
				State_manager.set_state("player","inventory",inventory);
			},
			
			/**
				Creates AND appends a new item display
			 */
			create_item_display: function(item)
			{
				// get the last item display in order to get the correct heights.
				var last_y;
				var last_height;
				if(displays.length === 0)
				{
					last_y = 0;
					last_height = 0;
				}
				else 
				{
					last_y = displays[displays.length - 1].display.relative_y;
					last_height = displays[displays.length - 1].display.height;
				}
				var display = new UIPanel(0,last_y + last_height, DISPLAY_WIDTH, DISPLAY_HEIGHT);
				
				display.addSubElement(new UILabel(item.name,"left"),10,10);
				display.addSubElement(new UILabel(`Market value: ${Currency_converter.displayFull(item.market_value)}`,"left"),10,30);
				var average_price = new UILabel(`Bought for : ${Currency_converter.displayFull(item.average_price)}`,"left");
				display.addSubElement(average_price,10,50);
				var stock = new UILabel(`Stock: ${item.count.toLocaleString()} units`,"left");
				display.addSubElement(stock,10,70);
				panel.addSubElement(display, 0, last_y + last_height);
				
				displays.push({display: display
					,item: item
					,average_price:average_price
					,stock:stock});
				return display;
			},
			
			update: function()
			{
				displays.forEach(display =>
					{
						display.average_price.setText(`Bought for : ${Currency_converter.displayFull(display.item.average_price)}`);
						display.stock.setText(`Stock: ${display.item.count.toLocaleString()} units`);
					}
				);
			},
		}
	}
)();