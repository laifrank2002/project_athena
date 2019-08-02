/**
	Controls time itself. You might say it's the most powerful handler.
 */
var Time_handler = (
	function()
	{
		return {
			initialize: function()
			{
				
			},
			pause: function()
			{
				Engine.log("Time set to pause");
			},
			play: function()
			{
				Engine.log("Time set to play");
			},
			fast: function()
			{
				Engine.log("Time set to fast");
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
	DAYS_PER_YEAR: 365,
	DAYS_PER_LEAPYEAR: 366,
	
	MONTHS:["January","February","March","April","May","June","July","August","September","October","November","December"],
	DAYS_PER_MONTH_YEAR:[31,28,31,30,31,30,31,31,30,31,30,31],
	DAYS_PER_MONTH_LEAPYEAR:[31,29,31,30,31,30,31,31,30,31,30,31],
	
	/**
		@param time an integer representing the number of days passed since January 1st 1800
		Displays time in longform string 
		Weekday, Month Day, Year
		ie: Wednesday, January 1, 1800
	 */
	displayFull: function(time)
	{
		var weekday = Time_converter.WEEKDAYS[(Time_converter.WEEKDAYS.indexOf(Time_converter.STARTING_DAY)+time)%Time_converter.WEEKDAYS.length];
		
		// the fun part now... dates.
		
	}
}