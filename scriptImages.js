//#region REGION 0 - CARDS - LOGICS 

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.glass.card');
  const continueButtons = document.querySelectorAll('.continue-button');

  // Función para mover la card a translateY(150%)
  function moveCardDown(card) {
      card.style.transform = 'translateY(150%) translateX(-50%)';
  }

  // Eventos para los botones de Continue
  continueButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
          moveCardDown(cards[index]); // Mueve la card correspondiente hacia abajo
      });
  });
});


//#endregion

//#region REGION 1 - CROPPER 

var image = document.getElementById('image');
  var inputImage = document.getElementById('inputImage');
  var preview = document.getElementById('preview');
  var cropper;

  function resizeImage(url, callback) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var maxDimension = 400; // Max dimension (width or height)
      var scaleRatio = maxDimension / Math.max(img.width, img.height);

      canvas.width = img.width * scaleRatio;
      canvas.height = img.height * scaleRatio;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL());
    };
    img.src = url;
  }

  inputImage.addEventListener('change', function (event) {
    var files = event.target.files;
    var done = function (url) {
      inputImage.value = '';
      image.src = url;
      preview.style.display = 'block';
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(image, {
        aspectRatio: 1, // Mantiene el área de recorte como un círculo perfecto
        viewMode: 1, // Asegura que la imagen no se desborde del área de recorte
        dragMode: 'move', // Permite mover la imagen dentro del área de recorte
        autoCropArea: 1, // Máximo área inicial de recorte
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        modal: false,
        background: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        ready: function () {
          var containerData = this.cropper.getContainerData();
          this.cropper.setCropBoxData({
            left: (containerData.width - 180) / 2, // Centra horizontalmente
            top: (containerData.height - 180) / 2, // Centra verticalmente
            width: 180, // Fija el ancho a 180px
            height: 180 // Fija el alto a 180px
          });
        },
        crop: function(event) {
          // Esta función se llama cada vez que el área de recorte cambia
          var canvas = this.cropper.getCroppedCanvas({
            width: 200, // Definir el tamaño de la vista previa
            height: 200
          });
          if (canvas) {
            var previewImage = document.getElementById('preview');
            previewImage.src = canvas.toDataURL('image/png');
            previewImage.style.display = 'block';
          }
        }
      });
      
      
    };

    if (files && files.length > 0) {
      var reader = new FileReader();
      reader.onload = function (e) {
        resizeImage(e.target.result, done); // Redimensionar la imagen antes de aplicar Cropper.js
      };
      reader.readAsDataURL(files[0]);
    }
  });

  document.getElementById('zoomRange').addEventListener('input', function () {
    if (cropper) {
      cropper.zoomTo(this.value);
    }
  });
  
  document.getElementById('rotateRange').addEventListener('input', function () {
    if (cropper) {
      cropper.rotateTo(this.value);
    }
  });
  
//#endregion

//#region REGION 2 - WORLDS LOGIC 

let selectedBackground = 'assets/bg_world_1.png' // Asume que esta es la imagen inicial

  const images = [
      'assets/bg_world_1.png',
      'assets/bg_world_2.png',
      'assets/bg_world_3.png',
      'assets/bg_world_4.png'
  ];
  let currentImageIndex = 0;

  const worldImage = document.querySelector('.world-image');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  leftArrow.addEventListener('click', function() {
      if (currentImageIndex === 0) {
          currentImageIndex = images.length - 1;
      } else {
          currentImageIndex--;
      }
      worldImage.src = images[currentImageIndex];
      selectedBackground = images[currentImageIndex]; // Actualiza la variable al cambiar de imagen
  });

  rightArrow.addEventListener('click', function() {
      if (currentImageIndex === images.length - 1) {
          currentImageIndex = 0;
      } else {
          currentImageIndex++;
      }
      worldImage.src = images[currentImageIndex];
      selectedBackground = images[currentImageIndex]; // Actualiza la variable al cambiar de imagen
      console.log(currentImageIndex)
      console.log(selectedBackground)
  });



//#endregion

//#region REGION 3 - SHOW IMAGE 

