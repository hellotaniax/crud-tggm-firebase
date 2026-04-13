export class ImagenesModel {
    id?: string;
    nombreImagen: string;
    imgUrl: string;
    fechaNacimiento: string;
    tlfEmergencia: string;
    cedula: string;
 
    constructor(nombreImagen: string, imgUrl: string, fechaNacimiento: string, tlfEmergencia: string, cedula: string) {
        this.nombreImagen = nombreImagen;
        this.imgUrl = imgUrl;
        this.fechaNacimiento = fechaNacimiento;
        this.tlfEmergencia = tlfEmergencia;
        this.cedula = cedula;
    }
}
//Este lo que hace es un constructor para poder crear los registros en la db no relacional, da un id, 
//nombre de quien es, la url e la carpeta, etc. Esos soon los atributos que va a tener la base de datos relacional.


