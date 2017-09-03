this.ShowVersion = 'PhotoPizza v3.1';

this.f = new (require("FlashEEPROM"))();
require("SSD1306");
require("Font8x16").add(Graphics);

this.irCods = {};
this.irCods.calibrationStart = 25803148087;
this.irCods.calibrationStart_errror = 6450787021;

this.irCods.RedPower = 6450774781;
this.irCods.RedPower_error = 25803099127;
this.irCods.Setup = 6450823741;
this.irCods.Setup_error = 25803294967;
this.irCods.Up = 6450800791;
this.irCods.Up_2 = 25803203167;
this.irCods.Down = 6450796711;
this.irCods.Down_error = 25803186847;
this.irCods.Left = 6450809461;
this.irCods.Left_error = 25803237847;
this.irCods.Right = 6450776821;
this.irCods.Right_error = 25803107287;
this.irCods.Ok = 6450825271;
this.irCods.Ok_error = 25803301087;
this.irCods.Ok_error2 = '';
this.irCods.StepperEn = '';

this.irCodsDig = {};
this.irCodsDig._1 = 6450803341;
this.irCodsDig._2 = 6450819151;
this.irCodsDig._2_error = 8888888888888;
this.irCodsDig._3 = 6450786511;
this.irCodsDig._4 = 6450795181;
this.irCodsDig._5 = 6450810991;
this.irCodsDig._6 = 6450778351;
this.irCodsDig._7 = 6450799261;
this.irCodsDig._8 = 6450815071;
this.irCodsDig._8_error = 25803260287;
this.irCodsDig._9 = 6450782431;
this.irCodsDig._0 = 6450806911;
this.irCodsDig._0_error = 25803227647;

this.right = 1;
this.left = 0;
this.direction = 1;
this.dirDisplay = '';
if (this.direction === 1) {
  this.dirDisplay = 'right';
} else {
  this.dirDisplay = 'left';
}

this.saved = E.toString(this.f.read(0));

//MEMORY
if (this.saved != 'saved') {
  console.log('start save');
  this.f.write(0, 'saved');
  this.f.write(1, '16000');//allsteps
  this.f.write(2, '10');//frame
  this.f.write(3, '100');//pause
  this.f.write(4, '100');//shootingTime
  this.f.write(5, '5000');//speed
  this.f.write(6, '2000');//acceleration
  this.f.write(7, 'inter');//shootingMode
}

this.frame = E.toString(this.f.read(2)) * 1;
this.allSteps = E.toString(this.f.read(1)) * 1;
this.pause = E.toString(this.f.read(3)) * 1;
this.frameTime = E.toString(this.f.read(4)) * 1;
this.speed = E.toString(this.f.read(5)) * 1;
this.acceleration = E.toString(this.f.read(6)) * 1;
this.shootingMode = E.toString(this.f.read(7));

this.irCode = 0;
this.irDigital = '1';
this.simNum = 0;

//DISPLAY
this.marker = 0;
this.indent = 13;
this.dispay_2 = false;
this.setupMode = false;

//STEPPER
this.pinStep = P11;
this.pinEn = P12;
this.pinDir = P10;

digitalWrite(this.pinStep, 0);
digitalWrite(this.pinEn, 1);
digitalWrite(this.pinDir, this.direction);

//RELAY
this.pinRelay = P5;
this.relayOn = false;

//FLAGS
this.startFlag = false;


