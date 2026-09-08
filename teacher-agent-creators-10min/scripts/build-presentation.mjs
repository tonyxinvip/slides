// Run with the Codex primary runtime and @oai/artifact-tool available.
// Arguments: deck directory, output directory. Creates English PPTX and web layouts.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const deck=path.resolve(process.argv[2]);
const output=path.resolve(process.argv[3]);
const talk=JSON.parse(await fs.readFile(path.join(deck,'talk-content.json'),'utf8'));
await fs.mkdir(output,{recursive:true});
const renderDir=path.join(output,'../render');
await fs.mkdir(renderDir,{recursive:true});
const C={navy:'#071428',blue:'#1769E0',paper:'#F5F2EA',ink:'#101A2C',cyan:'#5BE3D5',amber:'#EFAA36',muted:'#556175',white:'#FFFFFF'};
const theme={dark:{bg:C.navy,fg:C.white,muted:'#C2CDDB',accent:C.cyan,line:'#385067'},blue:{bg:C.blue,fg:C.white,muted:'#E0EBFF',accent:C.cyan,line:'#79A8EB'},paper:{bg:C.paper,fg:C.ink,muted:C.muted,accent:'#0D4DAA',line:'#CFD6DD'},amber:{bg:C.amber,fg:C.ink,muted:'#374356',accent:C.navy,line:'#C89031'}};

