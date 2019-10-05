var loadingControl;
var menuPrec;
var pageIndex;

window.onload = function(){
	// init page
	loadingControl = new loading();
	menuPrec = document.querySelector('#nav-principale .nav li.active' );
	changerForm( login_form() );
}

function menuClick( elm ){
	menuPrec.classList.remove('active');
	elm.classList.add('active');
	menuPrec = elm;

}

// listes des pages
function hundleRankUi(){
	status = "add";
	if( logined_rank == "Admin" ) status = "remove";
	document.querySelectorAll('.admin-only').forEach(
		function( elm ){
			eval("elm.classList."+ status + "('hidden')");
		}
	);
}

function pageAccueil(){
return`
	
	<div class="dPAccuiel">

		<div class="dusername"> <span class="span2"> Bonjour </span> <span id="lbl_user" class="username span2">`+logined_user+`</span>   
		</div>
		<div class="dusername userImg"> <img style="float:right; margin-top:-4px;" src="images/Use.png" alt="" /> </div>
	<div style="display:flex;clear:both;justify-content: center;">
		<div class="dAujourdui">
			<div style="width:80%; text-align:center; margin:auto; margin-top: 5px;"> <span>Produits</span> </div>
			<div class="dAccLeft" style="margin-top:15px;">  <span class="username span2">Nombre de Produits :</span> </div>
			<div class="dAccRight"><span class="username span2">` + dbGets("SELECT count(*) FROM Produits")[0]["count(*)"] + `</span></div>
			<div class="dAccLeft""> <span class="username span2">Valeur du stock :</span> </div>
			<div class="dAccRight"> <span class="username span2">`+dbGets("SELECT SUM(Quantite) from Produits")[0]["SUM(Quantite)"]+ `</span ></div>
			<div class="dAccLeft""> <span class="username span2">Prix d'Inventaires :</span> </div>
			<div class="dAccRight"> <span class="username span2">`+dbGets("SELECT SUM(PrixU) from Produits")[0]["SUM(PrixU)"]+ `,00</span ></div>
			<div class="dAccLeft""> <span class="username span2">Produit faible :</span> </div>
			<div class="dAccRight"> <span class="username span2">` + dbGets("SELECT count(*) FROM Produits WHERE Quantite <= limits")[0]["count(*)"] + `</span ></div>
			<button class="green" onclick="viewProduitFaile()" style="display:block;width:80%;margin:auto;margin-top:10px;background:#b22222;"> Afficher </button>
		</div>

		<div class="dAujourdui">
			<div style="width:80%; text-align:center; margin:auto; margin-top: 5px;"> <span>Fourniseurs</span> </div>
			<div class="dAccLeft" style="margin-top:15px;">  <span class="username span2">Nombre de Fourniseurs :</span> </div>
			<div class="dAccRight"><span class="username span2"> ` + dbGets("SELECT count(Ref_fou) FROM Fournisseurs")[0]["count(Ref_fou)"] + ` </span></div>
		<!-- <div class="dAccLeft""> <span class="username span2">Produit faible :</span> </div>
			<div class="dAccRight"> <span class="username span2">0</span ></div>
			<div class="dAccLeft""> <span class="username span2">Dernier Produits :</span> </div>
			<div class="dAccRight"> <span class="username span2">3</span ></div>
			<div class="dAccLeft""> <span class="username span2">Prix d'Inventaires :</span> </div>
			<div class="dAccRight"> <span class="username span2">14</span ></div> -->
			
		</div>

			<div class="dAujourdui">
			<div style="width:80%; text-align:center; margin:auto; margin-top: 5px;"> <span>aujourd'hui</span> </div>
			<div class="dAccLeft" style="margin-top:15px;">  <span class="username span2">Nombre de Transactions :</span> </div>
			<div class="dAccRight"><span class="username span2"> ` + dbGets("SELECT COUNT(Ref_Com) FROM detailcommande where datediff(dateCom, now()) = 0 ")[0]["COUNT(Ref_Com)"] + ` </span></div>
			<div class="dAccLeft""> <span class="username span2">Nombre d'Entrer :</span> </div>
			<div class="dAccRight"> <span class="username span2"> ` + dbGets("SELECT COUNT(Ref_Com) FROM detailcommande where datediff(dateCom, now()) = 0 AND type = 'entrer' ")[0]["COUNT(Ref_Com)"] + ` </span ></div>
			<div class="dAccLeft""> <span class="username span2">Nombre de Sortie :</span> </div>
			<div class="dAccRight"> <span class="username span2"> ` + dbGets("SELECT COUNT(Ref_Com) FROM detailcommande where datediff(dateCom, now()) = 0 AND type = 'Entrer' ")[0]["COUNT(Ref_Com)"] + ` </span ></div>
			<div class="dAccLeft""> <span class="username span2">Somme :</span> </div>
			<div class="dAccRight"> <span class="username span2"> ` + dbGets("SELECT SUM(PrixTotal) FROM detailcommande where datediff(dateCom, now()) = 0 AND type = 'Sortie' ")[0]["SUM(PrixTotal)"] + ` DH</span ></div>
			
		</div>

	</div> 

	</div>    
`;

} 


// Produit Start ================================================================
var pageProduitRecherche = "";
var pageProduitNbrPageIndex   = 0;

