 /*读取画布环境对象 => getContext('2d')获取123*/
 var canvas;
 var ctx;
 var canvasW = 900; //画布的宽
 var canvasH = 900; //画布的高
 var BodyLfet = 0; //body的滚动距离
 var BodyTop = 0; //body的滚动距离
 var opttype = "pencil"; //默认为画笔
 var record = []; //历史存储
 var div_eraser;
 // 定义画笔的粗细和颜色
 var PencilColor;
 var PencilW = 1;
 //定义橡皮檫的大小
 var EraserW = 2;
 var EraserH = 2;
 //开始坐标
 var StartX = 0;
 var StartY = 0;
 //移动坐标
 var MoveX;
 var MoveY;
 var W; //获取矩形的宽
 var H; //获取矩形的高
 var r; //获取圆形的半径

 //下载 a标签download 事件
 function download(filename, content) {
     var alink = document.createElement('a');
     //点击事件
     var evt = document.createEvent('MouseEvents');
     evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
     alink.download = filename;
     alink.href = content;
     alink.dispatchEvent(evt);
 };
 //点击事件
 function draw(type) {
     switch (type) {
         case "pencil": //画笔
         case "rectangle": //矩形
         case "rotundity": //圆形
         case "eraser": // 橡皮擦
             {
                 opttype = type;
                 break;
             }
         case "backout":
             {
                 record.splice(record.length - 1, 1);
                 LoadOld();
                 break;
             }
         case "clear": //清空
             {
                 ctx.clearRect(0, 0, canvasW, canvasH);
                 record = [];
                 break;
             }
         case "save":
             {

                 var type = "png";
                 var content = canvas.toDataURL("image/" + type).replace("image/" + type, "image/octet-stream");
                 console.log(content);
                 download("canvas." + type, content);
                 //  download("test.txt", "/2018我学习的/Canvas画布/file/网站.txt");
                 break;
             }
         case "add": //画笔加粗变细 橡皮擦放大縮小 
             {
                 if (opttype != "eraser") {
                     ++PencilW;
                 } else {
                     EraserW = EraserW * 2;
                     EraserH = EraserH * 2;
                 }
                 break;
             }
         case "minus": //画笔加粗变细 橡皮擦放大縮小 
             {
                 if (opttype != "eraser") {
                     PencilW = PencilW > 1 ? --PencilW : PencilW;
                 } else {
                     EraserW = EraserW > 2 ? EraserW / 2 : EraserW;
                     EraserH = EraserH > 2 ? EraserH / 2 : EraserH;
                 }
                 break;
             }
     }
 };

 //鼠标开始画的事件
 function MouseDown(StartX, StartY) {
     switch (opttype) {
         case "pencil":
             { //画笔
                 // 开始绘制  beginPath()起始一条路径，或重置当前路径
                 //moveTo()  把路径移动到画布中的指定点，不创建线条
                 ctx.moveTo(StartX, StartY);
                 break;
             }
         case "eraser":
             { //橡皮擦
                 ctx.clearRect(StartX, StartY, EraserW, EraserH);
                 break;
             }
         case "rectangle":
             { //矩形
                 ctx.strokeRect(StartX, StartY, EraserW, EraserH);
                 break;
             }
             //  case "rotundity":
             //      {
             //          break;
             //      }
         default:
             {
                 break;
             }
     }
 };

 //鼠标移动事件
 function MouseMove() {
     switch (opttype) {
         case "pencil":
             { //画笔
                 // 绘制鼠标路径
                 ctx.lineTo(MoveX, MoveY); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
                 ctx.stroke(); //绘制已定义的路径
                 break;
             }
         case "eraser":
             {
                 ctx.clearRect(MoveX, MoveY, EraserW, EraserH);
                 break;
             }
         case "rectangle":
             { //矩形
                 // 利用矩形方法实现 strokeRect
                 ctx.clearRect(0, 0, canvasW, canvasH);
                 LoadOld(); //读取历史
                 ctx.lineWidth = PencilW;
                 ctx.strokeStyle = PencilColor.value;
                 ctx.strokeRect(StartX, StartY, W, H);

                 break;
             }
         case "rotundity":
             { //圆形
                 ctx.beginPath();
                 ctx.clearRect(0, 0, canvasW, canvasH);
                 LoadOld(); //读取历史
                 ctx.lineWidth = PencilW;
                 ctx.strokeStyle = PencilColor.value;
                 ctx.arc(StartX, StartY, r, 0, 2 * Math.PI);
                 ctx.stroke();
                 break;
             }
     }
 };

 //松开鼠标事件
 function MouseUp() {
     record.push(ctx.getImageData(0, 0, canvasW, canvasH));
     ctx.closePath();
 };

 //加载历史图形
 function LoadOld() {
     if (record.length > 0) {
         ctx.putImageData(record[record.length - 1], 0, 0, 0, 0, canvasW, canvasH);
     } else {
         ctx.clearRect(0, 0, canvasW, canvasH);
         record = [];
     }
 };
 window.onload = function() {
     BodyLfet = document.body.scrollLeft; //body的滚动距离
     BodyTop = document.body.scrollTop; //body的滚动距离
     canvas = document.getElementById("canvas");
     div_eraser = document.getElementsByClassName("eraser"); //橡皮擦
     PencilColor = document.getElementById("color");
     //判断是否支持canvas属性
     if (canvas.getContext) {
         ctx = canvas.getContext("2d");
     }
     // 设置画笔属性
     ctx.fillStyle = "#eee"; //设置或返回用于填充绘画的颜色、渐变或模式
     ctx.lineWidth = PencilW;
     ctx.strokeStyle = PencilColor.value; //设置或返回用于笔触的颜色、渐变或模式
     ctx.shadowColor = PencilColor.value; //设置或返回用于阴影的颜色
     ctx.shadowBlur = 0; //设置或返回用于阴影的模糊级别
     ctx.shadowOffsetX = 0; //设置或返回阴影距形状的水平距离
     ctx.shadowOffsetY = 0; //设置或返回阴影距形状的垂直距离

     // 监听鼠标点击事件;
     canvas.onmousedown = function(e) {
         // 鼠标点击时的坐标  可视区域的位置 加上body的滚动距离 减去画布的位置偏移
         StartX = e.clientX - canvas.offsetLeft + BodyLfet;
         StartY = e.clientY - canvas.offsetTop + BodyTop;
         ctx.beginPath();
         MouseDown(StartX, StartY);

         // 鼠标移动事件监听
         canvas.onmousemove = function(e) {
             MoveX = e.clientX - canvas.offsetLeft + BodyLfet;
             MoveY = e.clientY - canvas.offsetTop + BodyTop;
             W = MoveX - StartX; //获取矩形的宽
             H = MoveY - StartY; //获取矩形的高
             r = Math.sqrt(Math.pow(W, 2) + Math.pow(H, 2)); //获取圆形的半径
             MouseMove();

             //鼠标松开  结束绘画
             canvas.onmouseup = function(e) {
                 var UpX = e.clientX - canvas.offsetLeft + BodyLfet;
                 var UpY = e.clientY - canvas.offsetTop + BodyTop;
                 var UpW = UpX - StartX;
                 var UpH = UpY - StartY;
                 var UpR = Math.sqrt((UpW * UpW) + (UpH * UpH));
                 MouseUp();
                 ctx.closePath();
                 canvas.onmouseup = null;
                 canvas.onmousemove = null;
             }
         }
     };
 }