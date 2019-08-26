/**
	Controls time itself. You might say it's the most powerful handler.
	Let's make keeping time simple. You have A time, and you start by adding to it.
	
	TODO
	Imprint local date system, then do addition instead of calculating EVERYTHING from epoch
 */
var Time_handler = (
	function()
	{
		var TIME_PER_TICK = 200;
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
				
				panel = new UIPanel(null,null,300,25);
				
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
				State_manager.add_listener("time_listener","world","time",() => time_display.setText(Time_converter.displayFull(State_manager.get_state("world","time"))));
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
							
							// handle the day 
							if(Time_handler.get_hour() % 24 === 0)
							{
								var day = Time_handler.get_day();
								Industry_handler.close_day(day);
								Reports_handler.close_day(day);
								Money_lender.close_day(day);
							}
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
				speed = 5;
				paused = false;
			},
			
			get_hour: function()
			{
				return Time_converter.getHour(State_manager.get_state("world","time"));
			},
			
			get_day: function()
			{
				return Time_converter.getDay(State_manager.get_state("world","time"));
			},
			
			get_day_stage: function()
			{
				return Time_converter.getDayStage(State_manager.get_state("world","time"));
			},
		}
	}
)();

/**
	Converts time and all that jazz.
 */
var Time_converter = {
	STARTING_WEEKDAY:"Wed.",
	STARTING_DAY: 0,
	STARTING_YEAR: 1800,
	WEEKDAYS:["Mon.","Tue.","Wed.","Thur.","Fri.","Sat.","Sun."],
	HOURS_PER_DAY: 24,
	DAY_TIME: {START: 6, END: 18},
	NIGHT_TIME: {START: 18, END: 6},
	DAYS_PER_YEAR: 365,
	DAYS_PER_LEAPYEAR: 366,
	// for maths 
	DAYS_PER_AVERAGE_YEAR: 365.2422,
	MONTHS:["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],
	DAYS_PER_MONTH_YEAR:[31,28,31,30,31,30,31,31,30,31,30,31],
	DAYS_PER_MONTH_LEAPYEAR:[31,29,31,30,31,30,31,31,30,31,30,31],
	
	/**
		@param time an integer representing the number of hours passed since January 1st 1800
		Displays time in longform string 
		Hour, Weekday, Month Day, Year
		ie: 12am, Wednesday, January 1, 1800
	 */
	displayFull: function(time)
	{
		// the fun part now... dates.
		// naive algorithm
		var hour = Time_converter.getHour(time);
		var days = Math.floor(time / Time_converter.HOURS_PER_DAY) + Time_converter.STARTING_DAY;
		
		var weekday = Time_converter.WEEKDAYS[(Time_converter.WEEKDAYS.indexOf(Time_converter.STARTING_WEEKDAY) + days) % Time_converter.WEEKDAYS.length];
		var year = Time_converter.STARTING_YEAR;
		
		var nextYearIsLeapYear = Time_converter.isLeapYear(year + 1);
		while(days >= Time_converter.DAYS_PER_YEAR || (nextYearIsLeapYear && days >= Time_converter.DAYS_PER_LEAPYEAR))
		{
			
			// reset 
			year++;
			if(nextYearIsLeapYear)
			{
				days -= Time_converter.DAYS_PER_LEAPYEAR;
			}
			else
			{
				days -= Time_converter.DAYS_PER_YEAR;
			}
			nextYearIsLeapYear = Time_converter.isLeapYear(year + 1);
		}
		
		var month_index = 0;
		var month_flag = false;
		if(Time_converter.isLeapYear(year))
		{
			while(month_index < Time_converter.DAYS_PER_MONTH_LEAPYEAR.length && !month_flag)
			{
				if(days >= Time_converter.DAYS_PER_MONTH_LEAPYEAR[month_index])
				{
					days -= Time_converter.DAYS_PER_MONTH_LEAPYEAR[month_index];
					month_index++;
				}
				else 
				{
					month_flag = true;
				}
			}
		}
		else
		{
			while(month_index < Time_converter.DAYS_PER_MONTH_YEAR.length && !month_flag)
			{
				if(days >= Time_converter.DAYS_PER_MONTH_YEAR[month_index])
				{
					days -= Time_converter.DAYS_PER_MONTH_YEAR[month_index];
					month_index++;
				}
				else 
				{
					month_flag = true;
				}
			}
		}
		
		var day = days + 1;
		var month = Time_converter.MONTHS[month_index];
		
		var suffix = "am";
		if(hour >= 12) suffix = "pm";
		// why else would midnight be 12am, or noon be 12pm?
		hour = hour % 12;
		if(hour === 0) hour += 12;
		
		return `${hour}${suffix}, ${weekday} ${month} ${day}, ${year}`;
	},
	
	getHour: function(time)
	{
		var hour = time % Time_converter.HOURS_PER_DAY;
		return hour;
	},
	
	getDay: function(time)
	{
		var day = Math.floor(time / Time_converter.HOURS_PER_DAY);
		return day;
	},
	
	getDayStage: function(time)
	{
		var hour = Time_converter.getHour(time);
		if(hour > Time_converter.DAY_TIME.START && hour <= Time_converter.DAY_TIME.END)
		{
			return "day";
		}
		else
		{
			return "night";
		}
	},
	
	isLeapYear: function(year)
	{
		if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
		{
			return true;
		}
		return false;
	},
}