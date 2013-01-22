function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Game = {
// Settings
    assetsPath: "assets",
    assetsNames: [],
// Variables
    context: null,
    assetsLoaded: false,
    assetsLoading: false,
    fps: 30,
    wait: 10,
    level: 2,
    mapSize: {
        x: 40,
        y: 40
        },
    
    map: null,
    
    
    snake: {
        parts: null,
        length: 0,
        maxLength: 0,
        direction: 'right',
        newDirection: 'right'
    },
    
    apple: {
    	x: 0,
    	y: 0
    },
// Methods
    Initialize: function (canvasElementId) {
        var canvas = document.getElementById(canvasElementId);
        this.context = canvas.getContext('2d');
        
        this.context.strokeStyle = "red";
        this.context.font = "24px Georgia";
        this.context.fillRect(0,0,800,600);

        
        var loadingText = "Loading...";
        var loadingTextSize = this.context.measureText(loadingText);
        
        this.context.fillStyle = "#FFFFFF";
        this.context.fillText(loadingText, 400 - loadingTextSize.width / 2, 360);
        
        
        this.map = new Array(this.mapSize.y);
        for (var i = 0; i < this.mapSize.y; ++i) {
            
            this.map[i] = new Array(this.mapSize.x);
            
            
            for (var j = 0; j < this.mapSize.x; ++j) {
                if (i == 0 || j == 0 || i == this.mapSize.y - 1 || j == this.mapSize.x - 1) {
                    this.map[i][j] = -1;
                } else {
                	this.map[i][j] = 0;
                } 
                
                /*
                    this.map[i][j] = getRandomInt(-2,10);
                    */
	            if (this.map[i][j] >= 0)
	            {
	            	this.snake.maxLength++;
	            }
            }
        }
        
	    this.NewApple();
        console.log(this.map);
        
        
        
        this.snake.parts = new Array(this.snake.maxLength);
        this.snake.parts[0] = {
            x: this.mapSize.x / 2,
            y: this.mapSize.y / 2
        };
        this.snake.parts[1] = {
            x: this.mapSize.x / 2,
            y: this.mapSize.y / 2
        };
        this.snake.parts[2] = {
            x: this.mapSize.x / 2,
            y: this.mapSize.y / 2
        };
        this.snake.length = 3;
        
        
        var self = this;
        //FIX
        window.addEventListener("keydown", function (e)
        {
            switch (e.keyCode) {
                case 37:
                	if (self.snake.direction != 'right') 
                    	self.snake.newDirection = 'left';
                    break;
                case 38:
                	if (self.snake.direction != 'down') 
                    	self.snake.newDirection = 'up';
                    break;
                case 39:
                	if (self.snake.direction != 'left') 
                    	self.snake.newDirection = 'right';
                    break;
                case 40:
                	if (self.snake.direction != 'up') 
                    	self.snake.newDirection = 'down';
                    break;
            }
        });
        
        
        
        setInterval(function() {
            self.Update.call(self);
            self.Draw.call(self);
        }, 1000/this.fps);
        
        
    },
    
    NewApple: function () {
    	do {
			        this.apple.x = getRandomInt(0,this.mapSize.y -2);
			        this.apple.y = getRandomInt(0,this.mapSize.x -2);
		} while (this.map[this.apple.y][this.apple.x] < 0);
    },
    
    Draw: function () {
        this.context.fillStyle = "black";
        this.context.fillRect(0,0,800,600);
        var tileSize = Math.min(600 / this.mapSize.y, 600 / this.mapSize.x) ;
        for (var i = 0; i < this.mapSize.y; ++i) {
            for (var j = 0; j < this.mapSize.x; ++j) {
                if (this.map[i][j] < 0)
                    this.context.fillStyle = "grey";
                else
                    this.context.fillStyle = "darkgreen";
                this.context.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
            }
        }
        
        for (i = 0; i < this.snake.length; ++i) {
            if (i === 0)
                this.context.fillStyle = "cyan";
            else
                this.context.fillStyle = "blue";
                
            this.context.fillRect(this.snake.parts[i].x * tileSize + 2, this.snake.parts[i].y * tileSize + 2, tileSize - 4, tileSize - 4);
                
        }
        
        
        this.context.fillStyle = "red";
        this.context.fillRect(this.apple.x * tileSize + 3, this.apple.y * tileSize + 3, tileSize - 6, tileSize - 6);
                
    },
    Update: function () {
        this.wait--;
        if (this.wait < 0) {
            this.wait = this.level;
            	this.snake.direction = this.snake.newDirection;
            // Check
            
            switch (this.snake.direction) {
                case 'left':
                    if (this.map[this.snake.parts[0].y][this.snake.parts[0].x - 1] < 0)
                        return;
                    break;
                case 'right':
                    if (this.map[this.snake.parts[0].y][this.snake.parts[0].x + 1] < 0)
                        return;
                    break;
                case 'up':
                    if (this.map[this.snake.parts[0].y - 1][this.snake.parts[0].x] < 0)
                        return;
                    break;
                case 'down':
                    if (this.map[this.snake.parts[0].y + 1][this.snake.parts[0].x] < 0)
                        return;
                    break;
            }
            // Update
            for (var i = this.snake.length - 1; i >= 0; --i) {
                if (i > 0) {
                    this.snake.parts[i].x = this.snake.parts[i - 1].x;
                    this.snake.parts[i].y = this.snake.parts[i - 1].y;
                } else {
                    switch (this.snake.direction) {
                        case 'left':
                            this.snake.parts[i].x -= 1;
                            break;
                        case 'right':
                            this.snake.parts[i].x += 1;
                            break;
                        case 'up':
                            this.snake.parts[i].y -= 1;
                            break;
                        case 'down':
                            this.snake.parts[i].y += 1;
                            break;
                    }
                }
            }
            // Apple
            if (this.snake.parts[0].x == this.apple.x && this.snake.parts[0].y == this.apple.y)
            {
            	if (this.snake.length < this.snake.maxLength)
            	{
            		this.snake.parts[this.snake.length] = {
            			x: this.snake.parts[this.snake.length - 1].x,
            			y: this.snake.parts[this.snake.length - 1].y
            		};
            		this.snake.length++;
            	}  
    			this.NewApple();
            }
        }
    }
    
};