function pageProduit(){
	pageProduitNbrPage = Math.ceil( dbGets("select count(*) as ct FROM Produits WHERE RefPro LIKE '%" + pageProduitRecherche + "%'")[0]['ct']/7);
	pages = "";
	for( i = 1; i <= pageProduitNbrPage; i++)
		pages += "<span class='pagination' onclick='changePageProduit( parseInt(this.innerHTML) )'> " + i + " </span>";
	
	var a = `<button id="bnt_add" onClick="changerForm(pagetest());"> Nouveau produit </button>`
	if(logined_rank != "Admin"){
		a=''
	}
	var b = `
	<div class="" style="width:100%; position:absolut;">
		<div style="width:5%; height:50px; display:inline-block; height: 100%; padding: 0px 15px 0px 0px;" class=""> 	<img style="float: right; margin: -6px;" src="images/Cardboard.png" alt="" /> </div><div style="width:15%; height:50px; display:inline-block; height: 100%;" class=""><h2 style="font-family: Century Gothic;"> Liste produits </h2> </div>
	</div>
	
	<div class="right">
		<input type="text" onKeyUp='pageProduitInput()' id='rechercheInp' class="inpt1" style="display:inline-block;" placeholder="Rechercher" value="`+ (pageProduitRecherche == "-' or Quantite <= limits -- " ? 'Produit Faible' : pageProduitRecherche) +`" >
		` + a + `
	</div>

	<div style="min-height: 400px;" > 
		<table>
		<th>Ref_pro</th>
		<th>Libellé</th>
		<th>QTE STOCK</th>
		<th>PrixU</th>
		<th>ACTION</th>
		<th>ALL</th>
		<th class='admin-only' colspan =2></th>
			
	`+ dbGets("select * FROM Produits  WHERE RefPro LIKE '%" + pageProduitRecherche + "%' LIMIT " + pageProduitNbrPageIndex * 7 + "," + 7 )
		.map( function( elm ){ 
			return "<tr> <td>"+ elm['RefPro'] +"</td> <td>"+ elm['Libelle'] +"</td> <td>" +elm['Quantite']+ "</td> <td>"+ elm['PrixU'] +",00 DH </td> <td style='width:150px;'> <img onClick = \"ProduitMinus(" + elm['Ref_pro'] + ", document.getElementById( 'txt_"+elm['Ref_pro']+" ').value )\"' class='icons' src='images/Minus.png'/> <input class='txtadd' id='txt_"+elm['Ref_pro']+" ' value='1' type='number' /> <img onClick = \"ProduitAdd(" + elm['Ref_pro'] + ", document.getElementById( 'txt_"+elm['Ref_pro']+" ').value )\";  class='icons' src='images/Add.png'/> </td> <td> <img onClick = 'pageView();remplireProduitView("+elm['Ref_pro']+");'  class='icons' src='images/Eye.png'/> </td> <td class='admin-only' onClick =' remplireProduit( " + elm['Ref_pro'] + "); alertBox(pageDeleteProduit());'><img  class='icons' src='images/b7843f71.png'> </td> <td class='admin-only'  onclick=' changerForm(pageModiferProduit()); remplireProduitEdit( " + elm['Ref_pro'] + " );'> <img class='icons' src='images/icons8_Edit_32px.png' /> </td> </tr>" 
		})
		.join('') +`
	</table>
	</div>
` + pages;

	return b;
}



function changePageProduit( nbr ){
	pageProduitNbrPageIndex = nbr - 1;
	pageIndex = nbr;
	changerForm( pageProduit() );
}

function pageProduitInput(){
	pageProduitNbrPageIndex   = 0;
	value = document.getElementById('rechercheInp').value;
	pageProduitRecherche = value;
	changerForm( pageProduit() );
	elm = document.getElementById('rechercheInp');
	elm.focus();
	elm.selectionStart = elm.selectionEnd = elm.value.length;
}

function ajouterProduit(){
	var Libellé = txtLib.value;
	var Ref = txtRef.value;
	var d = txtDes.value;
	var p = parseFloat(txtPrixU.value);
	var prixVente = parseFloat(txtPrixV.value);
	var LimitQte = parseFloat(txtLimitQte.value);
	var q = parseFloat(txtQte.value);
	var f = document.getElementById('cmbFou').value.split(" - ")[0];
	var flag = false;
	var msj = "";

	// check if data vide
	if (Libellé == ""){ 
        msj  = "<span style='display:block;'>Vous avez oublié d'entrer la Libellé</span> ";
        flag = true;
        }

    if (Ref == ""){ 
        msj  += "<span style='display:block;'>Vous avez oublié d'entrer la Réference</span> ";
        flag = true;
        }
       
	if(isNaN(q)){
		msj += "<span style='display:block;'>la Quantite doit être numérique non null.</span> \n";
		flag = true;
		
	}

	if(isNaN(p)){
		msj += "<span style='display:block;'>le Prix doit être numérique non null.</span> \n";
		flag = true;
	}

	if(d === "" ){
		msj += "<span style='display:block;'> la description doit être non null. </span> \n";
		flag = true;
	}

	if(flag){
		alertBox(msj);
		return;
	}

	// check if user already exist by RefFou
	data =  dbGets("select count(*) FROM Produits WHERE RefPro = '" + Ref +"' " )[0]["count(*)"];
	if(data != 0 ){
		msj = "Le produit déjà Inscrit!";
		alertBox( msj );
		return;
	}

	 // insert to db
	dbPost("insert into Produits(RefPro,Libelle,DescriptionP,Quantite,PrixU,Ref_fou,limits,prixV) values ('"+Ref+"','"+Libellé+"','"+d+"',"+q+","+p+","+f+","+LimitQte+","+prixVente+")");
	changerForm( pageProduit() );
}

