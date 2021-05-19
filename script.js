'use strict';

window.addEventListener('DOMContentLoaded', () => {

  const filters = document.querySelector('.filters'),
        resetBtn = document.querySelector('.btn-reset'),
        nextBtn = document.querySelector('.btn-next'),
        loadBtn = document.querySelector('.btn-load--input'),
        saveBtn = document.querySelector('.btn-save'),
        imgCont = document.querySelector('.editing-img'),
        root = document.documentElement,
        fullScreenBtn = document.querySelector('.fullscreen');

  filters.addEventListener('mousemove', (e) => {
    if (e.which === 1 && e.target.matches('input[type="range"]')) {
      let range = e.target;
      range.addEventListener('input', () => {
        let output = range.nextElementSibling;
        output.innerText = range.value;
        root.style.setProperty(`--${range.name}`, `${range.value}${range.getAttribute('data-sizing')}`);
      });
    }
  });

  filters.addEventListener('mouseup', () => {
    drawImage();
  });

  
  resetBtn.addEventListener('click', () => {
    let filtersElements = filters.querySelectorAll('input[type="range"]');
    filtersElements.forEach((item) => {
      if (item.name === 'saturate') {
        item.value = 100;
      } else {
        item.value = 0;
      }
      item.nextElementSibling.value = item.value;
      root.style.setProperty(`--${item.name}`, `${item.value}${item.getAttribute('data-sizing')}`);
    });
  });

  function detectDayTime () {
    let currentTime = new Date(Date.now()).getHours();
    let dayTime;
    if (currentTime >= 6 && currentTime <= 11) {
      dayTime = 'morning';
    } else if (currentTime >= 12 && currentTime <= 17) {
      dayTime = 'day';
    } else if (currentTime >= 18 && currentTime <= 23) {
      dayTime = 'evening';
    } else if (currentTime >= 0 && currentTime <= 5) {
      dayTime = 'night';
    }
    return dayTime;
  }

  
  const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
  const baseUrl = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
  let i = 0;

  function getImgUrl (folder) {
    if (i >= 20) {
      i = 0;
    }
    let index = i % images.length;
    const imgSrc = `${baseUrl}${folder}/${images[index]}`;
    i++;
    return imgSrc;
  }

  nextBtn.addEventListener('click', () => {
    let imgFolder = detectDayTime();
    imgCont.src = getImgUrl(imgFolder);
    drawImage();
  });

  loadBtn.addEventListener('change', () => {
    const file = loadBtn.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      imgCont.src = reader.result;
      drawImage();
    });
    reader.readAsDataURL(file);
    loadBtn.value = '';
  });

  const canvas = document.createElement('canvas');

  function drawImage() {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); 
    img.src = imgCont.src;
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      const filters = document.querySelectorAll('input[type="range"]');
      const activeFilters = [];
      filters.forEach((item) => {
        let value;
        if (item.name === 'blur') {
          value = imgCont.naturalWidth / imgCont.width * item.value;
        } else {
          value = item.value;
        }
        activeFilters.push(`${item.name}(${value}${item.getAttribute('data-sizing')})`);
      });
      let activeFiltersStr = `${activeFilters.join(' ')}`.replace('hue', 'hue-rotate');
      ctx.filter = activeFiltersStr;
      ctx.drawImage(img, 0, 0);
    };
  }
  drawImage();

  saveBtn.addEventListener('click', () => {
    drawImage();
    var link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
    link.delete;
  });

  fullScreenBtn.addEventListener('click', () => {
      if(!document.fullscreenElement){
          document.documentElement.requestFullscreen();
      } else{
          document.exitFullscreen();
      }
  });

  if(document.fullscreenElement){
      document.addEventListener('keydown', (e) => {
          if(e.code == 'Escape'){
              document.exitFullscreen();
          }
      }, false);
  }

});