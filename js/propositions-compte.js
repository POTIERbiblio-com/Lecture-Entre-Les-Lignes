import {auth,onAccount,requestService} from './request-service.js?v=decisions-20261119';
const panel=document.getElementById('admin-proposals-shortcut');
const count=document.getElementById('proposals-count');
let generation=0;
onAccount(async account=>{
 const turn=++generation;
 panel.hidden=true;
 if(account?.email?.toLowerCase()!=='quentinmorel1912@gmail.com')return;
 panel.hidden=false;
 if(!account.emailVerified)return;
 try{
  const {requests}=await requestService('requests-list',{admin:true},account);
  if(turn!==generation||auth.currentUser?.uid!==account.uid||!count)return;
  const pending=requests.filter(request=>request.status==='pending').length;
  count.textContent=pending+' en attente';
 }catch(error){if(turn===generation&&count)count.textContent=error.message;}
});