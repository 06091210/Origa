window.origa = {
ctx: null,
Lines: [],

setup(Name="canvas") {
  const canvas = document.getElementById(Name);
  this.ctx = canvas.getContext("2d");
},

valley() {
  this.ctx.strokeStyle = "#0000ff";
  this.ctx.setLineDash([10, 5]);
  this.ctx.stroke();
  this.ctx.beginPath();
},

mountain() {
  this.ctx.strokeStyle = "#ff0000";
  this.ctx.setLineDash([10, 5, 3, 5]);
  this.ctx.stroke();
  this.ctx.beginPath();
},

frame() {
  this.ctx.strokeStyle = "#000000";
  this.ctx.setLineDash([]);
  this.ctx.stroke();
  this.ctx.beginPath();
},

previous() {
  this.ctx.strokeStyle = "#b0b0b0";
  this.ctx.setLineDash([]);
  this.ctx.stroke();
  this.ctx.beginPath();
},

square(side) {
  this.ctx.moveTo(1, 1);
  this.ctx.lineTo(1, 1 + side);
  this.ctx.lineTo(1 + side, 1 + side);
  this.ctx.lineTo(1 + side, 1);
  this.ctx.lineTo(1, 1);
},

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
      this.record(show, [x1, y1], [x2, y2], name + String(i));
    }
  } else {
    for (i = 0; i < m.length; i++) {
      x1 = 1 + (side - 1) * m[i] * dir / n
      y1 = 1 + (side - 1) * m[i] * Math.abs(dir - 1) / n;
      x2 = 1 + (side - 1) * m[i] * dir / n + side * Math.abs(dir - 1)
      y2 = 1 + (side - 1) * m[i] * Math.abs(dir - 1) / n + side * dir;
      this.record(show, [x1, y1], [x2, y2], name + String(i + 1));
    }
  }
},

vectorToVector(show, [x1, y1], [x2, y2], name) {
  this.record(show, [x1, y1], [x2, y2], name);
},

lineToVector(show, [line, z], [x1, y1], name) {
  if (this.direction(line) == "y=") {
    x2 = z;
    y2 = this.slope(line) * x2 + this.intercept(line);
  } else if (this.direction(line) == "x=") {
    y2 = z;
    x2 = this.intercept(line);
  }
  this.record(show, [x1, y1], [x2, y2], name);
},

linesToVector(show, [line_1, line_2], [x1, y1], name) {
  if (this.direction(line_1) == "y=") {
    if (this.direction(line_2) == "y=") {
      x2 = ((this.intercept(line_2) - this.intercept(line_1)) / (this.slope(line_2) - this.slope(line_1)));
    } else if (this.direction(line_2) == "x=") {
      x2 = this.intercept(line_2);
    }
    y2 = this.slope(line_1) * x2 + this.intercept(line_1);
  } else if (this.direction(line_1) == "x=") {
    if (this.direction(line_2) == "y=") {
      x2 = this.intercept(line_1);
    }
    y2 = this.slope(line_2) * x2 + this.intercept(line_2);
  }
  this.record(show, [x1, y1], [x2, y2], name);
},

linesToLine(show, [line_1, line_2], [line_3, z], name) {
  if (this.direction(line_3) == "y=") {
    x1 = z;
    y1 = this.slope(line_3) * x1 + this.intercept(line_3);
  } else if (this.direction(line_3) == "x=") {
    y1 = z;
    x1 = this.intercept(line_3);
  }
  this.linesToVector(show, [line_1, line_2], [x1, y1], name);
},

