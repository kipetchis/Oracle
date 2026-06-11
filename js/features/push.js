// ── ORACLE PUSH NOTIFICATIONS (FCM) ────────────────────────────────────────
// Demande la permission au bon moment, enregistre le token FCM dans Firestore,
// et gère les notifications reçues quand l'app est ouverte.
// Prérequis : firebase-messaging-compat.js chargé, clé VAPID ci-dessous.

// ⚠️ COLLE ICI ta clé VAPID (Firebase Console → Paramètres du projet →
// Cloud Messaging → Certificats Web Push → "Paire de clés")
const PUSH_VAPID_KEY = 'BG_23oAjrfq5PdkuhP_Vp0HfdiEEnZ2O-cBhXMFIZteuOQG_E227c7FNj2W9gCLQT7LfXWQijqzQEC8rXbFQT5w';

// Heure locale par défaut d'envoi de la notification quotidienne
const PUSH_DEFAULT_LOCAL_HOUR = 9;

(function(){
  const LS_FLAGS = 'oracle_push'; // JSON : {enabled, prompted, token}

  function _flags(){
    try { return JSON.parse(localStorage.getItem(LS_FLAGS)) || {}; }
    catch(e){ return {}; }
  }
  function _setFlags(patch){
    const f = Object.assign(_flags(), patch);
    try { localStorage.setItem(LS_FLAGS, JSON.stringify(f)); } catch(e){}
    return f;
  }

  function _supported(){
    return typeof firebase !== 'undefined'
      && firebase.messaging
      && firebase.messaging.isSupported
      && firebase.messaging.isSupported()
      && 'Notification' in window
      && 'serviceWorker' in navigator;
  }

  // Heure UTC correspondant à l'heure locale souhaitée (pour le cron du Worker)
  function _utcHour(localHour){
    const offsetMin = new Date().getTimezoneOffset(); // minutes à AJOUTER au local pour obtenir UTC
    return ((localHour * 60 + offsetMin) / 60 % 24 + 24) % 24 | 0;
  }

  async function _saveToken(token){
    if(typeof fbDb === 'undefined' || !fbDb) return;
    const lang = (typeof state !== 'undefined' && state.lang) ? state.lang : 'fr';
    await fbDb.collection('pushTokens').doc(token).set({
      token: token,
      lang: lang,
      utcHour: _utcHour(PUSH_DEFAULT_LOCAL_HOUR),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      updated: Date.now()
    }, { merge: true });
  }

  async function enablePush(){
    if(!_supported()){
      if(typeof showToast === 'function') showToast(_t('Notifications non disponibles sur cet appareil','Notificaciones no disponibles en este dispositivo','Notifications unavailable on this device'));
      return false;
    }
    try{
      const perm = await Notification.requestPermission();
      _setFlags({ prompted: true });
      if(perm !== 'granted'){
        if(typeof showToast === 'function') showToast(_t('Notifications refusées','Notificaciones rechazadas','Notifications declined'));
        return false;
      }
      const reg = await navigator.serviceWorker.getRegistration('/Oracle/');
      const messaging = firebase.messaging();
      const token = await messaging.getToken({
        vapidKey: PUSH_VAPID_KEY,
        serviceWorkerRegistration: reg
      });
      if(!token) throw new Error('no token');
      await _saveToken(token);
      _setFlags({ enabled: true, token: token });
      if(typeof showToast === 'function') showToast(_t('🔮 L\'Oracle te parlera chaque jour !','🔮 ¡El Oráculo te hablará cada día!','🔮 The Oracle will speak to you daily!'));
      return true;
    }catch(e){
      console.warn('[push] enable error:', e);
      if(typeof showToast === 'function') showToast(_t('Erreur d\'activation des notifications','Error al activar las notificaciones','Notification setup error'));
      return false;
    }
  }

  async function disablePush(){
    const f = _flags();
    try{
      if(f.token && typeof fbDb !== 'undefined' && fbDb){
        await fbDb.collection('pushTokens').doc(f.token).delete().catch(()=>{});
      }
      if(_supported()){
        await firebase.messaging().deleteToken().catch(()=>{});
      }
    }catch(e){ console.warn('[push] disable error:', e); }
    _setFlags({ enabled: false, token: null });
    if(typeof showToast === 'function') showToast(_t('Notifications désactivées','Notificaciones desactivadas','Notifications disabled'));
  }

  // Les tokens FCM tournent : on rafraîchit l'enregistrement à chaque ouverture
  async function _refreshIfEnabled(){
    const f = _flags();
    if(!f.enabled || !_supported() || Notification.permission !== 'granted') return;
    try{
      const reg = await navigator.serviceWorker.getRegistration('/Oracle/');
      const token = await firebase.messaging().getToken({
        vapidKey: PUSH_VAPID_KEY,
        serviceWorkerRegistration: reg
      });
      if(token){
        if(f.token && f.token !== token && typeof fbDb !== 'undefined' && fbDb){
          fbDb.collection('pushTokens').doc(f.token).delete().catch(()=>{});
        }
        await _saveToken(token);
        _setFlags({ token: token });
      }
    }catch(e){ /* silencieux : pas bloquant */ }
  }

  // Notification reçue pendant que l'app est ouverte → simple toast
  function _wireForeground(){
    if(!_supported()) return;
    try{
      firebase.messaging().onMessage(function(payload){
        const d = (payload && payload.data) || {};
        if(typeof showToast === 'function' && d.body) showToast('🔮 ' + d.body);
      });
    }catch(e){}
  }

  // ── Bannière d'invitation (après 10 faits lus, une seule fois) ──
  function _maybeShowPrompt(){
    const f = _flags();
    if(f.prompted || f.enabled) return;
    if(!_supported() || Notification.permission !== 'default') return;
    if(typeof state === 'undefined' || !state.read || (state.read.total||0) < 10) return;
    if(document.getElementById('pushPromptBanner')) return;

    const div = document.createElement('div');
    div.id = 'pushPromptBanner';
    div.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:rgba(14,16,32,.97);border:1px solid rgba(140,160,255,.35);border-radius:16px;padding:16px 18px;width:min(92vw,360px);box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:Montserrat,sans-serif;';
    const msg = _t('Veux-tu que l\'Oracle te parle chaque jour ? Reçois ton fait quotidien en notification.',
                   '¿Quieres que el Oráculo te hable cada día? Recibe tu dato diario como notificación.',
                   'Want the Oracle to speak to you daily? Get your daily fact as a notification.');
    const yes = _t('Oui, je veux !','¡Sí, quiero!','Yes please!');
    const later = _t('Plus tard','Más tarde','Later');
    div.innerHTML = '<div style="font-size:.86rem;color:#dfe3ff;line-height:1.45;margin-bottom:12px;">🔮 ' + msg + '</div>'
      + '<div style="display:flex;gap:10px;">'
      + '<button id="pushPromptYes" style="flex:1;padding:10px 0;border:none;border-radius:10px;background:linear-gradient(135deg,#6b7cff,#9b6bff);color:#fff;font-size:.82rem;cursor:pointer;font-family:inherit;">' + yes + '</button>'
      + '<button id="pushPromptLater" style="flex:1;padding:10px 0;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:none;color:rgba(255,255,255,.6);font-size:.82rem;cursor:pointer;font-family:inherit;">' + later + '</button>'
      + '</div>';
    document.body.appendChild(div);
    document.getElementById('pushPromptYes').onclick = function(){
      div.remove();
      enablePush();
    };
    document.getElementById('pushPromptLater').onclick = function(){
      _setFlags({ prompted: true });
      div.remove();
    };
  }

  // Attendre que Firebase soit initialisé (chargé dynamiquement dans oracle.html)
  let _tries = 0;
  const _initTimer = setInterval(function(){
    _tries++;
    if(typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length){
      clearInterval(_initTimer);
      _wireForeground();
      _refreshIfEnabled();
      // Vérifie périodiquement si l'invitation doit s'afficher (10 faits lus)
      setInterval(_maybeShowPrompt, 15000);
      setTimeout(_maybeShowPrompt, 3000);
    } else if(_tries > 60){
      clearInterval(_initTimer); // Firebase indisponible : on abandonne silencieusement
    }
  }, 500);

  window.oraclePush = { enable: enablePush, disable: disablePush, isEnabled: function(){ return !!_flags().enabled; } };
})();
