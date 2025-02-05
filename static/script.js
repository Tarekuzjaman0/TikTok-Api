document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission

    const videoUrl = document.getElementById('videoUrl').value;
    const messageDiv = document.getElementById('message');
    const loader = document.getElementById('loader');

    if (!videoUrl) {
        messageDiv.textContent = "Please enter a valid YouTube URL.";
        return;
    }

    loader.style.display = "block"; // Show loading animation
    messageDiv.textContent = ""; // Clear previous messages

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = `Download successful! File saved as: ${data.file}`;
        } else {
            messageDiv.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        messageDiv.textContent = `Error: ${error.message}`;
    } finally {
        loader.style.display = "none"; // Hide loading animation
    }
});