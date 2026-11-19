const share=document.getElementById('share-reading');
if(share)share.addEventListener('click',async()=>{
 const url=new URL(location.href);url.hash='reader-content';
 const data={title:'Une lecture sur Entre les lignes',text:'Découvre cette lecture sur Entre les lignes.',url:url.href};
 try{
  if(navigator.share)await navigator.share(data);
  else{await navigator.clipboard.writeText(url.href);document.getElementById('share-feedback').textContent='Lien de lecture copié.';}
 }catch(error){if(error.name!=='AbortError')document.getElementById('share-feedback').textContent='Tu peux copier le lien depuis la barre d’adresse.';}
});