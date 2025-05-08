const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const captionBox = document.getElementById('captionBox');
const speakBtn = document.getElementById('speakBtn');
const frequencyBar = document.getElementById('frequencyBar').querySelector('span');

let apiUrl = 'https://cavadan-flask-end.onrender.com'; // Replace with your Flask back-end URL

imageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
      promptInput.style.display = 'block';
      generateBtn.style.display = 'inline-block';
      captionBox.style.display = 'none';
      speakBtn.style.display = 'none';
      captionBox.textContent = '';
    };
    reader.readAsDataURL(file);
  }
});

generateBtn.addEventListener('click', async function () {
  const prompt = promptInput.value.trim();
  const image = imageInput.files[0];

  if (!image) {
    alert('Please upload an image first.');
    return;
  }

  const formData = new FormData();
  formData.append('image', image);
  formData.append('prompt', prompt);

  try {
    const response = await fetch(`${apiUrl}/generate-caption`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to generate caption. Please try again.');
    }

    const result = await response.json();
    captionBox.textContent = result.caption;
    captionBox.style.display = 'block';
    speakBtn.style.display = 'inline-block';

    // Add ZIP download button
    const zipDownloadLink = document.createElement('a');
    zipDownloadLink.href = `${apiUrl}${result.zip_url}`;
    zipDownloadLink.textContent = 'Download ZIP';
    zipDownloadLink.download = 'captioned_output.zip';
    zipDownloadLink.style.display = 'block';
    zipDownloadLink.style.marginTop = '10px';
    captionBox.appendChild(zipDownloadLink);
  } catch (error) {
    console.error(error);
    alert('An error occurred while generating the caption.');
  }
});

speakBtn.addEventListener('click', function () {
  const text = captionBox.textContent;
  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;

    frequencyBar.style.width = '0%';
    frequencyBar.parentElement.style.display = 'block';

    let width = 0;
    const interval = setInterval(function () {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += Math.random() * 5;
        frequencyBar.style.width = width + '%';
      }
    }, 100);

    window.speechSynthesis.speak(utterance);
  }
});
