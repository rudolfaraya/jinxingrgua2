var pos = 0;
var intv;
var flippedElement;
var opcionesMenu = [{opciones:[{opcion:'1 Wantán Frito'},{opcion:'1 Chapsui de Pollo'},
					 {opcion:'1 Diente de Dragón Carne'},{opcion:'2 Arroz Chaufán'}],costo: '$11000',paquete:'Menú Para 2 Personas'},
					 {opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},
					 {opcion:'Jacuzzi de plata'}],costo: '500',paquete:'Menú Para 3 Personas'},
					 {opciones:[{opcion:'Cuarto individual'},
					 {opcion:'Alberca privada'},{opcion:'Jacuzzi'}],costo: '300',paquete:'Menú Para 4 Personas'}];
$(document).on('ready',function(){
		init();
});

function init(){
	$('.slider_controls li').on('click',handleClick);
	var width = $('.slider_container').width();

	$('.slide').each(function(i,e){
		var url = $(e).data('background');
		$(e).css('width',width+'px');
		$(e).css('background-image',"url("+(url+".jpg")+")");
	});
	$(document).on('click','.ver-mas',flipElement);
  
	intv = setInterval(handleClick,8000);
}
google.maps.event.addDomListener(window,'load',drawMap);
function drawMap(){
	var mapa;
	var opcionesMapa = {
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	mapa = new google.maps.Map(document.getElementById('google_canvas'),opcionesMapa);
	navigator.geolocation.getCurrentPosition(function(posicion){
		var geolocalizacion = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
		var marcador = new google.maps.Marker({
			map: mapa,
			draggable: false,
			position:geolocalizacion,
			visible: true
		});
		mapa.setCenter(geolocalizacion);
		calcRoute(geolocalizacion,mapa);
	});
}
function calcRoute(inicioRuta,mapa){
	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(mapa);
	var posicionRestaurant = new google.maps.LatLng(-34.1743651,-70.7437567);
	var marcador = new google.maps.Marker({
		map: mapa,
		draggable: false,
		position:posicionRestaurant,
		visible: true
	});
	var request = {
		origin: inicioRuta,
		destination: posicionRestaurant,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	}
	directionsService.route(request,function(response, status){
		if(status == google.maps.DirectionsStatus.OK){
			directionsRenderer.setDirections(response);
		}
	});
}

function flipElement(){
	if(flippedElement != null){
		$(flippedElement).revertFlip();
		flippedElement = null;
	}
	$(flippedElement).remove();
	var padre = $(this).parent();
	flippedElement = padre;
	$('#precioTemplate').template("CompiledTemplate");
	$(padre).flip({
		direction: 'rl',
		speed: 500,
		content: $('#precioTemplate').tmpl(opcionesMenu[$(this).data('number')]).html(),
		color: '#f7f7f7', 
		onEnd: function(){
			$('#regresar-ventana').on('click',function(){
				$(flippedElement).revertFlip();
				flippedElement = null;
			});
		}
	});
}
function handleClick(){
	var slide_target = 0;
	if($(this).parent().hasClass('slider_controls')){
		slide_target = $(this).index();
		pos = slide_target;
		clearInterval(intv);
		intv = setInterval(handleClick,8000);
 	}
	else{
		pos++;
		if(pos>=$('.slide').length){
			pos = 0;
		}
		slide_target = pos;
	}
	$('.slideContainer').fadeOut('slow',function(){
		$(this).animate({
			'margin-left':-(slide_target * $('.slider_container').width())+'px'
		},'slow',function(){
			$(this).fadeIn();
		});
	});
}