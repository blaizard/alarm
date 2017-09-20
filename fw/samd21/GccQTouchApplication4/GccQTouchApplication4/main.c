/* This source file is part of the ATMEL QTouch Library 5.0.7 */

/*****************************************************************************
 *
 * \file
 *
 * \brief  This file contains the SAMD QTouch library sample user application.
 *
 *
 * - Userguide:          QTouch Library Peripheral Touch Controller User Guide.
 * - Support email:      www.atmel.com/design-support/
 *
 *
 * Copyright (c) 2013-2015 Atmel Corporation. All rights reserved.
 *
 * \asf_license_start
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. The name of Atmel may not be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * 4. This software may only be redistributed and used in connection with an
 *    Atmel microcontroller product.
 *
 * THIS SOFTWARE IS PROVIDED BY ATMEL "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT ARE
 * EXPRESSLY AND SPECIFICALLY DISCLAIMED. IN NO EVENT SHALL ATMEL BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * \asf_license_stop
 *
 ******************************************************************************/

/**
 * Include header files for all drivers that have been imported from
 * Atmel Software Framework (ASF).
 */
#include <asf.h>

/**
 * Device Revision definition
 */
#define DEVICE_REVISION_MASK (0xFu << 8)
#define DEVICE_REVISION_MASK_POS (8u)
#define DEV_REV_A (0x0)
#define DEV_REV_B (0x1)
#define DEV_REV_C (0x2)

struct rtc_module rtc_instance;
uint32_t device_rev = 0;

/*
 * switch_main_clock 
 */
void switch_main_clock(void);

/*! \brief Initialize timer
 *
 */
void timer_init( void );

/*! \brief RTC timer overflow callback
 *
 */
void rtc_overflow_callback(void);

/*! \brief Configure the RTC timer callback
 *
 */
void configure_rtc_callbacks(void);

/*! \brief Configure the RTC timer count after which interrupts comes
 *
 */
void configure_rtc_count(void);

/*! \brief Set timer period.Called from Qdebug when application
 *     has to change the touch time measurement
 */
void set_timer_period(void);

/*! \brief RTC timer overflow callback
 *
 */
void rtc_overflow_callback(void)
{
	/* Do something on RTC overflow here */
	touch_time.time_to_measure_touch = 1;
	touch_time.current_time_ms = touch_time.current_time_ms +
			touch_time.measurement_period_ms;
}

/*! \brief Configure the RTC timer callback
 *
 */
void configure_rtc_callbacks(void)
{
	/* register callback */
	rtc_count_register_callback(&rtc_instance,
			rtc_overflow_callback, RTC_COUNT_CALLBACK_OVERFLOW);
	/* Enable callback */
	rtc_count_enable_callback(&rtc_instance, RTC_COUNT_CALLBACK_OVERFLOW);
}

/*! \brief Configure the RTC timer count after which interrupts comes
 *
 */
void configure_rtc_count(void)
{
	struct rtc_count_config config_rtc_count;
	rtc_count_get_config_defaults(&config_rtc_count);
    #if ((SAMC20) || (SAMC21))
	config_rtc_count.prescaler           = RTC_MODE0_CTRLA_PRESCALER_DIV32;
    #else
	config_rtc_count.prescaler           = RTC_MODE0_CTRL_PRESCALER_DIV2;
    #endif
	config_rtc_count.mode                = RTC_COUNT_MODE_16BIT;
	#ifdef FEATURE_RTC_CONTINUOUSLY_UPDATED
	config_rtc_count.continuously_update = true;
	#endif
	/* initialize rtc */
	rtc_count_init(&rtc_instance, RTC, &config_rtc_count);

	/* enable rtc */
	rtc_count_enable(&rtc_instance);
}

/*! \brief Initialize timer
 *
 */
void timer_init(void)
{
	/* Configure and enable RTC */
	configure_rtc_count();

	/* Configure and enable callback */
	configure_rtc_callbacks();

	/* Set Timer Period */

	rtc_count_set_period(&rtc_instance, DEF_TOUCH_MEASUREMENT_PERIOD_MS);
}

/*! \brief Set timer period.Called from Qdebug when application
 *     has to change the touch time measurement
 */
void set_timer_period(void )
{
	rtc_count_set_period(&rtc_instance, touch_time.measurement_period_ms);
}

