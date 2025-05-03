window.onload = function() {
    fetch("/get_all_images")
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');

            // Loop through the images and add them to the gallery
            data.images.forEach(image => {
                let img = document.createElement('img');
                img.src = image;  // Set the image URL
                img.alt = 'Uploaded Image';
                
                // Open the image in a new tab with metadata
                img.onclick = function() {
                    const metadata = encodeURIComponent(JSON.stringify({
                        imageUrl: image,
                        title: "Example Image Title", // Replace with actual metadata
                        description: "This is an example description of the image." // Replace with actual description
                    }));

                    // Open a new tab with the image and metadata page
                    window.open(`image_detail.html?metadata=${metadata}`, '_blank');
                };
                
                // Append the image to the gallery
                gallery.appendChild(img);
            });
        })
        .catch(error => console.error('Error fetching images:', error));
};
