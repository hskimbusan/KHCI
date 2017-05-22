$(document).ready(function(){
	var audio = new Audio();
	
	$("#b4").click(function(){
		audio.pause();
		audio = new Audio('./audio/b4.mp3');
		audio.play();
		var c = document.getElementById("Record");
		var ctx = c.getContext("2d");

		ctx.beginPath();
		ctx.arc(250, 150, 100, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fill();

		var album = c.getContext("2d");
		var img = document.getElementById("b4");
		album.drawImage(img, 170, 70, 160, 160);
	});
	
	$("#bb").click(function(){
		audio.pause();
		audio = new Audio('./audio/bb.mp3');
		audio.play();
		
		var c = document.getElementById("Record");
		var ctx = c.getContext("2d");

		ctx.beginPath();
		ctx.arc(250, 150, 100, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fill();

		var album = c.getContext("2d");
		var img = document.getElementById("bb");
		album.drawImage(img, 170, 70, 160, 160);
	});
	
	$("#akmu").click(function(){
		audio.pause();
		audio = new Audio('./audio/akmu.mp3');
		audio.play();
		var c = document.getElementById("Record");
		var ctx = c.getContext("2d");

		ctx.beginPath();
		ctx.arc(250, 150, 100, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fill();

		var album = c.getContext("2d");
		var img = document.getElementById("akmu");
		album.drawImage(img, 170, 70, 160, 160);
	});
	
	$("#play").click(function(){
		audio.play();
	});
	$("#pause").click(function(){
		audio.pause();
	});
	$("#stop").click(function(){
		audio.pause();
		audio.currentTime = 0;
	});
});