function deleteProduit(){
	dbPost("DELETE FROM Produits WHERE Ref_pro = " + saved_id );
	changerForm( pageProduit() );
}
var saved_id ;
function remplireProduit( nbr ){
	saved_id = nbr;
	dbGets("select * from Produits where Ref_pro =" +nbr)
	.map( function( elm ){ document.getElementById('txtDes').value = elm['DescriptionP'] ; document.getElementById('txtQte').value = elm['Quantite']  ; document.getElementById('txtPrixU').value = elm['PrixU']   })
	.join('')
}

function remplireProduitView( nbr ){
	saved_id = nbr;
	dbGets("select * from Produits where Ref_pro =" +nbr)
	.map( function( elm ){
		//remplire label
	 document.getElementById('lbl_Desqreption').innerText = elm['DescriptionP'];
	 document.getElementById('lbl_libelle').innerText     = elm['Libelle'];
	 document.getElementById('lbl_reference').innerText   = elm['RefPro'];
	 document.getElementById('lbl_fournisseur').innerText = elm['Ref_fou'];
	 document.getElementById('lbl_PrixAch').innerText     = elm['PrixU'];
	 document.getElementById('lbl_QteTotal').innerText    = elm['Quantite'];
	 document.getElementById('lbl_LimitQte').innerText    = elm['limits'];
	 document.getElementById('lbl_PrixVent').innerText    = elm['prixV'];
	new QRious({
          element: document.getElementById('qrCode'),
          value: elm['RefPro']
        })
	   })
	.join('');

}

function remplireProduitEdit( nbr ){
	saved_id = nbr;
	dbGets("select * from Produits where Ref_pro =" +nbr)
	.map( function( elm ){
	 // remplire Input
	 document.getElementById('txtDes').value      = elm['DescriptionP'];
	 document.getElementById('txtLib').value      = elm['Libelle'];
	 document.getElementById('txtRef').value      = elm['RefPro'];
	 // remplir combobox
	 elm_selected = elm['Ref_fou'] + " - " + dbGets('SELECT DescriptionF FROM Fournisseurs WHERE Ref_fou = ' + elm['Ref_fou'] )[0]['DescriptionF'];
	 console.log( elm_selected );
	 for( i = 0 ; document.getElementById('cmbFou').options.length > i ; i++){
	 	if( document.getElementById('cmbFou').options[i].value == elm_selected ) document.getElementById('cmbFou').options[i].selected = true;
	 }
	 document.getElementById('txtPrixU').value    = elm['PrixU'];
	 document.getElementById('txtQte').value      = elm['Quantite'];
	 document.getElementById('txtLimitQte').value = elm['limits'];
	 document.getElementById('txtPrixV').value    = elm['prixV'];
	   })
	.join('');
}



//function modifierProduit(){
//	dbPost("UPDATE produits set descriptionP = '"+txtDes.value+"' , Quantite = "+txtQte.value+" , PrixU = "+txtPrixU.value+"  WHERE Ref_pro =" +saved_id);
//}

function ProduitAdd( nbr , v ){
	dbPost("UPDATE produits set Quantite = Quantite + "+v+" WHERE Ref_pro =" +nbr);
	dbPost("insert into detailcommande(dateCom,Ref_pro,Qtite,Empolyee,PrixTotal,type) VALUES(NOW(),"+nbr+","+v+",'"+logined_user+"',"+dbGets('SELECT PrixU FROM Produits WHERE Ref_pro = ' + nbr)[0]['PrixU']  * v +",'Entrer' )");
	changerForm( pageProduit() );
}

function ProduitMinus( nbr , v ){
	dbPost("UPDATE produits set Quantite = Quantite - "+v+" WHERE Ref_pro =" +nbr);
	dbPost("insert into detailcommande(dateCom,Ref_pro,Qtite,Empolyee,PrixTotal,type) VALUES(NOW(),"+nbr+","+v+",'"+logined_user+"',"+dbGets('SELECT prixV FROM Produits WHERE Ref_pro = ' + nbr)[0]['prixV']  * v +",'Sortie' )");
	changerForm( pageProduit() );
}

// ================================================================
/*
// Page AjouterProudut ========================
function pageAjouterProduit(){ 
	return `
	
	<h1>Nouveau produit</h1>
	<input class="inpt" type="text" id = "txtLib" placeholder="Libellé">
	<input class="inpt2" type="text" id = "txtRef" placeholder="Réference">
	<input class="inpt2" type="text" id = "txtDes" placeholder="Description">
	
	<select class="CMB" name="" id="cmbFou">

	`+ dbGets("select * from Fournisseurs")
		.map(function( elm ){ return " <option> "+elm['Ref_fou']+" - "+elm['descriptionF']+" </option> " }) 
		.join(' ')
		+`

	</select>
			
	<input class="inpt2" type="text" id = "" placeholder="Description">		
	<input class="inpt2" type="text" id = "txtPrixU" placeholder="Prix">
	<input class="inpt2" type="text" id = "txtQte" placeholder="Quantite">
	

	
	

	<button class="green" onClick = "ajouterProduit(); document.querySelector('#alertBox').classList.toggle('hidden');"> Enregistrer </button>

`;
}
*/
// logi ============

