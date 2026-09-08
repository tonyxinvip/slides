import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const root=path.resolve(process.argv[2]||'.');
const out=path.resolve(process.argv[3]||path.join(root,'downloads'));
const tmp=path.resolve(process.argv[4]||path.join(root,'.build'));
await fs.mkdir(out,{recursive:true}); await fs.mkdir(path.join(tmp,'render'),{recursive:true});
const pages=JSON.parse(await fs.readFile(path.join(root,'content.json'),'utf8'));
const C={ink:'#111820',blue:'#2366AC',muted:'#53616C',rule:'#CCD3D8',pale:'#F0F4F7',white:'#FFFFFF'};
const sourceNames={
 'https://doi.org/10.1111/bjet.13514':'Cukurova, 2025 · BJET',
 'https://www.unesco.org/en/articles/ai-competency-framework-teachers':'Miao & Cukurova, 2024 · UNESCO',
 'https://doi.org/10.1016/j.caeai.2026.100542':'Sun et al., 2026 · C&E: AI',
 'https://doi.org/10.1073/pnas.2422633122':'Bastani et al., 2025 · PNAS'
};
const sourceFull={
 'https://doi.org/10.1111/bjet.13514':'Cukurova, M. (2025). The interplay of learning, analytics and artificial intelligence in education: A vision for hybrid intelligence. British Journal of Educational Technology, 56(2), 469–488.',
 'https://www.unesco.org/en/articles/ai-competency-framework-teachers':'Miao, F., & Cukurova, M. (2024). AI competency framework for teachers. UNESCO. https://unesdoc.unesco.org/ark:/48223/pf0000391104',
 'https://doi.org/10.1016/j.caeai.2026.100542':'Sun, D., Ba, S., Cha, Y., Yu, J., Chiang, F.-K., Dai, H. M., & Lim, C. P. (2026). Empowering university teachers in higher education: A generative AI-responsive competency framework. Computers and Education: Artificial Intelligence, 10, 100542.',
 'https://doi.org/10.1073/pnas.2422633122':'Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. Proceedings of the National Academy of Sciences, 122(26), e2422633122.'
};
// Adapted composition references: Codex Grid stacked cover (01), open paired
// narrative (05), open triple columns (06), and table-led evidence (14).
// No reference module or sample content is required to rebuild this deck.
function units(str){return [...str].reduce((n,c)=>n+(/[\u0000-\u007f]/.test(c)?(/[WM]/.test(c)?.85:/[il.,:; ']/.test(c)?.32:.57):1),0);}
function wrap(str,size,width){
 const max=(width-5)/size;
 return str.split('\n').map(line=>{let r=[],cur='';for(const ch of line){if(cur&&units(cur+ch)>max){r.push(cur);cur=ch;}else cur+=ch;}r.push(cur);return r.join('\n');}).join('\n');
}
function layout(p){
 const el=[];
 function rect(x,y,w,h,fill=C.rule){el.push({kind:'rect',x,y,w,h,fill});}
 function tx(str,x,y,w,size=28,bold=false,color=C.ink,extra={}){
  if(!str)return;
  const text=extra.noWrap?str:wrap(str,size,w),lh=extra.lh||1.35;
  const h=extra.h||Math.ceil(text.split('\n').length*size*lh+6);
  el.push({kind:'text',text,x,y,w,h,size,bold,color,align:extra.align||'left',lh,...extra});return h;
 }
 function image(src,x,y,w,h){el.push({kind:'image',src,x,y,w,h});}
 function header(){
  tx(p.kicker||p.section,72,47,900,22,true,C.blue,{noWrap:true});
  image('assets/cocorobo-logo-navy.png',1055,42,153,36);
  tx(p.title,72,110,1136,48,true,C.ink,{noWrap:true,h:80,role:'title'});
 }
 function takeaway(str=p.question){if(str){rect(72,608,1136,1);tx(str,72,626,1136,25,true,C.blue,{h:43});}}
 function footer(){
  let caption=(p.sources||[]).map(s=>sourceNames[s]||s).join('；');
  if(!caption)caption='辛海洋 Tony Xin · CocoRobo';
  tx(caption,72,686,1020,17,false,C.muted,{noWrap:true,h:24,role:'footer'});
  tx(`${String(p.id).padStart(2,'0')} / 36`,1110,684,98,19,true,C.muted,{align:'right',noWrap:true,h:27,role:'footer'});
 }
 if(p.type==='cover'){
  image('assets/cocorobo-logo-navy.png',72,56,213,51);
  tx('学习的价值 · 人的成长 · 教师的判断',72,155,1100,25,true,C.blue);
  tx(p.title,72,237,1136,80,true,C.ink,{lh:1.18,h:206});
  tx(p.lead.replace('\n',''),72,484,1136,32,false,C.muted);
  rect(72,612,1136,1);
  tx('辛海洋 Tony Xin',72,637,600,27,true);tx('CocoRobo',850,637,358,25,false,C.muted,{align:'right'});
 }else if(p.type==='closing'){
  image('assets/cocorobo-logo-navy.png',72,47,185,44);
  tx('把问题带回课堂',72,142,900,24,true,C.blue);
  tx('教育要成就什么？',72,232,1136,76,true,C.ink,{noWrap:true,h:114});
  tx(p.lead,72,377,1030,34,false,C.muted,{lh:1.5});
  rect(72,532,1136,1);
  tx(p.question,72,561,1110,28,true,C.blue,{h:96});footer();
 }else{
  header();
  if(p.type==='statement'){
   tx(p.lead,72,244,1090,48,true,C.ink,{lh:1.55});takeaway();
  }else if(p.type==='question' && !p.items){
   tx(p.lead,72,230,1080,p.id===13?48:55,true,C.ink,{lh:1.5});takeaway();
  }else if(p.type==='question'){
   const n=p.items.length;
   if(p.lead)tx(p.lead,72,197,1136,27,false,C.muted);
   p.items.forEach((a,i)=>{let y=236+i*(n===2?163:116);tx(a.head,72,y,290,32,true,C.blue);tx(a.body,395,y,813,28,false,C.ink,{h:n===2?132:99});});
   takeaway();
  }else if(p.type==='columns'){
   if(p.lead)tx(p.lead,72,197,1136,28,false,C.muted,{h:88});
   const n=p.items.length,gap=48,w=(1136-gap*(n-1))/n;
   const y=p.lead?324:284;
   p.items.forEach((a,i)=>{const x=72+i*(w+gap);rect(x,y-22,w,2,C.rule);tx(a.head,x,y,w,32,true,C.blue,{h:88});tx(a.body,x,y+91,w,28,false,C.ink,{h:185});});takeaway();
  }else if(p.type==='rows'){
   if(p.lead)tx(p.lead,72,193,1136,28,false,C.muted);
   const n=p.items.length,y0=p.lead?286:222,step=n===5?75:121;
   p.items.forEach((a,i)=>{const y=y0+i*step;rect(72,y-16,1136,1);tx(a.head,72,y,310,31,true,C.blue,{h:95});tx(a.body,426,y,782,n===5?28:28,false,C.ink,{h:95});});takeaway();
  }else if(p.type==='case'){
   tx(p.lead,72,205,1100,34,true,C.ink,{h:108});
   p.items.forEach((a,i)=>{const y=347+i*119;tx(a.head,72,y,286,32,true,C.blue,{h:94});tx(a.body,395,y,813,29,false,C.ink,{h:100});});takeaway();
  }else if(p.type==='levels'){
   const ys=[217,345,473];
   p.items.forEach((a,i)=>{rect(72,ys[i]-14,1136,1);tx(String(i+1).padStart(2,'0'),72,ys[i],78,40,true,C.blue);tx(a.head,180,ys[i],295,34,true);tx(a.body,520,ys[i]+4,688,30,false,C.muted);});takeaway();
  }else if(p.type==='table'){
   if(p.lead)tx(p.lead,72,193,1136,27,false,C.muted,{h:64});
   const y0=p.lead?277:235,widths=[246,445,445],x=[72,318,763],headerH=55;
   rect(72,y0,1136,headerH,C.pale);
   p.columns.forEach((s,j)=>tx(s,x[j]+14,y0+8,widths[j]-28,27,true,C.blue,{h:40}));
   const rh=p.rows.length===5?54:p.rows.length===4?76:88;
   p.rows.forEach((r,i)=>{const y=y0+headerH+i*rh;r.forEach((s,j)=>tx(s,x[j]+14,y+12,widths[j]-28,24,j===0,C.ink,{h:rh-10}));rect(72,y+rh,1136,1);});takeaway();
  }else if(p.type==='references'){
   p.items.forEach((a,i)=>{const y=221+i*96;rect(72,y-15,1136,1);tx(a.head,72,y,338,28,true,C.blue,{h:68});tx(a.body,441,y,767,25,false,C.ink,{h:80});});
  }
  footer();
 }
 const pace=`建议用时：${p.duration}秒。\n\n`;
 const sources=(p.sources||[]).map(s=>(sourceFull[s]||sourceNames[s]||'来源')+'\n'+s).join('\n\n');
 const notes=pace+p.notes+'\n\n[Sources]\n'+(sources||'本讲座整理的教学讨论与反思问题；情境、安排和新增材料为教学讨论所设，并非课堂实证结果。')+'\n品牌资产：tonyxinvip/slides/teacher-agent-creators-10min/assets/cocorobo-full-dark.svg（用户仓库既有资产）。\n[/Sources]';
 return{id:p.id,title:p.title.replaceAll('\n',''),section:p.section,notes,duration:p.duration,background:C.white,elements:el};
}

// Derive a web-safe raster from the exact, already corrected brand mark.
const brand=path.resolve(root,'assets/cocorobo-logo-navy.svg');
await sharp(brand).resize({width:1200}).png().toFile(path.join(root,'assets/cocorobo-logo-navy.png'));
const models=pages.map(layout);
await fs.writeFile(path.join(root,'slide-layouts.json'),JSON.stringify(models,null,2)+'\n');
const issues=[];
for(const m of models){
 for(const e of m.elements){
  if(e.x<0||e.y<0||e.x+e.w>1281||e.y+e.h>721)issues.push({slide:m.id,issue:'outside canvas',text:e.text});
  if(e.kind==='text'&&e.role==='title'&&units(e.text)*e.size>e.w)issues.push({slide:m.id,issue:'title width',text:e.text});
 }
 const texts=m.elements.filter(e=>e.kind==='text');
 for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){
  const a=texts[i],b=texts[j];
  const ah=a.text.split('\n').length*a.size*a.lh,bh=b.text.split('\n').length*b.size*b.lh;
  if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>2 && Math.min(a.y+ah,b.y+bh)-Math.max(a.y,b.y)>2)issues.push({slide:m.id,issue:'text overlap',a:a.text,b:b.text});
 }
}
await fs.writeFile(path.join(tmp,'layout-check.json'),JSON.stringify(issues,null,2));
if(issues.length){console.log(JSON.stringify(issues,null,2));throw new Error(`Resolve ${issues.length} layout warnings before export`);}
const pres=Presentation.create({slideSize:{width:1280,height:720}});
const logo=await fs.readFile(path.join(root,'assets/cocorobo-logo-navy.png'));
for(const m of models){
 const slide=pres.slides.add();slide.background.fill=m.background;
 for(const [i,e] of m.elements.entries()){
  const position={left:e.x,top:e.y,width:e.w,height:e.h};
  if(e.kind==='image')slide.images.add({blob:logo,contentType:'image/png',alt:'CocoRobo完整标志',fit:'contain',position});
  else{
   const s=slide.shapes.add({name:`s${m.id}-${e.role||e.kind}-${i}`,geometry:e.kind==='text'?'textbox':'rect',position,fill:e.kind==='rect'?e.fill:'none',line:{fill:'none',width:0}});
   if(e.kind==='text'){s.text=e.text;s.text.style={fontSize:e.size,bold:e.bold,color:e.color,typeface:'Noto Sans CJK SC',lineSpacing:e.lh,alignment:e.align,verticalAlignment:'top',autoFit:'none',wrap:'none',insets:{left:0,right:0,top:0,bottom:0}};}
  }
 }
 slide.speakerNotes.textFrame.setText(m.notes);
 await fs.writeFile(path.join(tmp,'render',`slide-${String(m.id).padStart(2,'0')}.layout.json`),await(await slide.export({format:'layout'})).text());
}
const filename='AI_Education_Purpose_36slides.pptx';
const pptx=await PresentationFile.exportPptx(pres);await pptx.save(path.join(out,filename));
if(path.resolve(out)!==path.resolve(root,'downloads')) await fs.copyFile(path.join(out,filename),path.join(root,'downloads',filename));
await fs.writeFile(path.join(tmp,'presentation.json'),JSON.stringify(pres.toProto()));
console.log(`Exported ${pages.length} slides; ${pages.reduce((s,p)=>s+p.duration,0)/60} minutes`);
for(let i=0;i<pres.slides.items.length;i++){
 const blob=await pres.export({slide:pres.slides.items[i],format:'png',scale:1.25});
 await fs.writeFile(path.join(tmp,'render',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log(`Rendered ${i+1}/36`);
}
await fs.copyFile(path.join(tmp,'render/slide-01.png'),path.join(root,'assets/cover.png'));
console.log(path.join(out,filename));
