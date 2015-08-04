Meteor.startup(function () {
  //initialize session variables
  Session.set("theSelectedOne","New");
  Session.set("selectedScreen","productInfo");
  Session.set("selectedLanguage","english");
  Accounts.ui.config({passwordSignupFields:"USERNAME_ONLY"});
  //uncomment following line after adding users
  //Accounts.config({forbidClientAccountCreation: true});
});

//subscribe to database -- matches publish function that runs on the server  
Meteor.subscribe('someLabels');

Template.main.helpers({
  plantings: function() {
    return Labels.find().fetch();
    },
  addNew: function() {
    var val = Session.get("theSelectedOne");
    if (val == "New") {return true;}
      else {return false;} 
  },
  editOnOff: function() {
    return Session.get("editOnOff");
  },
  infoIsProduct: function() {
    return (Session.get("selectedScreen")==="productInfo");
  },
  infoIsHealth: function() {
    return (Session.get("selectedScreen")==="healthInfo");
  },
  infoIsFirstAid: function() {
    return (Session.get("selectedScreen")==="firstAid");
  },
  infoIsPPE: function() {
    return (Session.get("selectedScreen")==="ppe");
  },
  infoIsAg: function() {
    return (Session.get("selectedScreen")==="agEnviron");
  },
  infoIsControls: function() {
    return (Session.get("selectedScreen")==="controls");
  },
  editInfo: function() {
    return (Session.get("selectedScreen")==="editAll");
  },
});

//functions

function arrOfJSONtoArr(arj,code) {
  //pull items with name code from an array of JSON
  //  return comma delimited string
  var ar = new Array();
  for (var j=0; j<arj.length; j++) {
    var jj = arj[j];
    ar.push(jj[code]);
  }
  return ar.join(", ");
}

function gatherIngredients(n) {
  //creates array of ingredients from input tags
  // within the element n
  var items=new Array();
  var ar = n.getElementsByTagName('p');
  for (var j=0; j<ar.length; j++) {
    if (ar[j].className === 'ingredient') {
      var item = Object.create(null);
      var inps = ar[j].getElementsByClassName('inp');
      for (var k=0; k<inps.length; k++) {
        var nm = inps[k].name;
        var val = inps[k].value;
        item[nm]=val;
      } // inps
      items.push(item);
    } // ingredient
  } // ar
  return items;
} //function

function getNextSiblingByClass(e,cl) {
  e = e.nextSibling;
  while (e && e.className!=cl ) {
      e = e.nextSibling;
  }
  return e;
}

function insertLineBreak(val) {
  //converts ;; to line break
  return val.replace(/;; /gm,"\r\n");
}

function insertLineBreakP(val) {
  //divides code by paragraph tag at ;;
  return "<p>" + val.replace(/;; /gm,"</p><p>") + "</p>";
}

function jtBool(st) {
  if (st=='yes') {return true;}
  if (st=='no') {return false;}
}

function pagePref(ev,screen) {
  // sets class for item to itemChoose and sets all others
  // within the div with itemChoose to item Available
    var i = ev.target.closest('span');
    var j = ev.target.closest('div');
    Session.set(screen,i.id);
    if (i.className!='itemChoosen') {
      var k = j.getElementsByClassName('itemChoosen')[0];
      k.classList.add('itemAvailable');
      k.classList.remove('itemChoosen');
      i.classList.remove('itemAvailable');
      i.classList.add('itemChoosen');
    } 
}

function productName() {
  // returns the product name of the selected material
  var a = Labels.findOne
      ({_id: Session.get("theSelectedOne")})["product"];
  return a;
}


function replaceLineBreaks(val) {
  //replaces all line breaks with ;;
  return val.replace(/(\r\n|\n|\r)/gm,";; ");
}

//other template helpers and events

Template.addlMaterial.events({
  //creates a template for adding another ingredient
  "click": function (ev) {
    //alert("Add'l button clicked: " + this.x);
    var i = document.getElementById(this.x);
    Blaze.render(Template.yourMsg,i);
    ev.preventDefault();
  }
});

Template.checkPest.helpers({
//reads JSON code to determine if pest is checked
"pcheck": function () {
  var s = arrOfJSONtoArr(this.ar,'name');
  if (s === this.n) {
    return "checked";
  } else {
    return "";
  }
}
});

Template.chooseOne.helpers({
//returns all materials in database
  materialChoices: function() {
    return Labels.find().fetch();
    }
});

Template.chooseOne.events({
  //set the Session variable to selected material in drop down
  "change #selMat": function(ev) {
    var sel=ev.target;
    var ix=sel.selectedIndex;
    Session.set("theSelectedOne",sel.options[ix].value);
    //alert('+' + Session.get("theSelectedOne"));
  }
});

//couldn't figure out how to otherwise do the following in Meteor
//  without duplicating the helpers for every page display option

Template.displayAgEnviron.helpers({
  chosenOne: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  product:  function() {
    return productName();   
  },
});

Template.displayArea.helpers({
//display longer text sections within page 
  "insertBreaksP": function () {
    return insertLineBreakP(this.val);
  }
});

