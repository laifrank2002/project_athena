/**
	Takes some input and creates something out of it.
 */
function Producer(type_key)
{
	if(this.types[type_key])
	{
		var type = this.types[type_key];
		MapObject.call(this,type.width,type.height);
		this.image = Engine.assets[type.image];
	}
	else 
	{
		Engine.log(`Producer: there is no such producer ${type_key}.`);
		MapObject.call(this,1,1);
	}
}

Producer.prototype = Object.create(MapObject.prototype);
Object.defineProperty(Producer.prototype, 'constructor', {
	value: Producer,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

Producer.prototype.types = {
	"spinster": {
		width: 1,
		height: 1,
		image: "spinster",
		animation_frames: ["spinster1","spinster2"],
	},
}

Producer.prototype.ANIMATION_COOLDOWN = 1000;

Producer.prototype.draw = function(context,x,y)
{
	if(this.occupiedTiles)
	{
		var grid_x = this.occupiedTiles[0].x;
		var grid_y = this.occupiedTiles[0].y;
		if(this.image)
		{
			context.drawImage(this.image
				,x + grid_x * Map.prototype.TILE_WIDTH
				,y + grid_y * Map.prototype.TILE_HEIGHT
				,Map.prototype.TILE_WIDTH
				,Map.prototype.TILE_HEIGHT);
		}
	}
}

Producer.prototype.tick = function()
{
	
}