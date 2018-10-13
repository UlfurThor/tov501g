/* 
 *  This program sweeps two servos over x and y axis to make
 *  a 2 dimensional matrix of distance measurements. 
 *  These measurements are streamed in real time over serial 
 *  to Processing where they are made into a picture.
 * 
 *  When inactive for more than sweepDelay (milliseconds)
 *  the servos to test sweeps over their respective ranges, 
 *  xAngle and yAngle. This is mostly to look nice, but also
 *  to show the sweep range.
 *  
 *  Servo control pins: X-axis@ D4, Y-axis@D5
 *  Button pin: D8, internal pull_upp, 560ohm resistor from button to GND
 *  SharpIR pin: A0
 *  
 */


#include <SharpIR.h>
#include <math.h>
#include <Servo.h>

#define ir A0
#define model GP2Y0A02YK0F

#define yAngle 30   // y axis scan angle
#define xAngle 30  // x axis scan angle
#define xStep 1    //x axis step increment
#define yStep 1
#define wait  50  // millisec delay between a measurement and the next step
#define sweepDelay 20000 // millisec delay between standy sweeps over defined range

#define xBias 0
#define yBias 0

const byte buttonPin = 8;   // start button

SharpIR laser(model, ir);
int dist;
float n;

Servo servoX;
Servo servoY;


int lastSweep;
int currTime;

void setup() {

  Serial.begin(9600);
  pinMode (A0, INPUT);
  pinMode(8,INPUT_PULLUP);  

  sweep();
  lastSweep = currTime = millis();

}

void loop() {

  if(digitalRead(buttonPin) == LOW){
    delay(100);
    scan();
    lastSweep = currTime = millis();
  }

  currTime = millis();
  
   if(currTime - lastSweep > sweepDelay){
    sweep();    
    lastSweep = currTime = millis();
  }
}

void scan(){

  int posX = xBias;
  int posY = yBias;
  
  servoX.attach(4);
  servoY.attach(5);
  servoX.write(posX);
  servoY.write(posY);

//todo: mappa distance á 0-255?
  
  for(posY; posY < yAngle+yBias; ){

    for(posX; posX < xAngle+xBias; ) { //left swing
      servoX.write(posX); 
      dist = laser.getDistance();      
      delay(wait);
      serialPrintPos((posX), posY, dist);               
      posX += xStep;                  
      } 

    posY += yStep;
    servoY.write(posY);
    dist = laser.getDistance();   
    delay(wait);
    serialPrintPos(posX, posY, dist); 
    
    for(posX; posX > xBias; ) { //right swing
      servoX.write(posX); 
      dist = laser.getDistance();       
      delay(wait);     
      serialPrintPos((posX), posY, dist);  // +posX for manual calibration    
      posX -= xStep;                                             
      }  
          
    posY += yStep;
    servoY.write(posY);
    dist = laser.getDistance();  
    delay(wait);
    serialPrintPos(posX, posY, dist); 
  
  }
  servoX.write(5); //núlla og aftengja
  servoY.write(5);
  delay(1000);
  
}

void serialPrintPos(int X, int Y, int d){
      Serial.print(String(X));
      Serial.print(",");
      Serial.print(String(Y)); 
      Serial.print(",");     
      Serial.print(String(d));  
      Serial.println(",");          
}

void sweep(){
          
  servoX.attach(4);
  servoY.attach(5);
  servoX.write(4);
  servoY.write(4);

  for(int x=0; x < xAngle; x++){  // left
    servoX.write(x);
    delay(wait/2);
  }
  
  for(int y=0; y < yAngle; y++){ // up
    servoY.write(y);
    delay(wait/2);
  }  
  
  for(int x=xAngle; x > 0; x--){  // right
    servoX.write(x);
    delay(wait/2);
  }

  for(int y=yAngle; y > 0; y--){ // down
    servoY.write(y);
    delay(wait/2);
  }
    servoY.write(yAngle/2);
    servoX.write(xAngle/2);
}
