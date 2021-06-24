function Sprite(data)
{
	this.frames		= data;
}
Sprite.prototype.draw = function(t, x, y)
{
	var frameIdx = 0;
		
	var offset = (typeof this.frames[frameIdx].offset=='undefined' ?
		[0,0] : this.frames[frameIdx].offset);
	
	ctx.drawImage(tileset,
		this.frames[frameIdx].x, this.frames[frameIdx].y,
		this.frames[frameIdx].w, this.frames[frameIdx].h,
		x + offset[0], y + offset[1],
		this.frames[frameIdx].w, this.frames[frameIdx].h);
};



function Stack(id, qty)
{
	this.type = id;
	this.qty = qty;
}
function Inventory(s)
{
	this.spaces		= s;
	this.stacks		= [];
}
Inventory.prototype.addItems = function(id, qty)
{
	for(var i = 0; i < this.spaces; i++)
	{
		if(this.stacks.length<=i)
		{
			var maxHere = (qty > itemTypes[id].maxStack ?
				itemTypes[id].maxStack : qty);
			this.stacks.push(new Stack(id, maxHere));
			
			qty-= maxHere;
		}
		else if(this.stacks[i].type == id &&
			this.stacks[i].qty < itemTypes[id].maxStack)
		{
			var maxHere = (itemTypes[id].maxStack - this.stacks[i].qty);
			if(maxHere > qty) { maxHere = qty; }
			
			this.stacks[i].qty+= maxHere;
			qty-= maxHere;
		}
		
		if(qty==0) { return 0; }
	}
	
	return qty;
};

function PlacedItemStack(id, qty){
    this.type = id;
	this.qty = qty;
	this.x = 0;
	this.y = 0;
}

function Tile(tx, ty, tt)
{
	this.x			= tx;
	this.y			= ty;
	this.type		= tt;
	this.roof		= null;
	this.roofType	= 0;
	this.eventEnter	= null;
	this.object		= null;
	this.itemStack	= null;
}

function TileMap()
{
	this.map	= [];
	this.w		= 0;
	this.h		= 0;
	this.levels	= 4;
}
TileMap.prototype.buildMapFromData = function(d, w, h)
{
	this.w		= w;
	this.h		= h;
	
	if(d.length!=(w*h)) { return false; }
	
	this.map.length	= 0;
	
	for(var y = 0; y < h; y++)
	{
		for(var x = 0; x < w; x++)
		{
			this.map.push( new Tile(x, y, d[((y*w)+x)]) );
		}
	}
	
	return true;
};
TileMap.prototype.addRoofs = function(roofs)
{
	for(var i in roofs)
	{
		var r = roofs[i];
		
		if(r.x < 0 || r.y < 0 || r.x >= this.w || r.y >= this.h ||
			(r.x+r.w)>this.w || (r.y+r.h)>this.h ||
			r.data.length!=(r.w*r.h))
		{
			continue;
		}for(var y = 0; y < r.h; y++)
		{
			for(var x = 0; x < r.w; x++)
			{
				var tileIdx = (((r.y+y)*this.w)+r.x+x);
				
				this.map[tileIdx].roof = r;
				this.map[tileIdx].roofType = r.data[((y*r.w)+x)];
			}
		}
	}
};


