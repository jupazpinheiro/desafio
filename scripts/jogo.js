function drawGame()
{
	if(ctx==null) { return; }
	if(!tilesetLoaded) { requestAnimationFrame(drawGame); return; }

	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;
	gameTime+= Math.floor(timeElapsed * gameSpeeds[currentSpeed].mult);

	var sec = Math.floor(Date.now()/1000);
	if(sec!=currentSecond)
	{
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }

	if(!player.processMovement(gameTime) && gameSpeeds[currentSpeed].mult!=0)
	{
		if(keysDown[78] && player.canMoveUp())			{ player.moveUp(gameTime); }
		else if(keysDown[83] && player.canMoveDown())	{ player.moveDown(gameTime); }
		else if(keysDown[79] && player.canMoveLeft())	{ player.moveLeft(gameTime); }
		else if(keysDown[69] && player.canMoveRight())	{ player.moveRight(gameTime); }
		else if(keysDown[80]) { player.pickUp(); }
	}

	viewport.update(player.position[0] + (player.dimensions[0]/2),
		player.position[1] + (player.dimensions[1]/2));
	
	var playerRoof1 = mapTileData.map[toIndex(
		player.tileFrom[0], player.tileFrom[1])].roof;
	var playerRoof2 = mapTileData.map[toIndex(
		player.tileTo[0], player.tileTo[1])].roof;

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);
	
	for(var z = 0; z < mapTileData.levels; z++)
	{

	for(var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y)
	{
		for(var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x)
		{
			if(z==0)
			{
				tileTypes[mapTileData.map[toIndex(x,y)].type].sprite.draw(
					gameTime,
					viewport.offset[0] + (x*tileW),
					viewport.offset[1] + (y*tileH));

			}
			else if(z==1)
			{
				var is = mapTileData.map[toIndex(x,y)].itemStack;
				if(is!=null)
				{
					itemTypes[is.type].sprite.draw(
						gameTime,
						viewport.offset[0] + (x*tileW) + itemTypes[is.type].offset[0],
						viewport.offset[1] + (y*tileH) + itemTypes[is.type].offset[1]);

				}
			}
			
			var o = mapTileData.map[toIndex(x,y)].object;
			if(o!=null && objectTypes[o.type].zIndex==z)
			{
				var ot = objectTypes[o.type];
				
				ot.sprite.draw(gameTime,
					viewport.offset[0] + (x*tileW) + ot.offset[0],
					viewport.offset[1] + (y*tileH) + ot.offset[1]);

			}
			
			if(z==2 &&
				mapTileData.map[toIndex(x,y)].roofType!=0 &&
				mapTileData.map[toIndex(x,y)].roof!=playerRoof1 &&
				mapTileData.map[toIndex(x,y)].roof!=playerRoof2)
			{
				tileTypes[mapTileData.map[toIndex(x,y)].roofType].sprite.draw(
					gameTime,
					viewport.offset[0] + (x*tileW),
					viewport.offset[1] + (y*tileH));

			}
		}
	}
	
		if(z==1)
		{
			player.sprites[player.direction].draw(
				gameTime,
				viewport.offset[0] + player.position[0],
				viewport.offset[1] + player.position[1]);

		}
	
	}
	
	ctx.textAlign = "right";
	
	for(var i = 0; i < player.inventory.spaces; i++)
	{
		ctx.fillStyle = "#ddccaa";
		ctx.fillRect(10 + (i * 50), 350,
			40, 40);
		
		if(typeof player.inventory.stacks[i]!='undefined')
		{
			var it = itemTypes[player.inventory.stacks[i].type];
			
			it.sprite.draw(gameTime,
				10 + (i * 50) + it.offset[0],
				350 + it.offset[1]);

			
			if(player.inventory.stacks[i].qty>1)
			{
				ctx.fillStyle = "#000000";
				ctx.fillText("" + player.inventory.stacks[i].qty,
					10 + (i*50) + 38,
					350 + 38);
			}
		}
	}
	ctx.textAlign = "left";

	ctx.fillStyle = "#ff0000";
	ctx.fillText("FPS: " + framesLastSecond, 10, 20);
	ctx.fillText("Velocidade " + gameSpeeds[currentSpeed].name, 10, 40);

	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}