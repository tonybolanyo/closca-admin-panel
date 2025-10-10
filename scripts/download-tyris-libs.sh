#!/bin/bash

# Script para descargar y almacenar localmente las librerías @tyris

LIBS_DIR="./libs"
VERDACCIO_REGISTRY="https://verdaccio.tyris-software.com"

echo "Descargando librerías @tyris desde Verdaccio..."

# Crear directorio libs si no existe
mkdir -p $LIBS_DIR

# Función para descargar y empaquetar una librería
download_lib() {
    local lib_name=$1
    local lib_version=$2
    
    echo "Descargando $lib_name@$lib_version..."
    
    # Cambiar temporalmente el registry para el scope @tyris
    npm config set @tyris:registry $VERDACCIO_REGISTRY
    
    # Descargar la librería en un directorio temporal
    temp_dir=$(mktemp -d)
    cd $temp_dir
    
    # Instalar la librería
    npm pack $lib_name@$lib_version --registry $VERDACCIO_REGISTRY
    
    # Mover el tarball a la carpeta libs
    mv *.tgz "$OLDPWD/$LIBS_DIR/"
    
    cd "$OLDPWD"
    rm -rf $temp_dir
    
    echo "$lib_name@$lib_version descargado correctamente"
}

# Descargar @tyris/angular-foundation
# Obtener la versión actual del package.json si existe
if [ -f "package.json" ]; then
    current_version=$(node -p "require('./package.json').dependencies['@tyris/angular-foundation']" 2>/dev/null | sed 's/file://' | sed 's/^.*@//' || echo "latest")
    if [[ $current_version == *"file:"* ]] || [[ $current_version == "undefined" ]]; then
        current_version="latest"
    fi
else
    current_version="latest"
fi

download_lib "@tyris/angular-foundation" $current_version

echo "Todas las librerías @tyris han sido descargadas en $LIBS_DIR"
echo ""
echo "Para usar las librerías locales, actualiza tu package.json:"
echo '  "@tyris/angular-foundation": "file:./libs/tyris-angular-foundation-<version>.tgz"'