// Globals
var photoList;
var maxWidth = '360px';
var maxHeight = '240px';

// Check when photo is loaded into DOM from server
function imgLoaded(el) {
  setTimeout(function() {
    $(el).fadeIn("slow");
  }, 600);
  //var node = el;
  //for (var i=0; (node=node.previousSibling); i++); // get index of node loaded
  //resize(i, el.parentNode);
  
  //console.log("image has loaded: "+el.src);
}

// Get list of photos
function getPhotos() {
  const numPagesAvailable = 100; // im guessing
  let randomImageIndex = Math.floor(Math.random() * numPagesAvailable);
  console.log('Getting photos...from page ' + randomImageIndex);

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
    //console.log(photoList);

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
        imgEl.style.width = maxWidth;
      } else if (w > h) {
        // Landscape      
        imgEl.style.width = 'auto';
        imgEl.style.maxWidth = '125%';
      }

      // Build DOM
      itemEl.appendChild(photoEl);
      $('#photos').append(itemEl);

    });
    resizeItems();
  });
}
// When window gets too small, shrink photo containers.
// Resize all DOM items.
function resizeItems() {
  // Loop thru JSON data and use same index for img lookup since they are in same order.
  for (let index = 0; index < photoList.length; index++) {
    resize(index, null);
  }
}

// Resize an item
function resize(index, container) {
  let w = Number(photoList[index].width);
  let h = Number(photoList[index].height);
  var image;

  if (container == null) {
    container = document.getElementsByClassName('photo-image');
    image = container[index].children[0];
  } else {
    image = container.children[0];
  }

  image.style.height = '100%';
  image.style.minHeight = '100%';
  image.style.maxHeight = '100%';

  // Change dimensions of <img>
  if (w < h || w == h) {
    // Portrait/Square
    image.style.width = '100%';
  } else if (w > h) {
    // Landscape
    image.style.width = '100%';

    // Keep stretching height until it reaches height of container
    var parent = document.getElementsByClassName('photo-item');
    if (parent[index] != undefined) {
      var item_h = parent[index].style.height;
      item_h = item_h.replace('px', '');
      
      if (image.height < item_h) {
        image.style.width = 'auto';
        image.style.height = maxHeight;
      }
    }
  }
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
  // TODO - Resize items on startup, but after img's loaded

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

/*
// Check photo loading completion
function checkComplete() {
  for (let index = 0; index < photoList.length; index++) {
    var images = document.getElementsByClassName('photo-image')[index].childNodes;
    if (images == undefined) {
      return false;
    } else {
      var image = images[0];
    }
    console.log(image.getAttribute("complete"));
    if (image.getAttribute("complete")) {
      $(image).fadeIn("slow");
      return true;
    } else {
      return false;
    }
  }
}
// Set loading complete check timer
var completeTimer;
completeTimer = setInterval(function(){
  var b = checkComplete();
  if (b) {clearInterval(completeTimer)}
}, 3000);
*/