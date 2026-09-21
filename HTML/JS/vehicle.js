/* vehicle.js — one vehicle, its photos and its specs */
(function(){
"use strict";
var esc = NM.esc;
var v = NM.byId(NM.param("v"));
var page = document.getElementById("page");
var index = 0;

if(!v){
  page.innerHTML = '<section class="section"><div class="wrap">'
    + '<div class="empty">That vehicle is not on the lot anymore. '
    + '<a href="inventory.html">See what is available</a>.</div></div></section>';
  return;
}
document.title = NM.vname(v) + " — " + NM.S.name;

function gallery(){
  var photos = v.photos || [];
  var main = photos.length
    ? '<div class="main"><img src="' + esc(photos[Math.min(index, photos.length-1)]) + '" alt="' + esc(NM.vname(v)) + '"></div>'
    : '<div class="main"><div class="nophoto">No photos yet</div></div>';
  var thumbs = photos.length > 1
    ? '<div class="thumbs">' + photos.map(function(p, i){
        return '<button data-i="' + i + '" aria-current="' + (i === index) + '" aria-label="Photo ' + (i+1) + '"><img src="' + esc(p) + '" alt=""></button>';
      }).join("") + "</div>"
    : "";
  return '<div class="gallery">' + main + thumbs + "</div>";
}
function specs(){
  var rows = [
    ["Stock number", v.stock], ["VIN", v.vin], ["Year", v.year], ["Make", v.make],
    ["Model", v.model], ["Trim", v.trim], ["Mileage", v.mileage ? NM.num(v.mileage) + " miles" : ""],
    ["Body style", v.body], ["Exterior color", v.color], ["Engine", v.engine],
    ["Transmission", v.transmission], ["Drivetrain", v.drivetrain], ["Fuel", v.fuel]
  ].filter(function(r){ return r[1]; });
  return '<dl class="specs" style="font-size:16px;grid-template-columns:auto 1fr">'
    + rows.map(function(r){ return "<dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd>"; }).join("")
    + "</dl>";
}
function buybox(){
  var sold = v.status === "sold";
  return '<aside class="buybox">'
    + '<div class="price">' + (NM.money(v.price) || "Call for price") + "</div>"
    + '<div style="color:var(--muted)">' + (v.payment ? "About " + esc(v.payment) + " per month" : "Plus tax, tag and title") + "</div>"
    + (sold ? '<p style="margin-top:14px;font-weight:700">This one is sold.</p>' : "")
    + '<div class="actions">'
      + (sold ? '<a class="btn btn-line" href="inventory.html">See what is available</a>'
              : '<a class="btn btn-gold" href="' + NM.applyHref(v) + '"' + NM.applyAttrs() + '>Apply for this vehicle</a>')
      + (NM.S.phone ? '<a class="btn btn-navy" href="' + NM.telHref(NM.S.phone) + '">Call ' + esc(NM.S.phone) + "</a>" : "")
      + '<a class="btn btn-line" href="' + esc(NM.mapUrl()) + '" target="_blank" rel="noopener">Come see it</a>'
    + "</div></aside>";
}

function render(){
  page.innerHTML = '<section class="section"><div class="wrap">'
    + '<div class="crumbs"><a href="index.html">Home</a> / <a href="inventory.html">Inventory</a> / ' + esc(NM.vname(v)) + "</div>"
    + '<div class="detail"><div>'
      + "<h1 style=\"font-size:clamp(32px,4.5vw,48px);margin-bottom:6px\">" + esc(NM.vname(v)) + "</h1>"
      + '<p style="color:var(--muted);font-size:19px">' + esc([v.trim, v.mileage ? NM.num(v.mileage) + " miles" : "", v.stock ? "Stock " + v.stock : ""].filter(Boolean).join(" \u00B7 ")) + "</p>"
      + gallery()
      + (v.description ? '<p style="margin-top:22px;font-size:18px">' + esc(v.description) + "</p>" : "")
      + '<h2 style="font-size:24px;margin:26px 0 12px">Vehicle details</h2>' + specs()
    + "</div>" + buybox() + "</div></div></section>";
}
page.addEventListener("click", function(e){
  var b = e.target.closest("[data-i]");
  if(b){ index = Number(b.getAttribute("data-i")); render(); }
});
render();
})();
