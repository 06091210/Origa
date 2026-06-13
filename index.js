window.origa = {
setup(Name="canvas", Side=500) {
  const canvas = document.getElementById(Name);
  const ctx = canvas.getContext('2d');

  const side = Side;
  const Lines = [];
}

valley() {
  ctx.strokeStyle = "#0000ff";
  ctx.setLineDash([10, 5]);
  ctx.stroke();
  ctx.beginPath();
}

mountain() {
  ctx.strokeStyle = "#ff0000";
  ctx.setLineDash([10, 5, 3, 5]);
  ctx.stroke();
  ctx.beginPath();
}

frame() {
  ctx.strokeStyle = "#000000";
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
}

previous() {
  ctx.strokeStyle = "#b0b0b0";
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
}

square() {
  ctx.moveTo(1, 1);
  ctx.lineTo(1, 1 + side);
  ctx.lineTo(1 + side, 1 + side);
  ctx.lineTo(1 + side, 1);
  ctx.lineTo(1, 1);
}

equalDivision(show, direction, n, m, name) {
  if (direction == "row") {
    dir = 1;
  } else if (direction == "line") {
    dir = 0;
  }
  if (m.length == 0) {
    for (i = 1; i < n; i++) {
      x1 = 1 + (side - 1) * i * dir / n
      y1 = 1 + (side - 1) * i * Math.abs(dir - 1) / n;
      x2 = 1 + (side - 1) * i * dir / n + side * Math.abs(dir - 1)
      y2 = 1 + (side - 1) * i * Math.abs(dir - 1) / n + side * dir;
      record(show, [x1, y1], [x2, y2], name + String(i));
    }
  } else {
    for (i = 0; i < m.length; i++) {
      x1 = 1 + (side - 1) * m[i] * dir / n
      y1 = 1 + (side - 1) * m[i] * Math.abs(dir - 1) / n;
      x2 = 1 + (side - 1) * m[i] * dir / n + side * Math.abs(dir - 1)
      y2 = 1 + (side - 1) * m[i] * Math.abs(dir - 1) / n + side * dir;
      record(show, [x1, y1], [x2, y2], name + String(i + 1));
    }
  }
}

function vectorToVector(show, [x1, y1], [x2, y2], name) {
  record(show, [x1, y1], [x2, y2], name);
}

function lineToVector(show, [line, z], [x1, y1], name) {
  if (direction(line) == "y=") {
    x2 = z;
    y2 = slope(line) * x2 + intercept(line);
  } else if (direction(line) == "x=") {
    y2 = z;
    x2 = intercept(line);
  }
  record(show, [x1, y1], [x2, y2], name);
}

function linesToVector(show, [line_1, line_2], [x1, y1], name) {
  if (direction(line_1) == "y=") {
    if (direction(line_2) == "y=") {
      x2 = ((intercept(line_2) - intercept(line_1)) / (slope(line_2) - slope(line_1)));
    } else if (direction(line_2) == "x=") {
      x2 = intercept(line_2);
    }
    y2 = slope(line_1) * x2 + intercept(line_1);
  } else if (direction(line_1) == "x=") {
    if (direction(line_2) == "y=") {
      x2 = intercept(line_1);
    }
    y2 = slope(line_2) * x2 + intercept(line_2);
  }
  record(show, [x1, y1], [x2, y2], name);
}

function linesToLine(show, [line_1, line_2], [line_3, z], name) {
  if (direction(line_3) == "y=") {
    x1 = z;
    y1 = slope(line_3) * x1 + intercept(line_3);
  } else if (direction(line_3) == "x=") {
    y1 = z;
    x1 = intercept(line_3);
  }
  linesToVector(show, [line_1, line_2], [x1, y1], name);
}

function linesToLines(show, [line_1, line_2], [line_3, line_4], name) {
  if (direction(line_3) == "y=") {
    if (direction(line_4) == "y=") {
      x2 = ((intercept(line_4) - intercept(line_3)) / (slope(line_4) - slope(line_3)));
    } else if (direction(line_4) == "x=") {
      x2 = intercept(line_4);
    }
    y2 = slope(line_3) * x2 + intercept(line_3);
  } else if (direction(line_3) == "x=") {
    if (direction(line_4) == "y=") {
      x2 = intercept(line_3);
    }
    y2 = slope(line_4) * x2 + intercept(line_4);
  }
  linesToVector(show, [line_1, line_2], [x2, y2], name);
}

function lineToLine(show, [line_1, z1], [line_2, z2], name) {
  if (direction(line_2) == "y=") {
    x1 = z;
    y1 = slope(line_2) * x1 + intercept(line_2);
  } else if (direction(line_2) == "x=") {
    y1 = z;
    x1 = intercept(line_2);
  }
  lineToVector(show, [line_1, z1], [line_2, z2], name);
}

writeLine(show, [x1, y1], [x2, y2], name) {
  str = countType("string", [x1, y1], [x2, y2]);
  num = countType("number", [x1, y1], [x2, y2]);
  if (num.length == 0) {
    linesToLines(show, [x1, y1], [x2, y2], name);
  }
  else if (num.length == 1) {
    linesToLine(show, [str[0], str[1]], [str[2], num[0]], name);
  }
  else if (num.length == 2) {
    if ((num == [x1, x2]) || (num == [y1, y2]) || (num == [x1, y2]) || (num == [y1, x2])) {
      lineToLine(show, [str[0], num[0]], [str[1], num[1]], name);
    } else {
      linesToVector(show, [str[0], str[1]], [num[0], num[1]], name);
    }
  }
  else if (num.length == 3) {
    lineToVector(show, [str[0], num[0]], [num[1], num[2]], name);
  }
  else if (num.length == 4) {
    vectorToVector(show, [x1, y1], [x2, y2], name);
  }
}

mirror(show, line, axis, name) {
  x11 = start(line)[0];
  x12 = end(line)[0];
  y11 = start(line)[1];
  y12 = end(line)[1];
  a = slope(axis);
  b = intercept(axis);
  if (direction(axis) == "y=") {
    x31 = ((x11 / a + y11) - b) / (a + 1 / a);
    x32 = ((x12 / a + y12) - b) / (a + 1 / a);
    y31 = a * x31 + b;
    y32 = a * x32 + b;
  }
  else {
    x31 = intercept(axis);
    x32 = x31;
    y31 = y11;
    y32 = y12;
  }
  x21 = 2 * x31 - x11;
  y21 = 2 * y31 - y11;
  x22 = 2 * x32 - x12;
  y22 = 2 * y32 - y12;
  ctx.moveTo(x21, y21);
  ctx.lineTo(x22, y22);
  writeLine(show, [x21, y21], [x22, y22], name);
}

function record(show, [x1, y1], [x2, y2], name) {
  if (show) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  a = (y2 - y1) / (x2 - x1);
  if (Math.abs(a) != Infinity) {
    Lines.push(name, ["y=", a, y1 - a * x1, [x1, y1], [x2, y2]]);
  } else {
    a = (x2 - x1) / (y2 - y1);
    Lines.push(name, ["x=", a, x1 - a * y1, [x1, y1], [x2, y2]]);
  }
}

function countType(type, [x1, y1], [x2, y2]) {
  count = [];
  if (typeof x1 == type) { count.push(x1); }
  if (typeof y1 == type) { count.push(y1); }
  if (typeof x2 == type) { count.push(x2); }
  if (typeof y2 == type) { count.push(y2); }
  return count;
}

function slope(line) {
  index = Lines.indexOf(line) + 1;
  return Lines[index][1];
}

function intercept(line) {
  index = Lines.indexOf(line) + 1;
  return Lines[index][2];
}

function direction(line) {
  index = Lines.indexOf(line) + 1;
  return Lines[index][0];
}

function start(line) {
  index = Lines.indexOf(line) + 1;
  return Lines[index][3];
}

function end(line) {
  index = Lines.indexOf(line) + 1;
  return Lines[index][4];
}
};

