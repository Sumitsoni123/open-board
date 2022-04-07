let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthEle = document.querySelector(".pencil-width");
let eraserWidthEle = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let track = 0;
let taskArr = [];

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthEle.value;
let eraserWidth = eraserWidthEle.value;

let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

let mousedown = false;
canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }

    // send data to server as beginPath name
    socket.emit("beginPath", data);
})


canvas.addEventListener("mousemove", (e) => {
    if (mousedown) {
        // drawStroke({
        //     x: e.clientX,
        //     y: e.clientY,
        //     color: eraserFlag ? eraserColor : penColor,
        //     width: eraserFlag ? eraserWidth : penWidth
        // })

        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        // send datastroke to server for broadcast
        socket.emit("drawStroke", data);
    }
})


canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    taskArr.push(url);
    track = taskArr.length - 1;
})


function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}


function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}


pencilColors.forEach((colorEle) => {
    colorEle.addEventListener("click", (e) => {
        penColor = colorEle.classList[0];
        tool.strokeStyle = penColor;
    })
})


pencilWidthEle.addEventListener("change", (e) => {
    penWidth = pencilWidthEle.value;
    tool.lineWidth = penWidth;
})


eraserWidthEle.addEventListener("change", (e) => {
    eraserWidth = eraserWidthEle.value;
    tool.lineWidth = eraserWidth;
})


eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})


download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


undo.addEventListener("click", (e) => {
    if (track > 0) track--;

    // let trackObj = {
    //     trackval: track,
    //     taskArr
    // }
    // undoRedoAction(trackObj);

    let data = {
        trackval: track,
        taskArr
    }
    // send to server
    socket.emit("undoRedo", data);
})


redo.addEventListener("click", (e) => {
    if (track < taskArr.length - 1) track++;

    // let trackObj = {
    //     trackval: track,
    //     taskArr
    // }
    // undoRedoAction(trackObj);

    let data = {
        trackval: track,
        taskArr
    }
    // send to server
    socket.emit("undoRedo", data);
})


function undoRedoAction(trackObj) {
    track = trackObj.trackval;
    taskArr = trackObj.taskArr;

    let url = taskArr[track];
    let img = new Image();
    img.src = url;

    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}



// data received from server
socket.on("beginPath", (data) => {
    beginPath(data);
})


socket.on("drawStroke", (data) => {
    drawStroke(data);
})


socket.on("undoRedo", (data) => {
    undoRedoAction(data);
})