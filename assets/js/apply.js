/* apply.js â€” the credit application: applicant, employment, vehicle */
(function(){
"use strict";
var esc = NM.esc, S = NM.S;
var page = document.getElementById("page");
var draft = {}, errors = {}, done = false;

var STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

var APPLICANT = [
  {k:"firstName",  l:"First name", w:4, req:true},
  {k:"middleName", l:"Middle name", w:4},
  {k:"lastName",   l:"Last name", w:4, req:true},
  {k:"address",    l:"Street address", w:6, req:true},
  {k:"city",       l:"City", w:3, req:true},
  {k:"state",      l:"State", w:2, req:true, type:"state"},
  {k:"zip",        l:"ZIP", w:2, req:true, mode:"numeric"},
  {k:"dob",        l:"Date of birth", w:3, req:true, type:"date"},
  {k:"dlNumber",   l:"Driver license number", w:4, req:true},
  {k:"dlState",    l:"License state", w:2, req:true, type:"state"},
  {k:"dlExp",      l:"License expiration", w:3, req:true, type:"date"},
  {k:"mobile",     l:"Mobile phone", w:4, req:true, type:"tel", hint:"We'll call this number to finish your approval by phone"},
  {k:"email",      l:"Email", w:4, req:true, type:"email"},
  {k:"residence",  l:"Residence", w:4, type:"select", opts:["Own","Rent","Live with family","Other"]},
  {k:"yearsAt",    l:"Years at residence", w:2, mode:"numeric"},
  {k:"monthsAt",   l:"Months at residence", w:2, mode:"numeric"},
  {k:"housingPayment", l:"Rent or mortgage payment", w:4, hint:"Monthly, before utilities"}
];
var EMPLOYMENT = [
  {k:"employer",       l:"Employer", w:6, req:true},
  {k:"employmentType", l:"Employment type", w:3, type:"select", opts:["Full time","Part time","Self employed","Retired","Military","Other"]},
  {k:"monthlyIncome",  l:"Monthly income", w:3, req:true, hint:"Gross, before deductions"},
  {k:"occupation",     l:"Occupation", w:6},
  {k:"workAddress",    l:"Address 1", w:6},
  {k:"workCity",       l:"City", w:4},
  {k:"workState",      l:"State", w:2, type:"state"},
  {k:"workZip",        l:"ZIP", w:3, mode:"numeric"},
  {k:"workPhone",      l:"Work phone", w:3, type:"tel"},
  {k:"timeOnJob",      l:"Time on job", w:4, hint:"For example, 2 years 4 months"}
];
var VEHICLE = [
  {k:"vStock",   l:"Stock number", w:3},
  {k:"vYear",    l:"Year", w:2, mode:"numeric"},
  {k:"vMake",    l:"Make", w:3},
  {k:"vModel",   l:"Model", w:4},
  {k:"vTrim",    l:"Trim", w:4},
  {k:"vVin",     l:"VIN", w:5},
  {k:"vMileage", l:"Mileage", w:3, mode:"numeric"}
];
var ALL = APPLICANT.concat(EMPLOYMENT).concat(VEHICLE);

function fillFromVehicle(v){
  draft.vPick = v.id; draft.vStock = v.stock; draft.vYear = v.year; draft.vMake = v.make;
  draft.vModel = v.model; draft.vTrim = v.trim; draft.vVin = v.vin; draft.vMileage = v.mileage;
}
var preset = NM.byId(NM.param("v"));
if(preset) fillFromVehicle(preset);

function field(f){
  var val = draft[f.k] == null ? "" : draft[f.k];
  var err = errors[f.k], id = "fld_" + f.k, input;
  if(f.type === "select" || f.type === "state"){
    var opts = f.type === "state" ? STATES : f.opts;
    input = '<select id="' + id + '" data-k="' + f.k + '"><option value="">Choose</option>'
      + opts.map(function(o){ return '<option value="' + esc(o) + '"' + (String(val) === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("")
      + "</select>";
  } else {
    input = '<input id="' + id + '" data-k="' + f.k + '" type="' + (f.type || "text") + '" value="' + esc(val) + '"'
      + (f.mode ? ' inputmode="' + f.mode + '"' : "")
      + (f.type === "tel" ? ' autocomplete="tel"' : "") + ">";
  }
  return '<div class="f w' + (f.w || 4) + (err ? " bad" : "") + '">'
    + '<label for="' + id + '">' + esc(f.l) + (f.req ? ' <span class="req" title="Required">*</span>' : "") + "</label>"
    + input
    + (err ? '<span class="err">' + esc(err) + "</span>" : (f.hint ? '<span class="hint">' + esc(f.hint) + "</span>" : ""))
    + "</div>";
}
function picker(){
  var avail = (window.INVENTORY || []).filter(function(v){ return v.status !== "sold"; });
  return '<div class="f w12"><label for="fld_vPick">Vehicle to finance</label>'
    + '<select id="fld_vPick"><option value="">I have not picked one yet</option>'
    + avail.map(function(v){
        return '<option value="' + esc(v.id) + '"' + (draft.vPick === v.id ? " selected" : "") + ">"
          + esc(NM.vname(v) + (v.trim ? " " + v.trim : "") + (v.stock ? " \u2014 stock " + v.stock : "")) + "</option>";
      }).join("")
    + '</select><span class="hint">Picking one fills in the details below. You can still edit them.</span></div>';
}
function formView(){
  return '<section class="section"><div class="wrap narrow">'
    + '<div class="notice">Takes about two minutes. Fill this out and we start on your approval right away' + (S.phone ? " \u2014 or call us directly at " + esc(S.phone) + "." : ".") + "</div>"
    + '<div class="form">'
      + '<div class="fieldset"><h2>Applicant information</h2>'
        + '<p class="note">Enter your name exactly as it appears on your driver license.</p>'
        + '<div class="fields">' + APPLICANT.map(field).join("") + "</div></div>"
      + '<div class="fieldset"><h2>Employment information</h2>'
        + '<p class="note">Where you work now. If you are self employed, use your business name as the employer.</p>'
        + '<div class="fields">' + EMPLOYMENT.map(field).join("") + "</div></div>"
      + '<div class="fieldset"><h2>Vehicle information</h2>'
        + '<p class="note">Tell us which vehicle you want to finance.</p>'
        + '<div class="fields">' + picker() + VEHICLE.map(field).join("") + "</div></div>"
      + '<div class="formfoot">'
        + '<button class="btn btn-gold" id="submitApply">Review and send</button>'
        + '<button class="btn btn-line" id="clearApply">Clear the form</button>'
        + '<span class="hint" id="errSummary"></span>'
      + "</div></div></div></section>";
}
function text(){
  function block(title, list){
    return title + "\n" + list.map(function(f){
      return draft[f.k] ? "  " + f.l + ": " + draft[f.k] : null;
    }).filter(Boolean).join("\n");
  }
  return "Credit application \u2014 " + S.name + "\n"
    + "Submitted " + new Date().toLocaleString() + "\n"
    + "NOTE: no SSN was collected on the website. Call the applicant to take it by phone before running credit.\n\n"
    + block("APPLICANT", APPLICANT) + "\n\n"
    + block("EMPLOYMENT", EMPLOYMENT) + "\n\n"
    + block("VEHICLE", VEHICLE) + "\n";
}
function doneView(){
  var subject = "Credit application \u2014 " + (draft.firstName || "") + " " + (draft.lastName || "");
  var href = "mailto:" + encodeURIComponent(S.email || "")
    + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text());
  return '<section class="section"><div class="wrap narrow">'
    + '<h2 style="font-size:36px;margin-bottom:10px">Your application is ready to send</h2>'
    + '<p style="color:var(--muted)">We\'ll call you shortly at the number you gave to finish your approval \u2014 it only takes a few minutes on the phone.</p>'
    + (S.email ? "" : '<div class="notice">No dealership email is set in data.js yet, so there is nowhere to send this. Add one and refresh.</div>')
    + '<div class="form"><div class="fieldset"><pre class="summary">' + esc(text()) + "</pre></div>"
    + '<div class="formfoot">'
      + (S.email ? '<a class="btn btn-gold" href="' + esc(href) + '">Send to ' + esc(S.name) + "</a>" : "")
      + '<button class="btn btn-line" id="copyApply">Copy the application</button>'
      + '<button class="btn btn-line" id="printApply">Print</button>'
      + '<button class="btn btn-line" id="editApply">Go back and edit</button>'
    + "</div></div></div></section>";
}
function validate(){
  errors = {};
  ALL.forEach(function(f){
    if(f.req && !String(draft[f.k] || "").trim()) errors[f.k] = "Required";
  });
  var em = String(draft.email || "");
  if(em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) errors.email = "Check this email address";
  var mob = String(draft.mobile || "").replace(/\D/g, "");
  if(mob && mob.length < 10) errors.mobile = "Use a 10 digit number";
  if(draft.dob){
    var age = (Date.now() - new Date(draft.dob).getTime()) / 31557600000;
    if(age < 18) errors.dob = "Applicants must be 18 or older";
    if(age > 110) errors.dob = "Check this date";
  }
  if(draft.dlExp && new Date(draft.dlExp) < new Date()) errors.dlExp = "This license has expired";
  return Object.keys(errors).length === 0;
}
function handoffView(){
  var a = window.APPLY || {};
  return '<section class="section"><div class="wrap narrow">'
    + '<h2 style="font-size:34px;margin-bottom:10px">Your application is handled securely</h2>'
    + "<p>We send financing applications through " + esc(a.hostedName || "our secure lending partner")
    + ", so your personal information travels over an encrypted connection and is never stored on this website.</p>"
    + (preset ? '<p style="color:var(--muted)">You were looking at the ' + esc(NM.vname(preset))
        + (preset.stock ? ", stock " + esc(preset.stock) : "")
        + ". Have that stock number handy when you fill out the application.</p>" : "")
    + '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px">'
      + '<a class="btn btn-gold" href="' + esc(a.hostedUrl) + '" target="_blank" rel="noopener">Open the secure application</a>'
      + '<a class="btn btn-line" href="inventory.html">Back to the inventory</a>'
    + "</div></div></section>";
}

function render(){
  if(NM.applyExternal()){ page.innerHTML = handoffView(); return; }
  page.innerHTML = done ? doneView() : formView();
}

page.addEventListener("input", function(e){
  var k = e.target.getAttribute && e.target.getAttribute("data-k");
  if(k){ draft[k] = e.target.value; if(errors[k]) delete errors[k]; }
});
page.addEventListener("change", function(e){
  if(e.target.id === "fld_vPick"){
    var v = NM.byId(e.target.value);
    if(v) fillFromVehicle(v); else draft.vPick = "";
    render();
  }
});
page.addEventListener("click", function(e){
  var t = e.target;
  if(t.id === "submitApply"){
    if(validate()){ done = true; render(); window.scrollTo(0, 0); }
    else {
      render();
      var n = Object.keys(errors).length;
      document.getElementById("errSummary").textContent =
        n + (n === 1 ? " field still needs an answer." : " fields still need an answer.");
      var first = document.querySelector(".f.bad input, .f.bad select");
      if(first){ first.scrollIntoView({block:"center"}); first.focus(); }
    }
  }
  else if(t.id === "clearApply"){
    if(confirm("Clear everything you have typed?")){ draft = {}; errors = {}; render(); }
  }
  else if(t.id === "editApply"){ done = false; render(); }
  else if(t.id === "printApply"){ window.print(); }
  else if(t.id === "copyApply"){
    navigator.clipboard.writeText(text()).then(
      function(){ NM.toast("Copied."); },
      function(){ NM.toast("Copying is blocked here. Select the text and copy it."); }
    );
  }
});
render();
})();