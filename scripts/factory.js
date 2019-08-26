/**
	An implementation of a Factory, intended to replace Industry_handler.
	All that's needed in a preset map_name.
 */
function Factory(map_name)
{
	if(!this.maps[map_name])
	{
		Engine.log(`Factory.constructor: No such map ${map_name} exists`);
		return null;
	}
	
	this.type = new type;
	
	this.type = this.maps[map_name];
	this.map_name = map_name;
	
	this.name = this.type.name;
	
	this.background_width = this.type.background_width;
	this.background_height = this.type.background_height;
	this.background_image = this.type.factory_image;
	
	this.skyline_day_image = this.type.skyline_day;
	this.skyline_night_image = this.type.skyline_night;
	
	this.factory_position = this.type.factory_position;
	
	this.producers = {};
	
	Map.call(this,this.type.factory_width,this.type.factory_height);
}

Factory.prototype = Object.create(Map.prototype);
Object.defineProperty(Factory.prototype, 'constructor', {
	value: Factory,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
	
/* preset maps */
Factory.prototype.maps = {
	"small_mill_a": {
		name: "Testing",
		factory_image: "map1",
		skyline_day: "background1_day",
		skyline_night: "background1_night",
		background_width: 800,
		background_height: 600,
		
		factory_position: {x: 200, y: 200},
		factory_width: 10,
		factory_height: 6,
	},
}