function Character()
{

	this.tileFrom	= [1,1];
	this.tileTo		= [1,1];
	this.timeMoved	= 0;
	this.dimensions	= [30,30];
	this.position	= [45,45];

	this.delayMove	= {};
	this.delayMove[floorTypes.path]			= 400;
	this.delayMove[floorTypes.grass]		= 800;
	this.delayMove[floorTypes.ice]			= 100;
	this.delayMove[floorTypes.conveyorU]	= 200;
	this.delayMove[floorTypes.conveyorD]	= 200;
	this.delayMove[floorTypes.conveyorL]	= 200;
	this.delayMove[floorTypes.conveyorR]	= 200;

	this.direction	= directions.up;
	
	this.sprites = {};
    this.sprites[directions.up]		= new Sprite([{x:0,y:210,w:30,h:30}]);
	this.sprites[directions.right]	= new Sprite([{x:0,y:150,w:30,h:30}]);
	this.sprites[directions.down]	= new Sprite([{x:0,y:120,w:30,h:30}]);
	this.sprites[directions.left]	= new Sprite([{x:0,y:180,w:30,h:30}]);

	
	this.inventory = new Inventory(3);
}
Character.prototype.placeAt = function(x, y)
{
	this.tileFrom	= [x,y];
	this.tileTo		= [x,y];
	this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)),
		((tileH*y)+((tileH-this.dimensions[1])/2))];
};
Character.prototype.processMovement = function(t)
{
	if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { return false; }

	var moveSpeed = this.delayMove[tileTypes[mapTileData.map[toIndex(this.tileFrom[0],this.tileFrom[1])].type].floor];

	if((t-this.timeMoved)>=moveSpeed)
	{
		this.placeAt(this.tileTo[0], this.tileTo[1]);

		if(mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter!=null)
		{
			mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter(this);
		}

		var tileFloor = tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor;

		if(tileFloor==floorTypes.ice)
		{
			if(this.canMoveDirection(this.direction))
			{
				this.moveDirection(this.direction, t);
			}
		}
		else if(tileFloor==floorTypes.conveyorL && this.canMoveLeft())	{ this.moveLeft(t); }
		else if(tileFloor==floorTypes.conveyorR && this.canMoveRight()) { this.moveRight(t); }
		else if(tileFloor==floorTypes.conveyorU && this.canMoveUp())	{ this.moveUp(t); }
		else if(tileFloor==floorTypes.conveyorD && this.canMoveDown())	{ this.moveDown(t); }
	}
	else
	{
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

		if(this.tileTo[0] != this.tileFrom[0])
		{
			var diff = (tileW / moveSpeed) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		}
		if(this.tileTo[1] != this.tileFrom[1])
		{
			var diff = (tileH / moveSpeed) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}

		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
	}

	return true;
}
Character.prototype.canMoveTo = function(x, y)
{
	if(x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
	if(typeof this.delayMove[tileTypes[mapTileData.map[toIndex(x,y)].type].floor]=='undefined') { return false; }
	if(mapTileData.map[toIndex(x,y)].object!=null)
	{
		var o = mapTileData.map[toIndex(x,y)].object;
		if(objectTypes[o.type].collision==objectCollision.solid)
		{
			return false;
		}
	}
	return true;
};
Character.prototype.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
Character.prototype.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
Character.prototype.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
Character.prototype.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };
Character.prototype.canMoveDirection = function(d) {
	switch(d)
	{
		case directions.up:
			return this.canMoveUp();
		case directions.down:
			return this.canMoveDown();
		case directions.left:
			return this.canMoveLeft();
		default:
			return this.canMoveRight();
	}
};

Character.prototype.moveLeft	= function(t) { this.tileTo[0]-=1; this.timeMoved = t; this.direction = directions.left; };
Character.prototype.moveRight	= function(t) { this.tileTo[0]+=1; this.timeMoved = t; this.direction = directions.right; };
Character.prototype.moveUp		= function(t) { this.tileTo[1]-=1; this.timeMoved = t; this.direction = directions.up; };
Character.prototype.moveDown	= function(t) { this.tileTo[1]+=1; this.timeMoved = t; this.direction = directions.down; };
Character.prototype.moveDirection = function(d, t) {
	switch(d)
	{
		case directions.up:
			return this.moveUp(t);
		case directions.down:
			return this.moveDown(t);
		case directions.left:
			return this.moveLeft(t);
		default:
			return this.moveRight(t);
	}
};
Character.prototype.pickUp = function()
{
	if(this.tileTo[0]!=this.tileFrom[0] ||
		this.tileTo[1]!=this.tileFrom[1])
	{
		return false;
	}
	
	var is = mapTileData.map[toIndex(this.tileFrom[0],
				this.tileFrom[1])].itemStack;
	
	if(is!=null)
	{
		var remains = this.inventory.addItems(is.type, is.qty);

		if(remains) { is.qty = remains; }
		else
		{
			mapTileData.map[toIndex(this.tileFrom[0],
				this.tileFrom[1])].itemStack = null;
		}
	}
	
	return true;
};

function toIndex(x, y)
{
	return((y * mapW) + x);
}
