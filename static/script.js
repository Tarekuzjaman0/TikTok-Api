document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission

    const videoUrlInput = document.getElementById('videoUrl');
    const messageDiv = document.getElementById('message');
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const videoUrl = videoUrlInput.value.trim();

    if (!videoUrl) {
        messageDiv.textContent = "Please enter a valid YouTube URL.";
        return;
    }

    loader.style.display = "block"; // Show loading animation
    messageDiv.textContent = ""; // Clear previous messages
    progressContainer.style.display = "block"; // Show progress bar
    progressBar.style.width = "0%"; // Reset progress

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });

        if (!response.body) {
            throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length') || 1000000; // Fallback size estimate

        let receivedLength = 0;
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;

            // Update progress bar
            let progress = (receivedLength / contentLength) * 100;
            progressBar.style.width = `${progress.toFixed(2)}%`;
        }

        messageDiv.textContent = "Download successful!";
        videoUrlInput.value = ""; // Clear input field after successful download
        progressBar.style.width = "100%"; // Ensure progress bar reaches full
    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        progressContainer.style.display = "none"; // Hide progress bar on error
    } finally {
        loader.style.display = "none"; // Hide loading animation
    }
});
