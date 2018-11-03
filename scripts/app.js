// Globals
var maxWidth = '360px';
var maxHeight = '240px';

// Check when photo is loaded into DOM from server
function imgLoaded(image, spinner) {
  setTimeout(function() {
    $(image).fadeIn("slow");
    // Remove spinner element
    //image.parentNode.children[4].remove();
    spinner.remove();
  }, 1000);
  
  //console.log("image has loaded: "+image.src);
}

// Get list of photos
function getPhotos(numImages, order, replace) {
  const numPagesAvailable = 100; // im guessing
  let randomImageIndex = Math.floor(Math.random() * numPagesAvailable);
  console.log('Getting photos...from page ' + randomImageIndex);

  // Client Access ID from your unsplash app dashboard
  const clientID = ''; //'client_id=XXX'

  // Query api for a single page of photos
  var params = {
    page : randomImageIndex,
    per_page : numImages,
    order_by : order
  }

  $.getJSON(`https://api.unsplash.com/photos/?${clientID}`, params, function(photoList) {
    // Clear photo DOM elements
    if (replace) {
      $('#photos').html('');
    }

    $.each(photoList, function(index, value) {
      //console.log(value);
      
      // Get attributes from json
      var name = value.user.name;
      var bio = value.user.bio;
      if (bio === null) {bio = 'No Bio'}
      var imageURL = value.urls.regular;
      var dl = value.links.download;
      var likes = value.likes;
      //var w = Number(value.width);
      //var h = Number(value.height);
      var col = value.color;

      // Make Elements
      //
      // Item Container
      var itemEl = document.createElement('div');
      itemEl.className = 'photo-item';
      itemEl.title = dl;
      itemEl.style.backgroundColor = col;
      itemEl.innerHTML = 
        `
          <div class="sel-item"></div>
          <h1 class="name" title="author">${name}</h1>
          <h2 class="likes" title="likes">${likes}</h2>
          <p class="bio" title="bio">${bio}</p>
        `;
      // Photo
      var photoEl = document.createElement('div');
      photoEl.className = 'photo-image';
      photoEl.title = imageURL;
      var imgEl = document.createElement('div');
      imgEl.className = 'imgLoading';
      $(photoEl).hide(); // Hide image to fadeIn later onLoad
      photoEl.style.backgroundImage = 'url(' + imageURL + ')';
      itemEl.appendChild(imgEl);
      photoEl.addEventListener( "load", imgLoaded(photoEl, imgEl) ); // Listen for done loading

      // Build DOM
      //
      // Add photo image to item container
      itemEl.appendChild(photoEl);
      // Add photo item to gallery container
      $('#photos').append(itemEl);
    });
  });
}

// Link to GitHub
function goGitHub() {
  window.open('https://github.com/dieharders/example-image-cards', '_blank');
}

///////////
// LOGIC //
///////////
//
// Get photos on startup
$(document).ready(function() {
  getPhotos(25, "latest", true);
  // Hide name, bio, etc onHover
  $(document).on('mouseenter', '.sel-item', function() {
    $(this).css('background-color', '#00000000');
    $(this).parent().children('.name, .bio, .likes').hide();
  });
  $(document).on('mouseleave', '.sel-item', function() {
    $(this).css('background-color', '#3838384d');
    $(this).parent().children('.name, .bio, .likes').show();
  });
});
// Load more images if reached the bottom of page
var lastScrollPosition = 0;
window.addEventListener('scroll', function() {
  let divHeight = $(document).height();
  let windowHeight = $(window).height();
  let scrollY = $(window).scrollTop();
  let scrollPos = Math.floor(divHeight - (scrollY + windowHeight));
  
  if ( scrollPos <= 0 && lastScrollPosition != scrollPos )
  {
    // Load more images
    console.log('loaded more images');
    getPhotos(25, "latest", false);
  }

  lastScrollPosition = scrollPos;
});