
String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor(sec_num  / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0)
  {
    return new Array(width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
  }
  return number + '';
}

function startBreak() {
  clock.start = 0;
  clock.current = 0;
  clock.seconds = 0;
  clock.end = $("#break").data('time');
  countDown = setInterval(
    function() { clock.draw(true); },
    1000
  );
}

let clock = {
  start: 0,
  end: 60*25,
  current: 0,
  seconds: 0,

  draw: function(clr,justUpdate=false) {
    let canvas = $("#canvas").get(0);
    let cv = canvas.getContext("2d");
    if(clock.seconds > clock.end) {
      cv.clearRect(0,0,canvas.width,canvas.height)
      cv.fillText('done',canvas.width/2,canvas.height/2);
      clearInterval(countDown);
      // start break!
      startBreak();
    } else {
      let color = (clock.seconds*15+8);
      let hex = color.toString(16);
      color = '#' + zeroFill(hex,2) + '850D';
      if(clr) {
        cv.clearRect(0, 0, canvas.width, canvas.height);
      }
      cv.beginPath();
      cv.strokeStyle = '#' + zeroFill(hex,2) + '850D';

      let startAngle = (Math.PI/180) * 0 - (Math.PI/180) * 90;
      let endAngle = (Math.PI/180) * ((360/(clock.end - clock.start)) * ((clock.current - clock.start) + clock.seconds)) - (Math.PI/180) * 90;
      cv.arc(canvas.width/2, canvas.height/2, 150, startAngle, endAngle);
      cv.lineWidth = 15;
      cv.stroke();
      cv.font = "4em Tahoma";
      cv.fillStyle = color;
      cv.textAlign = "center";
      cv.fillText(Math.round((clock.end - clock.current) - clock.seconds).toString().toMMSS(),canvas.width/2,canvas.height/2);
      if(!justUpdate)
        clock.seconds++;
    }
  }
}
// enable or disable the buttons if disable is true
function disableTimeChange(disable) {
  $("#increaseMin").prop('disabled', disable)
  $("#decreaseMin").prop('disabled', disable)
  $("#increaseBreak").prop('disabled', disable)
  $("#decreaseBreak").prop('disabled', disable)
}

let countDown;
$('#start').click( function(){
  disableTimeChange(true);
  let time = $(this).data('time');
  clock.start = 0;
  clock.end = time;
  clearInterval(countDown);
  countDown = setInterval(
    function() { clock.draw(true); },
    1000
  );
})
$('#reset').click(function() {
  disableTimeChange(false);
  let time = $(this).data('time');
  clock.start = 0;
  clock.end = time;
  clock.current = 0;
  clock.seconds = 0;
  $('#start').data('time', clock.end)
  $('#session').html(clock.end.toString().toMMSS())
  let canvas = $("#canvas").get(0);
  let cv = canvas.getContext("2d");
  cv.clearRect(0, 0, canvas.width, canvas.height);
  clock.draw(true,true)
  clearInterval(countDown);
});
$('#pause').click(function(){
  clearInterval(countDown);
})

$("#increaseMin").click(function() {
  clock.end += 60;
  clock.draw(true,true)
  $('#start').data('time', clock.end)
  $('#session').html(clock.end.toString().toMMSS())
})
$("#decreaseMin").click(function() {
  if (clock.end > 60) {
    clock.end -= 60;
    $('#start').data('time', clock.end)
    clock.draw(true,true)
    $('#session').html(clock.end.toString().toMMSS())
  }
})

$("#increaseBreak").click(function() {
  let breakTime = $("#break").data('time');
  breakTime += 60;
  $('#break').data('time', breakTime);
  $('#break').html(breakTime.toString().toMMSS());
})
$("#decreaseBreak").click(function() {
  let breakTime = $("#break").data('time');
  if (breakTime > 60) {
    breakTime -= 60;
    $('#break').data('time', breakTime);
    $('#break').html(breakTime.toString().toMMSS());
  }
})

$(document).ready( function(){
  let canvas = $("#canvas").get(0);
  let cv = canvas.getContext("2d");
  cv.font = "4em Tahoma";
  cv.textAlign = "center";
  cv.fillStyle = "green";
  cv.fillText('25:00',canvas.width/2,canvas.height/2);
})
