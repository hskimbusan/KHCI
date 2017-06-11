var cx = 250;
var cy = 150;

var isDown = false; //flag we use to keep track
var mx, my;
var angle = 0;
var inCircle = false;
var moving = false;
var mouseOnCurrent = false;
var howmuchplay = 0;

var playCanvas = document.getElementById('Record');
var output = document.getElementById('angle');
var ctx = playCanvas.getContext('2d');

var myMusic = document.getElementById('iu');
var coverImg = new Image();
coverImg.src = "./iu.png";

myMusic.addEventListener("timeupdate", function() {
  if (myMusic.currentTime > 0) {
      howmuchplay = (myMusic.currentTime / myMusic.duration);

      if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
        mouseOnCurrent = true;
      }
      else {
        mouseOnCurrent = false;
      }

      render();
   }
}, true);

playCanvas.width = 500;
playCanvas.height = 300;

render();

document.onmousemove = function(e) {
	mx = e.offsetX;
	my = e.offsetY;

	angle = Math.atan2(my - cy, mx - cx);
	angle += Math.PI / 2;
	if (angle < 0) {
		angle += Math.PI * 2;
	}

	var distance = Math.sqrt(Math.pow(mx - cx, 2) + Math.pow(my - cy, 2));
	if (distance < 100 && distance > 60) {
		inCircle = true;
	} else {
		inCircle = false;
		moving = false;
	}

	if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.003) {
		mouseOnCurrent = true;
	}
	else {
		mouseOnCurrent = false;
	}

	output.innerHTML = inCircle;
	render();
}

$('#playCanvas').on('mousedown touchstart', function(e) {
  if (isDown === false) {

    isDown = true;

    console.log(angle);

    if (mouseOnCurrent) {
      moving = true;
    }

    render();
  }
});

$(window).on('mouseup touchend', function(e) {

  if (isDown === true) {

    if (moving) {
      if (mouseOnCurrent === false) {
        myMusic.currentTime = angle * myMusic.duration / (2 * Math.PI);
      }
    }

    isDown = false;
    moving = false;

    render();
  }
});

function getMousePos(playCanvas, evt) {
  var rect = playCanvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function render() {

  ctx.clearRect(0, 0, 500, 300);

  ctx.beginPath();
  ctx.rect(0, 0, 500, 300);
  ctx.fillStyle = "rgb(144, 122, 71)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = 'black'; // 레코드 판
  ctx.fill();

  ctx.beginPath();
  ctx.arc(mx, my, 5, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = 'gray'; // 마우스 점
  ctx.fill();

  if (inCircle === true) {
    ctx.beginPath();
    var temp_angle = angle - 0.5 * Math.PI;
    if (temp_angle < 0) {
      temp_angle += Math.PI * 2;
    }
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 100, 1.5 * Math.PI, temp_angle);
    ctx.closePath();
    //ctx.lineTo(cx, cy);
    ctx.fillStyle = 'rgba(190, 42, 68, 0.6)'; // 마우스 위치
    ctx.fill(); // or context.fill()
  }

  ctx.beginPath();
  var temp_angle = (2 * howmuchplay - 0.5) * Math.PI;
  if (temp_angle < 0) {
    temp_angle += Math.PI * 2;
  }
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, 100, 1.5 * Math.PI, temp_angle);
  ctx.closePath();
  //ctx.lineTo(cx, cy);
  ctx.fillStyle = 'rgb(49, 182, 232)'; // 재생 바
  ctx.fill(); // or context.fill()
  //ctx.closePath();



  if (mouseOnCurrent === true) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(100 * Math.sin(angle) + cx, -100 * Math.cos(angle) + cy);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'green';
    ctx.stroke();
    console.log("abc");
  }

  ctx.drawImage(coverImg, cx-60, cy-60, 120, 120);
}