var login_form = function(){
	return `
	
	
	<div class="dPageLogin">
		<span  style="display: block;font-size: 25px;padding-bottom: 27px;"> <img style="width:400px;" src="images/logo.jpg" alt="d" /> </span>
		
		<div style="width:70%;height:50px;margin:auto;margin-bottom:10px;"> <input style="width:100%;" class="" type="text" id = "login" placeholder="Login"> </div>
		<div style="width:70%;height:50px;margin:auto;"> <input type="password" style="width:100%;"   class="" type="text" id = "mdp" placeholder="Mot de passe"> </div>

			<button style="margin-top: 35px;" class="green" onClick = "login_connection()"> Se connecter </button>
			
	</div>

	<div class="dPageLogin" style="padding: 0;background: #f7f7f7;margin-top: 20px;FONT-SIZE: 14px;">
		<span>&copy 2019 Logiciel STM  | SYSTEM GESTION DE STOCK</span>
	</div>

	

	
	`;
}

var logined_user;
var logined_rank;

var login_connection = function(){
	login = document.getElementById('login').value.replace("'","");
	mdp   = document.getElementById('mdp').value.replace("'","");
	req   = dbGets("SELECT type FROM users WHERE login = '"+ login +"' AND mdp = '"+ mdp +"' ");
	if( req.length == 0 ){
		alertBox( '<h1> Utilisateur introuvable! </h1>' );
		return; 
	}

	
	
	// data is OK! 
	logined_rank = req[0]['type'];
	logined_user = login; 
	//document.getElementById('lbl_user').innerText = elm['type'];	
	document.getElementById('nav-principale').style.left = "0px";
	changerForm( pageAccueil() );
}

// ================================================================


// Page ModiferProudut ========================
function pageModiferProduit(){
	return `
	<img id="imgBack" src="images/w_Left.png" alt="" onClick="changerForm(pageProduit())" />
	
	<div class="dP">
		
		<div class="dTop"> <input class="Bigtxtbox1" placeholder="Libellé" id="txtLib" type="text" /> </div>
		<div class="dLeft">
			
			<div class="smalDiv"><input class="txtbox" id="txtRef" type="text" placeholder="Réference Produit" /></div>
			
			<div class="smalDiv">
			
			<select class="txtbox" name="" id="cmbFou">
					
				`+ dbGets("select * from Fournisseurs")
					.map(function( elm ){ return " <option> "+elm['Ref_fou']+" - "+elm['descriptionF']+" </option> " }) 
					.join(' ')
					+`

			</select>

			</div>

		</div>
		
		<div class="dRight"> <textarea placeholder="Description" class="Bigtxtbox" name="" id="txtDes"></textarea> </div>
	</div>

	<div class="Divline"></div>

	<div class="dP2">
		<div class="div2"> <input id="txtPrixU" class="txtbox" type="text" placeholder="Prix d'achat" /> </div>
		<div class="div2B"> <span>Prix</span> </div>
		<div class="div2"> <input id="txtPrixV" class="txtbox" type="text" placeholder="Prix de vente" /> </div>
	</div>

	<div class="Divline"></div>

	<div class="dP2">
		<div class="div2"> <input id="txtQte" class="txtbox" type="text" placeholder="Quantite Total" /> </div>
		<div class="div2B"> <span>Quantite</span>  </div>
		<div class="div2"> <input id="txtLimitQte" class="txtbox" type="text" placeholder="Limit de Quantite" /> </div>
	</div>
	<div class="Divline"></div>
	
	<button class="green" onClick = "modifierProduit();"> Enregistrer </button>	
`;
}
// ================================================================


// Page pageModiferFournisseur ========================
function pageModiferFournisseur(){ 
	return `
	

	<div class="" style="width:100%; position:flex;">
		 <img id="imgBack" src="images/w_Left.png" alt="" onClick="changerForm(pageFournisseur())" /><h2  class="classfixh2">  Créer fournisseur </h2> </div>
	</div>
	

	<div class="dP2">
		<div class="div2"> <input id="txtNom" class="txtbox" type="text" placeholder="Nom" /> </div>
	
		<div class="div2"> <input id="txtRefr" class="txtbox" type="text" placeholder="Réference" /> </div>
	</div>

	

	<div class="dP2">
		<div class="div2"> <input id="txtFixe" class="txtbox" type="text" placeholder="Fixe" /> </div>
		
		<div class="div2"> <input id="txtMobile" class="txtbox" type="text" placeholder="Mobile" /> </div>
	</div>
	

		<div class="dP2">
		<div class="div2"> <input id="txtEmail" class="txtbox" type="email" placeholder="Email" /> </div>
		
		<div class="div2"> <input id="txtSite" class="txtbox" type="text" placeholder="Adresse" /> </div>
	</div>
	
	
	
	<button class="green" onClick = "modifierFournisseur(); changerForm( pageFournisseur() );document.querySelector('#alertBox').classList.toggle('hidden');"> Enregistrer </button>	
`;
}
// ================================================================


