$(document).ready(function() {
  var audio = new Audio();

  var title_list = [];
//  var singer_list = [];
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

  for (i = 0; i < songs.length; i++) {
    title_list.push(songs[i]["title"]);
 //   singer_list.push(songs[i]["singer"]);
  }
  console.log(title_list);
  //console.log(singer_list);

  function clearPlaylist() {
    title_list = [];
//    singer_list = [];
    $("#playlist").html("");
  }

  $("#search_input").autocomplete({
    minLength: 2,
    source: title_list,
		focus: function(event, ui) {
			$("#search_input").val(ui.item.value)
			return false;
		},
    select: function(event, ui) {
      for (i = 0; i < songs.length; i++) {
        if (ui.item.value == songs[i]["title"]) {
          if (confirm(songs[i]["title"] + "을(를) 재생 목록에 추가하시겠습니까?")) {
            document.getElementById("playlist").innerHTML +=
              '<img id="song" data-selector=' + play_list.length + ' src=' + songs[i]["image"] + ' draggable="true">';
            play_list.push(songs[i]);
          }
					else {
						$("#search_input").val('')
					}
        }
      }
      return false;
    }
  });
  /* 시간되면 가수로 검색하는거도 구현해 보려 했으나...
  $("#search_input").autocomplete({
    minLength: 2,
    source: singer_list,
		focus: function(event, ui) {
			$("#search_input").val(ui.item.value)
			return false;
		},
    select: function(event, ui) {
      for (i = 0; i < songs.length; i++) {
        if (ui.item.value == songs[i]["singer"]) {
          if (confirm(songs[i]["title"] + "을(를) 재생 목록에 추가하시겠습니까?")) {
            document.getElementById("playlist").innerHTML +=
              '<img id="song" data-selector=' + play_list.length + ' src=' + songs[i]["image"] + ' draggable="true">';
            play_list.push(songs[i]);
          }
					else {
						$("#search_input").val('')
					}
        }
      }
      return false;
    }
  });*/

	// 자동 완성에 앨범 아트 띄우기
  $("#search_input").data("ui-autocomplete")._renderItem = function(ul, item) {
    var $li = $('<li>'),
      $img = $('<img>');
		for(i=0;i<songs.length;i++){
			if(item.value == songs[i]["title"]){
				$img.attr({
		      src: songs[i]["image"],
					style : 'width : 80px; height : 80px'
		    });
		    $li.append('<a href="#">');
		    $li.find('a').append($img).append(songs[i]['singer']+ " - " + songs[i]['title'])
			}
		}
    return $li.appendTo(ul);
  };


  $(document).on("dragstart", "#song", function(event) {
    event.originalEvent.dataTransfer.setData("text", $(this).data("selector"));
  });

  $("canvas").on("drop", function(event) {
    var data = event.originalEvent.dataTransfer.getData("text");
    data = parseInt(data);
    
    console.log($("[id=song]")[data]);
    
    play_song(data);
  });

  function play_song(data) {
    for (i = 0; i < play_list.length; i++){
      if (i == data){
        $("[id=song]")[i].style = "border-bottom: 5px solid #ccddff";
      }
      else{
        $("[id=song]")[i].style = "";
      }
    }
    
    
    audio.pause();
    audio = new Audio(play_list[data].audio);
    audio.play();
    console.log(play_list[data]);
    current_song = data;
    render(current_song);

    audio.addEventListener("timeupdate", timeUpdate, true);
    audio.addEventListener("ended", function() {
      if (current_song < play_list.length - 1) {
        play_song(current_song + 1);
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

  $("#play").click(function() {
    audio.play();
  });
  $("#pause").click(function() {
    audio.pause();
  });
  $("#stop").click(function() {
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


      if (howmuchplay * 2 * Math.PI < angle) {
        ctx.arc(cx, cy, 100, current_angle, temp_angle);
      } else {
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

    ctx.beginPath();
    ctx.arc(mx, my, 5, 0, Math.PI * 2, true);
    ctx.closePath();
    if (isDown) {
      ctx.fillStyle = 'rgb(255, 252, 0)';
    } else {
      ctx.fillStyle = 'gray';
    }
    ctx.fill();
  }

  document.onmousemove = function(e) {
    var rect = playCanvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;

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
      //moving = false;
    }

    if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
      mouseOnCurrent = true;
    } else {
      mouseOnCurrent = false;
    }

    render(current_song);
  }

  $('#Record').on('mousedown', function(e) {
    if (isDown === false) {
      isDown = true;
      console.log(angle);

      if (mouseOnCurrent) {
        moving = true;
      }
      render(current_song);
    }
  });

  $(window).on('mouseup', function(e) {
    if (isDown === true) {
      if (moving && inCircle && mouseOnCurrent === false) {
        audio.currentTime = angle * audio.duration / (2 * Math.PI);
      }
      isDown = false;
      moving = false;
      render(current_song);
    }
  });


  function timeUpdate() {
    if (current_song == -1) return;
    if (audio.currentTime >= 0) {
      howmuchplay = (audio.currentTime / audio.duration);

      if (inCircle && Math.abs(angle / (2 * Math.PI) - howmuchplay) < 0.01) {
        mouseOnCurrent = true;
      } else {
        mouseOnCurrent = false;
      }
      render(current_song);
    }
  }

});
