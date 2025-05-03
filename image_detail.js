window.onload = function() {
    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
    const metadata = JSON.parse(decodeURIComponent(params.get('metadata')));

    // Get the image and metadata elements
    const imageElement = document.getElementById('image');
    const metadataElement = document.getElementById('imageMetadata');

    // Set the image URL and display it
    imageElement.src = metadata.imageUrl;

    // Populate the metadata sidebar
    metadataElement.innerHTML = `
        <p><strong>Title:</strong> ${metadata.title}</p>
        <p><strong>Description:</strong> ${metadata.description}</p>
    `;
};
