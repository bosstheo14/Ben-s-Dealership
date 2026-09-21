/* inventory.js — search, sort and list every vehicle */
(function(){
"use strict";
var esc = NM.esc, q = "", sort = "newest", status = "available";
var out = document.getElementById("results");
var summary = document.getElementById("resultcount");

function visible(){
  var list = (window.INVENTORY || []).slice();
  if(status === "available") list = list.filter(function(v){ return v.status !== "sold"; });
  if(q.trim()){
    var s = q.toLowerCase();
    list = list.filter(function(v){
      return [v.year,v.make,v.model,v.trim,v.stock,v.vin,v.color,v.body].join(" ").toLowerCase().indexOf(s) > -1;
    });
  }
  if(sort === "lowprice")  list.sort(function(a,b){ return (Number(a.price)||1e12) - (Number(b.price)||1e12); });
  if(sort === "highprice") list.sort(function(a,b){ return (Number(b.price)||0) - (Number(a.price)||0); });
  if(sort === "lowmiles")  list.sort(function(a,b){ return (Number(a.mileage)||1e12) - (Number(b.mileage)||1e12); });
  return list;
}
function render(){
  var list = visible();
  summary.textContent = list.length
    ? list.length + (list.length === 1 ? " vehicle" : " vehicles")
    : "";
  out.innerHTML = list.length
    ? '<div class="grid">' + list.map(NM.vehicleCard).join("") + "</div>"
    : '<div class="empty">' + ((window.INVENTORY || []).length
        ? "Nothing matches that search. Try a different year, make or stock number."
        : "The inventory is empty. Add vehicles in assets/js/data.js.") + "</div>";
}
document.getElementById("invq").addEventListener("input", function(e){ q = e.target.value; render(); });
document.getElementById("invsort").addEventListener("change", function(e){ sort = e.target.value; render(); });
document.getElementById("invstatus").addEventListener("change", function(e){ status = e.target.value; render(); });

var preset = NM.param("q");
if(preset){ q = preset; document.getElementById("invq").value = preset; }
render();
})();
