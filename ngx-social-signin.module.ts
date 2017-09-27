import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxSocialSigninService } from './ngx-social-signin.service';
import { NgxSocialSigninConfig } from './ngx-social-signin.config';
import { CONFIG } from './ngx-social-signin.di';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class NgxSocialSigninModule {
  public static forRoot(config: NgxSocialSigninConfig) : ModuleWithProviders {
    return {
      ngModule: NgxSocialSigninModule,
      providers: [
        NgxSocialSigninService,
        {
          provide: CONFIG,
          useValue: config
        }
      ]
    }
  }
}
