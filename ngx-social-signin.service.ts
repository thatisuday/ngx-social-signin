import { Observable } from 'rxjs/Observable';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { WINDOW } from "ngx-window-token";
import parseUrl from 'url-parse';
import _ from 'lodash';

import { NgxSocialSigninConfig } from './ngx-social-signin.config';
import { CONFIG } from './ngx-social-signin.di';

@Injectable()
export class NgxSocialSigninService {
  intvl: any = null;
  popup: any = null;

  constructor(
    @Inject(CONFIG) private config: NgxSocialSigninConfig,
    @Inject(DOCUMENT) private _document: any,
    @Inject(WINDOW) private _window: any
  ) {}

  // open popup window for social sign in
  openWindow(url: string, provider: string, resolve:any, reject: any) {
    let w = 900;
    let h = 700;
    var y = this._window.top.outerHeight / 2 + this._window.top.screenY - ( h / 2)
    var x = this._window.top.outerWidth / 2 + this._window.top.screenX - ( w / 2)
    
    // open popup window
    this.popup =  this._window.open(url, provider, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+y+', left='+x);
    
    // give popup window focus
    this.popup.focus();

    // start polling for redirection success
    this.poll(provider, resolve, reject);
  }

  // polling function for redirection success
  poll(provider: string, resolve:any, reject: any) {
    this.intvl = setInterval(() => {
      // if popup was already closed
      if(!this.popup || this.popup.closed || this.popup.closed === undefined) {
        this.closePopup();
        return reject({
          provider: provider,
          errCode: 'WINDOW_CLOSED',
          err: 'Sign in window was closed by the user.'
        });
      }

      // format redirect url and get full path
      let redirectUrlObj = parseUrl(this.config[provider].redirectUrl);
      let redirectUrlPath = redirectUrlObj.origin + redirectUrlObj.pathname;

      // if redirection was completed, resolve and close popup
      let redirectionCompleteResult = this.redirectionCompleted(redirectUrlPath);
      if(redirectionCompleteResult.done){
        this.closePopup();

        // auth code is missing
        if(!redirectionCompleteResult.code){
          return reject({
            provider: provider,
            errCode: 'AUTH_CODE_MISSING',
            err: 'No authorization code was returned.'
          });
        }

        // resolve with authorization code
        return resolve({provider: provider, code: redirectionCompleteResult.code});
      }
    }, 1000);
  }

  // check if redirection is completed 
  // and return auth code return by social network
  redirectionCompleted(redirectUriPath): {done: boolean, code?: any} {
    try {
      let popupWindowPath = this.popup.location.origin + this.popup.location.pathname;
      
      // match with removing trailing slashes
      if(popupWindowPath.replace(/\/+$/, '') == redirectUriPath.replace(/\/+$/, '')){
        return {
          done: true, 
          code: _.get(parseUrl(this.popup.location.href, true), 'query.code')
        };
      }
      else{
        return {done: false};
      }
    }
    catch(error) {
      return {done: false}; // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
    }
  }

  // close popup window and reset
  closePopup() {
    clearInterval(this.intvl);
    this.popup.close();
    this.intvl = null;
    this.popup = null;
  }

  /*********************************************/

  // perform sign in
  signin(provider: string): Promise<{provider: any, code: any}> {
    return new Promise((resolve, reject) => {
      if(_.get(this.config, provider)){
        if(provider == 'facebook') {
          this.openWindow(`https://www.facebook.com/v2.9/dialog/oauth?client_id=${this.config.facebook.appId}&redirect_uri=${this.config.facebook.redirectUrl}`, 'facebook', resolve, reject);
        }
        else if(provider == 'instagram') {
          this.openWindow(`https://api.instagram.com/oauth/authorize/?client_id=${this.config.instagram.appId}&redirect_uri=${this.config.instagram.redirectUrl}&response_type=code`, 'instagram', resolve, reject);
        }
        else if(provider == 'google'){
          this.openWindow(`https://accounts.google.com/o/oauth2/auth?redirect_uri=${this.config.google.redirectUrl}&response_type=code&client_id=${this.config.google.appId}&scope=https://www.googleapis.com/auth/userinfo.email`, 'google', resolve, reject);
        }
      }
      else{
        reject({
          provider: provider,
          errCode: 'MISSING_PROVIDER',
          err: 'Either this provider is not valid or configuation is missing for this provider.'
        });
      }
    });
  }

}
