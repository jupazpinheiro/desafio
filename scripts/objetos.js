window.onload = function()
{
	ctx = document.getElementById('game').getContext("2d");
	requestAnimationFrame(drawGame);
	ctx.font = "bold 10pt sans-serif";

	window.addEventListener("keydown", function(e) {
		if(e.keyCode>=69 && e.keyCode<=83) { keysDown[e.keyCode] = true; }
		if(e.keyCode==80) { keysDown[e.keyCode] = true; }
	});
	window.addEventListener("keyup", function(e) {
		if(e.keyCode>=69 && e.keyCode<=83) { keysDown[e.keyCode] = false; }
		if(e.keyCode==13)
		{
			currentSpeed = (currentSpeed>=(gameSpeeds.length-1) ? 0 : currentSpeed+1);
		}
		if(e.keyCode==80) { keysDown[e.keyCode] = false; }
	});

	viewport.screen = [document.getElementById('game').width,
		document.getElementById('game').height];

	tileset = new Image();
	tileset.onerror = function()
	{
		ctx = null;
		alert("Falha no carregamento!");
	};
	tileset.onload = function() { tilesetLoaded = true; };
	tileset.src = tilesetURL;
	
	mapTileData.buildMapFromData(gameMap, mapW, mapH);
	mapTileData.addRoofs(roofList);
	mapTileData.map[((2*mapW)+2)].eventEnter = function()
		{ console.log("Entered tile 2,2"); };
	//posição dos pokemons
	var mo1 = new MapObject(1); mo1.placeAt(2, 4);
	var mo2 = new MapObject(2); mo2.placeAt(2, 3);
	
	var mo4 = new MapObject(3); mo4.placeAt(4, 5);
	var mo5 = new MapObject(3); mo5.placeAt(12, 4);
	var mo6 = new MapObject(3); mo6.placeAt(4, 11);
	
	var mo7 = new MapObject(3); mo7.placeAt(12, 6);
	var mo8 = new MapObject(3); mo8.placeAt(2, 9);
	var mo9 = new MapObject(3); mo9.placeAt(12, 13);

	var mo11 = new MapObject(1); mo11.placeAt(5, 4);
	var mo12 = new MapObject(2); mo12.placeAt(7, 4);


	//casa1
	var ps = new PlacedItemStack(2, 1); ps.placeAt(6, 4);
	var ps = new PlacedItemStack(1, 1); ps.placeAt(7, 8);

	//casa2
	var ps = new PlacedItemStack(3, 1); ps.placeAt(15, 14);
	var ps = new PlacedItemStack(2, 1); ps.placeAt(18, 13);
	var ps = new PlacedItemStack(3, 1); ps.placeAt(10, 12);
	var ps = new PlacedItemStack(1, 1); ps.placeAt(18, 7);

};

function MapObject(nt)
{
	this.x		= 0;
	this.y		= 0;
	this.type	= nt;
}
MapObject.prototype.placeAt = function(nx, ny)
{
	if(mapTileData.map[toIndex(this.x, this.y)].object==this)
	{
		mapTileData.map[toIndex(this.x, this.y)].object = null;
	}
	
	this.x = nx;
	this.y = ny;
	
	mapTileData.map[toIndex(nx, ny)].object = this;
};

PlacedItemStack.prototype.placeAt = function(nx, ny)
{
	if(mapTileData.map[toIndex(this.x, this.y)].itemStack==this)
	{
		mapTileData.map[toIndex(this.x, this.y)].itemStack = null;
	}
	
	this.x = nx;
	this.y = ny;
	
	mapTileData.map[toIndex(nx, ny)].itemStack = this;
};
