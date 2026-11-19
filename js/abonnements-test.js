import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
const endpoint='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
const app=getApps()[0]||initializeApp({apiKey:'AIzaSyCHrFPytJh3voKVEV1ZZdgcwTyOCl03dNY',authDomain:'lecture-entre-les-lignes.firebaseapp.com',projectId:'lecture-entre-les-lignes',appId:'1:876044393565:web:da359169bccbfc709081b4'});
const auth=getAuth(app);
const root=document.getElementById('ell-billing-actions');
const status=document.getElementById('ell-subscription-status');
const choices=[...document.querySelectorAll('[data-subscribe-plan]')];
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
let redirecting=false;
function button(user,label,action,extras,allowedHosts,choice){
  const b=choice||document.createElement('button');
  if(!choice){
    b.type='button';
    b.textContent=label;
    b.className='subscribe-button';
    root.append(b);
  }
  b.onclick=async event=>{
    event.preventDefault();
    if(redirecting) return;
    redirecting=true;
    b.setAttribute('aria-busy','true');
    const feedback=choice?.parentElement.querySelector('[data-subscribe-feedback]')||status;
    feedback.textContent=action==='portal'?'Ouverture de la gestion Stripe…':'Ouverture du paiement sécurisé Stripe…';
    try{
      const {url}=await request(user,action,extras);
      if(auth.currentUser?.uid!==user.uid) return;
      if(!url) throw Error('Lien Stripe indisponible.');
      const destination=new URL(url);
      if(destination.protocol!=='https:'||!allowedHosts.includes(destination.hostname)) throw Error('Lien Stripe indisponible.');
      location.assign(destination.href);
    }catch(e){
      if(auth.currentUser?.uid===user.uid){
        feedback.textContent=e.message;
      }
    }finally{
      redirecting=false;
      b.removeAttribute('aria-busy');
    }
  };
}

function showBlocked(message){
  status.textContent=message;
  for(const choice of choices)choice.onclick=event=>{
    event.preventDefault();
    const feedback=choice.parentElement.querySelector('[data-subscribe-feedback]');
    if(feedback)feedback.textContent=message;
  };
}

onAuthStateChanged(auth,async user=>{
  root.replaceChildren();
  choices.forEach(choice=>choice.textContent='Souscrire');
  for(const choice of choices){
    const feedback=choice.parentElement.querySelector('[data-subscribe-feedback]');
    if(feedback)feedback.textContent='';
    choice.onclick=user?event=>{
      event.preventDefault();
      if(feedback)feedback.textContent='Vérification de ton compte en cours…';
    }:null;
    choice.href='connexion-firebase.html';
  }
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
      choices.forEach(choice=>choice.textContent='Voir mes accès');
      showBlocked(status.textContent);
      return;
    }
    if(!user.emailVerified){
      showBlocked('Vérifie ton adresse e-mail pour accéder à la souscription.');
      return;
    }
    if(returned==='success'&&!subscription.access_level){
      showBlocked('Confirmation Stripe en attente. Recharge la page pour vérifier l’activation.');
      return;
    }
    if(returned==='cancel') status.textContent+=' · Souscription annulée.';
    if(subscription.access_level||['past_due','unpaid','incomplete','paused'].includes(subscription.status)){
      for(const choice of choices){
        choice.textContent='Gérer mon abonnement';
        button(user,'Gérer mon abonnement','portal',{},['billing.stripe.com'],choice);
      }
      return;
    }
    for(const plan of plans){
      if(!names[plan.plan]) continue;
      const choice=choices.find(link=>link.dataset.subscribePlan===plan.plan);
      button(user,'Choisir '+names[plan.plan]+' · '+euros.format(plan.monthly_eur_cents/100)+'/mois','checkout',{plan:plan.plan},['checkout.stripe.com'],choice);
    }
  }catch(e){
    if(auth.currentUser?.uid===user.uid) showBlocked('Vérification impossible. '+e.message);
  }
});
