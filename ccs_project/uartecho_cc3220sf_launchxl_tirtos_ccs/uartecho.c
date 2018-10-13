/*
SERVO:
- brúnt -> GND
- rautt -> 5v
- orange -> PWM

servo0 : theta, horizontal, pin 2
servo1 : phi, vertical, pin 1

UART1 -> tfMini
graenn --> tx --> pin 8
hvitur --> rx --> pin 7
rautt -- 5v (4.5-6v)
svart -- gnd





*/
#include <stdint.h>
#include <stddef.h>
#include <stdlib.h>

/* Driver Header files */
#include <ti/drivers/GPIO.h>
#include <ti/drivers/UART.h>
#include <ti/drivers/PWM.h>
#include <ti/sysbios/BIOS.h>
#include <ti/sysbios/knl/Task.h>
#include <ti/sysbios/knl/Clock.h>

/* Example/Board Header files */
#include "Board.h"

#define     PWMTimerCC32XX_PIN_01    // timer 3A f pwm
#define     PWMTimerCC32XX_PIN_02    // timer 3B f pwm

#define servoPeriod 20000

// defines fyrir servo dót
#define thetaStep   1
#define thetaRange  80

#define phiStep     1
#define phiRange    45

#define servoMsStep 20    // delay milli servo hreyfinga

/*
int tfMiniRead_2(void);
void tfMiniInit(void);
void byrjaUart(void);
void byrjaServo(void);
void setServoAngle(PWM_Handle, int);
void testSweep(void);
*/

// extern void ltoa(string, long);

UART_Handle uart0;     // USB <--> pc
UART_Handle uart1;     // cc3220sf <--> tfMini
UART_Params uartParams;
PWM_Handle servo0;        // pwm0 : lárétt, theta
PWM_Handle servo1;        // pwm1
PWM_Params pwmParams;




/*
inline int getDec(string hexstr)
{
    return (int)strtol(hexstr.c_str(), 0, 16);
} */


void tfMiniInit(void)
{
    // setur tfMini a standard output mode.
    const uint8_t tfMiniSettings[] = {0x42, 0x57, 0x02, 0x00,
        0x00, 0x00, 0x01, 0x06};

    UART_write(uart1, tfMiniSettings, sizeof(tfMiniSettings));

    if(uart0 && uart1){
        const char initMsg[] = "tfMini initialized! \r\n";
        UART_write(uart0, initMsg, sizeof(initMsg));
    }
}

void byrjaUart(void)
{
    UART_Params_init(&uartParams);
     uartParams.writeDataMode = UART_DATA_BINARY;
     uartParams.readDataMode = UART_DATA_BINARY;
     uartParams.readReturnMode = UART_RETURN_FULL;
     uartParams.readEcho = UART_ECHO_OFF;
     uartParams.baudRate = 115200;

     uart0 = UART_open(Board_UART0, &uartParams);
     uart1 = UART_open(Board_UART1, &uartParams);

}

void byrjaServo()
{
   PWM_Params_init(&pwmParams);
   pwmParams.idleLevel = PWM_IDLE_LOW;      // Output low when PWM is not running
   pwmParams.periodUnits = PWM_PERIOD_US;   // Period is in microsec
   pwmParams.periodValue = servoPeriod;     // sja #define efst
   pwmParams.dutyUnits = PWM_DUTY_US;       // Duty is in us
   pwmParams.dutyValue = 0;                 // 0% initial duty cycle
   // Open the PWM instance
   servo0 = PWM_open(Board_PWM0, &pwmParams);
   PWM_start(servo0);
   servo1 = PWM_open(Board_PWM1, &pwmParams);
   PWM_start(servo1);
}

// kalla a med setServoAngle(pwm0, horn); // thar sem horn er 0-180
void setServoAngle(PWM_Handle servo, float angle)
{
    if((angle < 181) && (angle > 0)){
        int usValue = (1000 + (angle/180 * 1000));
        PWM_setDuty(servo, usValue);  // 1000 µs min, 2000 µs max.
    }
}





long dist = 0;
char printDist[4];

