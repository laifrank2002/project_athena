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
		
		return {
			initialize: function()
			{
				paused = false;
				speed = 1;
				
				timebank = 0;
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