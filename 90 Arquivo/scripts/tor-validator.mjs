/**
 * JARVIS OS — TOR DEVELOPER (SENTINEL)
 * Versão: 1.0
 * 
 * Este script valida a integridade do vault, verificando se as notas 
 * seguem o contrato de propriedades (§2) e a taxonomia de pastas.
 */

import fs from 'fs';
import path from 'path';

const VAULT_ROOT = process.cwd();
const IGNORE_FOLDERS = ['.git', '.obsidian', 'Templates', '90 Arquivo', 'raw'];

function validateNote(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
    
    if (!frontmatterMatch) {
        return { valid: false, error: "Missing frontmatter" };
    }
    
    const fm = frontmatterMatch[1];
    const issues = [];
    
    if (!fm.includes('area:')) issues.push("Missing 'area'");
    if (!fm.includes('tipo:')) issues.push("Missing 'tipo'");
    if (fm.includes('contexto:')) issues.push("Legacy property 'contexto' found");
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

function scanVault(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!IGNORE_FOLDERS.includes(file)) {
                scanVault(fullPath);
            }
        } else if (file.endsWith('.md')) {
            const result = validateNote(fullPath);
            if (!result.valid) {
                console.log(`⚠️ TOR: Issue in ${path.relative(VAULT_ROOT, fullPath)}: ${result.issues.join(', ')}`);
            }
        }
    });
}

console.log("🛡️ TOR: Iniciando varredura de integridade...");
scanVault(VAULT_ROOT);
console.log("✅ TOR: Varredura concluída.");