// Page pageModiferFournisseur ========================
function pageModiferUser(){ 
	return `
	

	<div class="" style="width:100%;">
		 <img id="imgBack" src="images/w_Left.png" alt="" onClick="changerForm(pageFournisseur())" /><h2  class="classfixh2">  Modifier Utilisateur </h2> </div>
	</div>
	
		<select style="width:137px;height:40px;" name="" id="cmbU">
				<option value="Admin">Administrateur</option>
				<option value="utilisateur">Utilisateur</option>
		</select>

		 <input id="txtLogin" class="" type="text" placeholder="Login" /> 
		 <input id="txtMdp" class="" type="text" placeholder="mot de passe" /> 
	
	<button class="green" onClick = "modifierUser(); changerForm( pageUser() );"> Enregistrer </button>	
`;
}
// ================================================================


// Page pageAjouterFournisseur ========================
function pageAjouterFournisseur(){ 
	return `
		
	<div class="" style="width:100%; position:flex;">
		 <img id="imgBack" src="images/w_Left.png" alt="" onClick="changerForm(pageFournisseur())" /><h2  class="classfixh2">  Créer fournisseur </h2> </div>
	</div>

	<div class="dP2">
		<div class="div2"> <input id="txtNom" class="txtbox" type="text" placeholder="Nom" /> </div>
	
		<div class="div2"> <input id="txtRefr" class="txtbox" type="text" placeholder="Réference" /> </div>
	</div>

	

	<div class="dP2">
		<div class="div2"> <input id="txtFixe" class="txtbox" type="text" placeholder="Fixe" /> </div>
		
		<div class="div2"> <input id="txtMobile" class="txtbox" type="text" placeholder="Mobile" /> </div>
	</div>
	

		<div class="dP2">
		<div class="div2"> <input id="txtEmail" class="txtbox" type="text" placeholder="Email" /> </div>
		
		<div class="div2"> <input id="txtSite" class="txtbox" type="text" placeholder="Adresse" /> </div>
	</div>
	
	
	<button style="color:#fff;background:#736e6e; margin-top:100px;" class="green" onClick = "changerForm( pageFournisseur() );"> Annuler </button>
	<button class="green" onClick = "ajouterFournisseur(); changerForm( pageFournisseur() );document.querySelector('#alertBox').classList.toggle('hidden');"> Enregistrer </button>

`;
}
// ================================================================

// Page AjouterProuduit ========================
function pagetest(){ 
	return `
	<img id="imgBack" src="images/w_Left.png" alt="" onClick="changerForm(pageProduit())" />
	
	<div class="dP">
		
		<div class="dTop">   <input class="Bigtxtbox1" placeholder="Libellé" id="txtLib" type="text" /> </div>
		<div class="dLeft">
			
			<div class="smalDiv"><input class="txtbox" id="txtRef" type="text" placeholder="Réference Produit" /></div>
			
			<div class="smalDiv">
			
			<select class="txtbox" name="" id="cmbFou">

				`+ dbGets("select * from Fournisseurs")
					.map(function( elm ){ return " <option> "+elm['Ref_fou']+" - "+elm['descriptionF']+" </option> " }) 
					.join(' ')
					+`

			</select>

			</div>

		</div>
		
		<div class="dRight"> <textarea placeholder="Description" class="Bigtxtbox" name="" id="txtDes"></textarea> </div>
	</div>

	<div class="Divline"></div>

	<div class="dP2">
		<div class="div2"> <input id="txtPrixV" class="txtbox" type="number" placeholder="Prix de vente" /> </div>
		<div class="div2B"> <span>Prix</span> </div>
		<div class="div2"> <input id="txtPrixU" class="txtbox" type="number" placeholder="Prix d'achat" /> </div>
	</div>

	<div class="Divline"></div>

	<div class="dP2">
		<div class="div2"> <input id="txtLimitQte" class="txtbox" type="number" placeholder="Limit de Quantite" /> </div>
		<div class="div2B"> <span>Quantite</span>  </div>
		<div class="div2"> <input id="txtQte" class="txtbox" type="number" placeholder="Quantite Total" /> </div>
	</div>
	<div class="Divline"></div>
		<button class="green" onClick = "ajouterProduit();"> Enregistrer </button>



	

	

`;
}
// ================================================================

// Page ModiferProudut ========================
function pageDeleteProduit(){ 
	return `
	
	<h1>Vous voulez vrimment suprimmer cette produit ! `+saved_id+` </h1>
	
	

	<button class="green" onClick = "deleteProduit();document.querySelector('#alertBox').classList.toggle('hidden')" > Valider </button>
	<button class="green" onclick=" document.querySelector('#alertBox').classList.toggle('hidden')" > Annuler </button>

`;
}
// ================================================================

// Page ModiferProudut ========================
function pageDeleteFournisseur(){ 
	return `
	
	<h1>Vous voulez vrimment suprimmer cette Fournisseur !  </h1>
	
	

	<button class="green" onClick = "deleteFournisseur();document.querySelector('#alertBox').classList.toggle('hidden')" > Valider </button>
	<button class="green" onclick=" document.querySelector('#alertBox').classList.toggle('hidden')" > Annuler </button>

`;
}
// ================================================================




// Fournisseur Start ================================================================
var pageFournisseurRecherche = "";
var pageFournisseurNbrPageIndex   = 0;

