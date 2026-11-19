import {createRemoteJWKSet,jwtVerify} from 'https://esm.sh/jose@5.9.6';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.49.4';
const jwks=createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const cors={'Access-Control-Allow-Origin':'https://potierbiblio-com.github.io','Access-Control-Allow-Headers':'authorization,content-type,apikey','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json'};
const json=(x:any,status=200)=>new Response(JSON.stringify(x),{status,headers:cors});
const prices:Record<string,string>={decouverte:'price_1UdDq83kaCHShBmDpPAaPTNA',passion:'price_1UdDqC3kaCHShBmD2QT86CeB',illimite:'price_1UdDqG3kaCHShBmDZZpASTUf'};
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 try{
  const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');
  if(!token)return json({error:'Connexion requise'},401);
  const {payload}=await jwtVerify(token,jwks,{issuer:'https://securetoken.google.com/lecture-entre-les-lignes',audience:'lecture-entre-les-lignes',algorithms:['RS256']});
  const uid=payload.sub;
  if(!uid||uid.length>128)return json({error:'Invalid account'},401);
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const body=await req.json();const action=body.action;
  if(action==='private-pdf'){const bookId=body.bookId;if(typeof bookId!=='string'||bookId.length>120)return json({error:'Livre invalide'},400);const bookQuery=db.from('books').select('id,pdf_path,published');const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(bookId);const {data:book,error:bookError}=await (uuid?bookQuery.eq('id',bookId):bookQuery.eq('original_page','livre-'+bookId+'.html')).maybeSingle();if(bookError)throw bookError;if(!book?.published||!book.pdf_path)return json({error:'PDF privé indisponible'},404);const {data:rule,error:ruleError}=await db.from('book_access_levels').select('access_level,hidden').eq('book_id',String(book.id)).maybeSingle();if(ruleError)throw ruleError;if(rule?.hidden)return json({error:'Livre indisponible'},404);
 const {data:moderation,error:moderationError}=await db.from('catalogue_moderation').select('access_level,hidden,deleted').eq('book_id','db-'+String(book.id)).maybeSingle();
 if(moderationError)throw moderationError;
 if(moderation?.hidden||moderation?.deleted)return json({error:'Livre masqué ou retiré'},404);const {data:billing,error:billingError}=await db.from('firebase_billing').select('plan,status').eq('firebase_uid',uid).maybeSingle();if(billingError)throw billingError;const levels:Record<string,number>={free:0,decouverte:1,passion:2,illimite:3};const level=['active','trialing'].includes(billing?.status)?levels[billing?.plan]||0:0;if(level<Math.max(rule?.access_level??0,moderation?.access_level??0))return json({error:'Abonnement requis pour ce livre'},403);const {data:signed,error:signedError}=await db.storage.from('book-pdfs').createSignedUrl(book.pdf_path,60);if(signedError)throw signedError;const {data:reserved,error:quotaError}=await db.rpc('reserve_firebase_download',{p_uid:uid,p_book:String(book.id),p_plan:level===0?'free':billing!.plan});if(quotaError)throw quotaError;if(!reserved)return json({error:'Quota de téléchargements atteint pour ce livre'},403);return json({url:signed.signedUrl,expiresIn:60});}
  if(action==='read'||action==='write'){
   const table=body.kind==='carnet'?'firebase_private_carnets':body.kind==='collections'?'firebase_private_collections':body.kind==='reader'?'firebase_private_readers':body.kind==='premium'?'firebase_private_premium':null;
   if(!table)return json({error:'Unknown data type'},400);
   if(action==='read'){const {data,error}=await db.from(table).select('data').eq('firebase_uid',uid).maybeSingle();if(error)throw error;return json({data:data?.data??null})}
   if(!body.data||typeof body.data!=='object'||Array.isArray(body.data)||JSON.stringify(body.data).length>500000)return json({error:'Invalid data'},400);
   // Le carnet personnel de base doit être accessible à tous les comptes, même gratuits.
   const {error}=await db.from(table).upsert({firebase_uid:uid,data:body.data,updated_at:new Date().toISOString()},{onConflict:'firebase_uid'});if(error)throw error;return json({ok:true});
  }

  // Livre proposé : stockage privé et suivi de la réponse sur le compte Firebase.
  const isAdmin=payload.email_verified===true&&['quentinmorel1912@gmail.com','juliepotier2006@gmail.com'].includes(String(payload.email||'').toLowerCase());
  if(action==='requests-list'){
    const q=db.from('book_requests_v2').select('*').order('created_at',{ascending:false}).limit(300);
    const {data,error}=await (body.admin===true&&isAdmin?q:q.eq('firebase_uid',uid));
    if(error)throw error;
    return json({requests:data??[]});
  }
  if(action==='requests-upload'){
    const type=body.fileType;
    const mime=body.mime;
    const ext=type==='cover'?({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[mime]):mime==='application/pdf'?'pdf':null;
    if(!ext||!['cover','pdf'].includes(type))return json({error:'Format de fichier non accepté'},400);
    const fileId=crypto.randomUUID();
    const path=uid+'/'+fileId+'.'+ext;
    const {data,error}=await db.storage.from('book-request-files').createSignedUploadUrl(path);
    if(error)throw error;
    return json({path,token:data.token});
  }
  if(action==='requests-create'){
    const d=body.data;
    if(!d||typeof d!=='object'||Array.isArray(d))return json({error:'Proposition invalide'},400);
    const title=String(d.title||'').trim(),author=String(d.author||'').trim();
    if(!title||title.length>200||author.length>160)return json({error:'Titre ou auteur invalide'},400);
    const fields=['genre','subgenre','edition','publicationDate','price','isbn','referenceUrl','summary','details'];
    const limits:Record<string,number>={genre:100,subgenre:100,edition:160,publicationDate:50,price:50,isbn:30,referenceUrl:500,summary:2500,details:3000};
    const clean:any={};
    for(const field of fields){clean[field]=String(d[field]||'').trim();if(clean[field].length>limits[field])return json({error:'Champ trop long : '+field},400)}
    if(clean.referenceUrl&&!/^https:\/\/[^ ]+$/.test(clean.referenceUrl))return json({error:'Lien invalide'},400);
    const coverPath=String(body.coverPath||''),pdfPath=String(body.pdfPath||''),pdfName=String(body.pdfName||'').slice(0,180);
    if(coverPath&&(!coverPath.startsWith(uid+'/')||!/\.(jpg|png|webp)$/.test(coverPath)))return json({error:'Chemin couverture invalide'},400);
    if(pdfPath&&(!pdfPath.startsWith(uid+'/')||!pdfPath.endsWith('.pdf')))return json({error:'Chemin PDF invalide'},400);
    const dayAgo=new Date(Date.now()-86400000).toISOString();
    const {count,error:countError}=await db.from('book_requests_v2').select('id',{head:true,count:'exact'}).eq('firebase_uid',uid).gte('created_at',dayAgo);
    if(countError)throw countError;
    if((count||0)>=15)return json({error:'Limite de 15 propositions par jour atteinte'},429);
    const {data,error}=await db.from('book_requests_v2').insert({
      firebase_uid:uid,requester_email:String(payload.email||''),title,author,details:clean,cover_path:coverPath,pdf_path:pdfPath,pdf_name:pdfName
    }).select('id').single();
    if(error)throw error;
    return json({ok:true,id:data.id});
  }
  if(action==='requests-reply'){
    if(!isAdmin)return json({error:'Accès administrateur refusé'},403);
    const id=String(body.id||'');
    if(!/^[0-9a-f-]{36}$/i.test(id))return json({error:'Demande invalide'},400);
    const status=String(body.status||''),reason=String(body.reason||''),message=String(body.message||'').trim();
    if(!['pending','validated','unresolved'].includes(status)||!['','missing_details','pdf_unavailable','other'].includes(reason)||message.length>3000)return json({error:'Réponse invalide'},400);
    const {data,error}=await db.from('book_requests_v2').update({status,reason,admin_message:message,reviewed_by:uid,reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id).select('id').maybeSingle();
    if(error)throw error;
    if(!data)return json({error:'Demande introuvable'},404);
    return json({ok:true});
  }
  if(action==='requests-file'){
    const id=String(body.id||''),type=body.fileType;
    if(!/^[0-9a-f-]{36}$/i.test(id)||!['cover','pdf'].includes(type))return json({error:'Fichier invalide'},400);
    const {data,error}=await db.from('book_requests_v2').select('firebase_uid,cover_path,pdf_path').eq('id',id).maybeSingle();
    if(error)throw error;
    if(!data||(!isAdmin&&data.firebase_uid!==uid))return json({error:'Accès refusé'},403);
    const path=type==='cover'?data.cover_path:data.pdf_path;
    if(!path)return json({error:'Pas de pièce jointe'},404);
    const {data:signed,error:signedError}=await db.storage.from('book-request-files').createSignedUrl(path,120);
    if(signedError)throw signedError;
    return json({url:signed.signedUrl});
  }
  if(action==='catalogue-moderate'){
    if(!isAdmin)return json({error:'Accès administrateur refusé'},403);
    const bookId=String(body.bookId||'').trim();
    if(!bookId||bookId.length>150||!(/^[a-zA-Z0-9_-]+$/.test(bookId)))return json({error:'Identifiant livre invalide'},400);
    const level=Number(body.level);
    if(!Number.isInteger(level)||level<0||level>3||typeof body.hidden!=='boolean'||typeof body.deleted!=='boolean')return json({error:'Paramètres invalides'},400);
    const {error}=await db.from('catalogue_moderation').upsert({book_id:bookId,hidden:body.hidden,deleted:body.deleted,access_level:level,updated_by:uid,updated_at:new Date().toISOString()},{onConflict:'book_id'});
    if(error)throw error;
    return json({ok:true});
  }

  if(action==='status'){const {data,error}=await db.from('firebase_billing').select('plan,status,current_period_end,cancel_at_period_end').eq('firebase_uid',uid).maybeSingle();if(error)throw error;return json({subscription:data??{plan:'free',status:'inactive'}})}
  if(action==='checkout'||action==='portal'){
   const secret=Deno.env.get('STRIPE_SECRET_KEY');if(!secret||!secret.startsWith('sk_test_'))return json({error:'Paiement test non configuré sur le serveur'},503);
   const stripe=async(path:string,form:URLSearchParams)=>{const r=await fetch('https://api.stripe.com/v1/'+path,{method:'POST',headers:{Authorization:'Bearer '+secret,'Content-Type':'application/x-www-form-urlencoded'},body:form});const v=await r.json();if(!r.ok)throw Error(v.error?.message||'Stripe error');return v};
   const {data:existing,error:lookupError}=await db.from('firebase_billing').select('stripe_customer_id').eq('firebase_uid',uid).maybeSingle();if(lookupError)throw lookupError;
   let customer=existing?.stripe_customer_id;
   if(!customer){const f=new URLSearchParams({description:'Entre les lignes account', 'metadata[firebase_uid]':uid});if(typeof payload.email==='string')f.set('email',payload.email);const created=await stripe('customers',f);customer=created.id;const {error}=await db.from('firebase_billing').upsert({firebase_uid:uid,stripe_customer_id:customer},{onConflict:'firebase_uid'});if(error)throw error}
   if(action==='portal'){const result=await stripe('billing_portal/sessions',new URLSearchParams({customer,return_url:'https://potierbiblio-com.github.io/Lecture-Entre-Les-Lignes/le-cercle.html'}));return json({url:result.url})}
   const price=prices[body.plan];if(!price)return json({error:'Unknown plan'},400);const {data:billing,error:billingError}=await db.from('firebase_billing').select('status,stripe_subscription_id').eq('firebase_uid',uid).maybeSingle();if(billingError)throw billingError;if(billing?.stripe_subscription_id&&['active','trialing','past_due','unpaid','incomplete','paused'].includes(billing.status))return json({error:'Un abonnement existe déjà. Utilise « Gérer mon abonnement » pour éviter une double souscription.'},409);
   const f=new URLSearchParams({mode:'subscription',customer,'line_items[0][price]':price,'line_items[0][quantity]':'1',success_url:'https://potierbiblio-com.github.io/Lecture-Entre-Les-Lignes/le-cercle.html?checkout=success',cancel_url:'https://potierbiblio-com.github.io/Lecture-Entre-Les-Lignes/le-cercle.html?checkout=cancel','client_reference_id':uid,'subscription_data[metadata][firebase_uid]':uid,'allow_promotion_codes':'true'});
   const session=await stripe('checkout/sessions',f);return json({url:session.url});
  }
  return json({error:'Unknown action'},400);
 }catch(e){console.error('secure-account',e);return json({error:'Action impossible. Vérifie ta connexion ou réessaie.'},500)}
});