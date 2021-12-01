const vscode = require('vscode')

module.exports = {
    activate() {
        const keywords = /(systemLog|processManagement|net|security|setParameter|storage|operationProfiling|replication|sharding|auditLog|snmp).*?:/i
        vscode.languages.registerDocumentFormattingEditProvider('mongod-config', {
            provideDocumentFormattingEdits(document) {
                let edits = []
                let tabLength = 0
                for (let line = 0; line < document.lineCount; line++) {
                    const lineObject = document.lineAt(line)
                    if (lineObject.isEmptyOrWhitespace || lineObject.text.trim().startsWith('#')) {
                        continue
                    }

                    const keywordsMatch = lineObject.text.match(keywords)
                    if (keywordsMatch) {
                        edits.push(vscode.TextEdit.replace(lineObject.range, keywordsMatch[1] + ':'))
                        tabLength = 1
                    } else {
                        const lineMatch = lineObject.text.match(/^(.*?):(.*)$/)
                        edits.push(vscode.TextEdit.replace(lineObject.range, String('\t').repeat(tabLength) + lineMatch[1].trim() + ': ' + lineMatch[2].trim()))
                        tabLength = lineMatch[2].trim() ? 1 : tabLength + 1
                    }
                }

                return edits
            },
        })
    },
    deactivate() {},
}