function pageFournisseur(){
pageFournisseurNbrPage = Math.ceil( dbGets("select count(*) as ct FROM Fournisseurs WHERE RefFou LIKE '%" + pageFournisseurRecherche + "%'")[0]['ct']/7);
pages = "";

for( i = 1; i <= pageFournisseurNbrPage; i++)
		pages += "<span class='pagination' onclick= 'changePageFournisseur( parseInt(this.innerHTML) )'> " + i + " </span>";



return `
	<div class="" style="width:100%;">
		<div style="width:5%; height:50px; display:inline-block; height: 100%; padding: 0px 15px 0px 0px;" class=""> 	<img style="float: right; margin: -6px;" src="images/Transit.png" alt="" /> </div><div style="width:15%; height:50px; display:inline-block; height: 100%;" class=""><h2  style="font-family: Century Gothic;width: 492px;"> Liste fournisseurs </h2> </div>
	</div>

	<div class="right">
		<input type="text" onKeyUp='pageFournisseurInput()' id='rechercheInp' class="inpt1" style="display:inline-block;" placeholder="Rechercher" value="`+ (pageFournisseurRecherche == "-' or Quantite <= limits -- " ? 'Produit Faible' : pageFournisseurRecherche) +`" >
		<button class="admin-only" onClick="changerForm( pageAjouterFournisseur() ) "> Nouveau Fournisseur </button> 
	</div>
	<div style="min-height: 372px;">

	<table>
		<th>Ref_Fou</th>
		<th>Nom</th>
		<th>TELEPHONE</th>
		<th>ADRESSE</th>
		<th>EMAIL</th>
		<th class="admin-only"></th>
		<th class="admin-only"></th>

		`+ dbGets("select * FROM Fournisseurs  WHERE RefFou OR DescriptionF LIKE '%" + pageFournisseurRecherche + "%' LIMIT " + pageFournisseurNbrPageIndex * 7 + "," + 7 )
		.map(function( elm ){ return "<tr> <td>"+ elm['RefFou'] +"</td> <td>"+ elm['descriptionF'] +"</td> <td>" +elm['TelF']+ "</td> <td>"+ elm['AdresseF'] +" </td> <td> "+elm['Email']+" </td> <td class='admin-only' onclick='alertBox(pageDeleteFournisseur());remplireFournisseur( " + elm['Ref_fou'] + " );'><img class='icons' src='images/b7843f71.png'> </td> <td class='admin-only' onClick='changerForm( pageModiferFournisseur() ) ;remplireFournisseur("+elm['Ref_fou']+") ;'> <img class='icons' src='images/icons8_Edit_32px.png' /> </td> </tr>" }) 
		.join(' ')
		+`

	</table>

	</div>

` +pages;
;
}

function changePageFournisseur( nbr ){
	pageFournisseurNbrPageIndex = nbr - 1;
	pageIndex = nbr;
	changerForm( pageFournisseur() );
}

function pageFournisseurInput(){
	pageFournisseurNbrPageIndex   = 0;
	value = document.getElementById('rechercheInp').value;
	pageFournisseurRecherche = value;
	changerForm( pageFournisseur() );
	elm = document.getElementById('rechercheInp');
	elm.focus();
	elm.selectionStart = elm.selectionEnd = elm.value.length;
}

var saved_idFou ;
function remplireFournisseur( nbr ){
	saved_idFou = nbr;
	dbGets("select * from fournisseurs where Ref_fou =" +nbr)
	.map( function( elm ){ 
		document.getElementById('txtRefr').value   = elm['RefFou'] ;
		document.getElementById('txtNom').value    = elm['descriptionF']  ;
		document.getElementById('txtMobile').value = elm['TelF'];
		document.getElementById('txtSite').value   = elm['AdresseF'];
		document.getElementById('txtEmail').value  = elm['Email'] 
		  })
	.join('')
}

function ajouterFournisseur(){

	var refFour = document.getElementById('txtRefr').value;
	var Nom     = document.getElementById('txtNom').value;
	var mobil   = document.getElementById('txtMobile').value ;
	var site    = document.getElementById('txtSite').value ;
	var Email   = document.getElementById('txtEmail').value ;
	
	//var flag = false;
	//var msj = "";

	dbPost("insert into Fournisseurs(RefFou,descriptionF,TelF,AdresseF,Email) values ('"+refFour+"' , '"+Nom+"', '"+mobil+"', '"+site+"','"+Email+"' )");
	changerForm( pageFournisseur() );

}

function modifierFournisseur(){
	dbPost("UPDATE Fournisseurs set RefFou ='"+txtRefr.value+"' , descriptionF ='"+txtNom.value+"', TelF = '"+txtMobile.value+"', Email = '"+txtEmail.value+"',AdresseF = '"+txtSite.value+"'  WHERE Ref_fou =" +saved_idFou);
}

function deleteFournisseur(){
	dbPost("DELETE FROM fournisseurs WHERE Ref_fou = " + saved_idFou );
	changerForm( pageFournisseur() );
}

// ================================================================

