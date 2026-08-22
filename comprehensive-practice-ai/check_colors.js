/* 配色核验：对比度与色阶间距，全部实测，不手写数字。
 * 依据 CocoRobo 视觉口径的三条硬规则，另加本讲座自己的两条（投影场景）。
 * 用法：node check_colors.js */
const P = require('./palette.js');
const hex = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16));
const lin = c => (c /= 255, c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = h => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { let [x, y] = [lum(a), lum(b)]; if (x < y) [x, y] = [y, x]; return (x + 0.05) / (y + 0.05); };
const oklab = h => {
  const [r, g, b] = hex(h).map(lin);
  let l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  let m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  let s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
          1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
          0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
};
const dE = (a, b) => { const [x, y, z] = oklab(a), [u, v, w] = oklab(b);
  return Math.hypot(x - u, y - v, z - w) * 100; };

const r2 = n => n.toFixed(2);
let bad = 0;
const check = (ok, line) => { console.log((ok ? '  ok   ' : '   ✗ 未过 ') + line); if (!ok) bad++; };

console.log('承载文字的色，在页底 ' + P.paper + ' 与卡片白上：');
[['navy', '大标题'], ['ink', '正文'], ['muted', '次要与页脚'], ['rust', '警示标签'],
 ['slate', '结构标签'], ['sev3', '收（白字底）']].forEach(([k, use]) => {
  const a = ratio(P[k], P.paper), b = ratio(P[k], P.white);
  check(Math.min(a, b) >= 4.5, `${k.padEnd(6)} ${P[k]}  底 ${r2(a)}  卡 ${r2(b)}   ${use}`);
});

console.log('只作图形、不承字的色（阈值 3:1，非文字对比）：');
[['rustf', '描边、书脊当前点'], ['blue', '卡片顶边、左描边']].forEach(([k, use]) => {
  const a = ratio(P[k], P.paper);
  check(a >= 3, `${k.padEnd(6)} ${P[k]}  底 ${r2(a)}   ${use}`);
});

console.log('徽章：深色两档要能承白字（11pt 粗体，阈值 4.5）：');
[['sev3', '收'], ['sev2', '半收']].forEach(([k, use]) => {
  const a = ratio(P[k], P.white);
  check(a >= 4.5, `${k.padEnd(6)} ${P[k]}  白字 ${r2(a)}   ${use}`);
});
check(ratio(P.sev1, P.ink) >= 4.5, `sev1   ${P.sev1}  上写 ink ${r2(ratio(P.sev1, P.ink))}   放`);

console.log('收放色阶：亮度单调，相邻色差要分得开（参照旧配色 17.3）：');
const ramp = [P.sev3, P.sev2, P.sev1];
check(oklab(ramp[0])[0] < oklab(ramp[1])[0] && oklab(ramp[1])[0] < oklab(ramp[2])[0], '亮度单调递增');
for (let i = 0; i < 2; i++) check(dE(ramp[i], ramp[i + 1]) >= 15,
  `ΔE(${['sev3', 'sev2', 'sev1'][i]}, ${['sev3', 'sev2', 'sev1'][i + 1]}) = ${dE(ramp[i], ramp[i + 1]).toFixed(1)}`);

console.log('结构蓝与警示赭必须分得开，否则语义会混：');
check(dE(P.slate, P.rust) >= 30, `ΔE(slate, rust) = ${dE(P.slate, P.rust).toFixed(1)}`);
check(dE(P.blue, P.rustf) >= 30, `ΔE(blue, rustf) = ${dE(P.blue, P.rustf).toFixed(1)}`);

console.log('指令三段底色：底上写 ink 要读得清，三段之间要分得开：');
[['tint1', P.tint1], ['tint3', P.tint3]].forEach(([k, v]) =>
  check(ratio(v, P.ink) >= 4.5, `${k} ${v}  上写 ink ${r2(ratio(v, P.ink))}`));
check(dE(P.tint1, P.tint3) >= 10, `ΔE(tint1, tint3) = ${dE(P.tint1, P.tint3).toFixed(1)}`);

console.log(bad ? `\n${bad} 项未过` : '\n全部通过');
process.exit(bad ? 1 : 0);
