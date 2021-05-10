// config
baseSpeed = 0.05;
notchWidth = 0.25;

colors = {
	green: {
		body: "hsl(168, 75%, 42%)",
		lock: "hsl(210, 61%, 18%)"
	},
	violet: {
		body: "hsl(267, 35%, 39%)",
		lock: "hsl(220, 86%, 11%)"
	},
	orange: {
		body: "hsl(24, 62%, 53%)",
		lock: "hsl(35, 20%, 12%)"
	},
	blue: {
		body: "hsl(186, 85%, 37%)",
		lock: "hsl(32, 67%, 8%)"
	},
	olive: {
		body: "hsl(55, 16%, 41%)",
		lock: "hsl(0, 0%, 0%)"
	}
};
//end config 

function setColor(color) {	
	$("body").css({"background": colors[color].body});
	$("#shackle, #lock").css({"border-color": colors[color].lock});
}
function newNotch() {
	notchPosition = (((Math.random() * 0.75 * Math.PI) + 0.25 * Math.PI) * ((clockwise * 2) - 1)) + linePosition;
	$("#notch-dial").css({"-webkit-transform": "rotate(" + notchPosition + "rad)"});
	$("#notch-dial").css({"-moz-transform": "rotate(" + notchPosition + "rad)"});
	$("#notch-dial").css({"transform": "rotate(" + notchPosition + "rad)"});
	$("#notch").show();
	$("#notch").toggleClass("appear-b");
}
function setStatus(newStatus) {
	status = newStatus;
	switch (newStatus) {
  	case "start":
			if (level < 10) setColor("green");
			else if (level < 20) setColor("violet");
			else if (level < 30) setColor("orange");
			else if (level < 40) setColor("blue");
			else setColor("olive");
			setCount(level);
			linePosition = 0;
    	clockwise = true;
			newNotch();
			$("body").removeClass("fail");
      break;
    case "move":
      break;
		case "fail":
			$("#notch").hide();
			$("body").addClass("fail");
			break;
		case "win":
			$("#notch").hide();
			$("body").addClass("next");
			$("#shackle").addClass("unlock");
			setTimeout(function() {
				setLevel(level + 1);
				setStatus("start");
				$("#shackle").removeClass("unlock");
			}, 1000);
			setTimeout(function() {
				$("body").removeClass("next");
			}, 2000);
			break;
	} 
}
function setCount(newCount) {
	count = newCount;
	$("#lock").text(count);
}
function setLevel(newLevel) {
	level = newLevel;
	$("#level").text(level);
	window.localStorage.setItem("level", level);
}
function click() {
	switch (status) {
		case "start":
			setStatus("move")
			break;
		case "move":
			if (Math.abs(Math.atan2(Math.sin(linePosition - notchPosition), Math.cos(linePosition - notchPosition))) < notchWidth) {
				setCount(count - 1);
				if (count == 0) {
					setStatus("win");
				}
				else {
					clockwise = !clockwise;
					newNotch();
				}
			}
			else {
				setStatus("fail");
			}
			break;
		case "fail":
			setStatus("start");
			break;
		case "win":
			setStatus("start");
			break;
	}
}
function step() {
	if (status == "move") linePosition += baseSpeed * (clockwise * 2 - 1);
	$("#line-dial").css({"-webkit-transform": "rotate(" + linePosition + "rad)"});
	$("#line-dial").css({"-moz-transform": "rotate(" + linePosition + "rad)"});
	$("#line-dial").css({"transform": "rotate(" + linePosition + "rad)"});
	if ((Math.atan2(Math.sin(linePosition - notchPosition), Math.cos(linePosition - notchPosition))) * (clockwise * 2 - 1) > notchWidth) setStatus("fail");
	window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
window.addEventListener("mousedown", click);
window.addEventListener("touchstart", function(event) {
	event.preventDefault();
	click();
});
window.addEventListener("keydown", click);

setLevel(parseInt(window.localStorage.getItem("level")) || 1);
setStatus("start");