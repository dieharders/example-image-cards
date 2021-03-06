# Image Cards
A small example page demonstrating how to load externally hosted images and display various sized photos in a container with defined size.

## Live Demo: https://example-image-cards.firebaseapp.com/

## What it does:
- Query the Unsplash API to fetch random photos.
- Infinite scrolling! Load more photos when reaching the bottom of page.
- Construct & style DOM elements using info supplied in JSON response.
- Smart resize images to completely fill the container.
- Make containers responsive to window size.
- (Graceful loading) Lays out html elements before images finish loading.
- Fade-in photos once they finish loading.
- Hover over effects (hide overlay and descriptions).

![Preview](https://github.com/dieharders/example-image-cards/blob/master/preview.jpg)