char *tfMiniRead_2(void) // tilrauna fall, 1 og 2, til ad lesa af tfmini.
{    // ath. betur med error checking osfrv.
    uint8_t lastChar = 0x00;
    uint8_t currChar = 0x00;
    char frame[7];
    char Dist_HL[3];
    Dist_HL[2] = '\0';    // null terminated string
   // uint8_t numCharsRead = 0;

 while(1){
        if (uart1) {
        UART_read(uart1, &currChar, 1);
        //  uint8_t curChar = streamPtr->read();

          if((lastChar == 0x59) && (currChar == 0x59)) {
            // Break to begin frame
            break;

          } else {
            // We have not seen two 0x59's in a row -- store the current character and continue reading.
            lastChar = currChar;
           // numCharsRead += 1;
          }
        }
        else if(!uart1) UART_write(uart0, "no tfMini! \r\n", 13);
    }
     UART_read(uart1, &frame, 7);
  //  UART_write(uart0, &frame, 9);
  //  Dist_HL[0] = frame[1];
  //  Dist_HL[1] = frame[0];
    dist = (frame[1] << 8) + frame[0];

//   dist = strtol((frame[1] << 8) + frame[0], NULL, 16);

    // breyta nidurstodum ur base 16 char array string yfir i long
    return dist+'0';
}

/*
void testSweep(void)
{
    for(j=0; j<60;){
       for(i=0; i<80; i++){
           Task_sleep(msStep * (1000 / Clock_tickPeriod));
           setServoAngle(servo0, i);
       }
       j=j+3;
       setServoAngle(servo1, j);
       for(i=80; i>0; i--){
           Task_sleep(msStep * (1000 / Clock_tickPeriod));
           setServoAngle(servo0, i);
       }
       j=j+3;
       setServoAngle(servo1, j);
    }
} */

void *mainThread(void *arg0){
    //   const char  echoPrompt[] = "Fjarlaegd:\r\n";
     //  const char  uart1fail[] = "uart1 fail... \r\n";
    uint8_t i, j;
    int msStep = 10;

      UART_init();
      byrjaUart();    // bara til ad gera main() knappara
      PWM_init();
      byrjaServo(); // bara til ad gera main() knappara
    //  tfMiniInit();

       UART_write(uart0, "test1\r\n", 7);


       if(servo0 == NULL) UART_write(uart0, "no servo0 \r\n", 12);

//       uint8_t frame[9];
     //  uint8_t angle = 90;

     //  PWM_setDuty(servo0, servoPeriod/2);

      // setServoAngle(servo0, 20);
      // setServoAngle(servo1, 160);
     //  PWM_setDuty(servo0, 1800);  // 3ms
      // PWM_setDuty(servo1, 1000);   // 1 ms
       while(1){
           for(j=0; j<60;){
              for(i=0; i<80; i++){
                  Task_sleep(msStep * (1000 / Clock_tickPeriod));
                  setServoAngle(servo0, i);
              }
              j=j+3;
              setServoAngle(servo1, j);
              for(i=80; i>0; i--){
                  Task_sleep(msStep * (1000 / Clock_tickPeriod));
                  setServoAngle(servo0, i);
              }
              j=j+3;
              setServoAngle(servo1, j);
           }
           // int dist = 0;
           // char printDist[10];
      /*     UART_write(uart0, "dist: ", 6);
           *printDist = tfMiniRead_2();

           UART_write(uart0, printDist, 4);
           UART_write(uart0, "\r\n", 2);
           Task_sleep(100 * (1000 / Clock_tickPeriod)); */


         //  if(dist != 0){
           /*    UART_write(uart0, echoPrompt, sizeof(echoPrompt));
               UART_write(uart0, &dist, sizeof(dist));
               dist = 0;
               tfMiniRead_2();  */
   /*      UART_read(uart1, &frame, 9);7


         UART_write(uart0, &frame, 2);
         UART_write(uart0, "\r\n", 2);
*/
         //  }


       }

   //     UART_write(uart, echoPrompt, sizeof(echoPrompt));

       /* Loop forever echoing
       while (1) {
           UART_read(uart, &input, 1);
           UART_write(uart, &input, 1);
       }  */

}














