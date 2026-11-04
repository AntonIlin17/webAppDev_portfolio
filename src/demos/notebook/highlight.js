// Tiny Python tokenizer for display only. Returns [{ type, text }] runs.
const KEYWORDS = new Set([
  'def', 'class', 'return', 'for', 'in', 'if', 'else', 'elif', 'while', 'import', 'from', 'as', 'with', 'not', 'and', 'or',
  'is', 'None', 'True', 'False', 'break', 'continue', 'lambda', 'yield', 'pass', 'raise', 'try', 'except', 'finally', 'del', 'global',
])
const BUILTINS = new Set(['print', 'len', 'range', 'enumerate', 'zip', 'list', 'dict', 'float', 'int', 'str', 'sum', 'max', 'min', 'round', 'bool', 'display', 'self', 'np', 'pd', 'plt', 'sns', 'object', 'staticmethod'])

const TOKEN = /("""[\s\S]*?"""|'''[\s\S]*?'''|#[^\n]*|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b|@\w+|\b[A-Za-z_]\w*\b|\s+|[^\sA-Za-z_\d"'#@]+)/g

export function tokenize(code) {
  const out = []
  let m
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(code)) !== null) {
    const t = m[0]
    let type = 'plain'
    if (t.startsWith('#')) type = 'comment'
    else if (t.startsWith('"') || t.startsWith("'")) type = 'string'
    else if (/^\d/.test(t)) type = 'number'
    else if (t.startsWith('@')) type = 'decorator'
    else if (KEYWORDS.has(t)) type = 'keyword'
    else if (BUILTINS.has(t)) type = 'builtin'
    else if (/^[A-Za-z_]\w*$/.test(t)) {
      const next = code.slice(TOKEN.lastIndex, TOKEN.lastIndex + 1)
      if (next === '(') type = 'call'
    }
    const last = out[out.length - 1]
    if (last && last.type === type && type === 'plain') last.text += t
    else out.push({ type, text: t })
  }
  return out
}
