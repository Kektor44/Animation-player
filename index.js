var color = document.getElementById("color");
var currentColor = document.getElementById("currentColor");
var prevColor = document.getElementById("prevColor");
var paint = document.getElementById("paint");
var move = document.getElementById("move");
var transf = document.getElementById("transform");
var canvItem = document.getElementsByClassName("canvas-item");
var frame = document.getElementsByClassName("frame");
var addFrame = document.getElementById("addFrame");
var frames = document.getElementById("frames");
var fullScreen = document.getElementById("fullScreen");
var animationEl = document.getElementById("animation");
var input = document.getElementById("input");
var fps = document.getElementById("fpsValue");
var numberFrame = document.getElementsByClassName("numberFrame");
var bcCur;
var countClick = 0;
var el1;
var el2;
var firstOrder;
var secondOrder;
var canvasData = localStorage.getItem('canvasData') ? JSON.parse(localStorage.getItem('canvasData')) : [{}, {}, {}, {}, {}, {}, {}, {}, {}];

if (localStorage.getItem('canvasData')) {
    for (var i = 0; i < canvItem.length; i++) {
        canvItem[i].style.backgroundColor = canvasData[i].backgroundColor;
        canvItem[i].style.borderRadius = canvasData[i].borderRadius;
        //canvItem[i].style.order = canvasData[i].order;

    }
}

function paintTool () {
    paint.style.backgroundColor = "#CCE5FF";
    move.style.backgroundColor = "white";
    transf.style.backgroundColor = "white";

    for (var i = 0; i < canvItem.length; i++) {
        canvItem[i].removeAttribute("onclick");
        canvItem[i].setAttribute("onclick", "paintBucket(event)");
    }
}

function moveTool () {
    paint.style.backgroundColor = "white";
    move.style.backgroundColor = "#CCE5FF";
    transf.style.backgroundColor = "white";

    for (var i = 0; i < canvItem.length; i++) {
        canvItem[i].removeAttribute("onclick");
        canvItem[i].setAttribute("onclick", "movefunc(event)");
    }

}

function transTool () {
    paint.style.backgroundColor = "white";
    move.style.backgroundColor = "white";
    transf.style.backgroundColor = "#CCE5FF";
    for (var i = 0; i < canvItem.length; i++) {
        canvItem[i].removeAttribute("onclick");
        canvItem[i].setAttribute('onClick', 'transform(event)');
    }
}

document.onkeypress = function paintKeyPress (event) {
    if (event.keyCode === 2) {
        paintTool();
    }
    if (event.keyCode === 10) {
        moveTool();
    }
    if (event.keyCode === 9) {
        transTool();
    }
};

function currColor () {
    bcCur = currentColor.style.backgroundColor;
    prevColor.style.backgroundColor = bcCur;
    currentColor.style.backgroundColor = color.value;
    localStorage.setItem('bgcolor', color.value)
}

function paintBucket (e) {
    e.target.style.backgroundColor = color.value;
    canvasData[e.target.style.order - 1]['backgroundColor'] = color.value;
    localStorage.setItem('canvasData', JSON.stringify(canvasData));
    canvasInFrame();
}

function transform (event) {
    var elem = event.target;

    if (elem.style.borderRadius === '0px' || elem.style.borderRadius === '0' || !elem.style.borderRadius) {
        elem.style.borderRadius = '50%'
    } else {
        elem.style.borderRadius = '0px'
    }
    canvasData[elem.style.order - 1]['borderRadius'] = elem.style.borderRadius;
    localStorage.setItem('canvasData', JSON.stringify(canvasData));
    canvasInFrame();
}

for (var i = 1; i <= canvItem.length; i++) {
    canvItem[i - 1].style.order = i;
}

function movefunc (e) {
    countClick++;
    if (countClick === 1) {
        el1 = e.target;
        firstOrder = el1.style.order;
    }
    if (countClick === 2) {
        el2 = e.target;
        secondOrder = el2.style.order;
        el2.style.order = firstOrder;
        el1.style.order = secondOrder;
        cleanMovingData();
    }
    canvasInFrame();

}

function cleanMovingData () {
    countClick = 0;
    el1 = 0;
    el2 = 0;
}

addFrame.addEventListener("click", function () {
    frames.removeChild(addFrame);
    frames.innerHTML += '<div class="frame" onclick="frameTool(event)"></div>\n';
    frames.appendChild(addFrame);
    for (var k = 0; k < frame.length; k++) {
        frame[k].style.backgroundColor = "white"
    }
    frame[frame.length - 1].style.backgroundColor = "yellow";
    canvasInFrame();
    numFrame();

});

function frameTool (e) {
    for (var k = 0; k < frame.length; k++) {
        frame[k].style.backgroundColor = "white"
    }
    var el = e.target;
    el.style.backgroundColor = "yellow";
}

frame[0].style.backgroundColor = "yellow";

function canvasInFrame () {
    for (var k = 0; k < frame.length; k++) {
        var el = frame[k];
        if (el.style.backgroundColor === "yellow") {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            for (var i = 0; i < canvItem.length; i++) {
                var clone = canvItem[i].cloneNode(true);
                el.appendChild(clone).className = "canvInFrame";
            }
            el.innerHTML += '<div class="numberFrame">1</div><button class="removeFrame" onclick="removeFrameTool(event)">X</button>';
            numFrame()
        }
    }
}

canvasInFrame();

function numFrame () {
    for (var k = 0; k < numberFrame.length; k++) {
        numberFrame[k].innerHTML = k + 1;
    }
}

function removeFrameTool (e) {
    console.log(frames);
    frames.removeChild(frame[0])
}

var k = 0;
setInterval(() => {
    animationEl.innerHTML = "";
    var clones = frame[k].cloneNode(true);
    animationEl.appendChild(clones).className = "animEl";
    if (k + 1 === frame.length) {
        k = 0;
    }
    k += 1;
}, 1000 / input.value);

fullScreen.addEventListener('click', function () {
    animationEl.webkitRequestFullScreen()
}, false);