#if ((SAMC20) || (SAMC21))
void switch_main_clock(void)
{
	/* Update OSC48M Pre-scaler */
	struct system_clock_source_osc48m_config osc48m_config_ptr;
	
	system_clock_source_osc48m_get_config_defaults(&osc48m_config_ptr);
	
	osc48m_config_ptr.div = SYSTEM_OSC48M_DIV_1;
	osc48m_config_ptr.on_demand = false;
	osc48m_config_ptr.run_in_standby = true;
	system_clock_source_osc48m_set_config(&osc48m_config_ptr);
	
	struct system_gclk_gen_config gclk_conf;
	system_gclk_gen_get_config_defaults(&gclk_conf);
	gclk_conf.source_clock    = SYSTEM_CLOCK_SOURCE_OSC48M;
	gclk_conf.division_factor = 1;  //Pre-scaler
	gclk_conf.run_in_standby  = false;
	gclk_conf.output_enable   = false;
	system_gclk_gen_set_config(GCLK_GENERATOR_0, &gclk_conf);
	system_gclk_gen_enable(GCLK_GENERATOR_0);
	
	/* GCLK 1 - Main clock pre-scaled for PTC */
	system_gclk_gen_get_config_defaults(&gclk_conf);
	gclk_conf.source_clock    = SYSTEM_CLOCK_SOURCE_OSC48M;
	gclk_conf.division_factor = 12;  //Pre-scaler
	gclk_conf.run_in_standby  = true;
	gclk_conf.output_enable   = false;
	system_gclk_gen_set_config(GCLK_GENERATOR_1, &gclk_conf);
	system_gclk_gen_enable(GCLK_GENERATOR_1);
	
	/* Disable DPLL and corresponding GCLK */
	system_clock_source_disable(SYSTEM_CLOCK_SOURCE_DPLL);
	system_gclk_gen_disable(GCLK_GENERATOR_2);
	
	/* Set on demand bit of OSC48M to one */
	osc48m_config_ptr.on_demand = true;
	system_clock_source_osc48m_set_config(&osc48m_config_ptr);
}
#endif

void configure_tc(void);

struct tc_module tc_instance;

#define PWM_TC      TC3
#define PWM_PIN     PIN_PA18
#define PWM_PIN_MUX MUX_PA18E_TC3_WO0

void configure_tc(void)
{
	struct tc_config config_tc;
	tc_get_config_defaults(&config_tc);
	config_tc.counter_size = TC_COUNTER_SIZE_16BIT;
	config_tc.wave_generation = TC_WAVE_GENERATION_NORMAL_PWM;
	config_tc.pwm_channel[0].enabled = true;
	config_tc.pwm_channel[0].pin_out = PWM_PIN;
	config_tc.pwm_channel[0].pin_mux = PWM_PIN_MUX;
	tc_init(&tc_instance, PWM_TC, &config_tc);
	tc_set_compare_value(&tc_instance, TC_COMPARE_CAPTURE_CHANNEL_0, 0);
	tc_set_top_value(&tc_instance, 0xffff);
	tc_enable(&tc_instance);
}

void setDuty(const uint16_t targetDuty);
void setDuty(const uint16_t targetDuty)
{
	const uint16_t incDuty = 100;
	static uint16_t currentDuty = 0;

	if (currentDuty != targetDuty)
	{
		// Update the current duty
		currentDuty = (currentDuty > targetDuty) ? (currentDuty - incDuty) : (currentDuty + incDuty);
		currentDuty = (abs(currentDuty - targetDuty) < incDuty) ? targetDuty : currentDuty;

		// Convert duty to the next TC value
		// TC value = x^4
		uint32_t tcValue = ((uint32_t) currentDuty);
		tcValue = (((((tcValue * tcValue) >> 16) * tcValue) >> 16) * tcValue) >> 16;
		tcValue = (uint16_t) (tcValue);

		tc_set_compare_value(&tc_instance, TC_COMPARE_CAPTURE_CHANNEL_0, tcValue);
	}
}

#define GET_SELFCAP_SIGNAL(SENSOR_NUMBER) p_selfcap_measure_data->p_channel_signals[SENSOR_NUMBER]

/*! \brief Main function
 *
 */
