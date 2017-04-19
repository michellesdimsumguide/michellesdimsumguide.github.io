var canvas = [document.getElementById("canvas1"), 
			  document.getElementById("canvas2"), 
			  document.getElementById("canvas3"), 
			  document.getElementById("canvas4")];
var ctx = [canvas[0].getContext("2d"), 
		   canvas[1].getContext("2d"),
		   canvas[2].getContext("2d"),
		   canvas[3].getContext("2d")];
var currentIndex = 0;
var images = [new Array(4), new Array(4), new Array(4), new Array(4)];
//var keyImage1;
//var keyImage2;
var sizeFactor = 110;
var mouse = {};
var fadeAlpha = 0;

function CanvasImage(imageID, position, infoID) {
	this.img = document.getElementById(imageID);
	this.aspectRatio = this.img.width / this.img.height;
	this.h = sizeFactor;
	this.w = this.h * this.aspectRatio;
	this.position = position;
	this.resize = 0;
	this.alpha = 0;
	this.info = document.getElementById(infoID);

	this.updatePosition = function() {
		if(position == 1) {
			this.absolutex = (canvas[0].width / 2);
			this.absolutey = 125;
		}
		if(position == 2) {
			this.absolutex = 310;
			this.absolutey = (canvas[0].height / 2) - 25;
		}
		if(position == 3) {
			this.absolutex = canvas[0].width - 310;
			this.absolutey = (canvas[0].height / 2) - 25;
		}
		if(position == 4) {
			this.absolutex = (canvas[0].width / 2); 
			this.absolutey = canvas[0].height - 150;
		}
		/*
		if(position == 5) {
			this.absolutex = canvas[0].width - 60;
			this.absolutey = canvas[0].height / 2;
			this.h = 560;
			this.w = this.h * this.aspectRatio;
		}
		if(position == 6) {
			this.absolutex = 60;
			this.absolutey = canvas[0].height / 2;
			this.h = 560;
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
			if(this.resize < 40) {
				this.resize += 4;
				this.resizeUpdate();
			}
			if(this.alpha < 1.0) {
				this.alpha += 0.1;
			}
			ctx[currentIndex].globalAlpha = this.alpha;
			ctx[currentIndex].drawImage(this.info, 
								 (canvas[currentIndex].width / 2) - 250, 
								 (canvas[currentIndex].height / 2) - 172, 
								 500, 
								 300);
			ctx[currentIndex].globalAlpha = fadeAlpha;
		}
		else if(this.resize > 0) {
			this.resize -= 2;
			this.resizeUpdate();
			this.alpha -= 0.05;
			ctx[currentIndex].globalAlpha = this.alpha;
			ctx[currentIndex].drawImage(this.info, 
								 (canvas[currentIndex].width / 2) - 250, 
								 (canvas[currentIndex].height / 2) - 172, 
								 500, 
								 300);
			ctx[currentIndex].globalAlpha = fadeAlpha;
		}	
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
    var wRatio = w / canvas[0].width;
    for(i=0; i<4; i++) {
    	canvas[i].width = w;
    	canvas[i].height = h;
    }
    //sizeFactor = sizeFactor * wRatio
    for(i=0; i<4; i++) {
    	for(j=0; j<4; j++) {
    		images[i][j].resizeUpdate();
    	}
    }
    //keyImage1.resizeUpdate();
    //keyImage2.resizeUpdate();
    ctx[currentIndex].globalAlpha = fadeAlpha;
    for(i=1; i<4; i++) {
    	update(i);
    }
}

function update(input) {
	ctx[input].clearRect(0, 0, canvas[input].width, canvas[input].height);
	if(fadeAlpha < 1.0 && input == currentIndex) {
		fadeAlpha += 0.04;
		ctx[input].globalAlpha = fadeAlpha
	}
	else if(fadeAlpha > 1.0) {
		fadeAlpha = 1.0;
	}

	for(j=0; j<4; j++) {
		images[input][j].mouseOverUpdate();
		ctx[input].drawImage(images[input][j].img, 
							 images[input][j].x, 
							 images[input][j].y, 
							 images[input][j].w, 
							 images[input][j].h);
	}
	//ctx[input].drawImage(keyImage1.img, keyImage1.x, keyImage1.y, keyImage1.w, keyImage1.h);
	//ctx[input].drawImage(keyImage2.img, keyImage2.x, keyImage2.y, keyImage2.w, keyImage2.h);
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
	for(i=0; i<4; i++) {
		for(j=0; j<4; j++) {
			images[i][j] = new CanvasImage("image" + (i * 4 + j + 1), j + 1, "info" + (i * 4 + j + 1));
		}
	}
	//keyImage1 = new CanvasImage("key1", 5);
	//keyImage2 = new CanvasImage("key2", 6);
	handleResize();
	(function animloop(){
		requestAnimFrame(animloop);
		update(currentIndex);
	})();
};

$('.carousel').on('slid.bs.carousel', function () {

  // This variable contains all kinds of data and methods related to the carousel
  var carouselData = $(this).data('bs.carousel');
  // EDIT: Doesn't work in Boostrap >= 3.2
  //var currentIndex = carouselData.getActiveIndex();
  currentIndex = carouselData.getItemIndex(carouselData.$element.find('.item.active'));
});