require("IRReceiver").connect(A0, function(code) {
  this._code = parseInt(code, 2);
  
  if (this.setupMode && this._code === this.irCodsDig._1 || this.setupMode && this._code === this.irCodsDig._2 || this.setupMode && this._code === this.irCodsDig._3 || this.setupMode && this._code === this.irCodsDig._4 || this.setupMode && this._code === this.irCodsDig._5 || this.setupMode && this._code === this.irCodsDig._6 || this.setupMode && this._code === this.irCodsDig._7 || this.setupMode && this._code === this.irCodsDig._8 || this.setupMode && this._code === this.irCodsDig._9 || this.setupMode && this._code === this.irCodsDig._0) {
  console.log('input');
    IrInput();
    return;
  }
  if (this._code === this.irCods.Setup && !this.setupMode && !this.poweroff || this._code === this.irCods.Setup_error && !this.setupMode && !this.poweroff) {
    SettingsDisplay_1();
    console.log('Setup');
    this.simNum = 0;
    return;
  } else if (this._code === this.irCods.Setup && this.setupMode || this._code === this.irCods.Setup_error && this.setupMode) {
    this.setupMode = false;
    NumControl();
    StartDisplay();
    console.log('Setup Exit');
    return;
  }
  if (this._code === this.irCods.Ok && this.startFlag && !this.poweroff || this._code === this.irCods.Ok_error && this.startFlag && !this.poweroff || this._code === this.irCods.Ok_error2 && this.startFlag && !this.poweroff) {
    this.startFlag = false;
    BtnStop();
    console.log('OK STOP');
    this.simNum = 0;
    return;
  }
  if (this._code === this.irCods.Ok && !this.startFlag && !this.poweroff || this._code === irCods.Ok_error && !this.startFlag && !this.poweroff || this._code === this.irCods.Ok_error2 && !this.poweroff && !this.startFlag) {
    this.startFlag = true;
    StartDisplay();
    Start();
    console.log('OK START');
    this.simNum = 0;
    return;
  }
  if (this._code === this.irCods.Down && !this.dispay_2 && this.setupMode || this._code === this.irCods.Down_error && !this.dispay_2 && this.setupMode) {
    this.marker = this.marker + this.indent;
    SettingsDisplay_1();
    this.simNum = 0;
    console.log('Down D1');
    return;
  } else if (this._code === this.irCods.Down && this.dispay_2 && this.setupMode || this._code === this.irCods.Down_error && this.dispay_2 && this.setupMode) {
    this.marker = this.marker + this.indent;
    SettingsDisplay_2();
    console.log('Down D2');
    this.simNum = 0;
    return;
  }
   if (this._code === this.irCods.Up && !this.dispay_2 && this.setupMode || this._code === this.irCods.Up_2 && !this.dispay_2 && this.setupMode) {
    this.marker = this.marker - this.indent;
    SettingsDisplay_1();
    this.simNum = 0;
    console.log('UP D1');
    return;
  } else if (this._code === this.irCods.Up && this.dispay_2 && this.setupMode || this._code === this.irCods.Up_2 && this.dispay_2 && this.setupMode) {
    this.marker = this.marker - this.indent;
    SettingsDisplay_2();
    console.log('UP D2');
    this.simNum = 0;
    return;
  }
  if (this._code === this.irCods.Right_error && !this.dispay_2 && this.setupMode || this._code === this.irCods.Right && !this.dispay_2 && this.setupMode) {
    SettingsDisplay_2();
    console.log('Right');
    this.simNum = 0;
    return;
  }
  if (this._code === this.irCods.Left_error && this.dispay_2 && this.setupMode || this._code === this.irCods.Left && this.dispay_2 && this.setupMode) {
    SettingsDisplay_1();
    console.log('Left');
    this.simNum = 0;
    return;
  }
  if (this._code === this.irCods.StepperEn && !this.poweroff) {
  }
  if (this._code === this.irCods.calibrationStart && !this.calibration&& !this.poweroff || this._code === this.irCods.calibrationStart_errror && !this.calibration && !this.poweroff) {
    Calibration();
    return;
  } else if (this._code === this.irCods.calibrationStart && this.calibration && !this.poweroff || this._code === this.irCods.calibrationStart_errror && this.calibration && !this.poweroff) {
    this.calibration = false;
    Stop();
  }
  if (this._code === this.irCods.RedPower && !this.poweroff || this._code === this.irCods.RedPower_error && !this.poweroff) {
    this.g.off();
    this.poweroff = true;
    Stop();
    return;
  } else if (this._code === this.irCods.RedPower && this.poweroff || this._code === this.irCods.RedPower_error && this.poweroff) {
    this.g.on();
    this.poweroff = false;
    LogoDisplay();
    return;
  }
  console.log(this._code);
});

