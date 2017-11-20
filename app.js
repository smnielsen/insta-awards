/***************************
 * 
 * InstaImage Class
 * 
 ***************************/
const outsidePadding = 50;
const FADE_IN = 800;
const FADE_OUT = 200;
const VISIBLE_TIME = 2000;

const randomInt = (min,max) => {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function InstaImage({ id, url, windowRect }) {
  const imageUrl = `/images/${encodeURI(url)}`;
  const imageRect = {
    width: 100,
    height: 200
  };

  let imageContainerDOM;

  const preload = () => {
    imageContainerDOM = $('<div>', {
      class: 'image-container is-preloaded',
      style: 'position: absolute; display: none;'
    });
    
    let imageDOM = $('<img>', {
      src: imageUrl,
      class: 'insta-image',
      width: imageRect.width,
      height: imageRect.height
    });
    
    imageContainerDOM.append(imageDOM);
    return imageContainerDOM;
  };
  
  function privateInstaImageRunner(completed) {
    console.log(`${id} showing for ${VISIBLE_TIME}`);

    const destroy = () => {
      imageContainerDOM.remove();
    };

    const hide = () => {
      
      // Fade out and destroy afterwards
      imageContainerDOM.fadeOut(FADE_OUT, () => {
        imageContainerDOM.removeClass('is-visible');
        imageContainerDOM.addClass('is-hidden');
        console.log(`${id} is hidden now`);
        setTimeout(() => {

          destroy();
          // Run completed callback
          completed(id, imageUrl);
        }, 1500);
      });
    };

    const show = () => {
      // Fade in
      imageContainerDOM.removeClass('is-preloaded');
      imageContainerDOM.addClass('is-visible');
      imageContainerDOM.fadeIn(FADE_IN, () => {

        setTimeout(() => {
          hide();
        }, VISIBLE_TIME);

      });
    };

    const position = (visibleImages) => {
      const maxLeft = windowRect.width - outsidePadding - imageRect.width;
      const maxTop = windowRect.height - outsidePadding - imageRect.height ;
      return {
        left: randomInt(outsidePadding, maxLeft),
        top: randomInt(outsidePadding, maxTop)
      };
    };

    if (!imageContainerDOM) {
      // preload image container 
      console.error(`${id} imageContainer is not created`);
      return;
    }

    // Calculate position
    const offset = position(/* visibleImages, imageRect */);

    // Set rect position
    imageContainerDOM.offset({ ...offset });
    
    // Start showing
    show();
  }

  const run = (completed) => {
    privateInstaImageRunner(completed);
  };

  return {
    run,
    preload
  };
};

/* END OF InstaImage */

/***************************
 * 
 * START OF APPLICATION
 * 
 ***************************/
(function() {
  console.log('Running app');
  let containerDOM = $('.container');
  let windowRect = {
    width: containerDOM.innerWidth(),
    height: containerDOM.innerHeight()
  };

  // Run the entire insta-awards animations forever
  let visibleImages = {};

  let currentImageIndex = 0;  
  let imageCounter = 0; 
  
  const preloadNextImage = () => {
    let imageUrl = window.IMAGES[currentImageIndex];
    let image = new InstaImage({
      id: imageCounter++, 
      url: imageUrl, 
      windowRect
    });
    const imageContainerDOM = image.preload();
    containerDOM.append(imageContainerDOM);
    return image;
  };

  let nextImage;
  const showNextImage = () => {
    if (!nextImage) {
      // First time
      nextImage = preloadNextImage();
    }
    // Run next image
    nextImage.run((id) => {
      console.log(`${id} completed and destroyed`);
    });

    // preload next image to show
    if (window.IMAGES.length === ++currentImageIndex) {
      currentImageIndex = 0;
    }

    // Preload next image
    nextImage = preloadNextImage();
  };

  console.log('Activating body');
  $('.container').click(function () {
    showNextImage();
  });

}());
