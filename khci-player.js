$(document).ready(function(){
	var c = document.getElementById("Record");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.arc(95, 50, 40, 0, 2*Math.PI);
	ctx.stroke();
});