function model(p,lang){
 const d=p[lang], c=theme[p.theme], e=[];
 function tx(text,x,y,w,h,size=26,bold=false,color=c.fg,role='body',extra={}){
   if(text)e.push({kind:'text',text,x,y,w,h,size,bold,color,role,line:role==='title'?1.03:1.16,...extra});
 }
 function rect(x,y,w,h,color){e.push({kind:'rect',x,y,w,h,color});}
 function img(asset,x,y,w,h,fit='cover',extra={}){e.push({kind:'image',asset,x,y,w,h,fit,...extra});}
 function header(){tx(d.kicker,64,56,1152,28,17,true,c.accent,'kicker');tx(d.title,64,97,1152,110,48,true,c.fg,'title');}
 function caption(text,x,y,w){tx(text,x,y,w,52,18,false,c.muted,'caption');}
 function takeaway(text=d.takeaway,y=619){rect(64,y-15,1152,2,c.line);tx(text,64,y,1152,54,26,true,c.fg,'takeaway');}
 function blocks(items,x,y,w,gap=144,titleSize=31,bodySize=26){
   items.forEach((b,i)=>{tx(b.title,x,y+i*gap,w,70,titleSize,true,c.fg,'subheading');tx(b.body,x,y+i*gap+72,w,93,bodySize,false,c.muted);});
 }
 // Native file metadata is hidden by the web viewer, which has its own controls.
 function footer(){tx('CocoRobo · UNESCO Digital Learning Week 2026',64,686,950,19,13,false,c.muted,'offline-meta');tx(String(p.number).padStart(2,'0')+' / 15',1120,682,96,24,15,true,c.muted,'offline-meta',{align:'right'});}

 if(p.layout==='cover'){
   img(p.assets[0],778,151,438,434,'cover');
   img('cocorobo-icon-white.svg',64,65,42,42,'contain');tx('CocoRobo',119,68,205,41,31,true,c.fg,'subheading');
   tx('PREPARED FOR',926,65,290,22,14,true,c.muted,'kicker');
   tx('UNESCO',926,90,290,40,31,true,c.fg,'subheading');
   tx('DIGITAL LEARNING WEEK 2026',926,130,290,30,15,true,c.muted,'kicker');
   tx(d.kicker,64,205,740,34,17,true,c.accent,'kicker');
   tx(d.title,64,267,704,190,68,true,c.fg,'title',{line:1.02});
   tx(d.lead,64,479,646,108,31,false,c.muted);
   tx('Haiyang Xin · CocoRobo Ltd.',64,620,860,35,26,true);
   tx('Paris · 2026',1020,625,196,28,20,false,c.muted,'body',{align:'right'});
 }else if(p.layout==='concept'){
   header();tx(d.lead,64,189,1152,52,31,true);tx(d.tag,64,244,1152,36,21,false,c.muted);
   d.blocks.forEach((b,i)=>{const y=285+i*106;tx(b.title,64,y,570,37,28,true);tx(b.body,64,y+38,570,65,25,false,c.muted);});
   img(p.assets[0],686,303,530,274,'contain');caption(d.caption,686,583,530);takeaway(d.takeaway,637);
 }else if(p.layout==='roadmap'){
   header();tx(d.lead,64,198,1152,76,32,false,c.muted);
   d.blocks.forEach((b,i)=>{const x=64+i*596;rect(x,300,550,3,c.accent);tx(b.title,x,323,550,48,39,true);tx(b.body,x,385,530,114,29,false,c.muted);});
   tx(d.metric,64,531,290,86,74,true,c.accent,'metric');tx(d.metricLabel,378,537,780,69,28,false,c.fg);
   tx(d.takeaway,64,636,1152,34,22,false,c.muted,'caption');
 }else if(p.layout==='city'){
   header();blocks(d.blocks,64,248,552,166,31,27);
   img(p.assets[0],682,218,534,178,'contain');img(p.assets[1],682,410,534,151,'cover');
   caption(d.caption,682,570,534);takeaway();
 }else if(p.layout==='pingshan'){
   header();blocks(d.blocks,64,246,522,150,30,27);
   img(p.assets[0],636,233,580,288,'cover');caption(d.caption,636,537,580);
   // One concise sequence describes the teacher development activity.
   const steps=d.steps;tx(steps.join('  →  '),64,579,1152,35,23,true,c.accent);takeaway(d.takeaway,636);
 }else if(p.layout==='liyuan'){
   header();blocks(d.blocks,64,237,550,171,31,27);
   img(p.assets[0],664,225,552,337,'cover');
   caption(d.caption,664,577,552);takeaway(d.takeaway,642);
 }else if(p.layout==='task'){
   header();
   d.blocks.forEach((b,i)=>{const y=227+i*87;tx(b.title,64,y,596,40,29,true);tx(b.body,64,y+39,596,40,25,false,c.muted);});
   img(p.assets[0],705,265,511,238,'contain');caption(d.caption,705,518,511);
   tx(d.tag,64,583,1152,36,19,false,c.muted,'caption');takeaway(d.takeaway,636);
 }else if(p.layout==='classroom'){
   header();img(p.assets[0],64,216,718,349,'cover');caption(d.caption,64,573,718);
   d.blocks.forEach((b,i)=>{const y=222+i*119;tx(b.title,829,y,387,39,31,true);tx(b.body,829,y+43,387,73,27,false,c.muted);});takeaway(d.takeaway,637);
 }else if(p.layout==='evidence'){
   header();tx(d.lead,64,204,1152,49,31,true,c.accent);
   d.blocks.forEach((b,i)=>{const y=294+i*96;tx(b.title,64,y,509,40,31,true);tx(b.body,64,y+41,509,58,26,false,c.muted);});
   img(p.assets[0],624,285,592,281,'cover');caption(d.caption,624,577,592);takeaway(d.takeaway,640);
 }else if(p.layout==='visible'){
   header();tx(d.lead,64,209,1152,77,30,false,c.muted);
   blocks(d.blocks,64,305,530,147,31,27);
   img(p.assets[0],668,310,548,256,'contain');caption(d.caption,668,572,548);takeaway(d.takeaway,640);
 }else if(p.layout==='support'){
   header();blocks(d.blocks,64,254,535,164,31,28);
   img(p.assets[0],653,225,563,332,'cover');caption(d.caption,653,570,563);takeaway(d.takeaway,638);
 }else if(p.layout==='boundary'){
   header();tx(d.lead,64,202,1152,82,30,false,c.muted);
   d.blocks.forEach((b,i)=>{const x=64+(i%2)*596,y=311+Math.floor(i/2)*124;tx(String(i+1).padStart(2,'0'),x,y,58,47,31,true,c.accent,'metric');tx(b.title,x+76,y,468,43,31,true);tx(b.body,x+76,y+46,462,78,27,false,c.muted);});
   tx(d.tag,64,574,1152,31,19,false,c.muted,'caption');takeaway(d.takeaway,631);
 }else if(p.layout==='priorities'){
   header();tx(d.lead,64,199,1152,49,31,true,c.accent);
   d.blocks.forEach((b,i)=>{const y=286+i*104;tx(String(i+1),64,y,57,68,50,true,c.accent,'metric');tx(b.title,147,y+2,1069,40,32,true);tx(b.body,147,y+46,1069,55,28,false,c.muted);});takeaway(d.takeaway,633);
 }else if(p.layout==='invite'){
   header();tx(d.lead,64,209,570,112,31,true);
   tx(d.tag,64,348,566,68,27,false,c.muted);
   tx(d.blocks[0].title,64,444,566,74,34,true);
   tx(d.blocks[0].body,64,528,566,78,29,true,c.accent);
   img(p.assets[0],676,211,540,368,'cover');caption(d.caption,676,589,540);
   takeaway(d.takeaway,641);
 }else if(p.layout==='contact'){
   header();tx(d.lead,64,200,1152,69,29,false,c.muted);
   [0,1].forEach(i=>{
     const x=216+i*592;
     tx(d.blocks[i].title,x-152,303,552,44,33,true,c.fg,'subheading',{align:'center'});
     img(p.assets[i],x,355,248,248,'contain',{link:i===0?talk.url:talk.supportUrl});
     tx(d.blocks[i].body,x-152,616,552,34,21,false,c.muted,'caption',{align:'center',link:i===0?talk.url:talk.supportUrl});
   });
   // Name and contact remain visible while the audience scans.
   tx(d.tag,64,267,745,37,24,true,c.accent);
   tx('tony@cocorobo.cc',855,267,361,37,27,true,c.accent,'body',{link:'mailto:tony@cocorobo.cc'});
   tx(d.takeaway,64,663,1152,27,20,false,c.muted,'contact-prompt',{align:'center'});
 }
 if(p.layout!=='cover'&&p.layout!=='contact')footer();
 return {background:c.bg,elements:e};
}

