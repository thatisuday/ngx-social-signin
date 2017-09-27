import { InjectionToken } from '@angular/core';

export interface NgxSocialSigninConfig{
	facebook: {
		appId: string;
		redirectUrl: string;
	},
	instagram?: {
		appId: string;
		redirectUrl: string;
	},
	google?: {
		appId: string;
		redirectUrl: string;
	}
}