window.origa = {
ctx: null,
Lines: [],
side: 500,
start: [],

setup(Name="canvas", Side=500) {
  const canvas = document.getElementById(Name);
  this.ctx = canvas.getContext("2d");
  this.side = Side;
  this.start = [(canvas.width - this.side) / 2, (canvas.height - this.side) / 2];
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

square() {
  const x = this.start[0];
  const y = this.start[1];
  this.ctx.moveTo(x, y);
  this.ctx.lineTo(x, y + this.side);
  this.ctx.lineTo(x + this.side, y + this.side);
  this.ctx.lineTo(x + this.side, y);
  this.ctx.lineTo(x, y);
},

equalDivision(show, direction, n, m, name) {
  let dir;
  let x1, y1, x2, y2;
  const x = this.start[0];
  const y = this.start[1];
  if (direction == "row") {
    dir = 1;
  } else if (direction == "line") {
    dir = 0;
  }
  if (m.length == 0) {
    for (let i = 1; i < n; i++) {
      x1 = x + this.side * i * dir / n
      y1 = y + this.side * i * Math.abs(dir - 1) / n;
      x2 = x + this.side * i * dir / n + this.side * Math.abs(dir - 1)
      y2 = y + this.side * i * Math.abs(dir - 1) / n + this.side * dir;
      this.record(show, [x1, y1], [x2, y2], name + String(i));
    }
  } else {
    for (let i = 0; i < m.length; i++) {
      x1 = x + this.side * m[i] * dir / n
      y1 = y + this.side * m[i] * Math.abs(dir - 1) / n;
      x2 = x + this.side * m[i] * dir / n + this.side * Math.abs(dir - 1)
      y2 = y + this.side * m[i] * Math.abs(dir - 1) / n + this.side * dir;
      this.record(show, [x1, y1], [x2, y2], name + String(i + 1));
    }
  }
},

vectorToVector(show, [x1, y1], [x2, y2], name) {
  this.record(show, [x1, y1], [x2, y2], name);
},

lineToVector(show, direction, [line, z], [x1, y1], name) {
  let x2, y2;
  if (this.direction(line) == "y=") {
    if (direction == "x") {
      x2 = z;
      y2 = this.slope(line) * x2 + this.intercept(line);
    } else {
      y2 = z;
      x2 = (y2 - this.intercept(line)) / this.slope(line);
    }
  } else if (this.direction(line) == "x=") {
    y2 = z;
    x2 = this.intercept(line);
  }
  this.record(show, [x1, y1], [x2, y2], name);
},

linesToVector(show, [line_1, line_2], [x1, y1], name) {
  let x2, y2;
  if (this.direction(line_1) == "y=") {
    if (this.direction(line_2) == "y=") {
      x2 = ((this.intercept(line_2) - this.intercept(line_1)) / (this.slope(line_1) - this.slope(line_2)));
    } else if (this.direction(line_2) == "x=") {
      x2 = this.intercept(line_2);
    }
    y2 = this.slope(line_1) * x2 + this.intercept(line_1);
  } else {
    if (this.direction(line_2) == "y=") {
      x2 = this.intercept(line_1);
    }
    y2 = this.slope(line_2) * x2 + this.intercept(line_2);
  }
  this.record(show, [x1, y1], [x2, y2], name);
},

linesToLine(show, direction, [line_1, line_2], [line_3, z], name) {
  let x1, y1;
  if (this.direction(line_3) == "y=") {
    if (direction == "x") {
      x1 = z;
      y1 = this.slope(line_3) * x1 + this.intercept(line_3);
    } else {
      y1 = z;
      x1 = (y1 - this.intercept(line_3)) / this.slope(line_3);
    }
  } else {
    y1 = z;
    x1 = this.intercept(line_3);
  }
  this.linesToVector(show, [line_1, line_2], [x1, y1], name);
},

linesToLines(show, [line_1, line_2], [line_3, line_4], name) {
  let x2, y2;
  if (this.direction(line_3) == "y=") {
    if (this.direction(line_4) == "y=") {
      x2 = ((this.intercept(line_4) - this.intercept(line_3)) / (this.slope(line_4) - this.slope(line_3)));
    } else {
      x2 = this.intercept(line_4);
    }
    y2 = this.slope(line_3) * x2 + this.intercept(line_3);
  } else {
    if (this.direction(line_4) == "y=") {
      x2 = this.intercept(line_3);
    }
    y2 = this.slope(line_4) * x2 + this.intercept(line_4);
  }
  this.linesToVector(show, [line_1, line_2], [x2, y2], name);
},

lineToLine(show, direction1, direction2, [line_1, z1], [line_2, z2], name) {
  let x1, y1;
  if (this.direction(line_2) == "y=") {
    if (direction2 == "x") {
      x1 = z2;
      y1 = this.slope(line_2) * x1 + this.intercept(line_2);
    } else {
      y1 = z2;
      x1 = (y1 - this.intercept(line_2)) / this.slope(line_2);
    }
  } else {
    y1 = z2;
    x1 = this.intercept(line_2);
  }
  this.lineToVector(show, direction1, [line_1, z1], [x1, y1], name);
},

writeLine(show, [x1, y1], [x2, y2], name) {
  const str = this.countType("string", [x1, y1], [x2, y2]);
  const num = this.countType("number", [x1, y1], [x2, y2]);
  if (num.length == 0) {
    this.linesToLines(show, [x1, y1], [x2, y2], name);
  }
  else if (num.length == 1) {
    if (num[0] == x1) {
      this.linesToLine(show, "x", [str[1], str[2]], [str[0], num[0]], name);
    } else if (num[0] == x2) {
      this.linesToLine(show, "x", [str[0], str[1]], [str[2], num[0]], name);
    } else if (num[0] == y1) {
      this.linesToLine(show, "y", [str[1], str[2]], [str[0], num[0]], name);
    } else {
      this.linesToLine(show, "y", [str[0], str[1]], [str[2], num[0]], name);
    }
  }
  else if (num.length == 2) {
    if ((num[0] == x1) && (num[1] == x2)) {
      this.lineToLine(show, "x", "x", [str[0], num[0]], [str[1], num[1]], name);
    } else if ((num[0] == x1) && (num[1] == y2)) {
      this.lineToLine(show, "x", "y", [str[0], num[0]], [str[1], num[1]], name);
    } else if ((num[0] == y1) && (num[1] == x2)) {
      this.lineToLine(show, "y", "x", [str[0], num[0]], [str[1], num[1]], name);
    } else if ((num[0] == y1) && (num[1] == y2)) {
      this.lineToLine(show, "y", "y", [str[0], num[0]], [str[1], num[1]], name);
    } else {
      this.linesToVector(show, [str[0], str[1]], [num[0], num[1]], name);
    }
  }
  else if (num.length == 3) {
    if (str[0] == x1) {
      this.lineToVector(show, "y", [str[0], num[0]], [num[1], num[2]], name);
    } else if (str[0] == y1) {
      this.lineToVector(show, "x", [str[0], num[0]], [num[1], num[2]], name);
    } else if (str[0] == x2) {
      this.lineToVector(show, "y", [str[0], num[2]], [num[0], num[1]], name);
    } else {
      this.lineToVector(show, "x", [str[0], num[2]], [num[0], num[1]], name);
    }
  }
  else if (num.length == 4) {
    this.vectorToVector(show, [x1, y1], [x2, y2], name);
  }
},

mirror(show, line, axis, name) {
  let x31, x32, y31, y32;
  const a = this.slope(axis);
  const b = this.intercept(axis);
  
  const x11 = this.start(line)[0];
  const y11 = this.start(line)[1];
  const x12 = this.end(line)[0];
  const y12 = this.end(line)[1];
  
  if (this.direction(axis) == "y=") {
    if (a != 0) {
      x31 = ((x11 / a + y11) - b) / (a + 1 / a);
      y31 = a * x31 + b;
      x32 = ((x12 / a + y12) - b) / (a + 1 / a);
      y32 = a * x32 + b;
    } else {
      x31 = x11;
      y31 = this.intercept(axis);
      x32 = x12;
      y32 = y31;
    }
  }
  else {
    x31 = this.intercept(axis);
    y31 = y11;
    x32 = x31;
    y32 = y12;
  }
  const x21 = 2 * x31 - x11;
  const y21 = 2 * y31 - y11;
  const x22 = 2 * x32 - x12;
  const y22 = 2 * y32 - y12;
  this.writeLine(show, [x21, y21], [x22, y22], name);
},

record(show, [x1, y1], [x2, y2], name) {
  if (show) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
  }
  let a = (y2 - y1) / (x2 - x1);
  if (Math.abs(a) != Infinity) {
    this.Lines.push(name, ["y=", a, y1 - a * x1, [x1, y1], [x2, y2]]);
  } else {
    a = (x2 - x1) / (y2 - y1);
    this.Lines.push(name, ["x=", a, x1 - a * y1, [x1, y1], [x2, y2]]);
  }
},

cross(line_1, line_2) {
  const a1 = this.slope(line_1);
  const b1 = this.intercept(line_1);
  const a2 = this.slope(line_2);
  const b2 = this.intercept(line_2);
  let x3, y3;
  if (this.direction(line_1) == "y=") {
    if (this.direction(line_2) == "y=") {
      x3 = ( b2 - b1 ) / ( a1 - a2 );
    } else {
      x3 = b2;
    }
    y3 = a1 * x3 + b1;
  }
  else {
    x3 = b1;
    y3 = a2 * x3 + b2;
  }
  return [x3, y3];
},

countType(type, [x1, y1], [x2, y2]) {
  const count = [];
  if (typeof x1 == type) { count.push(x1); }
  if (typeof y1 == type) { count.push(y1); }
  if (typeof x2 == type) { count.push(x2); }
  if (typeof y2 == type) { count.push(y2); }
  return count;
},

slope(line) {
  const index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][1];
},

intercept(line) {
  const index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][2];
},

direction(line) {
  const index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][0];
},

start(line) {
  const index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][3];
},

end(line) {
  const index = this.Lines.indexOf(line) + 1;
  return this.Lines[index][4];
}
};
