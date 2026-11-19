const colorParts=value=>/^#[0-9a-f]{6}$/i.test(value)?[1,3,5].map(i=>parseInt(value.slice(i,i+2),16)/255):[1,.9,0];
const marksOn=(marks,page)=>marks.filter(mark=>Number(mark.pageNumber||1)===page).flatMap(mark=>(mark.rects||[]).map(rect=>({rect,color:mark.color})));

export async function exportAnnotated(pdf,marks,format,progress){
 if(format==='pdf'){
  progress('Préparation du PDF annoté…');
  const {PDFDocument,rgb}=await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm');
  const output=await PDFDocument.load(await pdf.getData());
  for(const [index,page] of output.getPages().entries()){
   const entries=marksOn(marks,index+1);
   if(!entries.length)continue;
   const source=await pdf.getPage(index+1),view=source.getViewport({scale:1});
   for(const {rect,color} of entries){
    const first=view.convertToPdfPoint(rect.x*view.width,rect.y*view.height);
    const last=view.convertToPdfPoint((rect.x+rect.w)*view.width,(rect.y+rect.h)*view.height);
    page.drawRectangle({x:Math.min(first[0],last[0]),y:Math.min(first[1],last[1]),width:Math.abs(last[0]-first[0]),height:Math.abs(last[1]-first[1]),color:rgb(...colorParts(color)),opacity:.32});
   }
  }
  return new Blob([await output.save()],{type:'application/pdf'});
 }
 const {Document,Packer,Paragraph,ImageRun}=await import('https://cdn.jsdelivr.net/npm/docx@9.5.1/+esm');
 const contents=[];
 const canvas=document.createElement('canvas'),context=canvas.getContext('2d');
 for(let index=1;index<=pdf.numPages;index++){
  progress('Préparation du Word · page '+index+' sur '+pdf.numPages);
  const page=await pdf.getPage(index),view=page.getViewport({scale:1});
  const viewport=page.getViewport({scale:Math.min(1,700/Math.max(view.width,view.height))});
  canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
  await page.render({canvasContext:context,viewport}).promise;
  for(const {rect,color} of marksOn(marks,index)){
   context.globalAlpha=.32;context.fillStyle='rgb('+colorParts(color).map(v=>Math.round(v*255)).join(',')+')';
   context.fillRect(rect.x*canvas.width,rect.y*canvas.height,rect.w*canvas.width,rect.h*canvas.height);
  }
  context.globalAlpha=1;
  const image=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.82));
  if(!image)throw Error('Une page du PDF n’a pas pu être exportée.');
  const ratio=Math.min(475/canvas.width,640/canvas.height,1);
  contents.push(new Paragraph({pageBreakBefore:index>1,children:[new ImageRun({type:'jpg',data:new Uint8Array(await image.arrayBuffer()),transformation:{width:Math.round(canvas.width*ratio),height:Math.round(canvas.height*ratio)}})]}));
 }
 canvas.width=0;canvas.height=0;
 return Packer.toBlob(new Document({sections:[{children:contents}]}));
}