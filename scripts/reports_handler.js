var Reports_handler = (
	function()
	{
		var panel;
		var financial_tab;
		return {
			get panel() {return panel},
			
			initialize: function()
			{
				// tabs WITHIN tabs!
				panel = new UITabbedPanel(0,0,800,575);
				
				// financials 
				financial_tab = new UIPanel(0,0,800,550);
				financial_tab.addSubElement(new UILabel("Financial Statements"),400,25);
				
				panel.addSubPanel("Finance", financial_tab);
				
			},
			
			update_financial_tab: function()
			{
				
			},
		}
	}
)();