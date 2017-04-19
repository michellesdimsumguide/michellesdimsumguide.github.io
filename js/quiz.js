var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
var sizeFactor = 110;
var mouse = {};
var click = {};
var questionList = ["Are you a vegetarian?", "Are you feeling adventurous?", "Do you like shellfish?", "Want something traditional?", "Do you love pork?", "Want something sweet?", "Still hungry for dessert?"];
var quizState = 0;
var images = [];
var yesImage;
var noImage;
var fadeAlpha = 0;
var quizResult = [];
var tryText = "try";

function CanvasImage(imageID, position, name) {
	this.img = document.getElementById(imageID);
	this.aspectRatio = this.img.width / this.img.height;
	this.h = sizeFactor;
	this.w = this.h * this.aspectRatio;
	this.position = position;
	this.resize = 0;
	this.alpha = 1.0;
	this.mouseOver = false;
	this.name = name;


	this.updatePosition = function() {
		if(position == 1) {
			this.absolutex = canvas.width / 2 - 150;
			this.absolutey = canvas.height / 2 + 150;
		}
		if(position == 2) {
			this.absolutex = canvas.width / 2 + 150;
			this.absolutey = canvas.height / 2 + 150;
		}
		if(position == 3) {
			this.absolutex = canvas.width / 2;
			this.absolutey = canvas.height / 2 + 150;
		}
		/*
		if(position == 4) {
			this.absolutex = (canvas.width / 2); 
			this.absolutey = canvas.height - 175;
		}
		if(position == 5) {
			this.absolutex = canvas.width - 50;
			this.absolutey = canvas.height / 2 - 10;
			this.h = 520;
			this.w = this.h * this.aspectRatio;
		}
		if(position == 6) {
			this.absolutex = 50;
			this.absolutey = canvas.height / 2 - 10;	
			this.h = 520;
			this.w = this.h * this.aspectRatio;
		}*/
		this.x = this.absolutex - (this.w / 2);
		this.y = this.absolutey - (this.h / 2);
	}

	this.updatePosition();

	this.resizeUpdate = function() {
		this.h = sizeFactor + this.resize
		this.w = this.h * this.aspectRatio;
		this.updatePosition();
	}

	this.mouseOverUpdate = function() {
		if(mouse.x > this.absolutex - (this.w / 2) &&
			mouse.x < this.absolutex + (this.w / 2) &&
			mouse.y > this.absolutey - (this.h / 2) &&
			mouse.y < this.absolutey + (this.h / 2)) {
			this.mouseOver = true;
			if(this.resize < 40) {
				this.resize += 4;
				this.resizeUpdate();
			}
			if(this.alpha > 0.5) {
				this.alpha -= 0.1;
			}
			ctx.globalAlpha = this.alpha;
			ctx.globalAlpha = fadeAlpha;
		}
		else if(this.resize > 0) {
			this.mouseOver = false;
			this.resize -= 2;
			this.resizeUpdate();
			this.alpha += 0.05;
			ctx.globalAlpha = this.alpha;
			ctx.globalAlpha = fadeAlpha;
		}
		else {
			this.mouseOver = false;
		}
	}

	this.clickUpdate = function(x) {
		if(this.mouseOver && quizState < 7) {
			quizResult = [quizState * 2, quizState * 2 + 1];
			quizState = x;
			this.mouseOver = false;
		}
		else if(this.mouseOver) {
			tryText = this.name;
		}
	}

}

document.addEventListener("click", function(x) {
	click.x = x.pageX;
	click.y = x.pageY;
	clickUpdate();
}, false);

function clickUpdate() {
	if(quizState < 7) {
		yesImage.clickUpdate(7);
		if(quizState < 6) {
			noImage.clickUpdate(quizState + 1);
		}
		else {
			noImage.clickUpdate(0)
		}
	}
	else if(quizState = 7) {
		images[quizResult[0]].clickUpdate();
		images[quizResult[1]].clickUpdate();
	}
}

document.addEventListener("mousemove", function(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}, false);

window.addEventListener("resize", handleResize);
function handleResize() {
    var w = window.innerWidth-2; // -2 accounts for the border
    var h = window.innerHeight-2;
    var wRatio = w / canvas.width;
    canvas.width = w;
    canvas.height = h;
    //sizeFactor = sizeFactor * wRatio
    /*
    for(i=0; i<4; i++) {
    	for(j=0; j<4; j++) {
    		images[i][j].resizeUpdate();
    	}
    }
    */
    yesImage.resizeUpdate();
    noImage.resizeUpdate();
    for(i=0; i<14; i++) {
    	images[i].resizeUpdate();
    }
    ctx.globalAlpha = fadeAlpha;
    update()
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(fadeAlpha < 1.0) {
		fadeAlpha += 0.02;
		ctx.globalAlpha = fadeAlpha
	}
	else if(fadeAlpha > 1.0) {
		fadeAlpha = 1.0;
	}

	if(quizState < 7) {
		ctx.font = "50px Century Gothic";
		ctx.textAlign = "center";
		ctx.fillText(questionList[quizState], canvas.width/2, canvas.height/2 - 150);
		yesImage.mouseOverUpdate();
		noImage.mouseOverUpdate();
		ctx.globalAlpha = yesImage.alpha;
		ctx.drawImage(yesImage.img, yesImage.x, yesImage.y, yesImage.w, yesImage.h);
		ctx.globalAlpha = fadeAlpha;
		ctx.globalAlpha = noImage.alpha;
		ctx.drawImage(noImage.img, noImage.x, noImage.y, noImage.w, noImage.h);
		ctx.globalAlpha = fadeAlpha;
	}
	else if(quizState = 7) {
		images[quizResult[0]].mouseOverUpdate();
		images[quizResult[1]].mouseOverUpdate();
		ctx.font = "50px Century Gothic";
		ctx.textAlign = "center";
		ctx.fillText(tryText, canvas.width/2, canvas.height/2 - 150);
		ctx.drawImage(images[quizResult[0]].img, images[quizResult[0]].x, images[quizResult[0]].y, images[quizResult[0]].w, images[quizResult[0]].h)
		ctx.drawImage(images[quizResult[1]].img, images[quizResult[1]].x, images[quizResult[1]].y, images[quizResult[1]].w, images[quizResult[1]].h)
	}

}

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {

	images[0] = new CanvasImage("image1", 1, "rice noodle roll")
	images[1] = new CanvasImage("image2", 2, "congee")
	images[2] = new CanvasImage("image3", 3, "chicken feet");
	images[3] = images[2];
	images[4] = new CanvasImage("image5", 1, "har gao")
	images[5] = new CanvasImage("image6", 2, "siu mai")
	images[6] = new CanvasImage("image7", 1, "soup dumplings")
	images[7] = new CanvasImage("image8", 2, "sticky rice")
	images[8] = new CanvasImage("image9", 1, "pork buns")
	images[9] = new CanvasImage("image10", 2, "barbecued pork")
	images[10] = new CanvasImage("image11", 1, "pineapple buns")
	images[11] = new CanvasImage("image12", 2, "sesame balls")
	images[12] = new CanvasImage("image13", 1, "mango pudding")
	images[13] = new CanvasImage("image14", 2, "egg tarts")

	yesImage = new CanvasImage("yes", 1);
	noImage = new CanvasImage("no", 2);
	handleResize();

	(function animloop(){
		requestAnimFrame(animloop);
		update();
	})();
};