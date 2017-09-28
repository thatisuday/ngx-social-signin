# ngx-social-signin
A social sign in module for Angular 4+

[![npm version](https://badge.fury.io/js/ngx-social-signin.svg)](https://badge.fury.io/js/ngx-social-signin)
[![npm downloads](https://img.shields.io/npm/dt/ngx-social-signin.svg)](https://badge.fury.io/js/ngx-social-signin)


### Install
```
npm i -S ngx-social-signin
```


### Import
```
import { NgxSocialSigninModule } from 'ngx-social-signin';
```


### Configure
```
@NgModule({
	imports: [
		NgxSocialSigninModule.forRoot({
	      facebook: {
	        appId: '10xxxxxxxxxxxxxx43',
	        redirectUrl: 'http://localhost:4200/'
	      },
	      instagram: {
	        appId: '17xxxxxxxxxxxxxxxxx250',
	        redirectUrl: 'http://localhost:4200'
	      },
	      google: {
	        appId: "xxxxxxxxx.apps.googleusercontent.com",
	        redirectUrl: "http://localhost:4200"
	      }
	    })
	]
});
```

> Note that `redirectUrl` really doesn't matter. You just need to provide any valid redirect url configured in your social network application. 


### Use
my.component.ts
```

import { Component, OnInit } from '@angular/core';
import { NgxSocialSigninService } from 'ngx-social-signin';

export class MyComponent implements OnInit {
	constructor(
	    private ngxSocialSigninService: NgxSocialSigninService
	  ) { }

	  ngOnInit() {}

	  socialSignIn(provider: string) {
	    this.ngxSocialSigninService.signin(provider).then((data) => {
	      console.log(data); // like: {provider: "facebook", code: "xxxxxxxx", redirectUrl: "xxxxx"}
	    }).catch((err) => {
	      console.log(err); // like: {provider: "facebook", errCode: "WINDOW_CLOSED", err: "Sign in window was closed by the user."}
	    });
	  }
}
```

my.component.html
```
<div class="social-buttons">
	<button (click)="socialSignIn('facebook')">
		Facebook
	</button>

	<button (click)="socialSignIn('instagram')">
		Instagram
	</button>

	<button (click)="socialSignIn('google')">
		Google Plus
	</button>
	</div>
</div>
```

> When user clicks on the button, a popup window will open showing user a default form provided by social network to sign in and confirm data sharing. If user denies to share info or closes the popup window, you will get an error in `catch` block with error code and reason. If everything goes well, you will get `code` token returned by social network in `then` block.

#### data: success
```
{
	provider: "provider-xx", 
	code: "code-xx"
}
```

#### data: error
```
{
	  provider: provider,
	  errCode: 'WINDOW_CLOSED',
	  err: 'Sign in window was closed by the user.'
}
```

```
{
	provider: provider,
	errCode: 'AUTH_CODE_MISSING',
	err: 'No authorization code was returned.'
}
```

```
{
	provider: provider,
	errCode: 'MISSING_PROVIDER',
	err: 'Either this provider is not valid or configuation is missing for this provider.'
}
```

---

### Getting user data
This service returns authorization `code` token from the social network provider. Using that token, you can retrieve user data by making API calls using app id and secret in you backend. There are many modules available to do it, but I will be releasing one soon. 

---

### Contribution
To add more providers, you can create an issue here with provider API call url for getting a `code` token. I will try my best to add that provider as quickly as possible.