// Page Transaction ========================
var pageTransactionRecherche = "";
var pageTransactionNbrPageIndex   = 0;
var reqom = "SELECT * FROM detailcommande";
function pageTransaction(){ 
	pageTransactionNbrPage = Math.ceil( dbGets("select count(*) as ct FROM detailcommande WHERE Ref_Com LIKE '%" + pageTransactionRecherche + "%'")[0]['ct']/10);
pages = "";

for( i = 1; i <= pageTransactionNbrPage; i++)
		pages += "<span class='pagination' onclick= 'changePageTransaction( parseInt(this.innerHTML) )'> " + i + " </span>";



return `
	
	<div style="width:100%;">
		<div style="width:5%; height:50px; display:inline-block; height: 100%; padding: 0px 15px 0px 0px;" class=""> 	<img style="float: right; margin: -6px;" src="images/Transfer.png" alt="" /> </div><div style="width:15%; height:50px; display:inline-block; height: 100%;" class=""><h2  style="font-family: Century Gothic;width: 492px;"> Transaction </h2> </div>
	</div>

	<div class="right" style="margin: 10px;">
		 <input class="radiob" id="RdTous" type="radio" name="transaction" value="Tous" onclick="transactionPerTime( 'Tous' )" selected /> <span>Tous</span> 
		 <input class="radiob" id="RdMois" type="radio" name="transaction" value="Ce Mois" onclick="transactionPerTime( 'CeMois' )"  /> <span>Ce Mois</span>
		 <input class="radiob" id="RdAujourdhui" type="radio" name="transaction" value="Aujourd'hui" onclick="transactionPerTime( 'Aujourd' )"/> <span>Aujourd'hui</span>
	</div>

	<div style="min-height: 413px;">

	<table>
		<th>Date</th>
		<th>Réference</th>
		<th>Empolyeé</th>
		<th>Quantite</th>
		<th>Prix Total</th>
		<th>ACTION</th>

		`+ dbGets(" "+reqom+" order by Ref_Com desc LIMIT " + pageTransactionNbrPageIndex * 10 + "," + 10 )
		.map(function( elm ){ return "<tr> <td>"+ elm['dateCom'] +"</td> <td>" +dbGets('SELECT RefPro FROM Produits WHERE Ref_pro = ' + elm['Ref_pro'] )[0]['RefPro']+"</td> <td>" +elm['Empolyee']+ "</td> <td>"+ elm['Qtite'] +" </td> <td> "+elm['PrixTotal']+",00 DH </td> <td> "+elm['type']+" </td> </tr>" }) 
		.join(' ')
		+`

	</table>

	<div class="right" style="margin: 10px;">
		  <span id="spnEntr" style="DISPLAY: block; margin-bottom: 6px;">Montant Total Sortie : 30 000 DH</span> 
		  <span spn="spnSrt">Montant Total Entrer :  DH</span>
	</div>

	</div>

` +pages; 
;
}

function transactionPerTime( time ){
	if( time == "Tous" ){
		reqom = "SELECT * FROM detailcommande"; 
		
		changerForm(pageTransaction());
		document.getElementById('RdTous').checked=true
		var a =  dbGets("SELECT * FROM detailcommande")[0]["*"] 
		document.getElementById('spnSrt').innerHTML= a;
	}
	else if(time == "CeMois"){
		reqom = "SELECT * FROM detailcommande where Ref_com = 62 "; 
		
		changerForm(pageTransaction());
		document.getElementById('RdMois').checked=true
	}

	else if(time == "Aujourd"){
		reqom = "SELECT * FROM detailcommande where Ref_com = 62 "; 
		
		changerForm(pageTransaction());
		document.getElementById('RdAujourdhui').checked=true
	}
	

}

// ================================================================
function changePageTransaction( nbr ){
	pageTransactionNbrPageIndex = nbr - 1;
	pageIndex = nbr;
	changerForm( pageTransaction() );
}

// Page GUI ========================
var pageGUI = `

	<button> Ajouter </button> <button class="green"> Enregistrer </button>
	
	<div class="right">
		<button> Ajouter </button> <button class="green"> Enregistrer </button>
	</div>
	
	<button onClick="alertBox( pageProduit() )" class="green" > Message </button>
	
	<input type="text" placeholder="Description">

`;

// ================================================================

// Page Users========================
function pageUser(){
	//if (logined_rank!="admin") {alertBox("vous ete pas le admin"); return}
	//else 
return `
<div class="" style="width:100%;">
		<div style="width:5%; height:50px; display:inline-block; height: 100%; padding: 0px 15px 0px 0px;" class=""> 	<img style="float: right; margin: -6px;" src="images/Contacts3.png" alt="" /> </div><div style="width:15%; height:50px; display:inline-block; height: 100%;" class=""><h2  style="font-family: Century Gothic;width: 492px;"> Gestion des utilisateurs </h2> </div>
</div>

<div>

<input id="txtLogin" class="inpt1" type="text" placeholder="Login" required>
<input id="txtMdp" class="inpt1" type="text" placeholder="Mot de passe" required>
<select style="width: 220px;" class="" name="" id="cmbUser">
<option value="">Admin</option>
<option value="">User</option>
</select>


<button class="green" onClick="ajouterUsers();"> Ajouter Utilisateur </button>

<table class="SmalTable">
<th>Login</th>
<th>Mot de passe</th>
<th>Role</th>
<th colspan = 2></th>

`+ dbGets("select * FROM Users")
		.map( function( elm ){ return "<tr> <td>"+ elm['login'] +"</td> <td>"+ elm['mdp'] +"</td> <td>" +elm['type']+ "</td>  <td onClick =' alertBox(pageDeleteUser()); remplireProduit( " + elm['idUser'] + ");'><img class='icons' src='images/b7843f71.png'> </td> <td  onclick='changerForm(pageModiferUser()) ; remplireUser( " + elm['idUser'] + " );'> <img class='icons' src='images/icons8_Edit_32px.png' /> </td> </tr>" } )
		.join('')
	+`
</table>

</div>
`;
}