function LogoDisplay(){
  
  var x1x2 = 1;
  this.g.clear();
  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString(this.ShowVersion, 10, 45);
  this.g.flip();
  var preloader = setInterval(function () {
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.flip();
    if (x1x2 > 126) {
      clearInterval(preloader);
      NumControl();
      StartDisplay();
    }
  }, 10);
}

function StartDisplay(){
  this.g.clear();
  this.g.setFontVector(35);
  this.g.drawString(this._frame + ' f', 0, 0);
  this.g.flip();
  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString(Math.floor(this._shootingTime / 1000) + ' SECONDS', 0, 45);
  this.g.flip();
}

function SettingsDisplay_1(){
  this.setupMode = true;
  this.dispay_2 = false;

  if (this.marker > this.indent * 4) {
    this.marker = 0;
  } else if (this.marker < 0) {
    this.marker = this.indent * 4;
  }

  this.g.clear();

  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString('>', 1, this.marker);
  this.g.drawString('>', 117, 28);
  this.g.drawString('1', 117, 0);

  this.g.drawLine(112, 0, 112, 127);

  this.nameIndent = 48;

  this.g.drawString('frame', 8, 0);
  this.g.drawString('=', this.nameIndent, 0);
  this.g.drawString(this.frame, 57, 0);

  this.g.drawString('delay', 8, this.indent);
  this.g.drawString('=', this.nameIndent, this.indent);
  this.g.drawString(this.frameTime, 57, this.indent);

  this.g.drawString('pause', 8, this.indent * 2);
  this.g.drawString('=', this.nameIndent, this.indent * 2);
  this.g.drawString(this.pause, 57, this.indent * 2);

  this.g.drawString('speed', 8, this.indent * 3);
  this.g.drawString('=', this.nameIndent, this.indent * 3);
  this.g.drawString(this.speed, 57, this.indent * 3);

  this.g.drawString('accel', 8, this.indent * 4);
  this.g.drawString('=', this.nameIndent, this.indent * 4);
  this.g.drawString(this.acceleration, 57, this.indent * 4);

  this.g.flip();
}

function SettingsDisplay_2(){
  this.setupMode = true;
  this.dispay_2 = true;

  if (this.marker > this.indent * 2) {
    this.marker = 0;
  } else if (this.marker < 0) {
    this.marker = this.indent * 2;
  }

  this.g.clear();

  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString('>', 1, this.marker);
  this.g.drawString('<', 117, 28);
  this.g.drawString('2', 117, 0);

  this.g.drawLine(112, 0, 112, 127);

  this.nameIndent = 48;

  this.g.drawString('mode', 8, 0);
  this.g.drawString('=', this.nameIndent, 0);
  this.g.drawString(this.shootingMode, 57, 0);

  this.dirDisp = 'left';

  if (this.direction === left) {
    this.dirDisp = 'left';
  } else {
    this.dirDisp = 'Right';
  }
  this.g.drawString('direc', 8, this.indent);
  this.g.drawString('=', this.nameIndent, this.indent);
  this.g.drawString(this.dirDisp, 57, this.indent);

  this.g.drawString('steps', 8, this.indent * 2);
  this.g.drawString('=', this.nameIndent, this.indent * 2);
  this.g.drawString(this.allSteps, 57, this.indent * 2);

  this.g.flip();
}

