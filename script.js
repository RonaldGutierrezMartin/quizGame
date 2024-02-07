//Declaración de funciones 
let template  = document.querySelector("template");
let divContenedorPreguntas = document.querySelector("#contenedorTodasPreguntas")
let botonComprobar = document.querySelector("#botonComprobar")
let botonReiniciar = document.querySelector("#botonReiniciar")
let main = document.querySelector("main")
const cantidadRespuestasPosibles = 4
let listaPreguntasSolicitadas  = []
let arrayBotonesRespuestas = []
let arrayContadorSelecciones = []
let arrayContenedoresPreguntas = []

/**
 * Funcion hace la solicitud a la api de las preguntas
 */
function solicitarPreguntas(){
    fetch('https://the-trivia-api.com/v2/questions')
    .then(res => res.json())
    .then(respuesta =>{

        listaPreguntasSolicitadas = respuesta
        dibujarPreguntas()
    })
    .catch(error => console.log(error))
}
/**
 * Función genera un númeor aleatorio
 * @param {Number} maximo número maximo que se generará
 * @returns {Number} númeero random generado
 */
const generarNumeroRandom = (maximo =>Math.floor(Math.random()*maximo))


// const ramdomizarOrdenPreguntas2 = ((arrayIncorrectas, respuetaCorrecta)=>arrayIncorrectas.splice(generarNumeroRandom(cantidadRespuestasPosibles),0,respuetaCorrecta))

/**
 * Mezcla la respuesta correcta con las incorrectas
 * @param {Array} arrayIncorrectas respuestas incorrectas 
 * @param {String} respuetaCorrecta respuesta correcta
 * @returns {Array} array de respuestas incorrectas mezcladas con la rrespuesta corrrecta
 */
function ramdomizarOrdenPreguntas(arrayIncorrectas, respuetaCorrecta){
    
    arrayIncorrectas.splice(generarNumeroRandom(cantidadRespuestasPosibles),0,respuetaCorrecta)
    return arrayIncorrectas
}

/**
 * Función pinta las perguntas solicitadas a la api en el docuemto html
 */
function dibujarPreguntas(){
    let fragmento = document.createDocumentFragment();

    listaPreguntasSolicitadas.forEach(elemento => {
        
        let tempalteClon = template.content.cloneNode(true)

        tempalteClon.querySelector(".h3Pregunta").textContent=elemento.question.text

        let respuestasMezcladas =ramdomizarOrdenPreguntas(elemento.incorrectAnswers,elemento.correctAnswer)
        
        for(let i = 0; i<tempalteClon.querySelectorAll(".respuestas").length;i++){
            
            tempalteClon.querySelectorAll(".respuestas")[i].textContent = respuestasMezcladas[i]
            tempalteClon.querySelectorAll(".respuestas")[i].setAttribute("id",elemento.id+"respuesta"+i)
            tempalteClon.querySelector(".divContenedorPregunta").setAttribute("id",elemento.id)
        }
        
        fragmento.appendChild(tempalteClon)

    });
    divContenedorPreguntas.appendChild(fragmento)
    activarEventos()

}

/**
 * Función añade a un array las peguntas seleccionadas
 * @param  elemento boton de respuesta seleccionada 
 */
function contarPreguntasContestadas(elemento){
    if(!arrayContadorSelecciones.includes(elemento.parentNode.parentNode.id)){
        
        arrayContadorSelecciones.push(elemento.parentNode.parentNode.id)

        
    }
}

/**
 * Función le añade la clase de botonSeleccionada al boton 
 * @param elemento boton de respuesta seleccionado
 */
function destacarSeleccionado(elemento){

    if(elemento.tagName == "BUTTON"){
        
        elemento.parentNode.childNodes.forEach(hijo =>{
            if(hijo.tagName == "BUTTON"){
                
                hijo.classList.remove("respuestaSeleccionada")
                
            }
            
        })
        
    }
   
    elemento.classList.add("respuestaSeleccionada")
    contarPreguntasContestadas(elemento)
}

/**
 * Función elimina la clase  noSeleccionada de los div de las preguntas
 */
function eliminarMarcaNoSeleccionada(){
    arrayContenedoresPreguntas.forEach(e=>{
        e.classList.remove("noSeleccionada")
    })
}
/**
 * Añade la case noSeleccionada a los div de las prguntas 
 */
function marcarNoContestadas(){
    
    arrayContenedoresPreguntas.forEach(i=>{
        
        if(!arrayContadorSelecciones.includes(i.id)){
            i.classList.add("noSeleccionada")
        }
    })
}

/**
 * Función compueba que todas las perguntas han sido contestadas 
 */
function comprobarTodasPreguntasContestadas(){
    
    if(arrayContadorSelecciones.length ==10){
        eliminarMarcaNoSeleccionada()
        comprobarRespuestas()
    }else{
        alert("Contesta todas las preguntas 😑")
        eliminarMarcaNoSeleccionada()
        marcarNoContestadas()
    }
}

/**
 * Función comprueba si las respuestas son correctas
 */
function comprobarRespuestas(){
    let contador = 0;
    let resultado 
    let posicionElemento
    arrayBotonesRespuestas = divContenedorPreguntas.querySelectorAll(".respuestas")
    
    for(let i =0; i<arrayBotonesRespuestas.length; i+=cantidadRespuestasPosibles){
        for(let j = i; j<i+4;j++){
            posicionElemento = j
            
            if(arrayBotonesRespuestas[j].textContent == listaPreguntasSolicitadas[contador].correctAnswer){
                arrayBotonesRespuestas[j].classList.add("botonCorrecta")

                if(arrayBotonesRespuestas[j].classList[1] == "respuestaSeleccionada"){
                    resultado = "correcta"
                    break
                }else{
                    resultado = "incorrecta"
                }
            }
            
        }
        arrayBotonesRespuestas[posicionElemento].parentNode.parentNode.classList.add(resultado)

        contador ++
    }

}

/**
 * Función activa los diferentes eventos 
 */
function activarEventos(){
    arrayContenedoresPreguntas = document.querySelectorAll(".divContenedorPregunta")
    divContenedorPreguntas.addEventListener("click", (evento) =>{
    
        if(evento.target.tagName == "BUTTON"){
            destacarSeleccionado(evento.target)
        }

    })

    botonComprobar.addEventListener("click",comprobarTodasPreguntasContestadas)

    botonReiniciar.addEventListener("click",() =>location.reload())
}
//LLamo a la funcion para cargar las perguntas cuendo se cargue la página
solicitarPreguntas()


