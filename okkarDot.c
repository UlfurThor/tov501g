/*
SERVO:
- brúnt -> GND
- rautt -> 5v
- orange -> PWM

// phi og theta skv. mynd i skyrslu
servo0 : theta, vertical, pin 2
servo1 : phi, horizontal, pin 1

UART1 -> tfMini
graenn --> tx --> pin 8
hvitur --> rx --> pin 7
rautt -- 5v (4.5-6v)
svart -- gnd

Button 0 triggerar skann



*/
#include <stdint.h>
#include <stdio.h>
#include <stddef.h>
#include <stdlib.h>
#include <stdarg.h>
#include <math.h>

/* Driver Header files */
#include <ti/drivers/GPIO.h>
#include <ti/drivers/UART.h>
#include <ti/drivers/PWM.h>
#include <ti/sysbios/BIOS.h>
#include <ti/sysbios/knl/Task.h>
#include <ti/sysbios/knl/Clock.h>

/* Example/Board Header files */
#include "Board.h"

#define HITAMAELIR 0   // 0 ef enginn hitamaelir. 1 annars

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

//int tfMiniRead_2(void);
//void tfMiniInit(void);
//void byrjaUart(void);
//void byrjaServo(void);
//void setServoAngle(PWM_Handle, float);
//void testSweep(void);
float degToRad(int);

// extern void ltoa(string, long);

UART_Handle uart0;     // USB <--> pc
UART_Handle uart1;     // cc3220sf <--> tfMini
UART_Params uartParams;
PWM_Handle servo0;        // pwm0 : lárétt, phi
PWM_Handle servo1;        // pwm1
PWM_Params pwmParams;

// fylki fyrir maelingar, declaration herna, sidan uthlutad a heap seinna
//uint16_t *measurements;
//float *cartesian;
#ifdef HITAMAELIR
uint16_t measurements[numPoints][4];   // numPoints linur, 3 dalkar: r, theta, phi
#endif
#ifndef
uint16_t measurements[numPoints][3];   // numPoints linur, 3 dalkar: r, theta, phi
#endif
float cartesian[numPoints][3];      // x, y, z
char printDist[4];    // til ad breyta dist i c-string til ad uart-prenta

int utanumhald = 0;


//
//_i16 Role;
//_i16 Status;
//_u8 channel = 1;
//_u8 val = SL_WLAN_SEC_TYPE_OPEN;
//_u8 Ssid[] = "3DE_2018";



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
    UART_init();
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
   PWM_init();
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

void byrjaAllt()
{
    void tfMiniInit(void);
    void byrjaUart(void);
    void byrjaServo(void);
    void byrjaGPIO();

}

// triggerar skann.
void button0(uint_least8_t index)
{
    utanumhald |= SCAN_TRIG;
}

void button1(uint_least8_t index)
{
    GPIO_toggle(Board_GPIO_LED0);
}

void byrjaGPIO()
{
    GPIO_init();
    /* Configure the LED and button pins */
    GPIO_setConfig(Board_GPIO_LED0, GPIO_CFG_OUT_STD | GPIO_CFG_OUT_LOW);
    GPIO_setConfig(Board_GPIO_BUTTON0, GPIO_CFG_IN_PU | GPIO_CFG_IN_INT_FALLING);

    /* Turn on user LED */
    GPIO_write(Board_GPIO_LED0, Board_GPIO_LED_ON);
    /* install Button callback */

    /* Enable interrupts */
    GPIO_setConfig(Board_GPIO_BUTTON0, GPIO_CFG_IN_PU | GPIO_CFG_IN_INT_FALLING);
    GPIO_setCallback(Board_GPIO_BUTTON0, button0);
    GPIO_enableInt(Board_GPIO_BUTTON0);

    GPIO_setConfig(Board_GPIO_BUTTON1, GPIO_CFG_IN_PU | GPIO_CFG_IN_INT_FALLING);

        /* Install Button callback */
    GPIO_setCallback(Board_GPIO_BUTTON1, button1);
    GPIO_enableInt(Board_GPIO_BUTTON1);

}


//  ### ---------      USER FUNCTIONS     -----  ###  ///


// kalla a med setServoAngle(pwm0, horn); // thar sem horn er 0-180
void setServoAngle(PWM_Handle servo, float angle)
{
    if((angle < 181) && (angle > 0)){
        int usValue = (1000 + (angle/180 * 1000));
        PWM_setDuty(servo, usValue);  // 1000 µs min, 2000 µs max.
    }
    if(servo0 == NULL) UART_write(uart0, "no servo0 \r\n", 12);
    if(servo1 == NULL) UART_write(uart1, "no servo1 \r\n", 12);
}

