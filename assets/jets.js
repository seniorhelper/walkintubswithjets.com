(function(){
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
  var nav=document.querySelector('.gnav'), btn=document.querySelector('.gnav-btn');
  if(nav&&btn){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});}
  document.querySelectorAll('[data-print]').forEach(function(b){b.addEventListener('click',function(){window.print();});});
})();
// Shared number helpers for the calculators
window.WTJ={
  num:function(id){var el=document.getElementById(id);if(!el)return NaN;var v=parseFloat(String(el.value).replace(/[^0-9.\-]/g,''));return v;},
  money:function(v){if(!isFinite(v))return '—';return v<1?('$'+v.toFixed(2)):('$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));},
  fx:function(v,d){if(!isFinite(v))return '—';return v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});}
};
