/*
 * pxt-stepper- Stepper library for MakeCode - Version 1.1.0
 *
 * Original library Arduino(0.1)   by Tom Igoe.
 * Two-wire modifications  (0.2)   by Sebastian Gassner
 * Combination version     (0.3)   by Tom Igoe and David Mellis
 * Bug fix for four-wire   (0.4)   by Tom Igoe, bug fix from Noah Shibley
 * High-speed stepping mod         by Eugene Kozlenko
 * Timer rollover fix              by Eugene Kozlenko
 * Five phase five wire    (1.1.0) by Ryan Orendorff
 * Ported to Makecode      0.0.1   by Andres Sabas @ Electronic Cats
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 *
 * Drives a unipolar, bipolar, or five phase stepper motor.
 *
 * When wiring multiple stepper motors to a microcontroller, you quickly run
 * out of output pins, with each motor requiring 4 connections.
 *
 * By making use of the fact that at any time two of the four motor coils are
 * the inverse of the other two, the number of control connections can be
 * reduced from 4 to 2 for the unipolar and bipolar motors.
 *
 * A slightly modified circuit around a Darlington transistor array or an
 * L293 H-bridge connects to only 2 microcontroler pins, inverts the signals
 * received, and delivers the 4 (2 plus 2 inverted ones) output signals
 * required for driving a stepper motor. Similarly the Arduino motor shields
 * 2 direction pins may be used.
 *
 * The sequence of control signals for 5 phase, 5 control wires is as follows:
 *
 * Step C0 C1 C2 C3 C4
 *    1  0  1  1  0  1
 *    2  0  1  0  0  1
 *    3  0  1  0  1  1
 *    4  0  1  0  1  0
 *    5  1  1  0  1  0
 *    6  1  0  0  1  0
 *    7  1  0  1  1  0
 *    8  1  0  1  0  0
 *    9  1  0  1  0  1
 *   10  0  0  1  0  1
 *
 * The sequence of control signals for 4 control wires is as follows:
 *
 * Step C0 C1 C2 C3
 *    1  1  0  1  0
 *    2  0  1  1  0
 *    3  0  1  0  1
 *    4  1  0  0  1
 *
 * The sequence of controls signals for 2 control wires is as follows
 * (columns C1 and C2 from above):
 *
 * Step C0 C1
 *    1  0  1
 *    2  1  1
 *    3  1  0
 *    4  0  0
 *
 */
//% weight=2 color=#005585 icon="\uf041"
//% advanced=true blockGap=8
namespace stepper {

    export class Stepper {
        motor_pin_1: DigitalInOutPin;
        motor_pin_2: DigitalInOutPin;
        motor_pin_3: DigitalInOutPin;
        motor_pin_4: DigitalInOutPin;
        motor_pin_5: DigitalInOutPin;
        step_number: number;
        direction: number;
        last_step_time: number;
        number_of_steps: number;
        pin_count: number;
        step_delay: number;


        constructor() {
            this.step_number = 0    
            this.direction = 0      
            this.last_step_time = 0 
            this.number_of_steps = undefined
            this.motor_pin_1 = undefined
            this.motor_pin_2 = undefined
            this.motor_pin_3 = undefined
            this.motor_pin_4 = undefined
            this.motor_pin_5 = undefined
        }

        /*
         * two-wire constructor.
         * Sets which wires should control the motor.
         */
        /*Stepper(number_of_steps: number, motor_pin_1: number, motor_pin_2: number) {
            this.step_number = 0;    // which step the motor is on
            this.direction = 0;      // motor direction
            this.last_step_time = 0; // time stamp in us of the last step taken
            this.number_of_steps = number_of_steps; // total number of steps for this motor

            // Arduino pins for the motor control connection:
            this.motor_pin_1 = motor_pin_1;
            this.motor_pin_2 = motor_pin_2;

            // setup the pins on the microcontroller:
            //motor_pin_1: DigitalInOutPin;
            //motor_pin_2: DigitalInOutPin;
            //pinMode(this.motor_pin_1, OUTPUT);
            //pinMode(this.motor_pin_2, OUTPUT);

            // When there are only 2 pins, set the others to 0:
            this.motor_pin_3 = 0;
            this.motor_pin_4 = 0;
            this.motor_pin_5 = 0;

            // pin_count is used by the stepMotor() method:
            this.pin_count = 2;
        }
*/

        /*
         *   constructor for four-pin version
         *   Sets which wires should control the motor.
         */
        Stepper(number_of_steps: number, motor_pin_1: number, motor_pin_2: number, motor_pin_3: number, motor_pin_4: number) {
            this.step_number = 0;    // which step the motor is on
            this.direction = 0;      // motor direction
            this.last_step_time = 0; // time stamp in us of the last step taken
            this.number_of_steps = number_of_steps; // total number of steps for this motor

            // Arduino pins for the motor control connection:
            this.motor_pin_1 = motor_pin_1;
            this.motor_pin_2 = motor_pin_2;
            this.motor_pin_3 = motor_pin_3;
            this.motor_pin_4 = motor_pin_4;

            // setup the pins on the microcontroller:
            /*
            motor_pin_1: DigitalInOutPin;
            motor_pin_2: DigitalInOutPin;
            motor_pin_3: DigitalInOutPin;
            motor_pin_4: DigitalInOutPin;
*/
            //pinMode(this.motor_pin_1, OUTPUT);
            //pinMode(this.motor_pin_2, OUTPUT);
            //pinMode(this.motor_pin_3, OUTPUT);
            //pinMode(this.motor_pin_4, OUTPUT);

            // When there are 4 pins, set the others to 0:
            this.motor_pin_5 = 0;

            // pin_count is used by the stepMotor() method:
            this.pin_count = 4;
        }