document.addEventListener('DOMContentLoaded', function() {
  const inputImage = document.getElementById('inputImage');
  const previewImage = document.getElementById('previewImage');
  const imagePreviewDiv = document.getElementById('imagePreview');
  const deleteImageButton = document.getElementById('deleteImageButton');

  inputImage.addEventListener('change', function(event) {
      const file = event.target.files[0]; // Obtén el primer archivo que el usuario seleccionó
      if (file) {
          const reader = new FileReader(); // Crea un FileReader para leer el archivo
          reader.onload = function(e) {
              previewImage.src = e.target.result; // Asigna el resultado de la carga a src del img
              imagePreviewDiv.style.display = 'block'; // Muestra el div de previsualización
              deleteImageButton.style.display = 'inline'; // Muestra el botón de borrar
          };
          reader.readAsDataURL(file); // Lee el archivo como un URL de datos
      }
  });

  deleteImageButton.addEventListener('click', function() {
      previewImage.src = ''; // Elimina el src del img
      imagePreviewDiv.style.display = 'none'; // Oculta el div de previsualización
      deleteImageButton.style.display = 'none'; // Oculta el botón de borrar
      inputImage.value = ''; // Restablece el input de archivo
  });
});


//#endregion

//#region REGION 5 - CANVAS 


createCanvas = (croppedImageSrc) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 500; // Ajusta al ancho deseado
  canvas.height = 500; // Ajusta al alto deseado
  
  const image1 = new Image(); // Fondo
  const image2 = new Image(); // Imagen recortada
  const image3 = new Image(); // Astronauta
  
  // Carga la imagen de fondo.
  image1.src = selectedBackground;
  
  image1.onload = function() {
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  
    // Carga la imagen recortada si está disponible, sino salta al astronauta.
    if (croppedImageSrc) {
      image2.src = croppedImageSrc;
      image2.onload = function() {

        ctx.save();

        // Mueve el contexto al centro de la posición final deseada de la imagen
      
        // Rota el contexto
        // ctx.rotate(-10 * Math.PI / 180); // Convierte grados a radianes y rota
      
        // Dibuja la imagen recortada ajustada al centro rotado
        ctx.drawImage(image2, 125, 125, 250, 250); // Desplaza la imagen de vuelta para centrarla en el origen rotado
      
        // Restaura el contexto a su estado previo a las transformaciones
        ctx.restore();

        drawAstronaut();
      };
    } else {
      drawAstronaut();
    }
  };

  // Función para dibujar la imagen del astronauta.
  function drawAstronaut() {
    image3.src = 'assets/astronaut_new.png'; // Asegúrate de que la ruta es correcta
    image3.onload = function() {
      // Posiciona el astronauta en el centro del canvas, ajusta como necesites.
      let x = (canvas.width - image3.width) / 2;
      let y = (canvas.height - image3.height) / 2;
      ctx.drawImage(image3, 0, 0, 500, 500);
      
      // Configura la URL de descarga después de que todas las imágenes hayan sido dibujadas.
      const pngDataUrl = canvas.toDataURL("image/png");
      const canvasDownload = document.getElementById("canvasDownload");
      canvasDownload.href = pngDataUrl;
      canvasDownload.download = 'composite-image.png'; // Nombre del archivo para descargar
    };
  }
}



document.getElementById('continue-pag-1').addEventListener('click', function () {
  if (cropper) {
    var croppedCanvas = cropper.getCroppedCanvas({
      width: 200,
      height: 200
    });
    var croppedImageDataUrl = croppedCanvas.toDataURL('image/png');
    
    // Pasa la imagen recortada a la función createCanvas
    createCanvas(croppedImageDataUrl);
  } else {
    // Si no hay imagen recortada, solo llama a createCanvas sin parámetros
    createCanvas();
  }
});


document.getElementById('continue-pag-3').addEventListener('click', function () {
  console.log(selectedBackground)
})



//#endregion


//#region Last Slide 

var rocketGif = document.querySelector('.rocketgif')

canvasDownload.addEventListener('click', () => {
  rocketGif.style.transform = 'translateY(0)'
})

//#endregion