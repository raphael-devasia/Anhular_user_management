
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideAnimations} from '@angular/platform-browser/animations';

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog'
import { customInterceptor } from './services/custom.interceptor';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';


export const appConfig: ApplicationConfig = {
  providers: [
    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([customInterceptor])),
    ReactiveFormsModule,
    FormsModule,
    provideAnimationsAsync(),
    MatDialog,
    provideAnimations(),
    provideToastr({
      timeOut: 3000, // Global timeout for all toast messages
      positionClass: 'toast-top-center', // Global position
      preventDuplicates: true, // Prevent duplicate messages
      maxOpened: 1, // Control the number of toasts shown simultaneously
      extendedTimeOut: 1000,
      progressAnimation: 'increasing',
      tapToDismiss: true,
      enableHtml: true,
      toastClass: 'ngx-toastr animate__heartBeat animate__heartBeat', // Add custom class for global width change
    }),
    provideStore(),
    provideEffects(),
  ],
};
