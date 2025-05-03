window.onload = function() {
    // Fetch the status of the uploads folder (whether it's empty or not)
    fetch('/check_if_empty')
        .then(response => response.json())
        .then(data => {
            if (data.isEmpty) {
                // Show the "Upload Image" button if the folder is empty
                document.getElementById("uploadButton").style.display = "block";
                
                // Hide the other buttons (Clear All, Upload More, Look at Images)
                document.getElementById("image-gallery").style.display = "none";
            } else {
                // Hide the "Upload Image" button if the folder is not empty
                document.getElementById("uploadButton").style.display = "none";
                
                // Show the other buttons (Clear All, Upload More, Look at Images)
                document.getElementById("image-gallery").style.display = "block";
            }
        })
        .catch(error => console.error("Error checking if the folder is empty:", error));

    viewLastFiveImages();
    fetchAnomalies();
    fetchUnsure();
    fetchNormal();


    
        
};





function uploadImage() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;  // Allows multiple files to be selected

    input.onchange = function (e) {
        let files = e.target.files;
        let formData = new FormData();

        // Append each file to FormData for uploading
        for (let i = 0; i < files.length; i++) {
            formData.append("images[]", files[i]);
        }

        // Send the files to the server for storage
        fetch("http://localhost:5000/upload_images", {
            method: "POST",
            body: formData,
            headers: {}
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log("Full server response:", data); // Debug log
            
            if (data.success && Array.isArray(data.saved_paths)) {
                document.getElementById("uploadButton").style.display = "none";
                document.getElementById("image-gallery").style.display = "block";
                viewLastFiveImages();
                
                data.saved_paths.forEach(path => {
                    const unixPath = path.replace(/\\/g, '/');
                    fetch(`http://localhost:5000/run_python_script?image_path=${encodeURIComponent(unixPath)}`)
                        .then(r => r.json())
                        .then(result =>{
                            console.log("Script result:", result);
                            fetchAnomalies();   // Update anomalies section
                            fetchUnsure();      // Update unsure section
                            fetchNormal();      // Update normal section
                            viewLastFiveImages();
                        })
                        .catch(e => console.error("Script error:", e));
                });
            } else {
                console.error("Invalid server response:", data);
                alert(`Upload failed: ${data.message || 'Unknown error'}`);
            }
        })
        .catch(error => {
            console.error("Upload error:", error);
            alert("Upload failed. Check console for details.");
        });
    };

    input.click();  // Trigger the file input dialog


}


function viewLastFiveImages() {
    fetch("/get_last_five_images")
        .then(response => response.json())
        .then(data => {
            let uploadedImagesContainer = document.getElementById("uploadedImages");
            uploadedImagesContainer.innerHTML = '';  // Clear any previous images

            // Display the last 5 uploaded images on the main page
            data.images.forEach(image => {
                let img = document.createElement("img");
                img.src = image;  // Set the image URL
                img.style.width = "160px";
                img.style.height = "160px";
                img.style.margin = "10px";
                uploadedImagesContainer.appendChild(img);
            });
        })
        .catch(error => console.error("Error fetching images:", error));
}



function viewImages() {
    // Open the pop-up window and load the separate HTML file (popup.html)
    let popup = window.open('/popup.html', 'Image Viewer', 'width=800,height=600,resizable=yes');
}

function viewImagesAnomal() {
    // Open the pop-up window and load the separate HTML file (popup.html)
    let popup = window.open('/popupAnomal.html', 'Image Viewer', 'width=800,height=600,resizable=yes');
}


function viewImagesUnsure() {
    // Open the pop-up window and load the separate HTML file (popup.html)
    let popup = window.open('/popupUnsure.html', 'Image Viewer', 'width=800,height=600,resizable=yes');
}

function viewImagesNormal() {
    // Open the pop-up window and load the separate HTML file (popup.html)
    let popup = window.open('/popupNormal.html', 'Image Viewer', 'width=800,height=600,resizable=yes');
}



function clearImages() {
    fetch("/clear_images", { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("uploadedImages").innerHTML = "";  // Clear the display
                document.getElementById("image-gallery").style.display = "none";
                document.getElementById("uploadButton").style.display = "block";
            }
        })
        .catch(error => console.error("Error clearing images:", error));
}




function clearAnomal() {
    fetch("/clear_images_anomal", { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("anomalyFolder").innerHTML = "";  // Clear the display
                document.getElementById("image-gallery").style.display = "none";
                document.getElementById("uploadButton").style.display = "block";
            }
        })
        .catch(error => console.error("Error clearing images:", error));
}



function clearUnusual() {
    fetch("/clear_images_unsure", { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("unsureFolder").innerHTML = "";  // Clear the display
                document.getElementById("image-gallery").style.display = "none";
                document.getElementById("uploadButton").style.display = "block";
            }
        })
        .catch(error => console.error("Error clearing images:", error));
}


function clearNormal() {
    fetch("/clear_images_normal", { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("normalFolder").innerHTML = "";  // Clear the display
                document.getElementById("image-gallery").style.display = "none";
                document.getElementById("uploadButton").style.display = "block";
            }
        })
        .catch(error => console.error("Error clearing images:", error));
}




function fetchAnomalies() {
    fetch("/get_anomaly_images")
        .then(response => response.json())
        .then(data => {
            let uploadedImagesContainer = document.getElementById("anomalyFolder");
            uploadedImagesContainer.innerHTML = '';  // Clear any previous images

            // Display the last 5 uploaded images on the main page
            data.images.forEach(image => {
                let img = document.createElement("img");
                img.src = image;  // Set the image URL
                img.style.width = "160px";
                img.style.height = "160px";
                img.style.margin = "10px";
                img.style.objectFit = 'cover'; // Ensure image is properly fitted
                uploadedImagesContainer.appendChild(img);
            });
        })
        .catch(error => console.error("Error fetching images:", error));
}


function fetchUnsure() {
    fetch("/get_unsure_images")
        .then(response => response.json())
        .then(data => {
            let uploadedImagesContainer = document.getElementById("unsureFolder");
            uploadedImagesContainer.innerHTML = '';  // Clear any previous images

            // Display the last 5 uploaded images on the main page
            data.images.forEach(image => {
                let img = document.createElement("img");
                img.src = image;  // Set the image URL
                img.style.width = "160px";
                img.style.height = "160px";
                img.style.margin = "10px";
                img.style.objectFit = 'cover'; // Ensure image is properly fitted
                uploadedImagesContainer.appendChild(img);
            });
        })
        .catch(error => console.error("Error fetching images:", error));
}



function fetchNormal() {
    fetch("/get_unsure_images")
        .then(response => response.json())
        .then(data => {
            let uploadedImagesContainer = document.getElementById("normalFolder");
            uploadedImagesContainer.innerHTML = '';  // Clear any previous images

            // Display the last 5 uploaded images on the main page
            data.images.forEach(image => {
                let img = document.createElement("img");
                img.src = image;  // Set the image URL
                img.style.width = "160px";
                img.style.height = "160px";
                img.style.margin = "10px";
                img.style.objectFit = 'cover'; // Ensure image is properly fitted
                uploadedImagesContainer.appendChild(img);
            });
        })
        .catch(error => console.error("Error fetching images:", error));
}




function uploadMore() {
    uploadImage();
}