Template.displayControls.helpers({
  chosenOne: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  product:  function() {
    return productName();   
  },
});

Template.displayFirstAid.helpers({
  chosenOne: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  product:  function() {
    return productName();   
  },
});

Template.displayHealth.helpers({
  chosenOne: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  product:  function() {
    return productName();   
  },
});

Template.displayList.helpers({
//displays comma delimited list
  "assembleList": function () {
  return arrOfJSONtoArr(this.val,'name');
  }
});

Template.displayPPE.helpers({
  chosenOne: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  product:  function() {
    return productName();   
  },
});

Template.displayProduct.helpers({
  chosenOneX: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  product:  function() {
    return productName();   
  },
});

Template.formIngredient.events({
//these events add, delete, or update ingredient values
// they manipulate the visibility of the tags, create the 
// JSON code, and update the database
  "click .addone": function (ev) {
    //alert('Add');
    var i = ev.target.closest('p');
    i.classList.add('ingredient');
    i.classList.remove('addlIngredient');
    var ii = i.closest('div');
    var entry = gatherIngredients(ii);
    var nm = ii.id;
    var item = Object.create(null);
    item[nm]=entry;
    //alert(JSON.stringify(item));
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: item});
    ev.preventDefault();
  },
  "click .delete": function (ev) {
    //alert('Delete');
    var i = ev.target.closest('p');
    i.classList.remove('ingredient');
    i.classList.add('deleted');
    var ii = i.closest('div');
    var entry = gatherIngredients(ii);
    var nm = ii.id;
    var item = Object.create(null);
    item[nm]=entry;
    //alert(JSON.stringify(item));
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: item});
    ev.preventDefault();    
  },
  "click .zupdate": function (ev) {
    //alert('Update');
    var ii = ev.target.closest('div');
    var entry = gatherIngredients(ii);
    //alert(JSON.stringify(entry));
    var nm = ii.id;
    var item = Object.create(null);
    item[nm]=entry;
    //alert(JSON.stringify(item));
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: item});
    ii.classList.remove('editOn');
    ii.classList.add('editOff');
    ev.preventDefault();        
  }
});

Template.formRadio.helpers({
//returns whether yes radio button is checked
checkedOn: function() {
  if (this.val==='yes') {return "checked";}
    else {return "";}
}
});

Template.formRadio.events({
//works with editors for radio button inputs,
// manipulates the visibility of the tags,
//  creates the JSON code, and updates
// the database
  "click .rCancel": function (ev) {
    var i = ev.target.closest('div');
    i.classList.remove('editOn');
    i.classList.add('editOff');
    ev.preventDefault();
  },
  "click .toggle": function (ev) {
    var i = ev.target.closest('div');
    x="yes";
    if (jtBool(this.val)) {x="no";}
    var ex = Object.create(null);
    //var nm = "restricted";
    var nm = this.name;
    ex[nm]=x;
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: ex});
    i.classList.remove('editOn');
    i.classList.add('editOff');
    ev.preventDefault();    
  }
});

Template.formTextarea.helpers({
//displays longer text by manipulating line breaks
  "insertBreaks": function () {
    return insertLineBreak(this.val);
  },
  "insertBreaksP": function () {
    return insertLineBreakP(this.val);
  }

});

Template.hello.helpers({
  inActiveUser: function() {
    // returns true if no one is logged in
    if (Meteor.user()) {return false;}
      else {return true;}
  },
});

Template.newForm.events({
//reads the input tags from the form for new materials,
//  creates the JSON code, and inserts it into the database;
//  uses tag values and class names to determine methods
//  to generate the JSON code
  "submit form": function (ev) {
    ev.preventDefault();
    //alert('form submitted');
    var build = "{";
    var iName='';
    var txt='';
    var cl = '';
    var f = ev.target;
    var newEntry = Object.create(null);
    var arsenic = Object.create(null);
    var ingredients = Object.create(null);
    var active = new Array();
    var inert = new Array();
    var activeCase = true;
    for (var i=0; i<f.length; i++) {
      opt=f[i];
      var t = opt.type;
      var iName = opt.name;
      switch (t) {
        case 'text' :
        case 'textarea' :
        case 'hidden' : txt = opt.value; 
           break;
        case 'select-one' : var ix = opt.selectedIndex;
          txt = opt.options[ix].value; break;
        case 'checkbox' :
        case 'radio' : 
          if (opt.checked) {txt = opt.value;}
            else {iName='0';} 
          break;
        default: iName='0';
      } // switch 
      if (iName!=='0') {
        //alert(iName + '('+ t + ') =' + txt); 
        /* if (t === "text") {
          alert("Class = " + opt.className);
        } */
        switch (opt.className) {
          case "sole": newEntry[iName]=txt; break;
          case "arsenic": arsenic[iName]=txt; break;
          case "material":  ingredients[iName]=txt;
              if (iName==="percent" && activeCase) {
                active.push(
                  {"name" : ingredients.name,
                      "percent" : ingredients.percent});
                }               
              if (iName==="percent" && !activeCase) {
                inert.push(
                  {"name" : ingredients.name,
                      "percent" : ingredients.percent});
                }               
              break;
          case "trans": activeCase = false; break;
          default: var zip=0;
        } //switch
      }  
    } // for
    
    if (active.length>0) {
      newEntry["active"]=active;
    } //if
    if (inert.length>0) {
      newEntry["inert"]=inert;
    } //if
    newEntry["arsenic"]=arsenic;

    //alert(JSON.stringify(newEntry)); 
    
    Labels.insert(newEntry);   
    
    var matName = newEntry["product"];
    alert("Entering " + matName + " ...");
    
    var pid = Labels.findOne({"product": matName})["_id"];
    //alert(pid);
    
    Session.set("theSelectedOne",pid);
  }
});

