import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environments } from '../environments/environments';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';
import { ImagenesService } from './services/imagenes.services';
 
@NgModule(
    {
        declarations: [
            AppComponent,
        ],
        imports: [
            BrowserModule,
            AngularFireModule.initializeApp(environments.firebase),
            AngularFirestoreModule,
            ReactiveFormsModule,
            HttpClientModule,
        ],
        providers: [ImagenesService],
        bootstrap: [AppComponent]
    }
)
export class AppModule { }