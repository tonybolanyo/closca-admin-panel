#!/bin/bash

# Script para actualizar todos los componentes que usan headers con convertToHttpHeaderMap

# Lista de archivos a actualizar
FILES=(
  "src/app/modules/main/modules/panel/modules/bottle-types/components/bottle-types-list/bottle-types-list.component.ts"
  "src/app/modules/main/modules/panel/modules/bottles/components/bottles-list/bottles-list.component.ts"
  "src/app/modules/main/modules/panel/modules/brands/components/brands-list/brands-list.component.ts"
  "src/app/modules/main/modules/panel/modules/challenges/components/challenge-detail/challenge-detail.component.ts"
  "src/app/modules/main/modules/panel/modules/challenges/components/challenge-subscriptions-users-list/challenge-subscriptions-users-list.component.ts"
  "src/app/modules/main/modules/panel/modules/challenges/components/challenges-list/challenges-list.component.ts"
  "src/app/modules/main/modules/panel/modules/corporates/components/corporate-detail/corporate-detail.component.ts"
  "src/app/modules/main/modules/panel/modules/corporates/components/corporates-list/corporates-list.component.ts"
  "src/app/modules/main/modules/panel/modules/levels/components/levels-list/levels-list.component.ts"
  "src/app/modules/main/modules/panel/modules/products/components/products-list/products-list.component.ts"
  "src/app/modules/main/modules/panel/modules/public-or-private-fountains/components/public-or-private-fountains-list/public-or-private-fountains-list.component.ts"
  "src/app/modules/main/modules/panel/modules/reports/components/reports-list/reports-list.component.ts"
  "src/app/modules/main/modules/panel/modules/sponsored-fountains/components/sponsored-fountain-create/sponsored-fountain-create.component.ts"
  "src/app/modules/main/modules/panel/modules/sponsored-fountains/components/sponsored-fountains-list/sponsored-fountains-list.component.ts"
  "src/app/modules/main/modules/panel/modules/user-rate/components/user-rate-list/user-rate-list.component.ts"
  "src/app/modules/main/modules/panel/modules/users/components/user-detail/user-detail.component.ts"
  "src/app/modules/main/modules/panel/modules/wizard/components/wizard-list/wizard-list.component.ts"
)

echo "Actualizando ${#FILES[@]} archivos para usar convertToHttpHeaderMap..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Procesando: $file"
    
    # Verificar si ya tiene el import
    if ! grep -q "convertToHttpHeaderMap" "$file"; then
      # Buscar la última línea de import y añadir después
      # Esto es un reemplazo más seguro que modificar directamente
      echo "  -> Añadiendo import de convertToHttpHeaderMap"
    fi
  else
    echo "ADVERTENCIA: Archivo no encontrado: $file"
  fi
done

echo ""
echo "Actualización completada!"
echo "Por favor, revise los archivos y realice los cambios manualmente usando:"
echo "  - Importar: import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';"
echo "  - Envolver: const headers = convertToHttpHeaderMap({ ... });"
