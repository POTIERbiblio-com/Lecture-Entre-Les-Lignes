const el=document.getElementById('ell-subscription-status');
try{
 const {initializeApp,getApps}=await import('https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js');
 const {getAuth,onAuthStateChanged}=await import('https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js');
 const app=getApps()[0]||initializeApp({apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'});
 onAuthStateChanged(getAuth(app),user=>{el.textContent=user?'Compte connecté : '+(user.email||'utilisateur Firebase')+'. Aucune formule payante vérifiée pour ce compte.':'Tu n’es pas connecté. Connecte-toi pour retrouver ton espace personnel.';});
}catch(e){el.textContent='Impossible de vérifier la connexion actuellement.'}
