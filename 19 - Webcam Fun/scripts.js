const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo () {
  navigator.mediaDevices.getUserMedia({ video:true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error('OH NO!', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  setInterval(() => {
    // Gets the video and start to draw at canvas left 0 top 0.
    ctx.drawImage(video, 0, 0, width, height);
    // Get the image pixels to apply the filters:
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with the pixels with the function

    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.4;

    pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0)
  }, 16);
}

function takePhoto() {
  // Played the sound
  snap.currentTime = 0;
  snap.play();
  // take the data out of the canvas
  const data = canvas.toDataURL('/image/png');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  // Will put the picture (data) thumbnail
  link.innerHTML = `<img src="${data}" alt="Handsome">`
  strip.insertBefore(link, strip.firstChild);
}

// Filter function - Red
function redEffect(pixels) {
  // increment by 4 and not 1, since we have 4 values 'RGBA' for each pixel.
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 55; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  // increment by 4 and not 1, since we have 4 values 'RGBA' for each pixel.
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 200] = pixels.data[i + 0]; // red
    pixels.data[i + 450] = pixels.data[i + 1]; // green
    pixels.data[i - 450] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};
  [...document.querySelectorAll('.rgb input')].forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i+=4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
          pixels.data[i + 3] = 0;
      }
  }
  return pixels;
}

getVideo();

// Run the paint to canvas function when the video is running:
video.addEventListener('canplay', paintToCanvas);