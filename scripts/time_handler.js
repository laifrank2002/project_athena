/**
	Controls time itself. You might say it's the most powerful handler.
 */
var Time_handler = (
	function()
	{
		var TIME_PER_TICK = 500;
		var paused;
		var speed;
		
		var timebank;
		
		var panel;
		
		return {
			get panel() {return panel},
			
			initialize: function()
			{
				paused = false;
				speed = 1;
				
				timebank = 0;
				
				panel = new UIPanel(null,null,200,25);
				
				var time_speed_pause = new UIButton(25,25,"",Time_handler.pause);
				time_speed_pause.paint = function(context,x,y)
				{
					context.beginPath();
					context.rect(x+6,y+6,4,13);
					context.rect(x+15,y+6,4,13);
					context.fill();
					context.stroke();
				}
				panel.addSubElement(time_speed_pause,0,0);
				var time_speed_play = new UIButton(25,25,"",Time_handler.play);
				time_speed_play.paint = function(context,x,y)
				{
					context.beginPath();
					context.moveTo(x+7,y+5);
					context.lineTo(x+7,y+20);
					context.lineTo(x+19,y+12);
					context.closePath();
					context.fill();
					context.stroke();
				}
				panel.addSubElement(time_speed_play,25,0);
				var time_speed_fast = new UIButton(25,25,"",Time_handler.fast);
				time_speed_fast.paint = function(context,x,y)
				{
					context.beginPath();
					context.moveTo(x+7,y+5);
					context.lineTo(x+7,y+20);
					context.lineTo(x+13,y+12);
					context.closePath();
					context.fill();
					context.stroke();
					context.beginPath();
					context.moveTo(x+13,y+5);
					context.lineTo(x+13,y+20);
					context.lineTo(x+19,y+12);
					context.closePath();
					context.fill();
					context.stroke();
				}
				panel.addSubElement(time_speed_fast,50,0);
				
				time_display = new UILabel(`${State_manager.get_state("world","time")}`,"left");
				State_manager.add_listener("time_listener","world","time",() => time_display.setText(State_manager.get_state("world","time")));
				panel.addSubElement(time_display,75+5,5);
			},
			
			tick: function(lapse)
			{
				if(!paused)
				{
					timebank += lapse;
					if(speed > 0)
					{
						if(timebank > TIME_PER_TICK / speed)
						{
							timebank -= TIME_PER_TICK / speed;
							// now handle time 
							State_manager.add_state("world","time",1);
							// tick everything else 
							Industry_handler.tick();
						}					
					}
					else 
					{
						Engine.log("Speed is invalid, setting speed back to default (1).");
						speed = 1;
					}
				}
			},
			
			pause: function()
			{
				Engine.log("Time set to pause.");
				paused = true;
			},
			play: function()
			{
				Engine.log("Time set to play.");
				speed = 1;
				paused = false;
			},
			fast: function()
			{
				Engine.log("Time set to fast.");
				speed = 2;
				paused = false;
			},
		}
	}
)();

/**
	Converts time and all that jazz.
 */
var Time_converter = {
	STARTING_DAY:"Wednesday",
	STARTING_YEAR: 1800,
	WEEKDAYS:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
	HOURS_PER_DAY: 24,
	DAYS_PER_YEAR: 365,
	DAYS_PER_LEAPYEAR: 366,
	
	MONTHS:["January","February","March","April","May","June","July","August","September","October","November","December"],
	DAYS_PER_MONTH_YEAR:[31,28,31,30,31,30,31,31,30,31,30,31],
	DAYS_PER_MONTH_LEAPYEAR:[31,29,31,30,31,30,31,31,30,31,30,31],
	
	/**
		@param time an integer representing the number of hours passed since January 1st 1800
		Displays time in longform string 
		Hour ,Weekday, Month Day, Year
		ie: 12am, Wednesday, January 1, 1800
	 */
	displayFull: function(time)
	{
		// the fun part now... dates.
		
	}
}