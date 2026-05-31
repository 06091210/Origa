const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const side = 500;
const Lines = [];

//谷折り線
function valley() {
  ctx.strokeStyle = "#0000ff";
  ctx.setLineDash([10, 5]);
  ctx.stroke();
  ctx.beginPath();
}

//山折り線
function mountain() {
  ctx.strokeStyle = "#ff0000";
  ctx.setLineDash([10,5,3,5]);
  ctx.stroke();
  ctx.beginPath();
}

//枠線
function frame() {
  ctx.strokeStyle = "#000000";
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
}

//前の工程の線
function previous() {
  ctx.strokeStyle = "#b0b0b0";
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
}

//元の正方形 (一辺の長さをsideとする)
function square() {
  ctx.moveTo(1,1);
  ctx.lineTo(1,1+side);
  ctx.lineTo(1+side,1+side);
  ctx.lineTo(1+side,1);
  ctx.lineTo(1,1);
}

//n等分の線
function equalDivision(direction, n, m) {
  if (direction == "row") {
    //横にn等分する
    dir = 1;
  } else if (direction == "line") {
    //縦にn等分する
    dir = 0;
  }
  if (m.length == 0) {
    //m=[]の場合，元の正方形をn等分する線をすべて描画する
    for (i=1; i<n; i++) {
      ctx.moveTo(1+(side-1)*i*dir/n, 1+(side-1)*i*Math.abs(dir-1)/n);
      ctx.lineTo(1+(side-1)*i*dir/n+side*Math.abs(dir-1), 1+(side-1)*i*Math.abs(dir-1)/n+side*dir);
    }
  } else {
    //m≠[a1, a2, a3, ... ]の場合，元の正方形をn等分する線の内，左から(a1, a2, a3, ...　)番目の線のみを描画する
    for (i=0; i<m.length; i++) {
      ctx.moveTo(1+(side-1)*m[i]*dir/n, 1+(side-1)*m[i]*Math.abs(dir-1)/n);
      ctx.lineTo(1+(side-1)*m[i]*dir/n+side*Math.abs(dir-1), 1+(side-1)*m[i]*Math.abs(dir-1)/n+side*dir);
    }
  }
}

//二点(x1,y1), (x2,y2)を繋ぐ直線nameを描画する
function vectorToVector([x1, y1], [x2, y2], name) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  a = (y2-y1)/(x2-x1);
  Lines.push(name, [a, y1-a*x1]);
}

//直線line上の点Pと(x1,y1)を繋ぐ直線nameを描画する
function lineToVector(direction, line, z, [x1, y1], name) {
  index = Lines.indexOf(line)+1;
  if (direction == "row") {
    //zを直線line上の点Pのx座標とする
    x2 = z;
    y2 = Lines[index][0]*x2+Lines[index][1];
  } else if (direction == "line") {
    //zを直線line上の点Pのy座標とする
    y2 = z;
    x2 = (y2-Lines[index][1])/Lines[index][0];
  }
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  a = (y2-y1)/(x2-x1);
  Lines.push(name, [a, y1-a*x1]);
}
