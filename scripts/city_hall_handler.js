/**
	Can't fight it? Take it to da city hall!
	Responsible for 
		[ ] *SPECIAL* contracts
		[ ] Stats about DEMAND and SUPPLY! Finally, we get to see those peasants starve in real time!
		[ ] Other stats, like health, income, etc etc etc...
		[ ] POLITICS! Taxation, and other goody stuff; 
		[ ] TAXES! And DEATH too! Nah, just kidding, but BANKRUPTCY will be handled here (luckily, not at the loan shark).
 */
var City_hall_handler = (
	function()
	{
		var element = new UIWindow(0,0,400,500,"City Hall",true,true);
	
		var fields = {
			content: null,
			
			statistics: null,
		};
		Object.assign(element, fields);
		
		var methods = {
			initialize: function()
			{				
				this.content = new UITabbedPanel(null,null,this.width,this.height - this.title_bar.height);
				this.addSubElement(this.content);
				
				this.content.addSubPanel("Statistics",new UIScrollPanel(null,null,this.width,this.content.content_panel.height,1000));
				
			},
			
			onshow: function()
			{
				this.update();
			},
			
			update: function()
			{
				// set the city hall title to the current city, as an extra little touch;
				var current_city = City_handler.city;
				this.setTitle(`${current_city.name} Town Hall`);
				
				// also updates statistics
			},
			
			close_day: function(day)
			{
				this.update();
			},
		};
		Object.assign(element, methods);
		
		return element;
	}
)();