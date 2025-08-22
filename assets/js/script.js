var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

recognition.continuous = true; 
recognition.lang = 'pt-BR'; 
recognition.interimResults = false; 
recognition.maxAlternatives = 1; 

var diagnostic = document.querySelector('.output');

// coordenadas aproximadas dos locais do IFBA (substituir pelos valores reais depois)
const locais = {
  "depen": { lat: -11.1810, lng: -40.5110 },
  "cantina": { lat: -11.1820, lng: -40.5120 },
  "direção geral": { lat: -11.1815, lng: -40.5115 },
  "banheiros": { lat: -11.1822, lng: -40.5105 },
  "lab 01": { lat: -11.1830, lng: -40.5122 },
  "capne": { lat: -11.1818, lng: -40.5130 },
  "setor pedagógico": { lat: -11.1825, lng: -40.5118 },
  "auditório": { lat: -11.1835, lng: -40.5125 }
};

// Função para calcular distância em metros (fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // raio da Terra em metros
  const toRad = angle => angle * Math.PI / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // distância em metros
}

// Função para ir até o local
function irPara(local) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let minhaLat = position.coords.latitude;
      let minhaLng = position.coords.longitude;

      let destino = locais[local];
      
      if (destino) {
        let distancia = calcularDistancia(minhaLat, minhaLng, destino.lat, destino.lng);
        diagnostic.textContent = 
          `Destino: ${local.toUpperCase()} - Aproximadamente ${Math.round(distancia)} metros de distância.`;
      } else {
        diagnostic.textContent = "Local não encontrado no mapa.";
      }
    }, function(error) {
      diagnostic.textContent = "Erro ao acessar sua localização.";
    });
  } else {
    diagnostic.textContent = "Seu navegador não suporta geolocalização.";
  }
}

recognition.onresult = function(event) { 
  let length = event.results.length;  
  let command = event.results[length-1][0].transcript.trim().toLowerCase();

  if (command.includes("depen")){
    irPara("depen");
  }
  else if (command.includes("cantina")){
    irPara("cantina");
  }
  else if (command.includes("direção geral")){
    irPara("direção geral");
  }
  else if (command.includes("banheiro") || command.includes("banheiros")){
    irPara("banheiros");
  }
  else if (command.includes("lab 01") || command.includes("laboratório 1")){
    irPara("lab 01");
  }
  else if (command.includes("capne")){
    irPara("capne");
  }
  else if (command.includes("setor pedagógico")){
    irPara("setor pedagógico");
  }
  else if (command.includes("auditório")){
    irPara("auditório");
  }
  else {
    diagnostic.textContent = "Local não reconhecido. Tente novamente.";
  }
}

document.querySelector('#btn-start').onclick = function() {
  recognition.start();
  diagnostic.textContent = "Estou ouvindo... diga um local!";
}

document.querySelector('#btn-stop').onclick = function() {
  recognition.stop();
  diagnostic.textContent = "Reconhecimento de voz parado.";
}