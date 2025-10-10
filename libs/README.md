# Gestión de Librerías @tyris

Este proyecto usa librerías privadas del scope `@tyris` alojadas en Verdaccio. Para que los
desarrolladores puedan trabajar sin acceso a Verdaccio, se proporcionan las siguientes opciones:

## Desarrollo con código fuente

Si tienes acceso al código fuente de las librerías @tyris:

1. Clonar la librería en `libs/angular-foundation/`
2. Actualizar `package.json`:
   ```json
   {
     "dependencies": {
       "@tyris/angular-foundation": "file:./libs/angular-foundation"
     }
   }
   ```

## Configuración actual

El proyecto está configurado para usar:
- `@tyris/angular-foundation` desde una ruta local

## Scripts disponibles

- `./scripts/download-tyris-libs.sh` - Descarga librerías desde Verdaccio
- `./scripts/setup-git-submodule.sh` - Guía para configurar como submodulo Git

## Actualización de librerías

Para actualizar las librerías @tyris:

1. Con acceso a Verdaccio: Re-ejecutar `download-tyris-libs.sh`
2. Sin acceso: Solicitar al administrador que ejecute el script y haga commit de los nuevos archivos