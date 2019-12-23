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
			
			economy_panel: null,
			economy_title: null,
			economy_goods_table: null,
			economy_goods_panel: null,
			economy_goods: null,
			
		};
		Object.assign(element, fields);
		
		var methods = {
			initialize: function()
			{				
				this.content = new UITabbedPanel(null,null,this.width,this.height - this.title_bar.height);
				this.addSubElement(this.content);
				
				// statistics panel
				this.statistics_panel = new UIScrollPanel(null,null,this.content_panel.width,this.content.content_panel.height,1000);
				this.content.addSubPanel("Statistics",this.statistics_panel);
				
				this.statistics_title = new UILabel("Town Statistics","center");
				this.statistics_title.font_size = 20;
				this.statistics_panel.addSubElement(this.statistics_title, this.statistics_panel.width/2, 50);
				
				this.statistics_population = new UILabel("Population: ","left");
				this.statistics_panel.addSubElement(this.statistics_population, 50, 75);
				
				// economy panel 
				this.economy_panel = new UIScrollPanel(null,null,this.content_panel.width,this.content.content_panel.height,1000);
				this.content.addSubPanel("Economy",this.economy_panel);
				
				this.economy_title = new UILabel("Economy","center");
				this.economy_title.font_size = 20;
				this.economy_panel.addSubElement(this.economy_title, this.economy_panel.content_panel.width/2, 50);
				
				this.economy_goods_table = new UITable(this.statistics_panel.width - 50,500,0,4);
				this.economy_goods_table.add_row(["Name","Count","Produced","Consumed"]);
				this.economy_goods = [];
				//var top_y = 10;
				for(var key in Item.prototype.items)
				{
					this.economy_goods_table.add_row([Item.prototype.items[key]["name"],'0','0','0']);
					this.economy_goods.push({key: key});
				}
				this.economy_panel.addSubElement(this.economy_goods_table,10,125);
				
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
				
				// and economics 
				for(var index = 0; index < this.economy_goods.length; index++)
				{
					this.economy_goods_table.set_cell(current_city.economy.get_amount(this.economy_goods[index].key),1,index + 1);
				}
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