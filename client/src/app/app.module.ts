import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TUI_SANITIZER } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaigaProxyModule } from "./taiga-proxy/taiga-proxy.module";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TuiRootModule,
    // TuiDialogModule,
    // TuiAlertModule,
    TaigaProxyModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
