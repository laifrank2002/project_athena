/**
	A grid.
	Stores 
		- Tiles
		- Objects
	Performs
		- Drawing 
		- Ticking
		- Validating Objects 
		- Adding and Removing Objects 
 */
function Map(width,height)
{
	this.width = width;
	this.height = height;
	
	// create the tile map and set neighbours
	this.tiles = [];
	for(var index = 0, length = width * height; index < length; index++)
	{
		this.tiles.push(new Tile(index % width, Math.floor(index / width)));
	}
	
	this.tiles.forEach(tile => 
		{
			var x = tile.x;
			var y = tile.y;
			// north 
			if(y < this.height - 1) tile.neighbours.north = this.getTile(x,y + 1);
			// south 
			if(y > 0) tile.neighbours.south = this.getTile(x,y - 1);
			// east 
			if(x < this.width - 1) tile.neighbours.east = this.getTile(x + 1,y);
			// west 
			if(x > 0) tile.neighbours.west = this.getTile(x - 1,y);
		}
	);
	
	this.objects = [];
	
	// non-generic
	this.producers = {};
	this.initialize();
}

Map.prototype.TILE_WIDTH = 32;
Map.prototype.TILE_HEIGHT = 32;

/**
	Makes initialization easier, and 
	On savings/loadings, in case we added new producers
	
	That means this must be LOAD SAFE. As in, if it detects any previous data, will not overide anything.
 */
Map.prototype.initialize = function()
{
	var producers = Producer.prototype.types;
	for(var key in producers)
	{
		var producer = this.producers[key];
		if(producer)
		{
			// add other properties
			// TODO
		}
		else 
		{
			this.producers[key] = {count:0, options:{}};
			
			var productions = Producer.prototype.types[key].production;
			
			for(var option in productions)
			{
				this.producers[key].options[option] = {count: 0};
				//production[option];
			}
		}
	}
}

Map.prototype.draw = function(context,x=0,y=0)
{
	// draw grid 
	for(var index = 0, length = this.width * this.height; index < length; index++)
	{
		var grid_x = index % this.width;
		var grid_y = Math.floor(index / this.width);
		context.beginPath();
		context.rect(x + grid_x * this.TILE_WIDTH 
			,y + grid_y * this.TILE_HEIGHT 
			,this.TILE_WIDTH 
			,this.TILE_HEIGHT);
		context.stroke();
	}
	
	this.objects.forEach(object => object.draw(context,x,y));
}

Map.prototype.tick = function()
{
	this.objects.forEach(object => object.tick());
}

Map.prototype.plopObject = function(object, x, y)
{
	// validate first to save time and prevent errors
	if(x < 0 || x + object.width > this.width || y < 0 || y + object.height > this.height)
	{
		Engine.log(`GridMap: plop out of bounds at (${x},${y}).`);
		Engine.notify(`Object out of bounds!`);
		return false;
	}
	
	// for special cases
	if(object.plopValidationFunction)
	{
		if(!object.plopValidationFunction(this, x, y))
		{
			Engine.log(`GridMap: Unable to unplop, validation function failed.`);
			Engine.notify(`Unable to place object.`);
			return false;
		}
	}
	
	// check each and every coordinate 
	// otherwise, return false
	var occupiedTiles = [];
	for(var index = 0, length = object.width * object.height; index < length; index++)
	{
		var tile = this.getTile(index % object.width + x, Math.floor(index / object.width) + y);
		if(tile.occupied) 
		{
			return false;
			Engine.notify(`Tile already occupied.`);
		}
		occupiedTiles.push(tile);
	}
	// check one last time to make sure object isn't already plopped 
	if(!object.plop(occupiedTiles)) return false;
	
	// since it is all clear, then proceed and set everything
	occupiedTiles.forEach(tile => tile.setOccupied(object));
	this.addObject(object);
	return true;
}

Map.prototype.unplopObject = function(object)
{	
	if(object.unplopValidationFunction)
	{
		if(!object.unplopValidationFunction(this))
		{
			Engine.log(`GridMap: Unable to unplop, validation function failed.`);
			Engine.notify(`Unable to destroy object.`);
			return false;
		}
	}
	
	var occupiedTiles = object.occupiedTiles;
	if(!object.unplop()) return false;
	
	// since it is all clear, then proceed and set everything
	occupiedTiles.forEach(tile => tile.clearOccupied());
	object.occupiedTiles = null;
	this.removeObject(object);
	return true;
}

Map.prototype.addObject = function(object)
{
	this.objects.push(object);
}

Map.prototype.removeObject = function(object)
{
	object.active = false;
	this.objects = this.objects.filter(object => object.active);
}

Map.prototype.getTile = function(x,y)
{
	if(this.isInBounds(x,y)) return this.tiles[y * this.width + x];
	return null;
}

Map.prototype.getObjects = function()
{
	return this.objects;
}
/**
	If a set of coordinates is within the map, return true.
 */
Map.prototype.isInBounds = function(x,y)
{
	if(x >= 0 && x < this.width && y >= 0 && y < this.height)
	{
		return true;
	}
	return false;
}

/**
	**Utility**
	Translates a list of coordinates by an amount x,y
 */
Map.prototype.translateCoordinates = function(coordinateList, x, y)
{
	var newCoordinateList = [];
	for(var index = 0; index < coordinateList.length; index++)
	{
		var coordinate = coordinateList[index];
		newCoordinateList.push({x:coordinate.x + x, y:coordinate.y + y});
	}
	return newCoordinateList;
}
/**
	A standard representation of a tile. 
	Stores 
		- x 
		- y
		- Currently occupied object, if any 
		- Any neighbours
 */
function Tile(x,y)
{
	this.x = x;
	this.y = y;
	this.occupied = null;
	this.neighbours = {north: null, south: null, east: null, west: null};
}

Tile.prototype.setNeighbours = function(north,south,east,west)
{
	this.neighbours = {north:north, south: south, east: east, west: west};
}

Tile.prototype.getNeighbours = function()
{
	return this.neighbours;
}

Tile.prototype.setOccupied = function(occupied)
{
	this.occupied = occupied;
}

Tile.prototype.clearOccupied = function()
{
	this.occupied = null;
}
/**
	A map object. 
	Stores 
		- Occupied tiles 
	Knows
		- width 
		- height
	Performs 
		- Draw 
		- Tick
		- Plop and unplop
		- Check neighbouring objects
 */
function MapObject(width, height)
{
	this.width = width;
	this.height = height;
	
	this.occupiedTiles = null;
	this.isPlopped = false;
	this.active = true;
}

MapObject.prototype.draw = function(context,x,y)
{
	
}

MapObject.prototype.tick = function()
{
	
}

MapObject.prototype.plop = function(occupiedTiles)
{
	if(this.isPlopped)
	{
		Engine.log(`Object is already plopped!`);
		return false;
	}
	this.isPlopped = true;
	this.occupiedTiles = occupiedTiles;
	return true;
}

MapObject.prototype.unplop = function()
{
	if(!this.isPlopped)
	{
		Engine.log(`Object isn't plopped yet!`);
		return false;
	}
	this.isPlopped = false;
	this.occupiedTiles = null;
	return true;
}