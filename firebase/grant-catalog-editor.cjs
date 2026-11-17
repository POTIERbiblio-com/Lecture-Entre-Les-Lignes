'use strict';
const admin = require('firebase-admin');
const UID = '3bNBt66aPRgd46TyJqIfrXvouGC3';
const EXPECTED_EMAIL = 'quentinmorel1912@gmail.com';
admin.initializeApp({credential:admin.credential.applicationDefault(),projectId:'lecture-entre-les-lignes'});
(async()=>{
 const auth=admin.auth();
 const user=await auth.getUser(UID);
 if((user.email||'').toLowerCase()!==EXPECTED_EMAIL)throw new Error('UID et adresse e-mail différents : attribution annulée.');
 const claims={...(user.customClaims||{}),catalogEditor:true};
 await auth.setCustomUserClaims(UID,claims);
 console.log('Rôle catalogEditor attribué à',user.email,'(',UID,'). Reconnexion requise.');
})().catch(error=>{console.error('Attribution impossible :',error.message);process.exitCode=1;});
