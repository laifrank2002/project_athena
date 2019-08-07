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
				
				var display_count = 0;
				for(var key in inventory)
				{
					Inventory_handler.create_item_display(inventory[key]);
					display_count++;
				}
				
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
				
				display.addSubElement(new UILabel(item.name,"left"),10,10);
				display.addSubElement(new UILabel(`Market value: ${Currency_converter.displayFull(item.market_value)}`,"left"),10,30);
				var average_price = new UILabel(`Bought for : ${Currency_converter.displayFull(item.average_price)}`,"left");
				display.addSubElement(average_price,10,50);
				var stock = new UILabel(`Stock: ${item.count.toLocaleString()} units`,"left");
				display.addSubElement(stock,10,70);
				panel.addSubElement(display, 0, last_y + last_height);
				
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
				Inventory.buy_item(name, amount, price);
			},
			
			sell_item: function(name, amount, price)
			{
				Inventory.sell_item(name, amount, price);	
			},
		}
	}
)();