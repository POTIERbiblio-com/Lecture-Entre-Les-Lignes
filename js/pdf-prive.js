/* Accès aux PDF protégés : aucune clé serveur dans le navigateur. */
export async function ouvrirPdfPrive(bookId,{download=false}={}){
 const [{initializeApp,getApps},{getAuth}]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js')]);
 const app=getApps()[0]||initializeApp({apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'});
 const user=getAuth(app).currentUser;if(!user)throw Error('Connecte-toi pour accéder à ce livre.');
 const response=await fetch('https://cezgcoa nkoka.supabase.co/functions/v1/secure-account'.replace('cezgcoa nkoka','cezgcoaokwuobipwfffa'),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+await user.getIdToken()},body:JSON.stringify({action:'private-pdf',bookId:String(bookId)})});
 const result=await response.json();if(!response.ok)throw Error(result.error||'PDF indisponible');
 const url=new URL(result.url);if(url.protocol!=='https:'||url.hostname!=='cezgcoaokwuobipwfffa.supabase.co'||!url.pathname.includes('/storage/v1/object/sign/book-pdfs/'))throw Error('Adresse PDF non autorisée');
 if(download){const a=document.createElement('a');a.href=url.href;a.rel='noopener noreferrer';a.click()}else window.location.assign(url.href);
 return result;
}
