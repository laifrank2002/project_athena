/**
	Periodically updates the inventory tab.
 */
var Inventory_handler = (
	function()
	{
		var DISPLAY_WIDTH = 775;
		var DISPLAY_HEIGHT = 100;
		
		// separate rendering and data
		var displays = {};
		var panel;
		// whatwhich holds everything in the display.
		// compartmentalize!
		var inventory;
		
		var inventory_capacity;
		var inventory_information_panel;
		
		var item_display_panel;
		
		return {
			get panel() {return panel},
			get inventory() {return inventory},
			
			initialize: function()
			{
				panel = new UIScrollPanel(0,0,800,575,800);
				
				// inventory and capacity
				inventory_information_panel = new UIPanel(null,null,panel.width,100);
				inventory_capacity = new UILabel(`Capacity: ${0}/${0}`,"center");
				inventory_information_panel.addSubElement(inventory_capacity,inventory_information_panel.width/2,inventory_information_panel.height/2);
				panel.addSubElement(inventory_information_panel,0,0);
				
				// item display panel 
				item_display_panel = new UIPanel(null,null,panel.width,panel.height);
				
				var display_count = 0;
				for(var key in Item.prototype.items)
				{
					var item = Item.prototype.items[key];
					item_display_panel.addSubElement(Inventory_handler.create_item_display(item,key)
						,0
						,DISPLAY_HEIGHT * display_count);
					display_count++;
				}
				
				item_display_panel.resize(panel.width,display_count * DISPLAY_HEIGHT);
				panel.addSubElement(item_display_panel, 0, 100);
				
				panel.resizeMaxHeight(display_count * DISPLAY_HEIGHT + 200);
				
				// data 
				inventory = State_manager.get_state("player","city").warehouse;
			},
			
			/**
				Creates AND appends a new item display
			 */
			create_item_display: function(item,key)
			{
				var display = new UIPanel(0,0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
				
				display.addSubElement(new UIImage(80,80,Engine.assets[item.icon]),10,10);
				display.addSubElement(new UILabel(item.name,"left"),100,10);
				display.addSubElement(new UILabel(`Market value: ${Currency_converter.displayFull(item.market_value)}`,"left"),100,30);
				var average_price = new UILabel(`Bought for : ${Currency_converter.displayFull(item.average_price)}`,"left");
				display.addSubElement(average_price,100,50);
				var stock = new UILabel(`Stock: ${(0).toLocaleString()} units`,"left");
				display.addSubElement(stock,100,70);
				
				var buyTextField = new UITextField(150,25);
				buyTextField.setText("0");
				buyTextField.onenter = function(){this.setText(normalize_number_string(this.text))};
				display.addSubElement(buyTextField,600,10);
				
				var buyButton = new UIButton(75,25,"Buy");
				// TODO, decompose into a separate method 
				// Check if IS valid number from text
				buyButton.onmouseclick = () =>
				{
					buyTextField.setText(normalize_number_string(buyTextField.getText()));
					var text = buyTextField.getText();
					// we try to parse num ONLY if it is valid.
					// Number is a good choice here as it fails is there is string characters in text
					var number = Number(text);
					if(!isNaN(number))
					{
						Inventory_handler.buy_item(key, number, item.market_value);
						Inventory_handler.update();
					}
				}
				display.addSubElement(buyButton,500,10);
				
				var sellTextField = new UITextField(150,25);
				sellTextField.setText("0");
				sellTextField.onenter = function(){this.setText(normalize_number_string(this.text))};
				display.addSubElement(sellTextField,600,60);
				
				var sellButton = new UIButton(75,25,"Sell");
				sellButton.onmouseclick = () =>
				{
					sellTextField.setText(normalize_number_string(sellTextField.getText()));
					var text = sellTextField.getText();
					// we try to parse num ONLY if it is valid.
					// Number is a good choice here as it fails is there is string characters in text
					var number = Number(text);
					if(!isNaN(number))
					{
						Inventory_handler.sell_item(key, number, item.market_value);
						Inventory_handler.update();
					}
				}
				display.addSubElement(sellButton,500,60);
				
				displays[key] = {display: display
					,item: item
					,average_price:average_price
					,stock:stock};
					
				return display;
			},
			
			
			
			update: function()
			{
				inventory_capacity.setText(`Capacity: ${inventory.utilized_capacity.toLocaleString()}/${inventory.capacity.toLocaleString()}`);
				
				for(var key in displays)
				{
					var item = inventory.get_item(key);
					var display = displays[key];
					display.average_price.setText(`Bought for : ${Currency_converter.displayFull(item.average_price)}`);
					display.stock.setText(`Stock: ${item.amount.toLocaleString()} units`);
				}
			},
			
			// temporary for modal 
			buy_item: function(name, amount, price)
			{
				if(!inventory) return false;
				
				if(State_manager.get_state("player","money") >= price * amount)
				{
					// You CAN'T buy items over limit.
					var item_amount = inventory.add_amount(name, amount, price);

					if(item_amount) // if 0, gets false, therefore works as intended.
					{
						State_manager.add_state("player","money",-price*item_amount);
						return true;
					}
				}
			},
			
			sell_item: function(name, amount, price)
			{
				if(!inventory) return false;

				var item_amount = inventory.get_item(name).amount;
				if(item_amount > amount)
				{
					item_amount = amount;
				}
				
				if(inventory.add_amount(name, -item_amount))
				{
					State_manager.add_state("player","money",price * item_amount);
				}
				
			},
			
			get_inventory_value: function()
			{
				return inventory.get_total_value();
			},
		}
	}
)();