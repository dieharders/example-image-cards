// Globals
var photoList;

// Check when photo is loaded into DOM from server
function imgLoaded(el) {
  $(el).fadeIn("slow");
  el.removeEventListener("load", function() {
    console.log("image has loaded: "+el.src);
  });
}

// Get list of photos
function getPhotos() {
  console.log('Getting photos...');

  const maxWidth = '360px';
  const maxHeight = '240px';
  const numPagesAvailable = 100; // im guessing
  let randomImageIndex = Math.floor(Math.random() * numPagesAvailable);
  // Client Access ID from your unsplash app dashboard
  const clientID = '<YOUR-CLIENTID>'; //'client_id=XXX'

  // Query api for a single page of photos
  var params = {
    page : randomImageIndex,
    per_page : 25,
    order_by : "latest"
  }

  $.getJSON(`https://api.unsplash.com/photos/?${clientID}`, params, function(data) {
    photoList = data;
    console.log(photoList);

    // Clear photo DOM elements
    $('#photos').html('');

    $.each(data, function(index, value) {
      //console.log(value);
      
      // Get attributes from json
      var name = value.user.name;
      var bio = value.user.bio;
      if (bio === null) {bio = 'No Bio'}
      var imageURL = value.urls.regular;
      var dl = value.links.download;
      var likes = value.likes;
      var w = Number(value.width);
      var h = Number(value.height);
      var col = value.color;

      // Make Elements
      //
      // Item
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
      var imgEl = document.createElement('img');
      imgEl.src = imageURL;
      $(imgEl).hide(); //Hide image to fadeIn later onLoad
      photoEl.appendChild(imgEl);
      imgEl.addEventListener( "load", imgLoaded(imgEl) ); // listen for done loading
      // Check image aspect ratio and change scaling
      if (w < h || w == h) {
        // Portrait or Square
        imgEl.style.minHeight = 'auto';
        imgEl.style.height = 'auto';
        imgEl.style.width = maxWidth;
      } else if (w > h) {
        // Landscape      
        imgEl.style.minHeight = 'auto';
        imgEl.style.height = 'auto';
        imgEl.style.width = 'auto';
        imgEl.style.maxWidth = '125%';
      }

      // Build DOM
      itemEl.appendChild(photoEl);
      $('#photos').append(itemEl);

    });
  });
}

// Resize DOM items. When window gets too small, shrink photo containers.
function resizeItems() {
  // Check window size
  if ($(window).width() < 480) {
    maxWidth = '240px';
    maxHeight = '180px';
  } else {
    maxWidth = '360px';
    maxHeight = '240px';
  }
  // Update DOM photo container sizes
  let children = document.getElementsByClassName('photo-image');
  // Loop thru JSON data and use same index for img lookup since they are in same order.
  for (let index = 0; index < photoList.length; index++) {
    let w = Number(photoList[index].width);
    let h = Number(photoList[index].height);
    let image = children[index].children[0];
    if (w < h || w == h) {
      // Portrait/Square
      image.style.width = '100%';
      image.style.height = 'auto';
      image.style.minHeight = 'auto';
      image.style.maxHeight = 'auto';
    } else if (w > h) {
      // Landscape
      image.style.width = '100%';
      image.style.height = 'auto';
      image.style.minHeight = 'auto';
      image.style.maxHeight = 'auto';
      // Keep stretching height until it reaches height of container
      if (image.height < h) {
        image.style.height = maxHeight;
        image.style.minHeight = maxHeight;
        image.style.maxHeight = maxHeight;
      }
    }
  }
  // Resize item container
  $('.photo-item').css('width', maxWidth);
  $('.photo-item').css('max-width', maxWidth);
  $('.photo-item').css('min-width', maxWidth);
  $('.photo-item').css('height', maxHeight);
  $('.photo-item').css('max-height', maxHeight);
  $('.photo-item').css('min-height', maxHeight);
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
  getPhotos();
  //resizeItems();

  // Hide name, bio, etc onHover
  $(document).on('mouseenter', '.sel-item', function() {
    $(this).css('background-color', '#00000000');
    $(this).parent().children('.name').hide();
    $(this).parent().children('.bio').hide();
    $(this).parent().children('.likes').hide();
  });
  $(document).on('mouseleave', '.sel-item', function() {
    $(this).css('background-color', '#3838384d');
    $(this).parent().children('.name').show();
    $(this).parent().children('.bio').show();
    $(this).parent().children('.likes').show();
  });
});
// Resize items on window resize
$(window).resize(function() {
  resizeItems();
});