/**
 * Esta función muestra un formulario de login (para fetch)
 * El botón enviar del formulario deberá invocar a la función doLogin
 * Modifica el tag div con id main en el html
 */
function showLogin(){

    const mainTag = document.getElementById("main");

    var html = `
    <p>Usuario</p> 
    <input type='text' id='usuario' name='usuario' required><br>
    <p>Contraseña</p> 
    <input type='password' id='password' name='password' required><br>
    <button style = 'margin-top: 10px' onclick='doLogin()'>Iniciar Sesion</button>`;

    mainTag.innerHTML = html;

}

/**
 * Esta función recolecta los valores ingresados en el formulario
 * y los envía al CGI login.pl
 * La respuesta del CGI es procesada por la función loginResponse
 */
function doLogin(){

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    //consultamos con login.pl
    // url a momento de conectar con perl
    let url = "http://192.168.1.6/~alumno/proyectoFinal/cgi-bin/login.pl?usuario="+usuario+"&password="+password;
    console.log(url);

    xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () { //llamamos a loginResponse
        loginResponse(xhr.responseXML);
    };




}
/**
 * Esta función recibe una respuesta en un objeto XML
 * Si la respuesta es correcta, recolecta los datos del objeto XML
 * e inicializa la variable userFullName y userKey (e usuario)
 * termina invocando a la funcion showLoggedIn.
 * Si la respuesta es incorrecta, borra los datos del formulario html
 * indicando que los datos de usuario y contraseña no coinciden.
 */
function loginResponse(xml){

    // <user><owner><firstName><lastName>

    const userTag = xml.children[0];
    console.log(userTag);

    if (!(userTag.textContent == "\n")) { 
        let owner = userTag.children[0].textContent;
        let firstName = userTag.children[1].textContent;
        let lastName = userTag.children[2].textContent;
        
        userFullName = firstName+" "+ lastName;
        userKey = owner;

        showLoggedIn();
       
    }

    else {// si el valor es vacio, vaciamos formulario
        document.getElementById("usuario").value = "";
        document.getElementById("password").value = "";
    }



}
/**
 * esta función usa la variable userFullName, para actualizar el
 * tag con id userName en el HTML
 * termina invocando a las functiones showWelcome y showMenuUserLogged
 */
function showLoggedIn(){

    document.getElementById("userName").textContent = userFullName;
    showWelcome();
    showMenuUserLogged();
  


}


/**
 * Esta función crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la 
 * función doCreateAccount
 * */
function showCreateAccount(){

    const mainTag = document.getElementById("main");

    var html = `
    <label>Nombres: </label> 
    <input type='text' id='Nombre' name='Nombre' required><br>
    <label>Apellidos: </label> 
    <input type='text' id='Apellido' name='Apellido' required><br>
    <p>Usuario</p> 
    <input type='text' id='usuario' name='usuario' required><br>
    <p>Contraseña</p> 
    <input type='password' id='password' name='password' required><br>
    <button style = 'margin-top: 10px' onclick='doCreateAccount()'>Crear cuenta</button>`;

    mainTag.innerHTML = html;


}

/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function doCreateAccount(){
    
    const Nombre = document.getElementById("Nombre").value
    const Apellido = document.getElementById("Apellido").value
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;


    if (usuario == "" || password == "" || Nombre == "" || Apellido == "") {
        document.getElementById("Nombre").value = "";
        document.getElementById("Apellido").value = "";
        document.getElementById("usuario").value = "";
        document.getElementById("password").value = "";
    }
    else {

        let url = "http://192.168.1.6/~alumno/proyectoFinal/cgi-bin/register.pl?usuario="+usuario+"&password="+password+"&Nombre="+Nombre+"&Apellido="+Apellido;
        console.log(url);

        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.send();
        // registramos cuenta y la logeamos automaticamente
        xhr.onload = function () {
            loginResponse(xhr.responseXML);
        };

    }


}

/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario 
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
function doList(){
    // userkey = owner = usuario

    let url = "http://192.168.1.6/~alumno/proyectoFinal/cgi-bin/list.pl?usuario="+userKey;
    console.log(url);
    var xhr = new XMLHttpRequest();
    
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
      showList(xhr.responseXML);
    };

}

