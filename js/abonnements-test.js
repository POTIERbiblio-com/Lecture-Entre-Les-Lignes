import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
const endpoint='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
const app=getApps()[0]||initializeApp({apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'});
const auth=getAuth(app);
const root=document.getElementById('ell-billing-actions');
const status=document.getElementById('ell-subscription-status');
const names={decouverte:'Découverte',passion:'Passion',illimite:'Illimité',free:'Gratuit'};
const euros=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'});
const returned=new URLSearchParams(location.search).get('checkout');

async function request(user,action,extras={}){
  if(auth.currentUser?.uid!==user.uid) throw Error('Le compte a changé. Réessaie depuis ton espace.');
  const response=await fetch(endpoint,{method:'POST',headers:{Authorization:'Bearer '+await user.getIdToken(),'Content-Type':'application/json'},body:JSON.stringify({action,...extras})});
  const data=await response.json();
  if(!response.ok) throw Error(data.error||'Service indisponible');
  return data;
}
function button(user,label,action,extras,allowedHosts){
  const b=document.createElement('button');
  b.type='button';
  b.textContent=label;
  b.style.cssText='margin:8px;padding:12px 18px;border-radius:20px;background:#924d75;color:white;border:0;cursor:pointer';
  b.onclick=async()=>{
    const buttons=Array.from(root.querySelectorAll('button'));
    buttons.forEach(item=>item.disabled=true);
    try{
      const {url}=await request(user,action,extras);
      if(auth.currentUser?.uid!==user.uid) return;
      if(!url) throw Error('Lien Stripe indisponible.');
      const destination=new URL(url);
      if(destination.protocol!=='https:'||!allowedHosts.includes(destination.hostname)) throw Error('Lien Stripe indisponible.');
      location.assign(destination.href);
    }catch(e){
      if(auth.currentUser?.uid===user.uid) status.textContent=e.message;
      buttons.forEach(item=>item.disabled=false);
    }
  };
  root.append(b);
}

onAuthStateChanged(auth,async user=>{
  root.replaceChildren();
  if(!user){
    status.textContent='Connecte-toi pour consulter et gérer ton abonnement.';
    const link=document.createElement('a');
    link.href='connexion-firebase.html';
    link.textContent='Se connecter';
    root.append(link);
    return;
  }
  status.textContent='Vérification de ton compte…';
  try{
    const [{plans,liveCheckoutReady},initial]=await Promise.all([request(user,'pricing-list'),request(user,'status')]);
    let {subscription}=initial;
    if(returned==='success'&&liveCheckoutReady&&!subscription.access_level){
      status.textContent='En attente de la confirmation Stripe…';
      for(let attempt=0;attempt<10&&!subscription.access_level;attempt++){
        await new Promise(resolve=>setTimeout(resolve,1500));
        if(auth.currentUser?.uid!==user.uid) return;
        ({subscription}=await request(user,'status'));
      }
    }
    if(auth.currentUser?.uid!==user.uid) return;
    for(const plan of plans){
      for(const price of document.querySelectorAll('[data-plan-price="'+plan.plan+'"]')){
        price.firstChild.textContent=euros.format(plan.monthly_eur_cents/100)+' ';
      }
    }
    status.textContent='Formule active · '+(names[subscription.access_plan]||names.free);
    if(subscription.complimentary){
      status.textContent='Toutes les fonctionnalités sont activées directement pour ton compte.';
      document.querySelectorAll('.premium-hero, .feature-grid, #comparatif, .reassurance').forEach(section=>section.hidden=true);
      return;
    }
    if(!user.emailVerified){
      status.textContent='Vérifie ton adresse e-mail pour accéder à la souscription.';
      return;
    }
    if(!liveCheckoutReady){
      status.textContent+=' · Les paiements sont temporairement indisponibles.';
      return;
    }
    if(returned==='success'&&!subscription.access_level){
      status.textContent='Confirmation Stripe en attente. Recharge la page pour vérifier l’activation.';
      return;
    }
    if(returned==='cancel') status.textContent+=' · Souscription annulée.';
    if(subscription.access_level||['past_due','unpaid','incomplete','paused'].includes(subscription.status)){
      button(user,'Gérer mon abonnement','portal',{},['billing.stripe.com']);
      return;
    }
    for(const plan of plans){
      if(!names[plan.plan]) continue;
      button(user,'Choisir '+names[plan.plan]+' · '+euros.format(plan.monthly_eur_cents/100)+'/mois','checkout',{plan:plan.plan},['checkout.stripe.com']);
    }
  }catch(e){
    if(auth.currentUser?.uid===user.uid) status.textContent='Vérification impossible. '+e.message;
  }
});