Template.pages.events({
//handles click for changing display page option
  "click": function (ev) {
    pagePref(ev,"selectedScreen");
    ev.preventDefault();
  }
});

Template.pestList.helpers({
//returns comma delimited string from JSON array of pests
"valScript": function () {
  return arrOfJSONtoArr(this.val,'name');
}
});

Template.single.helpers({
  chosenOne: function() {
    return Labels.findOne({_id: Session.get("theSelectedOne")});    
  },
  displayUse: function(st) {
  // converts yes and no to boolean
    return jtBool(st);
  }
});

Template.single.events({
//Event handlers for editing existing information for current chosen 
//  material; manages the visibility of the editors, generates JSON
//  code and updates the database
  "click .editable": function(ev) {
    //alert('User = ' + Meteor.user());
    var openInps = document.querySelectorAll('div.editOn');
    for (var j=0; j<openInps.length; j++) {
      openInps[j].classList.remove('editOn');
      openInps[j].classList.add('editOff');
    }
    var i = ev.target.closest('div');
    //alert('clicked' + i.tagName);
    i.classList.toggle('editOff');
    i.classList.toggle('editOn');
    //i.style.color='green';
    //alert(i.className);
    ev.preventDefault();    
  },
  "click .update": function(ev) {
    //alert('Update clicked');
    var i = ev.target.closest('div');
    var val=document.getElementById('z_address').value;
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: {address: val}});
    i.classList.remove('editOn');
    i.classList.add('editOff');
  },
  "click .xupdate": function(ev) {
    //alert('xUpdate clicked');
    var i = ev.target.closest('div');
    var inp = i.getElementsByClassName('inp')[0];
    var nm = inp.name;
    //alert('name = ' + nm);
    var val=replaceLineBreaks(inp.value);
    //alert('value = '+ val);
    var ex = Object.create(null);
    ex[nm]=val;
    //alert(JSON.stringify(ex));    
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: ex});
    i.classList.remove('editOn');
    i.classList.add('editOff');
  },
  "click .cancel": function(ev) {
    var i = ev.target.closest('div');
    var current = i.getElementsByClassName('current')[0];
    var z=current.innerHTML;
    //alert('z = ' + z);
    i.classList.remove('editOn');
    i.classList.add('editOff');
    var inp = i.getElementsByClassName('inp')[0];
    //alert('inp.value = ' + inp.value);
    inp.value=z;
  },
  "click .yupdate": function(ev) {
    var i = ev.target.closest('div');
    var arsenic = Object.create(null);
    var inp = i.getElementsByClassName('inp');
    for (var j=0; j<inp.length; j++) {
      var nm = inp[j].name;
      var val=inp[j].value;
      arsenic[nm]=val;
    }   
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: {"arsenic" : arsenic}});
    i.classList.remove('editOn');
    i.classList.add('editOff');
  },
  "click .ycancel": function(ev) {
    var i = ev.target.closest('div');
    i.classList.remove('editOn');
    i.classList.add('editOff');
    var current = i.getElementsByClassName('current');
    for (var j=0; j<current.length; j++) {
      var z=current[j].innerHTML;
      //alert('z = ' + z);
      var inp = getNextSiblingByClass(current[j],'inp');
      //alert('inp.node = ' + inp.tagName + '(' + inp.nodeName + ')');
      inp.value=z;
    } // for
  },
  "click .pcancel": function(ev) {
    var i = ev.target.closest('div');
    i.classList.remove('editOn');
    i.classList.add('editOff');
    /* var current = i.getElementsByClassName('current');
    for (var j=0; j<current.length; j++) {
      var z=current[j].innerHTML;
      //alert('z = ' + z);
      var inp = getNextSiblingByClass(current[j],'inp');
      //alert('inp.node = ' + inp.tagName + '(' + inp.nodeName + ')');
      inp.value=z;
    } // for   */
  },
  "click .pupdate": function(ev) {
    var i = ev.target.closest('div');
    var inp = i.getElementsByClassName('inp');
    var pests = new Array();
    for (var j=0; j<inp.length; j++) {
      if (inp[j].checked) {
        var ex = Object.create(null);
        ex["name"]=inp[j].id;
        pests.push(ex);
      }
    }
    var p = Object.create(null);
    p["pests"]=pests;
    //alert(JSON.stringify(p));
    Labels.update({_id: Session.get("theSelectedOne")},
        {$set: p});
    i.classList.remove('editOn');
    i.classList.add('editOff');  
  }            
});


    