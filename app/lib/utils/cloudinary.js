const handleUpload = async () => {
    if (!image || !description) {
      alert("Please select an image and enter a description");
      return;
    }
  
    setLoading(true);
  
    try {
      const formData = new FormData();
  
      // Extract the file extension and determine the MIME type
      const fileExtension = image.split('.').pop().toLowerCase();
      let mimeType = 'image/jpeg'; // Default to JPEG
  
      if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'gif') {
        mimeType = 'image/gif';
      } else if (fileExtension === 'webp') {
        mimeType = 'image/webp';
      } else if (fileExtension === 'heic' || fileExtension === 'heif') {
        mimeType = 'image/heic';
      }
  
      // Append the image and other form data
      formData.append("image", {
        uri: image,
        type: mimeType,
        name: `profile.${fileExtension}`,
      });
      formData.append("email", user.email);
      formData.append("description", description);
  
      // Perform the upload request
      const uploadResponse = await fetch("https://zero-psi.vercel.app/api/additional-details", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
  
      const result = await uploadResponse.text();
      console.log("Server response:", result);
  
      try {
        const jsonResult = JSON.parse(result);
        if (uploadResponse.ok) {
          alert("Profile updated successfully");
          router.push("/TermsConditions");
        } else {
          alert("Failed to update profile: " + jsonResult.error);
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        alert("Failed to parse server response");
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  