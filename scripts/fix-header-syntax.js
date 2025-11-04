/**
 * Script para corregir los errores de sintaxis generados por el script anterior
 * Específicamente, arregla casos donde falta el paréntesis de cierre en convertToHttpHeaderMap
 */

const fs = require('fs');
const path = require('path');

// Archivos que reportaron errores TS1005
const filesToFix = [
  'src/app/modules/main/modules/panel/modules/corporates/components/corporate-detail/corporate-detail.component.ts',
  'src/app/modules/main/modules/panel/modules/sponsored-fountains/components/sponsored-fountain-create/sponsored-fountain-create.component.ts',
  'src/app/modules/main/modules/panel/modules/users/components/user-detail/user-detail.component.ts'
];

function fixFile(filePath) {
  const absolutePath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(absolutePath, 'utf8');
    const originalContent = content;

    // Patrón para encontrar: convertToHttpHeaderMap({ ... }; (cierra con } en lugar de })
    // Y reemplazarlo con: convertToHttpHeaderMap({ ... });
    content = content.replace(/(convertToHttpHeaderMap\(\{[^}]*\})/g, (match) => {
      // Si no termina con ), añadir )
      if (!match.endsWith(')')) {
        return match + ')';
      }
      return match;
    });

    // Patrón más complejo: buscar bloques completos
    const lines = content.split('\n');
    const fixed = [];
    let inHeaderBlock = false;
    let headerStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('const headers = convertToHttpHeaderMap({')) {
        inHeaderBlock = true;
        headerStart = i;
        fixed.push(line);
        continue;
      }

      if (inHeaderBlock) {
        // Buscar el cierre
        if (line.trim() === '};') {
          // Reemplazar }; con });
          fixed.push(line.replace('};', '});'));
          inHeaderBlock = false;
        } else {
          fixed.push(line);
        }
      } else {
        fixed.push(line);
      }
    }

    content = fixed.join('\n');

    if (content !== originalContent) {
      fs.writeFileSync(absolutePath, content, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
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
console.log('Corrigiendo errores de sintaxis...\n');

let fixed = 0;
let total = filesToFix.length;

filesToFix.forEach(file => {
  if (fixFile(file)) {
    fixed++;
  }
});

console.log(`\n✨ Proceso completado: ${fixed}/${total} archivos corregidos`);