int main(void)
{
	/**
	 * Initialize and configure system and generic clocks.
	 * Use conf_clocks.h to configure system and generic clocks.
	 * This example project uses Internal 8MHz oscillator.
	 * The PTC module clock is provided using GCLK generator 1.
	 */
	system_init();

    #if ((SAMC20) || (SAMC21))
	device_rev = ((DSU->DID.reg & DEVICE_REVISION_MASK) >> DEVICE_REVISION_MASK_POS);
	
	if(device_rev >= DEV_REV_C)
	{ 
	/* configure the cpu clock to OSC48MHz, and enable required GCLKs*/
		switch_main_clock();
	}
	#endif
	/**
	 * Initialize delay service.
	 */
	delay_init();

	/**
	 * Initialize timer.
	 * This example projects uses RTC timer for providing timing
	 * info to QTouch library.
	 */
	timer_init();

	/**
	 * Initialize QTouch library and configure touch sensors.
	 */
	touch_sensors_init();

	/* Configure System Sleep mode to standby MODE. */
      
   //	  system_set_sleepmode(SYSTEM_SLEEPMODE_STANDBY);
	  
    configure_tc();

	setDuty(0xffff);

	//DEF_TOUCH_MEASUREMENT_PERIOD_MS

	const size_t CALIBRATION_NB_SAMPLES = 256;
	const size_t offset = 20;
	uint16_t thresholds[DEF_SELFCAP_NUM_CHANNELS] = {0};
	uint32_t avgThresholds[DEF_SELFCAP_NUM_CHANNELS] = {0};
	size_t calibrationCounter = 0;
	uint16_t targetDuty = 0;

	while (1)
	{
		/**
		 * Goto STANDBY sleep mode, unless woken by timer or PTC
		 *interrupt.
		 */
		system_sleep();

		/**
		 * Start touch sensor measurement, if
		 *touch_time.time_to_measure_touch flag is set by timer.
		 */
		touch_sensors_measure();

		/**
		 * Update touch status once measurement complete flag is set.
		 */

		if ((p_selfcap_measure_data->measurement_done_touch == 1u))
		{
			const uint16_t signals[DEF_SELFCAP_NUM_CHANNELS] = {
				GET_SELFCAP_SIGNAL(0),
				GET_SELFCAP_SIGNAL(1),
				GET_SELFCAP_SIGNAL(2),
				GET_SELFCAP_SIGNAL(3)
			};

			// Update the calibration
			for (size_t i=0; i<DEF_SELFCAP_NUM_CHANNELS; ++i)
			{
				avgThresholds[i] += signals[i];
			}

			// Re-trigger a calibration
			if (calibrationCounter++ >= CALIBRATION_NB_SAMPLES)
			{
				for (size_t i=0; i<DEF_SELFCAP_NUM_CHANNELS; ++i)
				{
					thresholds[i] = avgThresholds[i] / CALIBRATION_NB_SAMPLES + offset;
					avgThresholds[i] = 0;
				}
				calibrationCounter = 0;
			}

			// Calculate the biggest difference'
			uint8_t position = -1;
			uint16_t positionDiff = 0;
			for (size_t i=0; i<DEF_SELFCAP_NUM_CHANNELS; ++i)
			{
				const uint16_t diff = (signals[i] < thresholds[i]) ? 0 : signals[i] - thresholds[i];
				if (diff)
				{
					if (positionDiff < diff)
					{
						position = i;
						positionDiff = diff;
					}
				}
			}

			switch (position)
			{
			case 0:
				targetDuty = 0xffff;
				break;
			case 1:
				targetDuty = 0xffff/3*2;
				break;
			case 2:
				targetDuty = 0xffff/3;
				break;
			case 3:
				targetDuty = 0;
				break;
			}

			setDuty(targetDuty);
		}
		   
		

		/**
		 * Self Cap method
		 * if ((p_selfcap_measure_data->measurement_done_touch == 1u))
		 * for self cap
		 * Touch sensor ON/OFF status or rotor/slider position.
		 *
		 * Self Cap method
		 * uint8_t sensor_state =
		 * GET_SELFCAP_SENSOR_STATE(SENSOR_NUMBER);
		 * uint8_t rotor_slider_position =
		 * GET_SELFCAP_ROTOR_SLIDER_POSITION(SENSOR_NUMBER);
		 *
		 */

		/**
		 * Mutual Cap method
		 * if ((p_mutlcap_measure_data->measurement_done_touch == 1u))
		 * for mutual cap
		 * Touch sensor ON/OFF status or rotor/slider position.
		 *
		 *
		 * uint8_t sensor_state =
		 * GET_MUTLCAP_SENSOR_STATE(SENSOR_NUMBER);
		 * uint8_t rotor_slider_position =
		 * GET_MUTLCAP_ROTOR_SLIDER_POSITION(SENSOR_NUMBER);
		 */
	}
}