// fall til ad breyta ur spherical yfir i kartesian
// tekur inn fjolda punkta til ad breyta, default gildi er heildarfjoldi
// fylkid er: r (dist), theta (vertical), phi (horizontal) --- breytir i x, y, z
void sphericalToCartesian(int numPts)
{
//    x = r * sin( theta )* cos( phi );
//    y = r * sin( theta )* sin( phi );
//    z = r * cos( theta );

    float phiRad, thetaRad;
    int i;
    for(i=0; i<numPts; i++){
        thetaRad = degToRad(measurements[i][1]);
        phiRad = degToRad(measurements[i][2]);

        cartesian[i][0] = measurements[i][0] * sinf(thetaRad) * cosf(phiRad);
        cartesian[i][1] = measurements[i][0] * sinf(thetaRad) * sinf(phiRad);
        cartesian[i][2] = measurements[i][0] * cosf(thetaRad);
    }
    // verdur {x, y, z}
}

float degToRad(int degree)
{
    return (degree * (PI /180))*1.0;
}

// int dist = 0;


int tfMiniRead(void) // tilrauna fall, 1 og 2, til ad lesa af tfmini.
{    // ath. betur med error checking osfrv.
    uint8_t lastChar = 0x00;
    uint8_t currChar = 0x00;
    int dist;
    uint8_t frame[7];
    uint8_t Dist_HL[3];
    Dist_HL[2] = '\0';    // null terminated string
// uint8_t numCharsRead = 0;

 while(1){
        if (uart1) {
        UART_read(uart1, &currChar, 1);
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
    Dist_HL[0] = frame[1];  // snua vid tolum
    Dist_HL[1] = frame[0];

     dist = (Dist_HL[0] << 8) + Dist_HL[1];

     // minFjarlaegd < dist < maxFjarlaegd, 0.3-12m
    if( (dist > 30) && (dist < 1200)) return dist;
     else return 0;
}

//int measurements[numPoints][3];   // numPoints linur, 3 dalkar: r, theta, phi
//float cartesian[numPoints][3];      // x, y, z

int scanSweep(void)
{

    int i,j;
    int samplCnt=0;

    for(j=0; j<thetaRange;){
       for(i=0; i < phiRange; i=i+phiStep){
           setServoAngle(servo0, i);
           Task_sleep(servoMsStep * (1000 / Clock_tickPeriod));
           measurements[samplCnt][0] = tfMiniRead();
           measurements[samplCnt][1] = j;
           measurements[samplCnt][2] = i;
           samplCnt++;

       }

       j=j+thetaStep;
       setServoAngle(servo1, j);

       for(i=phiRange; i>0; i=i-phiStep){
           setServoAngle(servo0, i);
           Task_sleep(servoMsStep * (1000 / Clock_tickPeriod));
           measurements[samplCnt][0] = tfMiniRead();
           measurements[samplCnt][1] = j;
           measurements[samplCnt][2] = i;
           samplCnt++;
       }

       j=j+thetaStep;
       setServoAngle(servo1, j);
    }
    sphericalToCartesian(numPoints);

    utanumhald |= SCANDATA_READY;
    return samplCnt;  // bara af forvitni
}


// tekur inn int, breytir char printDist.
// Thetta er bara eitthvad tilraunashit, veit ekki hvort thad verdi notad

void intToChar(int tala)
{
    printDist[0] = tala/1000;
    printDist[1] = (tala/100)%10;
    printDist[2] = (tala/10)%100;
    printDist[3] = tala%10;
}

#ifdef HITAMAELIR
// ath min max i hita, til ad akveda hitakvarda sjalfkrafa
void hitaMinMax()
{
    int maxTemp=0;
    int minTemp=200;

    int i;
    for(i=0; i>numPoints; i++){
        if(measurements[1][3] > maxTemp) maxTemp = measurements[1][3];
        if(measurements[1][3] < minTemp) minTemp = measurements[1][3];
    }
}
#endif
/*  RUSLA KISTAN
void wifi_init_ogByrja()
{
    Status = sl_WlanSetMode(ROLE_AP);      // Setur sem AP
    Status = sl_WlanSet(SL_WLAN_CFG_AP_ID, SL_WLAN_AP_OPT_SSID,
                         strlen(Ssid), Ssid);
    Status = sl_WlanSet(SL_WLAN_CFG_AP_ID, SL_WLAN_AP_OPT_CHANNEL,
                         1, (_u8 *)& channel);
 Status = sl_WlanSet(SL_WLAN_CFG_AP_ID, SL_WLAN_AP_OPT_SECURITY_TYPE,
                         1, (_u8 *)&val);
    sl_Stop(0);

    Role = sl_Start(NULL,NULL,NULL);
} 


//    dist = strtol(Dist_HL, NULL, 16);

//    int distLo = Dist_HL[0];
//    int distHi = Dist_HL[1];



*/













