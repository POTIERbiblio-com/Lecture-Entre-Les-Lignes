import {auth,requestService} from './request-service.js';
const endpoint='https://cezgcoaokwuobipwfffa.supabase.co/functions/v1/secure-account';
const dateFormat=new Intl.DateTimeFormat('fr-FR',{dateStyle:'medium'});

export async function reviewThreads(ids) {
  if(!ids.length)return {threads:{},level:0};
  await auth.authStateReady();
  const account=auth.currentUser;
  if(account)return requestService('review-threads',{ids},account);
  const result=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'review-threads-public',ids})});
  if(!result.ok)throw Error('Impossible de charger les réactions.');
  return {...await result.json(),level:0};
}

export function discussion(id,initial,level,onChange) {
  const host=document.createElement('div');
  host.className='review-discussion';
  let state=initial,busy=false;
  const status=document.createElement('p');
  status.setAttribute('role','status');
  const like=document.createElement(level>=2?'button':'span');
  if(level>=2){
    like.type='button';like.className='btn secondary';
    like.onclick=()=>send({liked:!state.liked});
  }
  const list=document.createElement('div');
  host.append(like,list,status);
  let input,submit;
  if(level>=3) {
    const form=document.createElement('form');
    const label=document.createElement('label');
    label.textContent='Ton commentaire';
    input=document.createElement('textarea');input.required=true;input.maxLength=2000;input.rows=2;
    label.append(input);
    submit=document.createElement('button');submit.className='btn secondary';submit.textContent='Publier';
    form.append(label,submit);
    form.onsubmit=event=>{event.preventDefault();if(input.value.trim())void send({comment:input.value});};
    host.append(form);
  }
  function draw(){
    like.textContent=(level>=2&&state.liked?'♥ ':'♡ ')+state.likes+' j’aime';
    if(level>=2) {
      like.setAttribute('aria-pressed',String(state.liked));
      like.setAttribute('aria-label',(state.liked?'Retirer mon j’aime':'Ajouter un j’aime')+' · '+state.likes+' j’aime');
    }
    list.replaceChildren();
    if(state.totalComments) {
      const details=document.createElement('details');details.open=true;
      const summary=document.createElement('summary');summary.textContent=state.totalComments+' commentaire'+(state.totalComments===1?'':'s');
      details.append(summary);
      for(const comment of state.comments){
        const item=document.createElement('div');item.className='review-comment';
        const author=document.createElement('strong');author.textContent=comment.display_name;
        const date=document.createElement('time');date.dateTime=comment.created_at;date.textContent=dateFormat.format(new Date(comment.created_at));
        const text=document.createElement('p');text.className='pre-wrap';text.textContent=comment.body;
        item.append(author,' · ',date,text);details.append(item);
      }
      if(state.totalComments>state.comments.length){
        const more=document.createElement('button');more.type='button';more.className='btn secondary';
        more.textContent='Afficher les commentaires précédents';
        more.onclick=async()=>{
          more.disabled=true;
          try{
            const offset=state.offset??state.comments.length;
            const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'review-comments-page',reviewId:id,offset})});
            if(!response.ok)throw Error('Impossible de charger la suite.');
            const {comments}=await response.json();
            const known=new Set(state.comments.map(comment=>comment.id));
            state.comments.push(...comments.filter(comment=>!known.has(comment.id)));
            state.offset=offset+comments.length;
            if(comments.length<30)state.totalComments=state.comments.length;
            draw();
          }catch(error){status.textContent=error.message;}
          finally{more.disabled=false;}
        };
        details.append(more);
      }
      list.append(details);
    }
  }
  async function send(fields){
    if(busy)return;
    busy=true;if(submit)submit.disabled=true;if(level>=2)like.disabled=true;
    status.textContent='';
    try{
      const {threads}=await requestService('review-react',{reviewId:id,...fields});
      if(!threads[id])throw Error('Cette critique est indisponible.');
      state=threads[id];if(input&&fields.comment)input.value='';
      draw();onChange?.(state);
    }catch(error){status.textContent=error.message;}
    finally{busy=false;if(submit)submit.disabled=false;if(level>=2)like.disabled=false;}
  }
  draw();
  return host;
}
