(function(g){
'use strict';
const C={navy:'#173C62',ink:'#1D2B37',muted:'#637383',blue:'#276AA7',teal:'#326E70',pale:'#F1F5F8',paper:'#FAFBFC',line:'#D8E0E7',white:'#FFFFFF'};
function build(content){
 const total=content.slides.length, result=[];
 for(const d of content.slides){
  const e=[];
  const T=(text,x,y,w,h,size=27,bold=false,color=C.ink,align='left',lh=1.24)=>e.push({kind:'text',text,x,y,w,h,size,bold,color,align,lh});
  const B=(x,y,w,h,fill=C.pale,r=0,stroke=null)=>e.push({kind:'rect',x,y,w,h,fill,r,stroke});
  const L=(x,y,w,h=0,color=C.line,width=1,arrow=false)=>e.push({kind:'line',x,y,w,h,color,width,arrow});
  const I=(x,y,w)=>e.push({kind:'image',src:'assets/cocorobo-navy.svg',x,y,w,h:w*34/148});
  const pill=(text,x,y,w=160)=>{B(x,y,w,31,C.pale,4);T(text,x+10,y+3,w-20,25,17,true,C.blue);};
  const note=(text,y=617)=>{L(64,y-16,1152);T(text,64,y,1152,61,25,true,C.navy,'left',1.24);};
  const step=(label,text,x,y,w,h=184)=>{B(x,y,w,h,C.pale,7);T(label,x+23,y+21,w-46,43,29,true,C.navy);T(text,x+23,y+77,w-46,h-85,27,false,C.ink,'left',1.3);};
  if(d.layout!=='cover'&&d.layout!=='closing'){
   T(d.section,64,45,945,32,20,true,C.blue);I(1058,42,158);
   T(d.title,64,111,1152,72,d.title.length>25?42:46,true,C.navy);
   T(d.type,64,185,1100,25,16,false,C.muted);
   if(d.lead)T(d.lead,64,226,1152,77,27,false,C.ink,'left',1.27);
   T(d.layout==='sources'?'完整引文、版本与材料类别见逐页讲者备注。':d.refs.map(k=>'['+k+'] '+content.refs[k].short).join('  ·  '),64,687,1048,22,13,false,C.muted);
   T(String(d.id).padStart(2,'0')+' / '+total,1126,684,90,26,17,true,C.muted,'right');
  }
  switch(d.layout){
   case 'cover':{
    I(64,45,218);T('Chee-Kit Looi 与 Haiyang Xin 合作研究',64,144,1120,38,24,false,C.muted);
    T(d.title,64,226,840,200,84,true,C.navy,'left',1.1);
    T(d.subtitle,68,462,1120,54,36,true,C.ink);
    T('Beyond the Personalization Paradox\nAuditing AI-Supported Learning',68,537,980,63,23,false,C.muted,'left',1.28);
    [['01','目的'],['02','权威'],['03','参与']].forEach((v,i)=>{L(1002,248+i*108,204);T(v[0],1002,264+i*108,51,36,20,true,C.blue);T(v[1],1064,255+i*108,148,58,38,true,C.navy);});
    L(64,637,1152);T('辛海洋 Tony Xin  ·  CocoRobo',64,660,780,36,26,true,C.navy);T('修订版 2.0 · 2026.09',910,667,306,29,18,false,C.muted,'right');break;
   }
   case 'writing':{
    const p=(a,x)=>{B(x,334,551,213,C.paper,6,C.line);T(a[0],x+25,354,495,41,28,true,C.navy);L(x+25,406,495);T(a[1],x+25,429,494,94,29);};p(d.left,64);p(d.right,665);note(d.bottom);break;
   }
   case 'sequence':{
    d.nodes.forEach((a,i)=>{let x=64+i*296;T('0'+(i+1),x,335,60,45,25,true,C.blue);T(a[0],x,391,260,56,36,true,C.navy);T(a[1],x,462,256,47,26);if(i<3)L(x+256,413,33,0,C.blue,2,true);});note(d.bottom);break;
   }
   case 'audit3':{
    d.cards.forEach((a,i)=>{let x=64+i*397;T('0'+(i+1),x,243,93,57,38,true,C.blue);L(x,313,358);T(a[0],x,338,369,43,31,true,C.navy);T(a[1],x,403,369,45,27,true);T(a[2],x,474,370,88,26,false,C.muted,'left',1.35);});note(d.bottom);break;
   }
   case 'math':{
    T('支持方式',82,323,405,35,23,true,C.muted);T('练习时有AI',583,323,230,36,23,true,C.muted,'center');T('随后无AI考试',908,323,281,36,23,true,C.muted,'center');
    d.rows.forEach((a,i)=>{let y=383+i*113;B(64,y-10,1152,104,i?C.paper:C.pale,4);T(a[0],82,y+1,410,40,28,true,C.navy);T(a[1],82,y+45,410,34,21,false,C.muted);T(a[2],570,y+4,255,70,43,true,C.blue,'center');T(a[3],858,y+12,347,68,i?27:43,true,C.navy,'center');});
    T('数值均相对无AI对照；百分比不是百分点。',66,604,1150,30,20,false,C.muted);break;
   }
   case 'physics':{
    d.rows.forEach((a,i)=>{let y=326+i*85;T(a[0],66,y+9,190,39,27,true,C.blue);T(a[1],265,y+7,425,42,28,true,C.navy);T(a[2],716,y+12,500,43,23,false,C.muted);L(64,y+70,1152);});note(d.bottom,617);break;
   }
   case 'goals':{
    [d.left,d.right].forEach((a,i)=>{let x=64+i*601;B(x,240,551,324,i?C.pale:C.paper,7,i?null:C.line);T(a[0],x+25,270,497,80,31,true,C.navy);T(a[1],x+25,363,497,87,29);T(a[2],x+25,475,497,67,23,false,C.muted,'left',1.35);});note(d.bottom);break;
   }
   case 'rubric':{
    d.rows.forEach((a,i)=>{let y=340+i*126;B(64,y,1152,104,i?C.pale:C.paper,5);T(a[0],83,y+27,246,51,29,true,C.navy);T(a[1],351,y+13,841,38,27,true);T(a[2],351,y+58,841,39,24,false,C.muted);});note(d.bottom);break;
   }
   case 'purpose':{
    d.rows.forEach((a,i)=>{let y=248+i*109;T(a[0],64,y+13,245,41,30,true,C.navy);T(a[1],324,y+4,890,43,28,true);T(a[2],324,y+53,888,41,27,false,C.blue);L(64,y+98,1152);});note(d.bottom);break;
   }
   case 'model':{
    B(64,334,330,230,C.pale,6);T('当前路径',85,354,285,34,22,true,C.muted);T('基础练习\n→ 继续基础练习',85,414,284,108,29,true,C.navy,'left',1.45);
    d.steps.forEach((a,i)=>{let y=323+i*83;T('0'+(i+1),443,y+9,57,39,23,true,C.blue);T(a[0],511,y+5,688,37,28,true,C.navy);T(a[1],511,y+46,688,45,23,false,C.ink);});note(d.bottom);break;
   }
   case 'authority':{
    T('决定',65,235,154,34,21,true,C.muted);T('谁承担什么',235,235,514,34,21,true,C.muted);T('怎样保留支持与责任',753,235,462,34,21,true,C.muted);
    d.rows.forEach((a,i)=>{let y=287+i*62;B(64,y-5,1152,58,i%2?C.white:C.pale,3);T(a[0],81,y+9,132,37,27,true,C.navy);T(a[1],235,y+9,498,43,24);T(a[2],753,y+9,459,43,23);});note(d.bottom,627);break;
   }
   case 'revision':{
    d.parts.forEach((a,i)=>{let y=240+i*111;T(a[0],64,y+11,255,39,27,true,i===2?C.teal:C.blue);B(327,y,889,i===2?112:94,i===2?C.pale:C.paper,5,i===2?null:C.line);T(a[1],349,y+18,844,i===2?92:70,28,i===2,C.ink,'left',1.3);});note(d.bottom,623);break;
   }
   case 'boundary':{
    [d.left,d.right].forEach((a,i)=>{let x=64+i*601;T(i?'互动很多':'示范完整',x,247,545,47,23,true,C.blue);T(a[0],x,309,546,80,31,true,C.navy);B(x,405,551,155,i?C.paper:C.pale,5,i?C.line:null);T(a[1],x+25,431,500,108,28,false,C.ink,'left',1.4);});note(d.bottom);break;
   }
   case 'disagreement':{
    d.parts.forEach((a,i)=>{let y=230+i*88;T(a[0],64,y+17,231,38,25,true,i===3?C.teal:C.blue);B(300,y+3,916,77,i>1?C.pale:C.paper,5,i>1?null:C.line);T(a[1],324,y+22,868,55,27,i===3);});note(d.bottom,624);break;
   }
   case 'loop':{
    const ps=[[64,235],[681,235],[681,438],[64,438]];
    d.nodes.forEach((a,i)=>{let [x,y]=ps[i];B(x,y,535,145,C.pale,6);T(a[0],x+23,y+19,488,43,31,true,C.navy);T(a[1],x+23,y+68,488,73,26);});
    L(607,306,63,0,C.blue,2,true);L(948,392,0,34,C.blue,2,true);L(671,504,-63,0,C.blue,2,true);L(329,428,0,-34,C.blue,2,true);note(d.bottom,629);break;
   }
   case 'khan':{
    d.rows.forEach((a,i)=>{let y=326+i*84;T(a[0],64,y+12,147,40,29,true,C.blue);T(a[1],236,y+1,980,40,28,true,C.navy);T(a[2],236,y+44,980,37,25,false,C.muted);L(64,y+77,1152);});note(d.bottom,627);break;
   }
   case 'utc':{
    d.nodes.forEach((a,i)=>{step(a[0],a[1],64+i*397,244,357,207);if(i<2)L(431+i*397,345,22,0,C.blue,2,true);});B(64,496,1152,69,C.pale,5);T(d.teacher,87,516,1106,47,28,true,C.navy);note(d.bottom);break;
   }
   case 'agents':{
    d.parts.forEach((a,i)=>{let y=328+i*91;T(a[0],64,y+12,233,41,26,true,i===2?C.teal:C.blue);B(311,y,905,77,i===2?C.pale:C.paper,5,i===2?null:C.line);T(a[1],335,y+19,858,53,27,i===2);});note(d.bottom,631);break;
   }
   case 'ui':{
    d.rows.forEach((a,i)=>{let y=326+i*86;T(a[0],64,y+8,175,42,29,true,C.blue);T(a[1],264,y+1,951,42,28,true,C.navy);T(a[2],264,y+47,951,40,25,false,C.muted);L(64,y+78,1152);});note(d.bottom,628);break;
   }
   case 'compare':{
    T('案例',64,242,307,35,22,true,C.muted);T('有价值的进展',383,242,318,35,22,true,C.muted);T('具体的改进问题',730,242,486,35,22,true,C.muted);
    d.rows.forEach((a,i)=>{let y=303+i*69;B(64,y-6,1152,64,i%2?C.white:C.pale,3);T(a[0],79,y+10,284,42,25,true,C.navy);T(a[1],384,y+10,322,42,24);T(a[2],730,y+10,477,50,24);});note(d.bottom,624);break;
   }
   case 'bottles':{
    d.conditions.forEach((a,i)=>{let x=90+i*270;T(a[0],x+7,317,174,40,25,true,C.navy,'center');B(x+27,374,150,179,C.white,12,C.navy);B(x+34,427-i*35,136,119+i*35,'#E2EDF4',3);B(x+20,362,164,14,C.navy,3);T(a[1],x-14,566,232,33,22,true,C.navy,'center');T(a[2],x+20,481-i*12,164,35,26,true,C.navy,'center');});
    B(689,321,527,267,C.pale,7);T(d.prompt,714,350,477,218,29,true,C.navy,'left',1.4);note(d.bottom,632);break;
   }
   case 'support':{
    d.parts.forEach((a,i)=>{let y=234+i*122;T(a[0],64,y+12,255,65,27,true,i===2?C.teal:C.blue);B(333,y,883,105,i===1?C.pale:C.paper,5,i===1?null:C.line);T(a[1],356,y+17,835,85,27,i===1,C.ink,'left',1.28);});note(d.bottom,631);break;
   }
   case 'enact':{
    d.rows.forEach((a,i)=>{let y=233+i*81;T('0'+(i+1),64,y+12,62,42,23,true,C.blue);T(a[0],143,y+9,281,50,27,true,C.navy);T(a[1],448,y+10,767,65,27,false,C.ink,'left',1.25);L(64,y+72,1152);});note(d.bottom,624);break;
   }
   case 'evidence':{
    d.nodes.forEach((a,i)=>{let x=64+i*296;T('0'+(i+1),x,265,80,48,26,true,C.blue);T(a[0],x,330,268,46,31,true,C.navy);B(x,401,263,165,C.pale,5);T(a[1],x+17,426,230,123,26,false,C.ink,'left',1.4);if(i<3)L(x+271,350,20,0,C.blue,2,true);});note(d.bottom,627);break;
   }
   case 'closing':{
    I(65,43,205);T('BEYOND THE PERSONALIZATION PARADOX',65,160,1130,35,21,true,C.blue);T(d.title,64,237,1152,157,58,true,C.navy,'left',1.32);
    [['目的','路通向哪里？'],['权威','谁能改变方向？'],['参与','学生亲自做什么？']].forEach((a,i)=>{let x=64+i*397;L(x,447,357);T(a[0],x,476,357,46,27,true,C.blue);T(a[1],x,535,371,53,30,true,C.navy);});note(d.bottom,634);T('25 / 28',1124,686,92,25,17,true,C.muted,'right');break;
   }
   case 'utcdata':{
    ['组别','分组人数','突击测试到场','到场者均分'].forEach((a,i)=>T(a,[83,347,605,984][i],265,[232,225,342,217][i],43,25,true,C.muted));
    d.rows.forEach((a,i)=>{let y=347+i*104;B(64,y-8,1152,95,i?C.paper:C.pale,4);a.forEach((t,j)=>T(t,[83,347,605,984][j],y+20,[232,225,342,217][j],50,j===3?35:29,true,j===3?C.blue:C.navy));});T('原研究报告 d = 1.04；非随机分组，且两组缺席比例差异较大。',64,581,1152,38,24,false,C.muted);note(d.bottom,635);break;
   }
   case 'versions':{
    d.rows.forEach((a,i)=>{let y=237+i*113;T(a[0],64,y+7,330,43,29,true,C.navy);T(a[1],64,y+58,330,37,21,false,C.muted);T(a[2],427,y+18,789,89,27,false,C.ink,'left',1.3);L(64,y+104,1152);});note(d.bottom,631);break;
   }
   case 'sources':{
    const rows=[['[M]','Looi & Xin · 核心论文稿','Beyond the Personalization Paradox\nAuditing AI-Supported Learning'],['[D]','补充研究讨论稿 · 2026-09-08','UTC、OpenMAIC 与 MAIC-UI 的比较审视'],['[1]','Bastani et al. · 2025 · PNAS','DOI: 10.1073/pnas.2422633122'],['[2]','Kestin et al. · 2025 · Scientific Reports','DOI: 10.1038/s41598-025-97652-6'],['[3]','Khan Academy · Khanmigo','公开设计说明；论文原有案例'],['[4]','Fidalgo-Blanco et al. · 2026 · RIED','DOI: 10.5944/ried.47210'],['[5–7]','MAIC / OpenMAIC / MAIC-UI','MAIC v1 · OpenMAIC v1.0.0 · MAIC-UI v1']];
    rows.forEach((a,i)=>{let y=230+i*54;T(a[0],64,y,107,34,21,true,C.blue);T(a[1],185,y,497,40,22,true,C.navy);T(a[2],710,y+1,506,46,18,false,C.muted,'left',1.15);if(i<6)L(64,y+48,1152);});T('正文25页＋附录3页。案例中的对话、数值情境与预期回答为设计示例，研究事实另行标明。',64,626,1152,51,21,false,C.muted);break;
   }
  }
  const refs=d.refs.map(k=>'['+k+'] '+content.refs[k].full+(content.refs[k].url?'\n'+content.refs[k].url:'')).join('\n\n');
  result.push({...d,background:C.white,elements:e,notes:(d.duration?'建议讲述：约'+d.duration+'秒。\n\n':'附录，按问答需要使用。\n\n')+d.notes+'\n\n【材料类别】'+d.type+'\n\n【来源】\n'+refs});
 }
 return result;
}
g.PP_BUILD=build;if(typeof module!=='undefined')module.exports=build;
})(typeof window!=='undefined'?window:globalThis);
