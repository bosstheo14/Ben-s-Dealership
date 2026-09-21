/* home.js — builds the homepage from data.js */
(function(){
"use strict";
var S = NM.S, esc = NM.esc;

function hero(){
  var addr = NM.fullAddress();
  return '<section class="hero"><div class="petalwash">' + NM.mark("#FFFFFF") + '</div><div class="wrap">'
    + "<div><h1>" + esc(S.tagline) + "</h1>"
      + '<p class="lede">' + esc(S.lede) + "</p>"
      + '<div class="cta">'
        + '<a class="btn btn-gold" href="inventory.html">See the inventory</a>'
        + '<a class="btn btn-ghost" href="' + esc(NM.mapUrl()) + '" target="_blank" rel="noopener">Get directions</a>'
      + "</div></div>"
    + '<aside class="lotcard"><h2>Visit the lot</h2>'
      + '<div class="addr">' + (addr ? esc(addr) : '<span style="color:var(--on-navy-muted)">Add your street address in assets/js/data.js</span>') + "</div>"
      + NM.hoursTable()
      + (S.phone ? '<p style="margin:16px 0 0"><a class="btn btn-gold btn-sm" href="' + NM.telHref(S.phone) + '">Call ' + esc(S.phone) + "</a></p>" : "")
    + "</aside></div></section>";
}

function news(){
  var items = window.NEWS || [];
  if(!items.length) return "";
  return '<section class="section"><div class="wrap">'
    + '<div class="sechead"><div><h2>What\'s new on the lot</h2>'
    + "<p>Fresh arrivals, price drops and hours changes, posted as they happen.</p></div></div>"
    + '<div class="newslist">' + items.map(function(n){
        return '<article class="newsitem"><div class="when">' + esc(n.when) + "</div>"
          + "<div><h3>" + esc(n.title) + "</h3><p>" + esc(n.body) + "</p></div></article>";
      }).join("") + "</div></div></section>";
}

function featured(){
  var list = (window.INVENTORY || []).filter(function(v){ return v.status !== "sold"; });
  var shown = list.slice(0, 3);
  var body = shown.length
    ? '<div class="grid">' + shown.map(NM.vehicleCard).join("") + "</div>"
    : '<div class="empty">No vehicles listed yet. Add your first one in assets/js/data.js.</div>';
  return '<section class="section alt"><div class="wrap">'
    + '<div class="sechead"><div><h2>On the lot right now</h2><p>'
      + (list.length ? list.length + (list.length === 1 ? " vehicle available today." : " vehicles available today.") : "Vehicles you add will show up here.")
      + "</p></div>"
    + '<a class="btn btn-line btn-sm" href="inventory.html">See all ' + (list.length || "") + " vehicles</a></div>"
    + body + "</div></section>";
}

function visitStrip(){
  var addr = NM.fullAddress();
  return '<section class="section"><div class="wrap"><div class="cols">'
    + '<div><h2 style="font-size:34px;margin-bottom:12px">Finding us</h2>'
      + '<p style="white-space:pre-line;font-size:19px">' + (addr ? esc(addr) : "Add your address in assets/js/data.js") + "</p>"
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">'
        + '<a class="btn btn-navy" href="' + esc(NM.mapUrl()) + '" target="_blank" rel="noopener">Open directions in Maps</a>'
        + '<a class="btn btn-line" href="visit.html">Hours and details</a></div></div>'
    + "<div><h3>Hours</h3>" + NM.hoursTable(true) + "</div>"
    + "</div></div></section>";
}

function contactStrip(){
  var socials = (S.socials || []).filter(function(x){ return x.url; }).map(function(x){
    return '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.label) + "</a>";
  }).join("");
  return '<section class="section alt"><div class="wrap">'
    + '<div class="sechead"><div><h2>Talk to us</h2><p>Call, email or send a message. We answer during lot hours.</p></div></div>'
    + '<div class="cols">'
      + "<div><h3>Phone</h3>" + (S.phone
          ? '<a class="contactline" href="' + NM.telHref(S.phone) + '">' + esc(S.phone) + "</a>"
          : '<p style="color:var(--muted)">Add your phone number in data.js</p>') + "</div>"
      + "<div><h3>Email</h3>" + (S.email
          ? '<a class="contactline" href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>"
          : '<p style="color:var(--muted)">Add your email in data.js</p>') + "</div>"
      + "<div><h3>Social</h3>" + (socials ? '<div class="socials">' + socials + "</div>"
          : '<p style="color:var(--muted)">Add your social links in data.js</p>') + "</div>"
      + '<div><h3>Financing</h3><p style="color:var(--muted)">Start the application online and we will call you back about the vehicle you picked.</p>'
        + '<a class="btn btn-gold" href="' + NM.applyHref() + '"' + NM.applyAttrs() + '>Apply online</a></div>'
    + "</div></div></section>";
}

document.getElementById("page").innerHTML = hero() + news() + featured() + visitStrip() + contactStrip();
})();
