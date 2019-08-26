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
		// whatwhich holds everything in the display.
		// compartimentalize!
		var inventory_capacity;
		var inventory_information_panel;
		
		var item_display_panel;
		
		return {
			get panel() {return panel},
			get inventory() {return inventory},
			
			initialize: function()
			{
				panel = new UIScrollPanel(0,0,800,575,800);
				inventory = new Inventory(500);
				
				// inventory and capacity
				inventory_information_panel = new UIPanel(null,null,panel.width,100);
				inventory_capacity = new UILabel(`Capacity: ${inventory.utilized_capacity}/${inventory.capacity}`,"center");
				inventory_information_panel.addSubElement(inventory_capacity,inventory_information_panel.width/2,inventory_information_panel.height/2);
				panel.addSubElement(inventory_information_panel,0,0);
				
				// item display panel 
				item_display_panel = new UIPanel(null,null,panel.width,panel.height);
				
				var display_count = 0;
				for(var key in inventory.items)
				{
					item_display_panel.addSubElement(Inventory_handler.create_item_display(inventory.getItem(key))
						,0
						,DISPLAY_HEIGHT * display_count);
					display_count++;
				}
				
				item_display_panel.resize(panel.width,display_count * DISPLAY_HEIGHT);
				panel.addSubElement(item_display_panel, 0, 100);
				
				panel.resizeMaxHeight(display_count * DISPLAY_HEIGHT);
				
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
				
				display.addSubElement(new UIImage(80,80,Engine.assets[items[item.key].icon]),10,10);
				display.addSubElement(new UILabel(item.name,"left"),100,10);
				display.addSubElement(new UILabel(`Market value: ${Currency_converter.displayFull(item.market_value)}`,"left"),100,30);
				var average_price = new UILabel(`Bought for : ${Currency_converter.displayFull(item.average_price)}`,"left");
				display.addSubElement(average_price,100,50);
				var stock = new UILabel(`Stock: ${item.count.toLocaleString()} units`,"left");
				display.addSubElement(stock,100,70);
				
				var buyTextField = new UITextField(150,25);
				buyTextField.setText("0");
				display.addSubElement(buyTextField,600,10);
				
				var buyButton = new UIButton(75,25,"Buy");
				// TODO, decompose into a separate method 
				// Check if IS valid number from text
				buyButton.onmouseclick = () =>
				{
					var text = buyTextField.getText();
					// we try to parse num ONLY if it is valid.
					// Number is a good choice here as it fails is there is string characters in text
					var number = Number(text);
					if(!isNaN(number))
					{
						Inventory_handler.buy_item(item.key, number, item.market_value);
					}
				}
				display.addSubElement(buyButton,500,10);
				
				var sellTextField = new UITextField(150,25);
				sellTextField.setText("0");
				display.addSubElement(sellTextField,600,60);
				
				var sellButton = new UIButton(75,25,"Sell");
				sellButton.onmouseclick = () =>
				{
					var text = sellTextField.getText();
					// we try to parse num ONLY if it is valid.
					// Number is a good choice here as it fails is there is string characters in text
					var number = Number(text);
					if(!isNaN(number))
					{
						Inventory_handler.sell_item(item.key, number, item.market_value);
					}
				}
				display.addSubElement(sellButton,500,60);
				
				displays.push({display: display
					,item: item
					,average_price:average_price
					,stock:stock});
					
				return display;
			},
			
			
			
			update: function()
			{
				inventory_capacity.setText(`Capacity: ${inventory.utilized_capacity.toLocaleString()}/${inventory.capacity.toLocaleString()}`);
				
				displays.forEach(display =>
					{
						display.average_price.setText(`Bought for : ${Currency_converter.displayFull(display.item.average_price)}`);
						display.stock.setText(`Stock: ${display.item.count.toLocaleString()} units`);
					}
				);
			},
			
			// temporary for modal 
			buy_item: function(name, amount, price)
			{
				
				inventory.buyItem(name, amount, price);
			},
			
			sell_item: function(name, amount, price)
			{
				inventory.sellItem(name, amount, price);	
			},
			
			get_inventory_value: function()
			{
				return inventory.getTotalValue();
			},
		}
	}
)();