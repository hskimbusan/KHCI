$(document).ready(function(){
	var audio = new Audio();
	
	var title_list = [];
	var play_list = [];
	
	var current_song = -1;
	
	/* Canvas */
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
	
	for (i = 0; i < songs.length; i++){
		title_list.push(songs[i]["title"]);
	}
	console.log(title_list);
	
	function clearPlaylist(){
		title_list = [];
		$("#playlist").html("");
	}
	
	$("#search_input").autocomplete({
		minLength: 2,
		source: title_list,
		select: function(event, ui){
			for (i = 0; i < songs.length; i++){
				if (ui.item.value == songs[i]["title"]){
					document.getElementById("playlist").innerHTML +=
						'<img id="song" data-selector='+play_list.length+' src='+songs[i]["image"] +' draggable="true">';
					play_list.push(songs[i]);
				}
			}
			return false;
		}
	});

	$(document).on("dragstart", "#song", function(event){
		event.originalEvent.dataTransfer.setData("text", $(this).data("selector"));
	});
	
	$("canvas").on("drop", function(event){
		var data = event.originalEvent.dataTransfer.getData("text");
		play_song(parseInt(data));
	});
	
	function play_song(i){
		audio.pause();
		audio = new Audio(play_list[i].audio);
		audio.play();
		console.log(play_list[i]);
		current_song = i;
		render(current_song);
		
		audio.addEventListener("timeupdate", timeUpdate, true);	
		audio.addEventListener("ended", function(){
			if (current_song < play_list.length-1){
				play_song(current_song+1);
			}
		});
		
/*
		ctx.beginPath();
		ctx.arc(250, 150, 100, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fill();
		*/
	}
	/*
    $(document).on("click", "#song", function() {
        var i = $(this).data('selector');
		play_song(i);
    });*/
	
	$("#play").click(function(){
		audio.play();
	});
	$("#pause").click(function(){
		audio.pause();
	});
	$("#stop").click(function(){
		audio.pause();
		audio.currentTime = 0;
		timeUpdate();
	});
	
	clearPlaylist();
	
	function render(i) {
		if (i == -1) return;
		ctx.clearRect(0, 0, 500, 300);
		ctx.beginPath();
		ctx.rect(0, 0, 500, 300);
		ctx.fillStyle = 'white';
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
		
		ctx.beginPath();
		var current_angle = (2 * howmuchplay - 0.5) * Math.PI;
		if (current_angle < 0) {
			current_angle += Math.PI * 2;
		}

		ctx.moveTo(cx, cy);
		ctx.arc(cx, cy, 100, 1.5 * Math.PI, current_angle);
		ctx.closePath();
		//ctx.lineTo(cx, cy);
		ctx.fillStyle = 'rgb(49, 182, 232)'; // 재생 바
		ctx.fill(); // or context.fill()
		//ctx.closePath();
		
		if (inCircle === true) {
			ctx.beginPath();
			var temp_angle = angle - 0.5 * Math.PI;
			if (temp_angle < 0) {
				temp_angle += Math.PI * 2;
			}
			ctx.moveTo(cx, cy);

			
			if (howmuchplay*2*Math.PI < angle){
				ctx.arc(cx, cy, 100, current_angle, temp_angle);
			}else{
				ctx.arc(cx, cy, 100, temp_angle, current_angle);
			}
			ctx.closePath();
			//ctx.lineTo(cx, cy);
			ctx.fillStyle = 'rgba(190, 42, 68, 0.6)'; // 마우스 위치
			ctx.fill(); // or context.fill()
		}

		if (mouseOnCurrent === true) {
			ctx.beginPath();
			ctx.moveTo(cx, cy);
			ctx.lineTo(100 * Math.sin(angle) + cx, -100 * Math.cos(angle) + cy);
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'green';
			ctx.stroke();
		}
		
		var album = c.getContext("2d");
		var img = new Image();
		img.src = play_list[i].image;
		album.drawImage(img, 180, 80, 140, 140);
		
	}
	
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

		if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
			mouseOnCurrent = true;
		}
		else {
			mouseOnCurrent = false;
		}

		render(current_song);
	}

	$('#Record').on('mousedown touchstart', function(e) {
		if (isDown === false) {
			isDown = true;
			console.log(angle);

			if (mouseOnCurrent) {
				moving = true;
			}
			render(current_song);
		}
	});

	$(window).on('mouseup touchend', function(e) {
		if (isDown === true){
			if (moving) {
				if (mouseOnCurrent === false) {
					audio.currentTime = angle * audio.duration / (2 * Math.PI);
				}
			}
			isDown = false;
			moving = false;
			render(current_song);
		}
	});
	
	function getMousePos(playCanvas, evt) {
		var rect = playCanvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}	
	
	function timeUpdate(){
		if (current_song == -1) return;
		if (audio.currentTime >= 0) {
			howmuchplay = (audio.currentTime / audio.duration);

			if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
				mouseOnCurrent = true;
			}
			else {
				mouseOnCurrent = false;
			}
			render(current_song);
		}
	}

});