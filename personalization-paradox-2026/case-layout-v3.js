(function(g){
'use strict';
const base=g.PP_BUILD;
function build(content){
const out=base(content),C={navy:'#173C62',ink:'#1D2B37',muted:'#637383',blue:'#276AA7',teal:'#326E70',pale:'#F1F5F8',paper:'#FAFBFC',line:'#D8E0E7',white:'#FFFFFF'};
for(const d of out){
 const e=d.elements;
 for(const t of e){if(t.kind==='text'){t.text=t.text.replace('修订版 2.0 · 2026.09','商业案例版 3.0 · 2026.09').replace('正文25页＋附录3页','正文32页＋附录4页');if(d.layout==='closing'&&t.text==='25 / 28')t.text=d.id+' / '+out.length;if(d.layout==='caseSources'&&t.y===687)t.text='商业学习产品案例 · 来源索引';}}
 const T=(text,x,y,w,h,size=27,bold=false,color=C.ink,align='left',lh=1.24)=>e.push({kind:'text',text,x,y,w,h,size,bold,color,align,lh});
 const B=(x,y,w,h,fill=C.pale,r=0,stroke=null)=>e.push({kind:'rect',x,y,w,h,fill,r,stroke});
 const L=(x,y,w,h=0,color=C.line,width=1,arrow=false)=>e.push({kind:'line',x,y,w,h,color,width,arrow});
 const note=text=>{L(64,603,1152);T(text,64,620,1152,57,24,true,C.navy);};
 if(d.layout==='claim'){
   T('企业公布的指标',64,310,491,35,22,true,C.blue);
   d.stats.forEach((a,i)=>{let y=357+i*108;T(a[0],64,y,563,55,i?34:40,true,C.navy);T(a[1],64,y+55,563,34,21,false,C.muted);});
   L(628,311,0,267);d.questions.forEach((a,i)=>{let y=316+i*89;T(a[0],674,y,535,36,25,true,C.blue);T(a[1],674,y+43,536,42,25);});note(d.bottom);
 }else if(d.layout==='grading'){
   T(d.task,64,281,1152,48,27,true,C.navy);
   B(64,345,551,172,C.paper,6,C.line);B(665,345,551,172,C.pale,6);
   T('学生作答 · 题意重绘',84,359,506,35,21,true,C.blue);
   for(let i=0;i<10;i++)B(87+i*38,408,22,22,C.white,0,C.navy);
   for(let i=0;i<5;i++){let x=87+i*46;L(x,481,16,-28,C.navy,2);L(x+16,453,16,28,C.navy,2);L(x,481,32,0,C.navy,2);}
   T('10 ÷ 2 = 5',348,452,238,44,29,true,C.navy,'right');
   T('系统反馈 · 据报道截图',687,359,505,35,21,true,C.blue);T('将5个三角形判为错误',687,410,500,43,29,true,C.navy);T('给出8个英文“triangle”',687,465,500,38,26);
   T(d.response,64,540,1152,50,24,false,C.muted);note(d.bottom);
 }else if(d.layout==='green'){
   d.steps.forEach((a,i)=>{let x=64+i*397;B(x,333,357,154,C.pale,6);T(a[0],x+21,354,315,43,28,true,C.navy);T(a[1],x+21,418,315,45,25);if(i<2)L(x+365,408,23,0,C.blue,2,true);});
   T(d.evidence,64,522,1152,64,27,true,C.navy);note(d.bottom);
 }else if(d.layout==='trial'){
   d.stages.forEach((a,i)=>{let x=64+i*397;T(a[0],x,319,357,36,24,true,C.blue);B(x,373,357,106,C.pale,5);T(a[1],x+18,395,321,73,26,true,C.navy);if(i<2)L(x+365,425,23,0,C.blue,2,true);});
   d.analysis.forEach((a,i)=>{let x=64+i*397;T(a[0],x,499,357,32,20,true,C.blue);T(a[1],x,538,357,61,22,false,C.ink);});note(d.bottom);
 }else if(d.layout==='answer'){
   B(64,308,1152,75,C.pale,5);T(d.report,86,329,1108,45,28,true,C.navy);
   T(d.goal,64,410,1152,41,25,true,C.blue);
   d.work.forEach((a,i)=>{let x=64+i*296;T(a[0],x,481,268,41,28,true,C.navy);T(a[1],x,546,268,37,23,false,C.muted);});note(d.bottom);
 }else if(d.layout==='lumosity'){
   B(64,310,1152,98,C.pale,5);T(d.regulatory,85,333,1108,66,27,true,C.navy);
   T('2017年独立研究',64,440,1152,33,22,true,C.blue);
   d.study.forEach((a,i)=>{let x=64+i*397;T(a[0],x,496,372,55,i===2?31:40,true,C.navy);T(a[1],x,558,372,39,22,false,C.muted);});note(d.bottom);
 }else if(d.layout==='tests'){
   d.rows.forEach((a,i)=>{let y=247+i*112;T(a[0],64,y+10,231,40,29,true,C.blue);T(a[1],311,y+1,904,43,29,true,C.navy);T(a[2],311,y+51,904,43,26,false,C.muted);L(64,y+99,1152);});note(d.bottom);
 }else if(d.layout==='caseSources'){
   d.rows.forEach((a,i)=>{let y=243+i*57;T('['+a[0]+']',64,y,174,39,21,true,C.blue);T(a[1],250,y,516,43,23,true,C.navy);T(a[2],783,y+2,433,43,21,false,C.muted);L(64,y+47,1152);});
   T('事实、企业主张、受访陈述与框架推论分别标明；原文链接收录于每页讲者备注。',64,626,1152,49,23,false,C.muted);
 }
}
return out;
}
g.PP_BUILD=build;if(typeof module!=='undefined')module.exports=build;
})(typeof window!=='undefined'?window:globalThis);
