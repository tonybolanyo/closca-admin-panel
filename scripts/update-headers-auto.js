/**
 * Script para actualizar automáticamente componentes con headers incompatibles
 * Añade import de convertToHttpHeaderMap y envuelve los headers
 */

const fs = require('fs');
const path = require('path');

// Lista de archivos a actualizar
const filesToUpdate = [
  'src/app/modules/main/modules/panel/modules/bottle-types/components/bottle-types-list/bottle-types-list.component.ts',
  'src/app/modules/main/modules/panel/modules/bottles/components/bottles-list/bottles-list.component.ts',
  'src/app/modules/main/modules/panel/modules/brands/components/brands-list/brands-list.component.ts',
  'src/app/modules/main/modules/panel/modules/challenges/components/challenge-detail/challenge-detail.component.ts',
  'src/app/modules/main/modules/panel/modules/challenges/components/challenge-subscriptions-users-list/challenge-subscriptions-users-list.component.ts',
  'src/app/modules/main/modules/panel/modules/challenges/components/challenges-list/challenges-list.component.ts',
  'src/app/modules/main/modules/panel/modules/corporates/components/corporate-detail/corporate-detail.component.ts',
  'src/app/modules/main/modules/panel/modules/corporates/components/corporates-list/corporates-list.component.ts',
  'src/app/modules/main/modules/panel/modules/levels/components/levels-list/levels-list.component.ts',
  'src/app/modules/main/modules/panel/modules/products/components/products-list/products-list.component.ts',
  'src/app/modules/main/modules/panel/modules/public-or-private-fountains/components/public-or-private-fountains-list/public-or-private-fountains-list.component.ts',
  'src/app/modules/main/modules/panel/modules/reports/components/reports-list/reports-list.component.ts',
  'src/app/modules/main/modules/panel/modules/sponsored-fountains/components/sponsored-fountain-create/sponsored-fountain-create.component.ts',
  'src/app/modules/main/modules/panel/modules/sponsored-fountains/components/sponsored-fountains-list/sponsored-fountains-list.component.ts',
  'src/app/modules/main/modules/panel/modules/user-rate/components/user-rate-list/user-rate-list.component.ts',
  'src/app/modules/main/modules/panel/modules/users/components/user-detail/user-detail.component.ts',
  'src/app/modules/main/modules/panel/modules/wizard/components/wizard-list/wizard-list.component.ts'
];

const importStatement = "import { convertToHttpHeaderMap } from 'src/app/shared/utils/http-header-utils';";

function addImportIfMissing(content) {
  if (content.includes('convertToHttpHeaderMap')) {
    return content; // Ya tiene el import
  }

  // Buscar la última línea de import
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
    return lines.join('\n');
  }

  return content;
}

function wrapHeadersObjects(content) {
  // Patrón para encontrar: const headers = { ... };
  // Envuelve con convertToHttpHeaderMap({ ... })

  const headerPattern = /(const headers = )(\{[^}]*(?:limit|skip|filter)[^}]*\})/gm;

  return content.replace(headerPattern, (match, prefix, objectContent) => {
    // Verificar si ya está envuelto
    if (match.includes('convertToHttpHeaderMap')) {
      return match;
    }
    return `${prefix}convertToHttpHeaderMap(${objectContent})`;
  });
}

function processFile(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(absolutePath, 'utf8');
    const originalContent = content;

    // Añadir import
    content = addImportIfMissing(content);

    // Envolver headers
    content = wrapHeadersObjects(content);

    if (content !== originalContent) {
      fs.writeFileSync(absolutePath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Sin cambios: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Procesar todos los archivos
console.log('Iniciando actualización de headers...\n');

let updated = 0;
let total = filesToUpdate.length;

filesToUpdate.forEach(file => {
  if (processFile(file)) {
    updated++;
  }
});

console.log(`\n✨ Proceso completado: ${updated}/${total} archivos actualizados`);
