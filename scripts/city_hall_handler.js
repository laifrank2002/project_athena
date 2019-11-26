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
			
			statistics_panel: null,
			statistics_title: null,
			statistics_population: null,
		};
		Object.assign(element, fields);
		
		var methods = {
			initialize: function()
			{				
				this.content = new UITabbedPanel(null,null,this.width,this.height - this.title_bar.height);
				this.addSubElement(this.content);
				
				// statistics panel
				this.statistics_panel = new UIScrollPanel(null,null,this.width,this.content.content_panel.height,1000);
				this.content.addSubPanel("Statistics",this.statistics_panel);
				
				this.statistics_title = new UILabel("Town Statistics","center");
				this.statistics_title.font_size = 20;
				this.statistics_panel.addSubElement(this.statistics_title, this.statistics_panel.width/2, 50);
				this.statistics_population = new UILabel("Population: ","left");
				this.statistics_panel.addSubElement(this.statistics_population, 50, 75);
			},
			
			onshow: function()
			{
				this.update();
			},
			
			update: function()
			{
				if(this.hidden) return;
				// set the city hall title to the current city, as an extra little touch;
				var current_city = City_handler.city;
				this.setTitle(`${current_city.name} Town Hall`);
				
				// also updates statistics
				this.statistics_population.setText(`Population: ${Math.floor(current_city.population)}`);
			},
			
			close_day: function(day)
			{
				this.update();
			},
			
			close_week: function(week)
			{
				this.update();
			},
		};
		Object.assign(element, methods);
		
		return element;
	}
)();