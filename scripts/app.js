// Globals
var maxWidth = '360px';
var maxHeight = '240px';
var currPage = 1;
var totalPages = 100; // im guessing

// Check when photo is loaded from server
function imgLoaded(image, spinner) {
  setTimeout(function() {
    $(image).fadeIn("slow");
    // Remove spinner element
    spinner.remove();
  }, 1000);
  
  //console.log("image has loaded: "+image.src);
}

// Get list of photos
function getPhotos(numImages, order, replace) {
  let randomImageIndex = Math.floor(Math.random() * totalPages);
  currPage = randomImageIndex;
  console.log('Getting photos...from page ' + randomImageIndex);

  // Client Access ID from your unsplash app dashboard
  const clientID = ''; //'client_id=XXX'

  // Query api for a single page of photos
  var params = {
    page : randomImageIndex,
    per_page : numImages,
    order_by : order
  }

  // teststst
  $.ajax({
    type: "get",
    url: `https://api.unsplash.com/photos/?${clientID}`,
    crossDomain: true,
    cache: false,
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data: params,
    success: function(photoList, textStatus, xhr) {
        var totalPhotos = xhr.getResponseHeader("X-Total");
        totalPages = Math.floor(totalPhotos / numImages) - 1;
        console.log('Total pages: ' + totalPages);
        console.log('Total photos: ' + totalPhotos);
        //console.log('Num photos this page: ' + xhr.getResponseHeader("X-Per-Page"));

        // Clear photo DOM elements if refreshing
        if (replace) {
          $('#photos').html('');
        }


        $.each(photoList, function(index, value) {
          // Get attributes from json
          var avatar = value.user.profile_image.small;
          var name = value.user.name;
          var bio = value.user.bio;
          if (bio === null) {bio = 'No Bio'}
          var imageURL = value.urls.regular;
          var dl = value.links.download;
          var likes = value.likes;
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
              <div class="nameContainer">
                <img src="${avatar}" class="avatar" height="26" width="26">
                <h1 class="name" title="author">${name}</h1>
              </div>
              <h2 class="likes" title="likes">${likes}</h2>
              <p class="bio" title="bio">${bio}</p>
            `;
          // Photo container
          var photoEl = document.createElement('div');
          photoEl.className = 'photo-image';
          photoEl.title = imageURL;
          var imgEl = document.createElement('div');
          imgEl.className = 'imgLoading';
          $(photoEl).hide(); // Hide image to fadeIn later onLoad
          photoEl.style.backgroundImage = 'url(' + imageURL + ')';
          itemEl.appendChild(imgEl);
          photoEl.addEventListener( "load", imgLoaded(photoEl, imgEl) ); // Listen for done loading event to fade-in

          // Build DOM
          //
          // Add photo image to item container
          itemEl.appendChild(photoEl);
          // Add photo item to gallery container
          $('#photos').append(itemEl);
        });
    },
    error: function (xhr, textStatus, errorThrown) {
        console.log(errorThrown);
    }});
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
  let children = '.nameContainer, .bio, .likes';
  $(document).on('mouseenter', '.sel-item', function() {
    $(this).css('background-color', '#00000000');
    $(this).parent().children(children).hide();
  });
  $(document).on('mouseleave', '.sel-item', function() {
    $(this).css('background-color', '#3838384d');
    $(this).parent().children(children).show();
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