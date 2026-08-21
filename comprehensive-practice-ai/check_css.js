/* 类名撞车与孤儿类检查。
 * 起因：新加的 g1/g2/g3 与既有的网格类 .g2 .g3 撞名，行内 span 被变成 grid；
 * 之后 .take .tp 又继承了工具位置表的 .tp。两次都是肉眼难发现的错位。
 * 用法：node check_css.js */
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

const top = new Set(), desc = new Set(), defined = new Set();
css.replace(/\/\*[\s\S]*?\*\//g, '').split(/\}/).forEach(block => {
  const sel = block.slice(block.lastIndexOf('}') + 1).split('{')[0];
  if (!sel || sel.indexOf('@') >= 0) return;
  sel.split(',').forEach(one => {
    const t = one.trim();
    if (!t) return;
    (t.match(/\.[A-Za-z][\w-]*/g) || []).forEach(c => defined.add(c.slice(1)));
    const m = /^\.([A-Za-z][\w-]*)\s*(?::[\w-]+)?$/.exec(t);
    if (m) top.add(m[1]);
    const d = /^\.[A-Za-z][\w-]*[\s>]+\.([A-Za-z][\w-]*)/.exec(t);
    if (d) desc.add(d[1]);
  });
});

/* 允许的重名：同一元素的作用域覆写，不是撞车 */
const OK = new Set(['eyebrow', 'redrow', 'head', 'lbl', 'th']);
const clash = [...top].filter(c => desc.has(c) && !OK.has(c)).sort();

const used = new Set();
(app.match(/class="[^"]*"/g) || []).forEach(a => {
  a.slice(7, -1).split(/[\s'+]+/).forEach(t => { if (/^[A-Za-z][\w-]*$/.test(t)) used.add(t); });
});
(app.match(/'([a-z][\w-]*)'\s*\+\s*\(k \+ 1\)/g) || []).forEach(() => {});
/* 拼接类名的片段，不是真类名 */
const FRAG = new Set(['L', 'cls']);
const orphan = [...used].filter(c => !defined.has(c) && !FRAG.has(c)).sort();

let bad = 0;
if (clash.length) { bad = 1; console.log('类名撞车（顶层类又被当作后代类，会继承到不该继承的属性）：');
  clash.forEach(c => console.log('  .' + c)); }
if (orphan.length) console.log('app.js 用到但 styles.css 未定义（可能是笔误）：\n  ' + orphan.join(' '));
if (!bad && !orphan.length) console.log('类名检查：无撞车，无孤儿类');
process.exit(bad);