        /*
         *   constructor for five phase motor with five wires
         *   Sets which wires should control the motor.
         */
        /*
        Stepper(number_of_steps: number, motor_pin_1: number, motor_pin_2: number, motor_pin_3: number, motor_pin_4: number, motor_pin_5: number) {
            this.step_number = 0;    // which step the motor is on
            this.direction = 0;      // motor direction
            this.last_step_time = 0; // time stamp in us of the last step taken
            this.number_of_steps = number_of_steps; // total number of steps for this motor

            // Arduino pins for the motor control connection:
            this.motor_pin_1 = motor_pin_1;
            this.motor_pin_2 = motor_pin_2;
            this.motor_pin_3 = motor_pin_3;
            this.motor_pin_4 = motor_pin_4;
            this.motor_pin_5 = motor_pin_5;

            // setup the pins on the microcontroller:
            motor_pin_1: DigitalInOutPin;
            //motor_pin_2: DigitalInOutPin;
            //motor_pin_3: DigitalInOutPin;
            //motor_pin_4: DigitalInOutPin;
            //motor_pin_5: DigitalInOutPin;
            
            //pinMode(this.motor_pin_1, OUTPUT);
            //pinMode(this.motor_pin_2, OUTPUT);
            //pinMode(this.motor_pin_3, OUTPUT);
            //pinMode(this.motor_pin_4, OUTPUT);
            //pinMode(this.motor_pin_5, OUTPUT);

            // pin_count is used by the stepMotor() method:
            this.pin_count = 5;
        }
*/
        /*
         * Sets the speed in revs per minute
         */
        setSpeed(whatSpeed: number): void {
            this.step_delay = 60 * 1000 * 1000 / this.number_of_steps / whatSpeed;
        }
        /*
                 * Moves the motor forward or backwards.
                 */
        stepMotor(thisStep: number): void {
            if (this.pin_count == 2) {
                switch (thisStep) {
                    case 0:  // 01
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        break;
                    case 1:  // 11
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(true);
                        break;
                    case 2:  // 10
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        break;
                    case 3:  // 00
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(false);
                        break;
                }
            }
            if (this.pin_count == 4) {
                switch (thisStep) {
                    case 0:  // 1010
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(false);
                        break;
                    case 1:  // 0110
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(false);
                        break;
                    case 2:  //0101
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(true);
                        break;
                    case 3:  //1001
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(true);
                        break;
                }
            }

            if (this.pin_count == 5) {
                switch (thisStep) {
                    case 0:  // 01101
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(false);
                        this.motor_pin_5.digitalWrite(true);
                        break;
                    case 1:  // 01001
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(false);
                        this.motor_pin_5.digitalWrite(true);
                        break;
                    case 2:  // 01011
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(true);
                        this.motor_pin_5.digitalWrite(true);
                        break;
                    case 3:  // 01010
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(true);
                        this.motor_pin_5.digitalWrite(false);
                        break;
                    case 4:  // 11010
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(true);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(true);
                        this.motor_pin_5.digitalWrite(false);
                        break;
                    case 5:  // 10010
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(false);
                        this.motor_pin_4.digitalWrite(true);
                        this.motor_pin_5.digitalWrite(false);
                        break;
                    case 6:  // 10110
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(true);
                        this.motor_pin_5.digitalWrite(false);
                        break;
                    case 7:  // 10100
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(false);
                        this.motor_pin_5.digitalWrite(false);
                        break;
                    case 8:  // 10101
                        this.motor_pin_1.digitalWrite(true);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(false);
                        this.motor_pin_5.digitalWrite(true);
                        break;
                    case 9:  // 00101
                        this.motor_pin_1.digitalWrite(false);
                        this.motor_pin_2.digitalWrite(false);
                        this.motor_pin_3.digitalWrite(true);
                        this.motor_pin_4.digitalWrite(false);
                        this.motor_pin_5.digitalWrite(true);
                        break;
                }
            }
        }
        
        /*
         * Moves the motor steps_to_move steps.  If the number is negative,
         * the motor moves in the reverse direction.
         */
        step(steps_to_move: number): void {
            let steps_left = Math.abs(steps_to_move);  // how many steps to take

            // determine direction based on whether steps_to_mode is + or -:
            if (steps_to_move > 0) { this.direction = 1; }
            if (steps_to_move < 0) { this.direction = 0; }


            // decrement the number of steps, moving one step each time:
            while (steps_left > 0) {
                //let now = micros(); TODO
                let now = 0;
                // move only if the appropriate delay has passed:
                if (now - this.last_step_time >= this.step_delay) {
                    // get the timeStamp of when you stepped:
                    this.last_step_time = now;
                    // increment or decrement the step number,
                    // depending on direction:
                    if (this.direction == 1) {
                        this.step_number++;
                        if (this.step_number == this.number_of_steps) {
                            this.step_number = 0;
                        }
                    }
                    else {
                        if (this.step_number == 0) {
                            this.step_number = this.number_of_steps;
                        }
                        this.step_number--;
                    }
                    // decrement the steps left:
                    steps_left--;
                    // step the motor to step number 0, 1, ..., {3 or 10}
                    if (this.pin_count == 5)
                        this.stepMotor(this.step_number % 10);
                    else
                        this.stepMotor(this.step_number % 4);
                }
            }
        }

        /*
          version() returns the version of the library:
        */
        //int Stepper::version(void)
        version() {
            {
                return 1
            }
        }
    }
} 