const models={};for(const lang of ['en','zh','fr'])models[lang]=talk.slides.map(p=>model(p,lang));
await fs.writeFile(path.join(deck,'slide-layouts.json'),JSON.stringify(models,null,2)+'\n');
if(process.argv.includes('--web-only')){console.log('Updated multilingual web layouts.');process.exit(0);}
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
const imageCache=new Map();
async function imageBytes(asset){
 if(imageCache.has(asset))return imageCache.get(asset);
 const source=path.join(deck,'assets',asset);
 const raster=(asset.endsWith('.svg')||asset.includes('-qr.'))
    ? {blob:await sharp(source).resize({width:asset.endsWith('.svg')?800:800,withoutEnlargement:!asset.endsWith('.svg')}).png().toBuffer(),contentType:'image/png'}
    : {blob:await sharp(source).resize({width:1600,withoutEnlargement:true}).jpeg({quality:88}).toBuffer(),contentType:'image/jpeg'};
 imageCache.set(asset,raster);return raster;
}
for(let i=0;i<talk.slides.length;i++){
 const page=talk.slides[i],m=models.en[i],slide=presentation.slides.add();slide.background.fill=m.background;
 for(let n=0;n<m.elements.length;n++){
   const e=m.elements[n],name=`s${i+1}-${e.role||e.kind}-${n+1}`;
   const position={left:e.x,top:e.y,width:e.w,height:e.h};
   if(e.kind==='image'){
     const data=await imageBytes(e.asset);
     slide.images.add({...data,alt:e.asset.replace(/\.[^.]+$/,'').replaceAll('-',' '),fit:e.fit,position});
   }else{
     const shape=slide.shapes.add({geometry:e.kind==='text'?'textbox':'rect',name,position,fill:e.kind==='rect'?e.color:'none',line:{fill:'none',width:0}});
     if(e.kind==='text'){
       shape.text=e.text;
       shape.text.style={fontSize:e.size,bold:e.bold,color:e.color,typeface:'Arial',lineSpacing:e.line,alignment:e.align||'left',verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};
       if(e.link)shape.text.get(e.text).link={uri:e.link,isExternal:true};
     }
   }
 }
 slide.speakerNotes.textFrame.setText(page.note_en);
 const layout=await slide.export({format:'layout'});
 await fs.writeFile(path.join(renderDir,`slide-${String(i+1).padStart(2,'0')}.layout.json`),await layout.text());
 console.log(`Built slide ${i+1}: ${page.en.title.replaceAll('\n',' ')}`);
}
const pptx=await PresentationFile.exportPptx(presentation);
const pptxPath=path.join(output,'UNESCO_Teacher_AI_Agents_EN.pptx');
await pptx.save(pptxPath);console.log(`Saved ${pptxPath}`);
await fs.writeFile(path.join(output,'../presentation.json'),JSON.stringify(presentation.toProto()));
for(let i=0;i<presentation.slides.items.length;i++){
 const slide=presentation.slides.items[i];
 const png=await presentation.export({slide,format:'png',scale:1.25});
 await fs.writeFile(path.join(renderDir,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
 console.log(`Rendered slide ${i+1}`);
}
console.log(JSON.stringify({slides:talk.slides.length,pptx:pptxPath}));
