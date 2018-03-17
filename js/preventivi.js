// $(document).ready(function(){
// 
// });

// FUNZIONI JAVASCRIPT DELLA PAGINA
function calcolaImporti() {
  // formattazione dell'importo da fatturare
  var impDaFatt = document.getElementById("impDaFatt").value;
  var importo = impFormatted(impDaFatt);
  document.getElementById("impDaFatt").value = importo;

  // calcolo importo cassa geometri
  var impCassa = calcPerce(impDaFatt, 5);
  var impCassaString = impCassa.toString().replace(/[.]/, ",");
  document.getElementById("impCassaGeom").innerHTML = impFormatted(impCassaString) + " &euro;";

  // totale imponibile
  var impTotImpon = impDaFatt + impCassa;
  var impTotImponString = impTotImpon.toString().replace(/[.]/, ",");
  document.getElementById("impTotImpon").innerHTML = impFormatted(impTotImponString) + " &euro;";

  // Iva sull'imponibile
  var impIvaImpon = calcPerce(impTotImpon, 22);
  var impIvaImponString = impTotImpon.toString().replace(/[.]/, ",");
  document.getElementById("impIvaImpon").innerHTML = impFormatted(impIvaImponString) + " &euro;";

  // importo articolo 15

  // totale fattura

  // ritenuta d'acconto

  // importo corrisposto
}

// Auto-format currency value
function impFormatted(amount) {
	var delimiter = "."; // replace comma if desired
	var a = amount.split(',',2)
  var d = a[1];
  if (d == undefined) {
    d = 0;
  }
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = new String(i);
	var a = [];
	while(n.length > 3) {
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0) { a.unshift(n); }
	n = a.join(delimiter);
	if(d.length < 1) { amount = n; }
	else {
    if (d.length > 1) {amount = n + ',' + d.substr(0,2);}
    else {
      amount = n + ',' + d + '0';
    }
  }
	amount = minus + amount;
	return amount;
}

function normalizzaImp(amount) {
	var a = amount.split(',',2)
  var d = a[1];
  if (d == undefined) {
    d = 0;
  }
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = new String(i);
	if(d.length < 1) { amount = n; }
	else {
    if (d.length > 1) {amount = n + ',' + d.substr(0,2);}
    else {
      amount = n + ',' + d + '0';
    }
  }
	amount = minus + amount;
	return amount;
}

function calcPerce(importo, perce) {
  return (perce / 100) * importo;
}
// calcoli importi

function gestRitenuta() {

  if (document.getElementById("ritenutaSwitch").value == "ON") {
    document.getElementById("ritenuta").style.display='none';
    document.getElementById("ritenutaSwitch").value = "OFF";
  } else {
    document.getElementById("ritenuta").style.display='block';
    document.getElementById("ritenutaSwitch").value = "ON";
  }
}

// MODAL Cliente
function searchNome() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("modClienteNome");
  filter = input.value.toUpperCase();
  table = document.getElementById("modClienteTab");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function searchCdfisPiva() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("modClientePiva");
  filter = input.value.toUpperCase();
  table = document.getElementById("modClienteTab");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function initAttrModIns() {
  document.getElementById("modCliNomeI").style.display='block';
  document.getElementById("modCliCognomeI").style.display='block';
  document.getElementById("modCliCdfisI").style.display='block';
  document.getElementById("modCliNomeL").style.display='block';
  document.getElementById("modCliCognomeL").style.display='block';
  document.getElementById("modCliCdfisL").style.display='block';
  document.getElementById("modCliRagSocI").style.display='none';
  document.getElementById("modCliPivaI").style.display='none';
  document.getElementById("modCliRagSocL").style.display='none';
  document.getElementById("modCliPivaL").style.display='none';
  document.getElementById("modBtnPriv").classList.remove("btn-default");
  document.getElementById("modBtnPriv").classList.add("btn-success");
  document.getElementById("modBtnSoc").classList.remove("btn-success");
  document.getElementById("modBtnSoc").classList.add("btn-default");
}

