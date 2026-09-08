// Restyle the approved 17-slide deck in place. Preserve source elements and notes.
// node redesign-presentation.mjs <source.pptx> <source-layouts.json> <output-dir>
// To regenerate the baseline models, run build-presentation.mjs with --web-only
// and copy its slide-layouts.json before running this imported-deck edit.
import fs from 'node:fs/promises';
import path from 'node:path';
import {FileBlob, PresentationFile} from '@oai/artifact-tool';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'..');
const [source,baseline,out]=process.argv.slice(2);
const talk=JSON.parse(await fs.readFile(path.join(root,'talk-content.json'),'utf8'));
const before=JSON.parse(await fs.readFile(baseline,'utf8'));
const C={navy:'#10283F',ink:'#142D43',paper:'#F8FAFC',blue:'#175DA8',teal:'#64D2C4',muted:'#566C7E',light:'#BED0DD',line:'#CAD8E2',white:'#FFFFFF'};
const dark=new Set([1,3,6,9,10,14,16,17]);
function restyle(m,p,lang){
 const e=structuredClone(m.elements),isDark=dark.has(p.number);
 const fg=isDark?C.white:C.ink,muted=isDark?C.light:C.muted,accent=isDark?C.teal:C.blue;
 const d=p[lang];
 e.forEach((v,n)=>{v.sourceName=`s${p.number}-${v.role||v.kind}-${n+1}`;if(v.kind==='text'){v.color=v.role==='kicker'||v.role==='metric'?accent:v.bold?fg:muted;v.line=v.role==='title'?1.06:1.2;}else if(v.kind==='rect'){v.color=accent;}});
 const put=(v,x,y,w,h,size,bold,color,extra={})=>{if(!v)throw Error(`Missing element on slide ${p.number}`);Object.assign(v,{x,y,w,h,...(size?{size}:{}),...(bold!==undefined?{bold}:{}),...(color?{color}:{}),...extra});return v;};
 const T=(s,...args)=>put(e.find(v=>v.kind==='text'&&v.text===s),...args);
 const R=(r,...args)=>put(e.find(v=>v.role===r),...args);
 const I=(n,x,y,w,h,fit='cover')=>put(e.filter(v=>v.kind==='image')[n],x,y,w,h,undefined,undefined,undefined,{fit});
 const Q=e.filter(v=>v.kind==='rect');
 const title=(text,size=48,w=1168)=>R('title',56,87,w,110,size,true,fg,{text:lang==='en'?text:d.title});
 const cap=(x,y,w,h=42)=>T(d.caption,x,y,w,h,17,false,muted);
 const block=(n,x,y,w,bodyY=42,ts=29,bs=26,h=96)=>{T(d.blocks[n].title,x,y,w,bodyY,ts,true,fg);T(d.blocks[n].body,x,y+bodyY,w,h,bs,false,muted);};
 const takeaway=(y=627)=>{const v=e.find(v=>v.role==='takeaway');if(v){put(v,77,y,1140,58,25,true,fg);put(Q.at(-1),56,y+3,4,39,undefined,undefined,accent);}};
 if(p.layout!=='cover')R('kicker',56,43,1168,25,16,true,accent,{line:1.1});
 for(const v of e.filter(v=>v.role==='offline-meta'))put(v,v.align==='right'?1124:56,689,v.align==='right'?100:990,20,v.align==='right'?13:12,false,muted);

 if(p.layout==='cover'){
   I(0,700,183,580,479);I(1,56,52,43,43,'contain');
   T('CocoRobo',112,58,240,40,29,true,fg);
   T('PREPARED FOR',935,48,289,22,13,true,muted);
   T('UNESCO',935,77,289,40,30,true,fg);
   T('DIGITAL LEARNING WEEK 2026',935,119,289,26,14,true,muted);
   T(d.kicker,56,180,628,30,16,true,accent);
   R('title',56,238,628,244,60,true,fg,{text:lang==='en'?'From AI Tool Users\nto AI Agent\nCreators':d.title,line:1.02});
   T(d.lead,56,514,587,103,30,false,muted);
   T('Haiyang Xin · CocoRobo Ltd.',56,638,628,35,24,true,fg);
   T('Paris · 2026',1040,676,184,26,18,false,muted,{align:'right'});
 }else if(p.layout==='concept'){
   title('What is a pedagogical AI agent?',49);
   T(d.lead,56,173,1168,58,32,true,fg);T(d.tag,56,237,1150,35,21,false,muted);
   [293,393,511].forEach((y,n)=>block(n,56,y,574,37,28,24,79));
   I(0,686,301,538,287,'cover');cap(686,598,538,26);takeaway(637);
 }else if(p.layout==='roadmap'){
   title('One goal. Two views.',62);
   T(d.lead,56,183,1120,88,31,false,muted);
   d.blocks.forEach((b,n)=>{const x=56+n*605;put(Q[n],x,296,548,3,undefined,undefined,accent);block(n,x,320,536,62,40,29,120);});
   T(d.metric,56,526,306,107,91,true,accent);
   T(d.metricLabel,392,538,795,92,28,false,fg);
   T(d.takeaway,56,649,1168,30,21,false,muted);
 }else if(p.layout==='province'){
   title('Guangdong: shared goals\nfor AI education',49,1130);
   T(d.lead,56,214,1150,49,30,true,accent);
   T('2 + 1',56,302,366,152,120,true,accent);
   cap(62,487,325,100);T(d.caption,62,484,325,104,23,false,muted);
   [290,397,504].forEach((y,n)=>block(n,482,y,727,40,29,26,65));takeaway(637);
 }else if(p.layout==='city'){
   title('Shenzhen: access\nand chances to create',50,590);
   block(0,56,284,551,48,30,27,106);block(1,56,455,551,48,30,27,95);
   I(0,666,164,558,220,'contain');I(1,666,399,558,177,'cover');cap(666,590,558,29);takeaway(635);
 }else if(p.layout==='pingshan'){
   title('Pingshan: help teachers lead AI use',49);
   block(0,56,225,482,52,30,27,102);block(1,56,399,482,48,30,27,98);
   I(0,579,204,645,365,'cover');cap(579,574,645,27);
   T(d.steps.join('  →  '),56,601,1168,29,21,true,accent);takeaway(645);
 }else if(p.layout==='liyuan'){
   title('Liyuan: teachers shape the standards',49);
   I(0,56,221,605,371,'cover');cap(56,601,605,27);
   block(0,705,232,519,48,30,26,120);block(1,705,422,519,48,30,26,110);takeaway(642);
 }else if(p.layout==='task'){
   title('Bao’an: give each agent a clear job',49);
   [217,308,399,490].forEach((y,n)=>block(n,56,y,580,38,28,25,50));
   I(0,663,238,561,286,'contain');cap(663,539,561,35);
   T(d.tag,56,587,1168,36,19,false,muted);takeaway(637);
 }else if(p.layout==='bridge'){
   title('Why does practice\nneed research?',55,625).h=145;
   T(d.lead,56,239,569,103,30,false,muted);
   I(0,56,371,569,219,'cover');cap(56,601,569,26);
   [243,367,491].forEach((y,n)=>block(n,689,y,535,42,29,25,76));takeaway(639);
 }else if(p.layout==='timeline'){
   title('A year of practice,\nevidence and revision',50,1000);
   T(d.lead,56,212,1168,43,29,true,accent);
   put(Q[0],56,324,1147,2,undefined,undefined,'#426178');
   d.blocks.forEach((b,n)=>{const x=56+n*400;T(b.title,x,277,356,42,29,true,accent);put(Q[n+1],x,319,12,12,undefined,undefined,accent);T(b.body,x,347,353,85,29,true,fg);});
   T(d.caption,56,440,1168,65,25,false,muted);
   d.outputs.forEach((b,n)=>{const x=56+n*691;T(b.title,x,521,n?477:657,44,n?28:32,true,accent);T(b.body,x,568,n?477:657,43,26,false,fg);});takeaway(640);
 }else if(p.layout==='visible'){
   title('Building agents makes\nteaching choices visible',50,1120);
   T(d.lead,56,213,1168,69,29,false,muted);
   block(0,56,319,523,45,30,27,91);block(1,56,480,523,44,30,27,83);
   I(0,633,298,591,287,'contain');cap(633,594,591,35);takeaway(640);
 }else if(p.layout==='support'){
   title('Teachers need support\nto keep creating',51,1070);
   I(0,56,241,596,354,'cover');cap(56,603,596,36);
   block(0,705,255,519,50,30,28,101);block(1,705,432,519,49,30,28,115);takeaway(644);
 }else if(p.layout==='boundary'){
   title('Boundary Learning:\ndeciding where AI belongs',49,1110);
   T(d.lead,56,216,1150,74,29,false,muted);
   d.blocks.forEach((b,n)=>{const x=56+(n%2)*607,y=331+Math.floor(n/2)*130;T(String(n+1).padStart(2,'0'),x,y,64,55,44,true,accent);T(b.title,x+86,y,470,43,30,true,fg);T(b.body,x+86,y+44,465,78,26,false,muted);});
   T(d.tag,56,596,1168,27,18,false,muted);takeaway(642);
 }else if(p.layout==='partnership'){
   title('Four partners make\nthe work possible',51,1080);
   T(d.lead,56,211,1168,80,28,false,muted);
   d.blocks.forEach((b,n)=>{const x=56+(n%2)*612,y=331+Math.floor(n/2)*148;put(Q[n],x,y+1,4,107,undefined,undefined,accent);T(b.title,x+22,y,531,45,29,true,accent);T(b.body,x+22,y+49,529,95,27,false,fg);});takeaway(642);
 }else if(p.layout==='priorities'){
   title('Make the partnership\nuseful in practice',51,1000);
   T(d.lead,56,214,1168,49,30,true,accent);
   d.blocks.forEach((b,n)=>{const y=302+n*106;T(String(n+1),56,y-5,65,82,61,true,accent);T(b.title,149,y,1065,40,31,true,fg);T(b.body,149,y+45,1065,62,27,false,muted);});takeaway(642);
 }else if(p.layout==='invite'){
   title('You are welcome\nin Shenzhen.',59,641).h=155;
   T(d.lead,56,243,567,120,31,true,fg);
   T(d.tag,56,389,564,77,27,false,muted);
   T(d.blocks[0].title,56,492,568,70,31,true,fg);
   T(d.blocks[0].body,56,565,568,64,28,true,accent);
   I(0,672,178,552,404,'cover');cap(672,594,552,39);takeaway(646);
 }else if(p.layout==='contact'){
   title('Let’s keep\nlearning together.',61,592).h=185;
   T(d.lead,56,272,543,125,29,false,muted);
   T(d.tag,56,459,561,82,24,true,fg,{text:lang==='en'?'Haiyang Xin ·\nFounder & CEO, CocoRobo Ltd.':d.tag});
   T('tony@cocorobo.cc',56,555,553,56,37,true,accent);
   [0,1].forEach(n=>{const x=689+n*280;T(d.blocks[n].title,x,232,250,85,28,true,fg,{align:'left',text:lang==='en'?(n?'Submission\nmaterials':'This\npresentation'):d.blocks[n].title});I(n,x,327,246,246,'contain');T(d.blocks[n].body,x,590,252,69,19,false,muted,{align:'left',text:lang==='en'?(n?'UNESCO submission ·\nstudies and evidence':'Online slides ·\ncurrent version'):d.blocks[n].body});});
   T(d.takeaway,56,661,1168,29,21,false,muted,{align:'left'});
 }
 // Non-English online versions retain the same composition and all approved text.
 // French needs slightly smaller type for its longer phrases; source notes untouched.
 if(lang==='fr')for(const v of e)if(v.kind==='text'&&v.role!=='offline-meta'&&v.size>=24)v.size*=.88;
 if(lang==='fr'&&p.layout==='support')e.find(v=>v.text===d.caption).size=16;
 return {background:isDark?C.navy:C.paper,elements:e};
}
const models={};for(const lang of ['en','zh','fr'])models[lang]=talk.slides.map((p,n)=>restyle(before[lang][n],p,lang));
await fs.writeFile(path.join(root,'slide-layouts.json'),JSON.stringify(models,null,2)+'\n');
await fs.mkdir(out,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(source));
p.theme.colorScheme={name:'CocoRobo conference',themeColors:{...p.theme.hexColorMap,hlink:C.teal,folHlink:C.teal}};
for(let n=0;n<17;n++){
 const s=p.slides.items[n],m=models.en[n];s.background.fill=m.background;
 let im=0;
 for(const e of m.elements){
   const pos={left:e.x,top:e.y,width:e.w,height:e.h};
   if(e.kind==='image'){
     const v=s.images.items[im++];const meta=await sharp(path.join(root,'assets',e.asset)).metadata();
     const ar=meta.width/meta.height,fr=e.w/e.h;
     let frame={...pos},crop={left:0,top:0,right:0,bottom:0};
     if(e.fit==='cover'){
       if(ar>fr)crop.left=crop.right=(1-fr/ar)/2;else crop.top=crop.bottom=(1-ar/fr)/2;
     }else{
       if(ar>fr){frame.height=e.w/ar;frame.top=e.y+(e.h-frame.height)/2;}else{frame.width=e.h*ar;frame.left=e.x+(e.w-frame.width)/2;}
     }
     v.frame=frame;v.fit=e.fit;v.crop=crop;
   }else{
     const v=s.shapes.items.find(x=>x.name===e.sourceName);if(!v)throw Error(`Missing copied shape ${e.sourceName}`);
     v.position=pos;
     if(e.kind==='rect')v.fill=e.color;
     else{
       v.text=e.text;
       v.text.style={fontSize:e.size,bold:e.bold,color:e.color,typeface:'Arial',lineSpacing:e.line,alignment:e.align||'left',verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};
       if(e.link)v.text.get(e.text).link={uri:e.link,isExternal:true};
     }
   }
 }
 console.log(`Restyled existing slide ${n+1}`);
}
const file=await PresentationFile.exportPptx(p);await file.save(path.join(out,'UNESCO_Teacher_AI_Agents_EN.pptx'));
const qa=path.join(out,'../render');await fs.mkdir(qa,{recursive:true});
for(let n=0;n<17;n++){
 const s=p.slides.items[n];
 await fs.writeFile(path.join(qa,`slide-${String(n+1).padStart(2,'0')}.layout.json`),await (await s.export({format:'layout'})).text());
 const png=await p.export({slide:s,format:'png',scale:1});await fs.writeFile(path.join(qa,`slide-${String(n+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 console.log(`Rendered ${n+1}`);
}
const montage=await p.export({format:'png',montage:true,scale:.3});await fs.writeFile(path.join(qa,'montage.png'),new Uint8Array(await montage.arrayBuffer()));
console.log('Saved redesigned 17-slide copy.');
