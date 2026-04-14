import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { environments } from '../../environments/environments';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { ImagenesModel } from '../models/imagenes.model';
import { FileItems } from '../models/file.items';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
 
 
 
@Injectable({
    providedIn: 'root'
})
export class ImagenesService {
    private CARPETA_IMAGENES = 'img';
    private imagenesCollection: AngularFirestoreCollection<ImagenesModel>
    progress: any;
 
 
 
    constructor(private db: AngularFirestore) {
        this.imagenesCollection = db.collection<ImagenesModel>('tbl-face');
    }
 
 
 
    getImagenes(): Observable<ImagenesModel[]> {
        return this.imagenesCollection.snapshotChanges().pipe(
            map((actions: any[]) => actions.map((a: any) => {
                const data = a.payload.doc.data() as ImagenesModel;
                const id = a.payload.doc.id;
                return { id, ...data }
            })
            )
        )
    }
 
 
 
    getImagen(id: any) {
        return this.imagenesCollection.doc(id).valueChanges();
    }
 
 
 
    cargarImagenesFirebase(imagen: FileItems, imagesData: ImagenesModel) {
        const app = getApps().length > 0 ? getApp() : initializeApp(environments.firebase);
        const storage = getStorage(app);
        let item = imagen;
        let imagenTrim = imagesData.nombreImagen;
        const storageRef = ref(storage, `${this.CARPETA_IMAGENES}/${imagenTrim.replace(/ /g, '')}`);
        const uploadTask = uploadBytesResumable(storageRef, item.archivo);
        uploadTask.on('state_changed', (snapshot: any) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(this.progress);
        }, (err: any) => {
            console.log('Error al subir archivo', err);
            Swal.fire('Error en Storage', 'No se pudo subir la imagen. ' + err.message, 'error');
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
                item.url = downloadURL;
                this.guardarImagen({
                    nombreImagen: imagesData.nombreImagen,
                    imgUrl: item.url || '',
                    fechaNacimiento: imagesData.fechaNacimiento,
                    tlfEmergencia: imagesData.tlfEmergencia,
                    cedula: imagesData.cedula
                });
            });
        }
        )
    }
 
 
 
    async guardarImagen(imagen: {
        nombreImagen: string,
        imgUrl: string, fechaNacimiento: string,
        tlfEmergencia: string,
        cedula: string
    }): Promise<any> {
        try {
            // Se usa this.imagenesCollection que fue inicializada en el constructor
            // para evitar el error NG0203 de inyección de dependencias.
            return await this.imagenesCollection.add(imagen as any);
        } catch (err: any) {
            console.log(err);
            Swal.fire('Error en Firestore', 'No se pudo guardar en la base de datos. ' + err.message, 'error');
        }
    }
 
 
 
    public eliminarImagen(id: string, imagenNombre: string) {
        const app = getApps().length > 0 ? getApp() : initializeApp(environments.firebase);
        const storage = getStorage(app);
        const deleteImg = ref(storage, `${this.CARPETA_IMAGENES}/${imagenNombre.replace(/ /g, '')}`);
        deleteObject(deleteImg).then(() => {
            Swal.fire('EXITO', 'El registro se elimino correctamente', 'success');
        }).catch((err: any) => {
            console.error(err);
        });
        return this.imagenesCollection.doc(id).delete();
    }
 
 
 
    // Agregar el actualizar:
    async actualizarImagen(id: string, datosActualizados: { nombreImagen: string, fechaNacimiento: string, tlfEmergencia: string, cedula: string }): Promise<void> {
        try {
            await this.imagenesCollection.doc(id).update(datosActualizados);
        } catch (error) {
            console.error('Error al actualizar la imagen:', error);
            throw error; // Lanza el error para manejarlo en el componente
        }
    }
}