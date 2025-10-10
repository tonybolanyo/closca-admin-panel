#!/bin/bash

# Script alternativo: Clonar la librería como submodulo (si tienes acceso al repo fuente)

echo "Configurando @tyris/angular-foundation como submodulo..."

# Si la librería está en un repositorio Git accesible
git submodule add git@bitbucket.org:damonfer/tyris-angular-foundation.git libs/angular-foundation

echo "Después de clonar, puedes referenciarla en package.json como:"
echo '  "@tyris/angular-foundation": "file:./libs/angular-foundation"'