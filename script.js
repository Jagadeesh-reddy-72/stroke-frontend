async function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    const resultDiv = document.getElementById("result");
    const previewDiv = document.getElementById("preview");

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an MRI image first.");
        return;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        previewDiv.innerHTML = `
            <h3>Uploaded Image:</h3>
            <img src="${e.target.result}" width="250" style="border-radius:10px; margin-top:10px;">
        `;
    };
    reader.readAsDataURL(file);

    // Show loading message
    resultDiv.innerHTML = "<h3>Analyzing... ⏳</h3>";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://jagadeesh72-stroke-predict.hf.space/predict", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        resultDiv.innerHTML = `
            <div style="margin-top:20px; padding:15px; background:#ffffff20; border-radius:10px;">
                <h2>🧠 Prediction Result</h2>
                <h3>${data.prediction.replace("_", " ").toUpperCase()}</h3>
                <h4>Confidence: ${data.confidence}%</h4>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = `
            <h3 style="color:red;">Error connecting to backend.</h3>
        `;
        console.error("Error:", error);
    }
}
