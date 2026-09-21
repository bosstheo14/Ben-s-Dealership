/* ==========================================================================
   site.js — shared helpers, header and footer.
   Every page loads this. You rarely need to touch it.
   ========================================================================== */
(function(){
"use strict";

var S = window.SITE || {};

/* ---------- small helpers ---------- */
function esc(s){
  return String(s == null ? "" : s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function money(n){
  var v = Number(String(n).replace(/[^0-9.]/g, ""));
  if(!isFinite(v) || v <= 0) return "";
  return "$" + v.toLocaleString("en-US", {maximumFractionDigits:0});
}
function num(n){
  var v = Number(String(n).replace(/[^0-9.]/g, ""));
  if(!isFinite(v) || !n) return "";
  return v.toLocaleString("en-US", {maximumFractionDigits:0});
}
function vname(v){ return [v.year, v.make, v.model].filter(Boolean).join(" ") || "Vehicle"; }
function telHref(p){ return "tel:" + String(p || "").replace(/[^0-9+]/g, ""); }
function fullAddress(){
  var line2 = [S.city, S.state].filter(Boolean).join(", ") + (S.zip ? " " + S.zip : "");
  return [S.street, line2].filter(function(x){ return x && x.trim(); }).join("\n");
}
function mapUrl(){
  var q = [S.street, S.city, S.state, S.zip].filter(Boolean).join(" ") || "Jackson MS";
  return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
}
function param(name){
  var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
}
function byId(id){
  return (window.INVENTORY || []).filter(function(v){ return String(v.id) === String(id); })[0];
}
function toast(msg, ms){
  var t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, ms || 3200);
}

/* ---------- where the Apply buttons point ---------- */
function applyConfig(){ return window.APPLY || {mode:"builtin"}; }
function applyExternal(){
  var a = applyConfig();
  return a.mode === "hosted" && !!a.hostedUrl;
}
function applyHref(v){
  var a = applyConfig();
  if(applyExternal()) return a.hostedUrl;
  return "apply.html" + (v ? "?v=" + encodeURIComponent(v.id) : "");
}
function applyAttrs(){
  return applyExternal() ? ' target="_blank" rel="noopener"' : "";
}

/* ---------- the magnolia mark ---------- */
function mark(color){
  var c = color || "var(--gold)", petals = "";
  for(var i = 0; i < 8; i++){
    petals += '<ellipse cx="50" cy="26" rx="10.5" ry="20" fill="' + c + '" transform="rotate(' + (i*45) + ' 50 50)"/>';
  }
  return '<svg viewBox="0 0 100 100" aria-hidden="true">' + petals
       + '<circle cx="50" cy="50" r="8.5" fill="var(--navy-deep)"/>'
       + '<circle cx="50" cy="50" r="4" fill="' + c + '"/></svg>';
}

/* ---------- header and footer, injected on every page ---------- */
var PAGES = [
  {href:"index.html",     label:"Home"},
  {href:"inventory.html", label:"Inventory"},
  {href:"visit.html",     label:"Visit us"},
  {href:"contact.html",   label:"Contact"}
];
function mountChrome(){
  var here = (document.body.getAttribute("data-page") || "index.html");
  var head = document.getElementById("site-header");
  if(head){
    head.className = "topbar";
    head.innerHTML = '<div class="wrap">'
      + '<a class="brand" href="index.html">' + mark()
        + "<span><b>" + esc(S.name) + "</b><small>" + esc(S.subtitle || "") + "</small></span></a>"
      + '<nav class="navlinks" aria-label="Main">'
        + PAGES.map(function(p){
            return '<a href="' + p.href + '"' + (p.href === here ? ' aria-current="page"' : "") + ">" + esc(p.label) + "</a>";
          }).join("")
      + "</nav>"
      + (S.phone ? '<a class="callnum" href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a>" : "")
      + '<a class="btn btn-gold btn-sm" href="' + applyHref() + '"' + applyAttrs() + '>Apply online</a>'
      + "</div>";
  }
  var foot = document.getElementById("site-footer");
  if(foot){
    foot.className = "site";
    var addr = fullAddress();
    foot.innerHTML = '<div class="wrap">'
      + "<div>" + esc(S.name) + (addr ? " &middot; " + esc(addr.replace(/\n/g, ", ")) : " &middot; Jackson, Mississippi")
        + "<br>&copy; " + new Date().getFullYear() + " " + esc(S.name) + ". All rights reserved.</div>"
      + "<nav>" + PAGES.map(function(p){ return '<a href="' + p.href + '">' + esc(p.label) + "</a>"; }).join("")
        + '<a href="' + applyHref() + '"' + applyAttrs() + '>Apply</a></nav>'
      + "</div>";
  }
  var t = document.querySelector("title");
  if(t && t.textContent.indexOf("{{name}}") > -1){
    t.textContent = t.textContent.replace("{{name}}", S.name);
  }
}

/* ---------- pieces reused across pages ---------- */
function hoursTable(muted){
  var today = new Date().getDay();
  var order = [6,0,1,2,3,4,5];           /* hours list starts on Monday */
  return '<table class="hours"' + (muted ? ' style="color:var(--muted)"' : "") + ">"
    + (S.hours || []).map(function(h, i){
        return '<tr class="' + (i === order[today] ? "today" : "") + '"><td>' + esc(h.d)
          + '</td><td' + (muted ? ' style="color:var(--text)"' : "") + ">" + esc(h.h) + "</td></tr>";
      }).join("")
    + "</table>";
}
function vehicleCard(v){
  var photo = (v.photos && v.photos[0])
    ? '<img src="' + esc(v.photos[0]) + '" alt="' + esc(vname(v)) + '" loading="lazy">'
    : '<div class="nophoto">No photo yet</div>';
  var count = (v.photos && v.photos.length > 1) ? '<span class="count">' + v.photos.length + " photos</span>" : "";
  var tag = v.status === "sold" ? '<span class="tag sold">Sold</span>'
          : v.status === "pending" ? '<span class="tag">Sale pending</span>' : "";
  var href = "vehicle.html?v=" + encodeURIComponent(v.id);
  return '<article class="card">'
    + '<a class="shot" href="' + href + '" style="display:block">' + photo + count + tag + "</a>"
    + '<div class="body">'
      + "<h3><a href=\"" + href + "\">" + esc(vname(v)) + "</a></h3>"
      + '<div class="sub">' + esc([v.trim, v.mileage ? num(v.mileage) + " miles" : ""].filter(Boolean).join(" \u00B7 ") || "Full details inside") + "</div>"
      + '<div class="price">' + (money(v.price) || "Call for price")
        + (v.payment ? "<small>or about " + esc(v.payment) + " per month</small>" : "<small>plus tax, tag and title</small>") + "</div>"
      + '<dl class="specs">'
        + (v.stock ? "<dt>Stock</dt><dd>" + esc(v.stock) + "</dd>" : "")
        + (v.vin ? "<dt>VIN</dt><dd>" + esc(v.vin) + "</dd>" : "")
        + (v.color ? "<dt>Color</dt><dd>" + esc(v.color) + "</dd>" : "")
      + "</dl>"
      + '<div class="actions">'
        + '<a class="btn btn-line btn-sm" href="' + href + '">View details</a>'
        + (v.status === "sold" ? "" : '<a class="btn btn-navy btn-sm" href="' + applyHref(v) + '"' + applyAttrs() + '>Apply for this one</a>')
      + "</div>"
    + "</div></article>";
}

/* ---------- exported ---------- */
window.NM = {
  S: S, esc: esc, money: money, num: num, vname: vname, telHref: telHref,
  fullAddress: fullAddress, mapUrl: mapUrl, param: param, byId: byId,
  toast: toast, mark: mark, hoursTable: hoursTable, vehicleCard: vehicleCard,
  applyHref: applyHref, applyAttrs: applyAttrs, applyExternal: applyExternal
};

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountChrome);
else mountChrome();
})();