function ajouterUsers(){
	
	var e = document.getElementById("cmbUser");
	Role = e.options[e.selectedIndex].text;
	var Login = document.getElementById("txtLogin").value;
	var Mdp = document.getElementById("txtMdp").value;
	var msj;
	var flag = true;
	if(Login==""){
		msj="login vide"
		flag = false;
	}
	if(Mdp==""){
		msj+="mdp vide"
		flag = false;
	}
	if(flag!=true){
		alertBox(msj);
		return;
	}

	dbPost("insert into users(login,mdp,type) values ( '"+Login+"', '"+Mdp+"','"+Role+"' )");
	changerForm( pageUser() );
}

function deleteUser(){
	dbPost("DELETE FROM users WHERE idUser = " + saved_id );
	changerForm( pageUser() );
}
function remplireProduit( nbr ){
	saved_id = nbr; 
	dbGets("select * from users where idUser =" +nbr).map( function( elm ){ document.getElementById('txtLgn').value = elm['Login'] ; document.getElementById('txtPass').value = elm['mdp']  ; document.getElementById('Role').value = elm['type']   })
		.join('')
}
var saved_idUser;
function remplireUser( nbr ){
	saved_idUser = nbr; 
	dbGets("select * from users where idUser =" +nbr).map( function( elm ){
		 document.getElementById('txtLogin').value = elm['login'] ;
		 document.getElementById('txtMdp').value = elm['mdp'];
		 // remplir combobox
		 var elm_selected = elm['type'];
		 for( i = 0 ; document.getElementById('cmbU').options.length > i ; i++){
		 	if( document.getElementById('cmbU').options[i].value == elm_selected ) document.getElementById('cmbU').options[i].selected = true;
		 }

	})
		.join('')
}

function modifierProduit(){
	var f = document.getElementById('cmbFou').value.split(' - ')[0];

	
	dbPost("UPDATE produits set Libelle ='"+txtLib.value+"' , RefPro ='"+txtRef.value+"', descriptionP = '"+txtDes.value+"', PrixU = "+txtPrixU.value+" , prixV = "+txtPrixV.value+", limits = "+txtLimitQte.value+",  Quantite = "+txtQte.value+",Ref_fou="+f+" WHERE Ref_pro =" +saved_id);
	changerForm( pageProduit() );
	alertBox('<span>avec succe</span>')
}

function modifierUser(){
	var f = document.getElementById('cmbU').value;

	
	dbPost("UPDATE users set login ='"+txtLogin.value+"' , Mdp ='"+txtMdp.value+"', type = '"+f+"' WHERE idUser =" +saved_idUser);
	changerForm( pageUser() );
	alertBox('<span>avec succe</span>')
}

// ================================================================
//var saved_id;


// Page ModiferProudut ========================
function pageDeleteUser(){ 
	return `
	
	<h1>Vous voulez vrimment suprimmer cette USER ! </h1>
	
	

	<button class="green" onClick = "deleteUser();document.querySelector('#alertBox').classList.toggle('hidden')" > Valider </button>
	<button class="green" onclick=" document.querySelector('#alertBox').classList.toggle('hidden')" > Annuler </button>

`;
}
// =============================================================

// Page test ========================
function pageView(){ 
	alertBox( `
	<div style="text-align:left;">
	<div class="dP">
		<div class="dDL2"> <div class="diesp"><span>Libellé :</span></div> <span class="span2" id="lbl_libelle">---------</span> </div> 
	 	
	</div>

	<div class="dP">
		
		<div class="dDR"> <div class="diesp"><span>Réference :</span></div> <span class="span2" id="lbl_reference">---------</span>  </div> 
		<div class="dDL"> <div class="diesp"><span>Fournisseur :</span></div> <span class="span2" id="lbl_fournisseur">---------</span> </div> 
	</div>	

	<div class="dP">
		
		<div class="dDR"> <div class="diesp"><span>Prix Achat :</span></div> <span class="span2" id="lbl_PrixAch">---------</span>  </div> 
		<div class="dDL"> <div class="diesp"><span>Prix Vente :</span></div> <span class="span2" id="lbl_PrixVent">---------</span> </div> 
	</div>	

	<div class="dP">
		
		<div class="dDR"> <div class="diesp"><span>Quantite Total :</span></div> <span class="span2" id="lbl_QteTotal">---------</span>  </div> 
		<div class="dDL"> <div class="diesp"><span>Quantite Limit :</span></div> <span class="span2" id="lbl_LimitQte">---------</span> </div> 
	</div>

	<div class="dP">
		<div class="dDL2"> <div class="diesp"><span>Description :</span></div> <span class="span2" id="lbl_Desqreption">---------</span> </div> 
	</div>
		<div class="dDLR" style="cursor:pointer; text-align: center;margin: auto;display: block;"> <img onclick='print(  ("<img src=" + this.src + ">").repeat( 30 + 45 - 21 )  )' src='' id='qrCode' style='width:'200px;height:200px;' > </div>
</div>
`);
}
// ================================================================


viewProduitFaile = function(){
	pageProduitRecherche = "-' or Quantite <= limits -- ";
	changerForm( pageProduit() );
}

// Page Deconexion ========================
function pageDeconexion(){ 
	changerForm(login_form());
	document.getElementById('nav-principale').style.left = '-300px';
}
// =============================================================