/*
ctx.beginPath();
square();
frame();
equalDivision(false, "row", 32, [], "base");
equalDivision(false, "row", 2, [], "zero");
equalDivision(false, "row", 32, [13, 14], "first");
equalDivision(true, "row", 32, [15], "second");
mirror(true, "second1", "zero1", "second2");
valley();
equalDivision(false, "line", 32, [1], "third");
writeLine(true, ["first2", "third1"], ["third1", 1], "fourth1");
mirror(true, "fourth1", "zero1", "fourth2");
writeLine(true, ["third1", "first2"], ["first2", 500], "fifth1");
mirror(true, "fifth1", "zero1", "fifth2");
writeLine(true, ["fourth1", "fifth1"], ["second1", 1], "sixth1");
mirror(true, "sixth1", "zero1", "sixth2");
mountain();
writeLine(true, ["first2", "third1"], ["first1", 1], "seventh1");
mirror(true, "seventh1", "zero1", "seventh2");
valley();
equalDivision(true, "row", 32, [7], "eighth");
mirror(true, "eighth1", "zero1", "eighth2");
writeLine(true, ["eighth1", "third1"], ["base2", 1], "ninth1");
mirror(true, "ninth1", "zero1", "ninth2");
mountain();
ctx.stroke();

console.log(Lines);
*/