/**
 * Esta función recibe un objeto XML con la lista de artículos de un usuario
 * y la muestra incluyendo:
 * - Un botón para ver su contenido, que invoca a doView.
 * - Un botón para borrarla, que invoca a doDelete.
 * - Un botón para editarla, que invoca a doEdit.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function showList(xml){

    const articlesTag = xml.children[0];

    if (articlesTag.children.length == 0) { // en caso este vacio.
        document.getElementById("main").innerHTML = `<h1>No hay paginas creadas</h1>`;
    } 
    
    else {
        document.getElementById("main").innerHTML = "<h1>Listado de paginas</h1>";

        for (let i = 0; i < articlesTag.children.length; i++) { // imprimimos las paginas existentes
            //<articles><article><owner><title>

            let title = articlesTag.children[i].children[1].textContent;
            var pagina = `<span>${title}</span>
            <button onclick="doView('${userKey}','${title}')">Ver Pagina</button>
            <button onclick="doDelete('${userKey}','${title}')">Eliminar Pagina</button>
            <button onclick="doEdit('${userKey}','${title}')">Editar Pagina</button><br>`;
            document.getElementById("main").innerHTML += pagina;
            console.log(document.getElementById("main").innerHTML);

        }

    }

}

/**
 * Esta función deberá generar un formulario para la creación de un nuevo
 * artículo, el formulario deberá tener dos botones
 * - Enviar, que invoca a doNew 
 * - Cancelar, que invoca doList
 */
function showNew(){

    let showNew = `<p>Titulo</p>
    <input id='titulo' name ='titulo' type='text'><br>
    <p>Contenido-markdown</p>
    <textarea style = "width: 100%;" type="text" id ="cuerpo" name="cuerpo"></textarea><br>
    <button onclick='doNew()'>Enviar</button>
    <button onclick='doList()'>Cancelar</button>`;
  
    document.getElementById("main").innerHTML = showNew;

}

/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 * los datos deberán ser extraidos del propio formulario
 * La acción de respuesta al CGI deberá ser una llamada a la 
 * función responseNew
 */
function doNew(){
    // encodeURI reemplaza espacios con %20, entonces reemplazamos %20 con + para la url
    let titulo = encodeURIComponent(document.getElementById("titulo").value).replace(/%20/g, "+"); // para reemplazar espacios en el url
    
    let cuerpo = encodeURIComponent(document.getElementById("cuerpo").value).replace(/%20/g,"+");
    
    let url = "http://192.168.1.6/~alumno/proyectoFinal/cgi-bin/new.pl?usuario="+userKey+"&titulo="+titulo+"&cuerpo="+cuerpo;
    console.log(url);
    let xhr = new XMLHttpRequest();
      
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        responseNew(xhr.responseXML);
    };
    

}

/*
 * Esta función obtiene los datos del artículo que se envían como respuesta
 * desde el CGI new.pl y los muestra en el HTML o un mensaje de error si
 * correspondiera
 */
function responseNew(response){
   
    //<article><tittle><text>
    let article = response.children[0];
    if (article.children.length == 0) { // si esta vacio
        document.getElementById("main").innerHTML = `<h2>Error al crear nueva pagina</h2>`;
    } 
    else {
        document.getElementById("main").innerHTML = "<h2>"+article.children[0].textContent+"</h2><p>"+article.children[1].textContent+"</p>";
    }

}

/*
 * Esta función invoca al CGI view.pl, la respuesta del CGI debe ser
 * atendida por responseView
 */
function doView(owner, title){




}

/*
 * Esta función muestra la respuesta del cgi view.pl en el HTML o 
 * un mensaje de error en caso de algún problema.
 */
function responseView(response){

}

/*
 * Esta función invoca al CGI delete.pl recibe los datos del artículo a 
 * borrar como argumentos, la respuesta del CGI debe ser atendida por doList
 */
function doDelete(owner, title){

    let url = "http://192.168.1.6/~alumno/proyectoFinal/cgi-bin/delete.pl?usuario="+owner+"&titulo="+title;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        doList();
    };

}

/*
 * Esta función recibe los datos del articulo a editar e invoca al cgi
 * article.pl la respuesta del CGI es procesada por responseEdit
 */
function doEdit(owner, title){




}

/*
 * Esta función recibe la respuesta del CGI data.pl y muestra el formulario 
 * de edición con los datos llenos y dos botones:
 * - Actualizar que invoca a doUpdate
 * - Cancelar que invoca a doList
 */
function responseEdit(xml){












}
/*
 * Esta función recibe el título del artículo y con la variable userKey y 
 * lo llenado en el formulario, invoca a update.pl
 * La respuesta del CGI debe ser atendida por responseNew
 */
function doUpdate(title){








}