function IrInput() {

  if (this._code === this.irCodsDig._1) {
    this.irDigital = '1';
  }
  if (this._code === this.irCodsDig._2 || this._code === this.irCodsDig._2_error) {
    this.irDigital = '2';
  }
  if (this._code === this.irCodsDig._3) {
    this.irDigital = '3';
  }
  if (this._code === this.irCodsDig._4) {
    this.irDigital = '4';
  }
  if (this._code === this.irCodsDig._5) {
    this.irDigital = '5';
  }
  if (this._code === this.irCodsDig._6) {
    this.irDigital = '6';
  }
  if (this._code === this.irCodsDig._7) {
    this.irDigital = '7';
  }
  if (this._code === this.irCodsDig._8 || this._code === this.irCodsDig._8_error) {
    this.irDigital = '8';
  }
  if (this._code === this.irCodsDig._9) {
    this.irDigital = '9';
  }
  if (this._code === this.irCodsDig._0 || this._code === this.irCodsDig._0_error) {
    this.irDigital = '0';
  }
  if (!this.dispay_2 && this.marker === 0 && this.simNum <= 7 && this.simNum > 0) {
    this.frame = (this.frame + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === 0 && this.simNum === 0 && this.irDigital != '0') {
    this.frame = '';
    this.frame = (this.frame + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent && this.simNum <= 7 && this.simNum > 0) {
    this.frameTime = (this.frameTime + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent && this.simNum === 0 && this.irDigital != '0') {
    this.frameTime = '';
    this.frameTime = (this.frameTime + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 2 && this.simNum <= 7 && this.simNum > 0) {
    this.pause = (this.pause + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 2 && this.simNum === 0 && this.irDigital != '0') {
    this.pause = '';
    this.pause = (this.pause + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 3 && this.simNum <= 7 && this.simNum > 0) {
    this.speed = (this.speed + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 3 && this.simNum === 0 && this.irDigital != '0') {
    this.speed = '';
    this.speed = (this.speed + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 4 && this.simNum <= 7 && this.simNum > 0) {
    this.acceleration = (this.acceleration + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 4 && this.simNum === 0 && this.irDigital != '0') {
    this.acceleration = '';
    this.acceleration = (this.acceleration + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }

  //DISPLAY 2
  if (this.dispay_2 && this.marker === 0 && this.irDigital === '1') {
    this.shootingMode = 'inter';
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === 0 && this.irDigital === '2') {
    this.shootingMode = 'nonstop';
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === 0 && this.irDigital === '3') {
    this.shootingMode = 'stopmo';
    SettingsDisplay_2();
  }
   if (this.dispay_2 && this.marker === this.indent && this.irDigital === '1') {
    this.direction = 1;
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === this.indent && this.irDigital === '2') {
    this.direction = 0;
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === this.indent * 2 && this.simNum <= 7 && this.simNum > 0) {
    this.allSteps = (this.allSteps + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_2();
    this.simNum++;
  }
  if (this.dispay_2 && this.marker === this.indent * 2 && this.simNum === 0 && this.irDigital != '0') {
    this.allSteps = '';
    this.allSteps = (this.allSteps + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_2();
    this.simNum++;
  }
}

function NumControl() {
  if ((E.toString(this.f.read(1)) * 1) != this.allSteps + '' && !this.setupMode) {
    this.f.write(1, this.allSteps + '');
    console.log('save allSteps');
  }
  if ((E.toString(this.f.read(2)) * 1) != this.frame + '' && !this.setupMode) {
    this.f.write(2, this.frame + '');
    console.log('save frame');
  }
  if ((E.toString(this.f.read(5)) * 1) != this.speed + '' && !this.setupMode) {
    this.f.write(5, this.speed + '');
    console.log('save speed');
  }
  this._frame = this.frame;
  this._speed = 1;
  this.frameSteps = this.allSteps / this.frame;
  this.stepperTime = this.frameSteps / this.speed * 1000;
  this.accelerationSteps = this.frameSteps / 4;
  this.accelerationTime = this.stepperTime / 4; 
  this.accIntervalSteps = Math.floor(0.04 * this.accelerationSteps);
  if (this.accIntervalSteps <= 0) {
    this.accIntervalSteps = 1;
  }
  this.accStep = this.speed / this.accIntervalSteps;
  this.accSpeed = this.accelerationTime / this.accIntervalSteps;
  this.shootingTime1F = this.pause + this.frameTime + this.stepperTime;
  this.shootingTime = this.shootingTime1F * this.frame;
  this._shootingTime = this.shootingTime;
  console.log('this.accIntervalSteps = ' + this.accIntervalSteps);
  console.log('NumControl');
}

function Start() {
  digitalWrite(pinEn, 0);
  if (this._frame > 0) {
    this.startFlag = true;
    ShotingPause();
  } else {
    Stop();
  }
}

function Stop() {
  console.log('stop');
  clearInterval();
  this.startFlag = false;
  digitalWrite(this.pinStep, 0);
  digitalWrite(pinEn, 1);
  NumControl();
  StartDisplay();
}

function StepperAccMax() {
  if (!this.startFlag) {
    return;
  }
  this._speed = 1;
  if (this.accIntervalSteps === 1) {
    this._speed = this.speed;
    this.accelerationTime = this.stepperTime / 3;
    Stepper();
    return;
  }
  var accTimerMax = setInterval(function () {
    analogWrite(this.pinStep, 0.5, { freq : this._speed } );
    this._speed = this._speed + this.accStep;
    if (this._speed >= this.speed) {
      clearInterval(accTimerMax);
      Stepper();
    }
  }, this.accSpeed);
}

function Stepper() {
  if (!this.startFlag) {
    return;
  }
  analogWrite(this.pinStep, 0.5, { freq : this.speed } );
  this.stepTimer = setTimeout(function () {
    clearTimeout(this.stepTimer);
    if (this.accIntervalSteps === 1) {
      this._shootingTime = this._shootingTime - this.shootingTime1F;
      digitalWrite(this.pinStep, 0);
      Start();
      return;
    }
    StepperAccMin();
  }, this.accelerationTime * 3);
}

function StepperAccMin() {
  if (!this.startFlag) {
    return;
  }
  analogWrite(this.pinStep, 0.5, { freq : this.speed } );
  var accTimerMin = setInterval(function () {
    analogWrite(this.pinStep, 0.5, { freq : this._speed } );
    this._speed = this._speed - this.accStep;
    if (this._speed <= 0) {
      clearInterval(accTimerMin);
      this._shootingTime = this._shootingTime - this.shootingTime1F;
      Start();
    }
  }, this.accSpeed);
}

function ShotingPause() {
  if (!this.startFlag) {
    return;
  }
  this.pauseTimer = setTimeout(function () {
  Relay();
    clearTimeout(this.pauseTimer);
  }, this.pause);

}

function Relay() {
  if (!this.startFlag) {
    return;
  }
  console.log('Relay');

  if (this._frame > 0 && this.startFlag) {
    this.relayOn = true;
    digitalWrite(this.pinRelay, 1);
    this._frame--;
    this.frameTimer = setTimeout(function () {
      digitalWrite(this.pinRelay, 0);
      this.relayOn = false;
      StartDisplay();
      StepperAccMax();
      clearTimeout(this.frameTimer);
    }, this.frameTime);
  } else {
    Stop();
  }
}

function BtnStop() {
  console.log('BtnStop');
      Stop();
}

function Calibration() {
  this.calibration = true;
  this.g.clear();
  this.g.setFontVector(20);
  this.g.drawString('calibration', 0, 0);
  this.g.flip();

  digitalWrite(this.pinEn, 0);
  this.step1 = true;
  allSteps = 0;
  setInterval(function () {
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
    if (this.step1) {
      digitalWrite(this.pinStep, 0);
      this.step1 = false;
      } else {
      digitalWrite(this.pinStep, 1);
      this.allSteps = this.allSteps + 1;
      this.step1 = true;
    }
 }, 1);

  setInterval(function () {
    this.g.clear();
    this.g.setFontVector(20);
    this.g.drawString(this.allSteps + ' st', 0, 0);
    this.g.flip();
 }, 4999);
}

this.loadingTimer = setTimeout(function () {
  
  this.g = require("SSD1306").connect(I2C1, LogoDisplay);
      clearTimeout(this.loadingTimer);
    }, 100);
function onInit() {
 I2C1.setup({scl:B8, sda:B9});
}