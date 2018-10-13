/*
Typical notkun. 
1. bæta við #include "okkarDot.h" í skránna

Setja eftirfarandi inni mainThread() i adal fallinu:

      //bara til ad gera main() knappara
      byrjaAllt();

      UART_write(uart0, "test1\r\n", 7);

       UART_write(uart0, "dist: ", 6);

       // setja innihaldid inni while lykkjuna i mainThread
      // while(1){
           if(utanumhald & SCAN_TRIG){
               scanSweep();
               utanumhald &= ~SCAN_TRIG;
           }
     //  }



 */


#ifndef __OKKAR_DOT__
#define __OKKAR_DOT__

#include <ti/drivers/GPIO.h>
#include <ti/drivers/UART.h>
#include <ti/drivers/PWM.h>

/* defines */

#define     PWMTimerCC32XX_PIN_01    // timer 3A f pwm
#define     PWMTimerCC32XX_PIN_02    // timer 3B f pwm
#define     PI   3.1415926

#define servoPeriod 20000            // 20 ms

// defines fyrir servo dót
#define thetaStep   1
#define thetaRange  60

#define phiStep     1
#define phiRange    60

#define servoMsStep 20    // delay milli servo hreyfinga

#define numPoints (thetaRange/thetaStep * phiRange/phiStep)
#define numDigits 4   // fjoldi tolutafa i hverri fjarlaegd maelingu (maxval 1200)

// skilgreiningar f "utanumhald" breytuna. Notad i bitmaska
#define SCAN_TRIG 1
#define SCANDATA_READY 2
#define SCANLINE_READY 4

// breytur, declarations
extern int utanumhald;
extern float cartesian[][];


/* API */
void tfMiniInit(void);
void byrjaUart(void);
void byrjaServo(void);
void byrjaGPIO();
void byrjaAllt();

// onotad eins og er...
// void wifi_init_ogByrja();

void button0(uint_least8_t index);
void button1(uint_least8_t index);

void setServoAngle(PWM_Handle, float);
void scanSweep(void);

int tfMiniRead_2(void);
void sphericalToCartesian(int numPts);
float degToRad(int);
void intToChar(int tala);

#endif // __OKKAR_DOT__