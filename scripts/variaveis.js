var ctx = null;
var gameMap = [
	0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 2, 2, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 2, 1, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 2, 1, 0, 2, 2, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 2, 1, 0, 2, 2, 0, 4, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
	0, 1, 1, 2, 2, 2, 2, 2, 0, 4, 4, 4, 1, 1, 1, 0, 2, 2, 2, 0,
	0, 1, 1, 2, 1, 0, 2, 2, 0, 1, 1, 4, 1, 1, 1, 0, 2, 2, 2, 0,
	0, 1, 1, 2, 1, 0, 2, 2, 0, 1, 1, 4, 1, 1, 1, 0, 2, 2, 2, 0,
	0, 1, 1, 2, 1, 0, 0, 0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 2, 0, 0,
	0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 2, 2, 2, 2, 0,
	0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 4, 4, 1, 1, 0, 2, 2, 2, 2, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 0, 2, 2, 2, 2, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 0, 2, 2, 2, 2, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var mapTileData = new TileMap();

var roofList = [
	{ x:5, y:3, w:4, h:7, data: [
		10, 10, 11, 11,
		10, 10, 11, 11,
		10, 10, 11, 11,
		10, 10, 11, 11,
		10, 10, 11, 11,
		10, 10, 11, 11,
		10, 10, 11, 11
	]},
	{ x:15, y:5, w:5, h:4, data: [
		10, 10, 11, 11, 11,
		10, 10, 11, 11, 11,
		10, 10, 11, 11, 11,
		10, 10, 11, 11, 11
	]},
	{ x:14, y:9, w:6, h:7, data: [
		10, 10, 10, 11, 11, 11,
		10, 10, 10, 11, 11, 11,
		10, 10, 10, 11, 11, 11,
		10, 10, 10, 11, 11, 11,
		10, 10, 10, 11, 11, 11,
		10, 10, 10, 11, 11, 11,
		10, 10, 10, 11, 11, 11
	]}
];

var tileW = 40, tileH = 40;
var mapW = 20, mapH = 20;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;

var tileset = null, tilesetURL = "img/mapa2.png", tilesetLoaded = false;

var gameTime = 0;
var gameSpeeds = [
	{name:"Normal", mult:2},
	{name:"Lento", mult:0.3},
	{name:"Rapido", mult:5},
	{name:"Pausado", mult:0}
];
var currentSpeed = 0;

var itemTypes = {
	1 : {
		name : "Water",
		maxStack : 2,
        sprite : new Sprite([{x:240,y:0,w:40,h:40}]),
        offset : [0,0]
	},
	2 : {
		name : "Fire",
		maxStack : 2,
		sprite : new Sprite([{x:240,y:40,w:40,h:40}]),
        offset : [0,0]
	},
	3 : {
		name : "Grass",
		maxStack : 2,
		sprite : new Sprite([{x:240,y:80,w:40,h:40}]),
        offset : [0,0]
	}
};

var objectCollision = {
	none		: 0,
	solid		: 1
};
var objectTypes = {
	1 : {
		name : "Box",
        sprite : new Sprite([{x:40,y:160,w:40,h:40}]),
        offset : [0,0],
		collision : objectCollision.solid,
		zIndex : 1
	},
	2 : {
		name : "Broken Box",
        sprite : new Sprite([{x:40,y:200,w:40,h:40}]),
        offset : [0,0],
		collision : objectCollision.none,
		zIndex : 1
	},
	3 : {
		name : "Tree top",
        sprite : new Sprite([{x:80,y:160,w:80,h:80}]),

        offset : [-20,-20],
		collision : objectCollision.solid,
		zIndex : 3
	}
};

var floorTypes = {
	solid	: 0,
	path	: 1,
	water	: 2,
	ice		: 3,
	conveyorU	: 4,
	conveyorD	: 5,
	conveyorL	: 6,
	conveyorR	: 7,
	grass		: 8
};

var tileTypes = {
	0 : { colour:"#685b48", floor:floorTypes.solid,
    sprite:new Sprite([{x:0,y:0,w:40,h:40}])	},

	1 : { colour:"#5aa457", floor:floorTypes.grass,
		sprite:new Sprite([{x:40,y:0,w:40,h:40}])	},

	2 : { colour:"#e8bd7a", floor:floorTypes.path,
		sprite:new Sprite([{x:80,y:0,w:40,h:40}])	},

	3 : { colour:"#286625", floor:floorTypes.solid,
		sprite:new Sprite([{x:120,y:0,w:40,h:40}])	},

	4 : { colour:"#678fd9", floor:floorTypes.water,
		sprite:new Sprite([
			{x:160,y:0,w:40,h:40,d:200}, {x:200,y:0,w:40,h:40,d:200},
			{x:160,y:40,w:40,h:40,d:200}, {x:200,y:40,w:40,h:40,d:200},
			{x:160,y:40,w:40,h:40,d:200}, {x:200,y:0,w:40,h:40,d:200}
		])},

	5 : { colour:"#eeeeff", floor:floorTypes.ice,
		sprite:new Sprite([{x:120,y:120,w:40,h:40}])	},

	6 : { colour:"#cccccc", floor:floorTypes.conveyorL,
		sprite:new Sprite([
			{x:0,y:40,w:40,h:40,d:200}, {x:40,y:40,w:40,h:40,d:200},
			{x:80,y:40,w:40,h:40,d:200}, {x:120,y:40,w:40,h:40,d:200}
		])},

	7 : { colour:"#cccccc", floor:floorTypes.conveyorR,
		sprite:new Sprite([
			{x:120,y:80,w:40,h:40,d:200}, {x:80,y:80,w:40,h:40,d:200},
			{x:40,y:80,w:40,h:40,d:200}, {x:0,y:80,w:40,h:40,d:200}
		])},

	8 : { colour:"#cccccc", floor:floorTypes.conveyorD,
		sprite:new Sprite([
			{x:160,y:200,w:40,h:40,d:200}, {x:160,y:160,w:40,h:40,d:200},
			{x:160,y:120,w:40,h:40,d:200}, {x:160,y:80,w:40,h:40,d:200}
		])},

	9 : { colour:"#cccccc", floor:floorTypes.conveyorU,
		sprite:new Sprite([
			{x:200,y:80,w:40,h:40,d:200}, {x:200,y:120,w:40,h:40,d:200},
			{x:200,y:160,w:40,h:40,d:200}, {x:200,y:200,w:40,h:40,d:200}
		])},

	
	10 : { colour:"#ccaa00", floor:floorTypes.solid,
		sprite:new Sprite([{x:40,y:120,w:40,h:40}])},

	11 : { colour:"#ccaa00", floor:floorTypes.solid,
		sprite:new Sprite([{x:80,y:120,w:40,h:40}])}

};

var directions = {
	up		: 0,
	right	: 1,
	down	: 2,
	left	: 3
};

var keysDown = {
	78 : false,
	69 : false,
	83 : false,
	79 : false,
	80 : false
};

var viewport = {
	screen		: [0,0],
	startTile	: [0,0],
	endTile		: [0,0],
	offset		: [0,0],
	update		: function(px, py) {
		this.offset[0] = Math.floor((this.screen[0]/2) - px);
		this.offset[1] = Math.floor((this.screen[1]/2) - py);

		var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

		this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) { this.startTile[0] = 0; }
		if(this.startTile[1] < 0) { this.startTile[1] = 0; }

		this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) { this.endTile[0] = mapW-1; }
		if(this.endTile[1] >= mapH) { this.endTile[1] = mapH-1; }
	}
};

var player = new Character();

