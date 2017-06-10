$(document).ready(function(){
	var audio = new Audio();
	
	var title_list = [];
	var play_list = [];
	
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
						'<img id="song" data-selector='+play_list.length+' width="140" height="140" src='+songs[i]["image"] +' draggable="true">';
					play_list.push(songs[i]);
				}
			}
			return false;
		}
	});
	
    $(document).on("click", "#song", function() {
        var i = $(this).data('selector');
		audio.pause();
		audio = new Audio(play_list[i].audio);
		audio.play();
		console.log(play_list[i]);
		
		var c = document.getElementById("Record");
		var ctx = c.getContext("2d");

		ctx.beginPath();
		ctx.arc(250, 150, 100, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fill();

		var album = c.getContext("2d");
		var img = new Image();
		img.src = play_list[i].image;
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
	
	clearPlaylist();
});