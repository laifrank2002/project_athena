var Reports_handler = (
	function()
	{
		var panel;
		/* FINANCE */
		var financial_tab;
		var financial_tab_today;
		var financial_tab_yesterday;
		var financial_tab_ereyesterday;
		
		var finance;
		
		return {
			get panel() {return panel},
			
			initialize: function()
			{
				// tabs WITHIN tabs!
				panel = new UITabbedPanel(0,0,800,575);
				
				// financials 
				financial_tab = {};
				financial_tab.panel = new UIPanel(0,0,800,550);
				financial_tab.title = financial_tab.panel.addSubElement(new UILabel("Financial Statements"),400,25);
				financial_tab.title.font_size = 20;
				
				financial_tab_today = {name:"Today"};
				financial_tab_yesterday = {name:"Yesterday"};
				financial_tab_ereyesterday = {name:"Ereyesterday"};
				
				var finance_tab_days = [financial_tab_today,financial_tab_yesterday,financial_tab_ereyesterday];
				for(var index = 0; index < finance_tab_days.length; index++)
				{
					var finance_tab_day = finance_tab_days[index];
					
					finance_tab_day.panel = new UIPanel(null,null,200,400);
					finance_tab_day.title = finance_tab_day.panel.addSubElement(new UILabel(finance_tab_day.name),100,20);
					finance_tab_day.title.font_size = 16;
					finance_tab_day.cash = finance_tab_day.panel.addSubElement(new UILabel(`Cash: ${Currency_converter.displayFull(State_manager.get_state("player","money"))}`,"left"),10,50);
					finance_tab_day.inventory = finance_tab_day.panel.addSubElement(new UILabel(`Inventory: ${Currency_converter.displayFull(0)}`,"left"),10,70);
					finance_tab_day.net_value = finance_tab_day.panel.addSubElement(new UILabel(`Net Value: ${Currency_converter.displayFull(State_manager.get_state("player","money"))}`,"left"),10,100);
					finance_tab_day.wages = finance_tab_day.panel.addSubElement(new UILabel(`Wages: ${Currency_converter.displayFull(0)}`,"left"),10,130);
					financial_tab.panel.addSubElement(finance_tab_day.panel,50 + index * 250,50);
				}
				
				
				panel.addSubPanel("Finance", financial_tab.panel);
				console.log(financial_tab_today);
				// what's a report without records?
				if(State_manager.get_state("history","finance"))
				{
					finance = State_manager.get_state("history","finance");
				}
				else
				{
					finance = [];
					State_manager.set_state("history","finance",finance);
				}
			},
			
			close_day: function(day)
			{
				var cash = State_manager.get_state("player","money");
				var inventory = Inventory_handler.get_inventory_value();
				var net_value = cash + inventory;
				var wages = Industry_handler.get_total_wages();
				
				
				finance.push({day: day,cash:cash,inventory:inventory,net_value:net_value,wages:wages});
				
				// today
				if(finance.length > 0)
				{
					Reports_handler.update_financial_tab_day(financial_tab_today,day);
				}
				// yesterday
				if(finance.length > 1)
				{
					Reports_handler.update_financial_tab_day(financial_tab_yesterday,day - 1);
				}
				// ereyesterday
				if(finance.length > 2)
				{
					Reports_handler.update_financial_tab_day(financial_tab_ereyesterday,day - 2);
				}
			},
			
			/**
				Takes a financial_tab_day, and takes data from finance to update it.
			 */
			update_financial_tab_day: function(financial_tab_day,day)
			{
				if(day - 1 >= 0 && day - 1 < finance.length)
				{
					var current_data = finance[day - 1];
					
					financial_tab_day.cash.setText(`Cash: ${Currency_converter.displayFull(current_data.cash)}`);
					financial_tab_day.inventory.setText(`Inventory: ${Currency_converter.displayFull(current_data.inventory)}`);
					financial_tab_day.net_value.setText(`Net Value: ${Currency_converter.displayFull(current_data.net_value)}`);
					financial_tab_day.wages.setText(`Wages: ${Currency_converter.displayFull(current_data.wages)}`);
				}
			},
		}
	}
)();