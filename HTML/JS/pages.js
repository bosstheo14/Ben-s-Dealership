/* pages.js — fills in the Visit us and Contact pages from data.js */
(function(){
"use strict";
var esc = NM.esc, S = NM.S;

var visit = document.getElementById("visit-body");
if(visit){
  var addr = NM.fullAddress();
  visit.innerHTML = '<div class="cols">'
    + "<div><h2 style=\"font-size:32px;margin-bottom:12px\">The lot</h2>"
      + '<p style="white-space:pre-line;font-size:20px">' + (addr ? esc(addr) : "Add your address in assets/js/data.js") + "</p>"
      + '<div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 24px">'
        + '<a class="btn btn-navy" href="' + esc(NM.mapUrl()) + '" target="_blank" rel="noopener">Open directions in Maps</a>'
        + (S.phone ? '<a class="btn btn-line" href="' + NM.telHref(S.phone) + '">Call ' + esc(S.phone) + "</a>" : "")
      + "</div>"
      + "<p>" + esc(S.about) + "</p></div>"
    + "<div><h2 style=\"font-size:32px;margin-bottom:12px\">Hours</h2>" + NM.hoursTable(true)
      + '<p style="margin-top:18px;color:var(--muted)">Holiday hours are posted on the homepage when they change.</p></div>'
    + "</div>";
}

var contact = document.getElementById("contact-body");
if(contact){
  var socials = (S.socials || []).filter(function(x){ return x.url; }).map(function(x){
    return '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.label) + "</a>";
  }).join("");
  contact.innerHTML = '<div class="cols">'
    + "<div><h2 style=\"font-size:24px;margin-bottom:8px\">Phone</h2>"
      + (S.phone ? '<a class="contactline" href="' + NM.telHref(S.phone) + '">' + esc(S.phone) + "</a>"
                 : '<p style="color:var(--muted)">Add your phone number in data.js</p>')
      + '<p style="color:var(--muted)">Call or text during lot hours.</p></div>'
    + "<div><h2 style=\"font-size:24px;margin-bottom:8px\">Email</h2>"
      + (S.email ? '<a class="contactline" href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>"
                 : '<p style="color:var(--muted)">Add your email in data.js</p>')
      + '<p style="color:var(--muted)">Applications and questions both land here.</p></div>'
    + "<div><h2 style=\"font-size:24px;margin-bottom:8px\">Address</h2>"
      + '<p style="white-space:pre-line">' + (NM.fullAddress() ? esc(NM.fullAddress()) : "Add your address in data.js") + "</p>"
      + '<a class="btn btn-line btn-sm" href="' + esc(NM.mapUrl()) + '" target="_blank" rel="noopener">Get directions</a></div>'
    + "<div><h2 style=\"font-size:24px;margin-bottom:8px\">Follow the lot</h2>"
      + (socials ? '<div class="socials">' + socials + "</div>"
                 : '<p style="color:var(--muted)">Add your social links in data.js</p>')
      + '<p style="color:var(--muted);margin-top:12px">New arrivals go up there first.</p></div>'
    + "</div>";
}
})();