function setPrivato() {
  if (document.getElementById("modBtnPriv").classList.contains("btn-default")) {
    document.getElementById("modCliNomeI").style.display='block';
    document.getElementById("modCliCognomeI").style.display='block';
    document.getElementById("modCliCdfisI").style.display='block';
    document.getElementById("modCliNomeL").style.display='block';
    document.getElementById("modCliCognomeL").style.display='block';
    document.getElementById("modCliCdfisL").style.display='block';
    document.getElementById("modCliRagSocI").style.display='none';
    document.getElementById("modCliPivaI").style.display='none';
    document.getElementById("modCliRagSocL").style.display='none';
    document.getElementById("modCliPivaL").style.display='none';
    document.getElementById("modBtnPriv").classList.remove("btn-default");
    document.getElementById("modBtnPriv").classList.add("btn-success");
    document.getElementById("modBtnSoc").classList.remove("btn-success");
    document.getElementById("modBtnSoc").classList.add("btn-default");
  }
}

function setSocieta() {
  if (document.getElementById("modBtnSoc").classList.contains("btn-default")) {
    document.getElementById("modCliNomeI").style.display='none';
    document.getElementById("modCliCognomeI").style.display='none';
    document.getElementById("modCliCdfisI").style.display='none';
    document.getElementById("modCliNomeL").style.display='none';
    document.getElementById("modCliCognomeL").style.display='none';
    document.getElementById("modCliCdfisL").style.display='none';
    document.getElementById("modCliRagSocI").style.display='block';
    document.getElementById("modCliPivaI").style.display='block';
    document.getElementById("modCliRagSocL").style.display='block';
    document.getElementById("modCliPivaL").style.display='block';
    document.getElementById("modBtnSoc").classList.remove("btn-default");
    document.getElementById("modBtnSoc").classList.add("btn-success");
    document.getElementById("modBtnPriv").classList.remove("btn-success");
    document.getElementById("modBtnPriv").classList.add("btn-default");
  }
}

// MODAL Opera
function searchOpId() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("modOperaId");
  filter = input.value.toUpperCase();
  table = document.getElementById("modOperaTab");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function searchOpDesc() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("modOperaDesc");
  filter = input.value.toUpperCase();
  table = document.getElementById("modOperaTab");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function changeId(id) {
  if (!$("#"+id).is(":visible")) {
    $("#preventivo").hide();
    $("#lista").hide();
    $("#"+id).show();
  }
}

$(document).ready(function(){
  $("descr").hide();
  
  $("#btnCollapse").click(function(){
    if ($(this).hasClass("glyphicon-chevron-right")) {
      $("div.descr").slideUp();
      $("button.glyphicon-chevron-right").addClass("glyphicon-chevron-down");
      $("button.glyphicon-chevron-right").removeClass("glyphicon-chevron-right");
      
    } else {
      $("div.descr").slideDown();
      $("button.glyphicon-chevron-down").addClass("glyphicon-chevron-right");
      $("button.glyphicon-chevron-down").removeClass("glyphicon-chevron-down");
    }
  });
    
  $("button.btn-tab").click(function(){
    descr = "#descr" + $(this).attr('id');
    if ($(this).hasClass("glyphicon-chevron-right")) {
      $(descr).slideUp();
      $(this).addClass("glyphicon-chevron-down");
      $(this).removeClass("glyphicon-chevron-right");
      
    } else {
      $(descr).slideDown();
      $(this).addClass("glyphicon-chevron-right");
      $(this).removeClass("glyphicon-chevron-down");
    }
    // $(this).next("descr").slideDown();
  });
  
  $("#ritenutaSwitch").click(function() {
    if ($(this).val() == "ON") {
      // document.getElementById("ritenuta").style.display='none';
      // document.getElementById("ritenutaSwitch").value = "OFF";
      $("#ritenuta").slideUp();
      $(this).val("OFF");
    } else {
      // document.getElementById("ritenuta").style.display='block';
      // document.getElementById("ritenutaSwitch").value = "ON";
      $("#ritenuta").slideDown();
      $(this).val("ON");
    }
  });
  
}); 

// fine script