linesToLines(show, [line_1, line_2], [line_3, line_4], name) {
  if (this.direction(line_3) == "y=") {
    if (this.direction(line_4) == "y=") {
      x2 = ((this.intercept(line_4) - this.intercept(line_3)) / (this.slope(line_4) - this.slope(line_3)));
    } else if (this.direction(line_4) == "x=") {
      x2 = this.intercept(line_4);
    }
    y2 = this.slope(line_3) * x2 + this.intercept(line_3);
  } else if (this.direction(line_3) == "x=") {
    if (this.direction(line_4) == "y=") {
      x2 = this.intercept(line_3);
    }
    y2 = this.slope(line_4) * x2 + this.intercept(line_4);
  }
  this.linesToVector(show, [line_1, line_2], [x2, y2], name);
},

lineToLine(show, [line_1, z1], [line_2, z2], name) {
  if (this.direction(line_2) == "y=") {
    x1 = z;
    y1 = this.slope(line_2) * x1 + this.intercept(line_2);
  } else if (this.direction(line_2) == "x=") {
    y1 = z;
    x1 = this.intercept(line_2);
  }
  this.lineToVector(show, [line_1, z1], [line_2, z2], name);
},

writeLine(show, [x1, y1], [x2, y2], name) {
  str = this.countType("string", [x1, y1], [x2, y2]);
  num = this.countType("number", [x1, y1], [x2, y2]);
  if (num.length == 0) {
    this.linesToLines(show, [x1, y1], [x2, y2], name);
  }
  else if (num.length == 1) {
    this.linesToLine(show, [str[0], str[1]], [str[2], num[0]], name);
  }
  else if (num.length == 2) {
    if ((num == [x1, x2]) || (num == [y1, y2]) || (num == [x1, y2]) || (num == [y1, x2])) {
      this.lineToLine(show, [str[0], num[0]], [str[1], num[1]], name);
    } else {
      this.linesToVector(show, [str[0], str[1]], [num[0], num[1]], name);
    }
  }
  else if (num.length == 3) {
    this.lineToVector(show, [str[0], num[0]], [num[1], num[2]], name);
  }
  else if (num.length == 4) {
    this.vectorToVector(show, [x1, y1], [x2, y2], name);
  }
},

mirror(show, line, axis, name) {
  x11 = this.start(line)[0];
  x12 = this.end(line)[0];
  y11 = this.start(line)[1];
  y12 = this.end(line)[1];
  a = this.slope(axis);
  b = this.intercept(axis);
  if (this.direction(axis) == "y=") {
    x31 = ((x11 / a + y11) - b) / (a + 1 / a);
    x32 = ((x12 / a + y12) - b) / (a + 1 / a);
    y31 = a * x31 + b;
    y32 = a * x32 + b;
  }
  else {
    x31 = this.intercept(axis);
    x32 = x31;
    y31 = y11;
    y32 = y12;
  }
  x21 = 2 * x31 - x11;
  y21 = 2 * y31 - y11;
  x22 = 2 * x32 - x12;
  y22 = 2 * y32 - y12;
  this.ctx.moveTo(x21, y21);
  this.ctx.lineTo(x22, y22);
  this.writeLine(show, [x21, y21], [x22, y22], name);
},

record(show, [x1, y1], [x2, y2], name) {
  if (show) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
  }
  a = (y2 - y1) / (x2 - x1);
  if (Math.abs(a) != Infinity) {
    this.Lines.push(name, ["y=", a, y1 - a * x1, [x1, y1], [x2, y2]]);
  } else {
    a = (x2 - x1) / (y2 - y1);
    this.Lines.push(name, ["x=", a, x1 - a * y1, [x1, y1], [x2, y2]]);
  }
},

countType(type, [x1, y1], [x2, y2]) {
  count = [];
  if (typeof x1 == type) { count.push(x1); }
  if (typeof y1 == type) { count.push(y1); }
  if (typeof x2 == type) { count.push(x2); }
  if (typeof y2 == type) { count.push(y2); }
  return count;
},

slope(line) {
  index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][1];
},

intercept(line) {
  index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][2];
},

direction(line) {
  index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][0];
},

start(line) {
  index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][3];
},

end(line) {
  index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][4];
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
