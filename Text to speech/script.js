document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const speakButton = document.getElementById('speakButton');
    const statusMessage = document.getElementById('statusMessage');
    
    // Check if SpeechSynthesis is supported
    if (!('speechSynthesis' in window)) {
        statusMessage.textContent = 'Speech Synthesis not supported in this browser';
        statusMessage.className = 'status error';
        speakButton.disabled = true;
        return;
    }
    
    // Check if there are any voices available
    if (speechSynthesis.getVoices().length === 0) {
        statusMessage.textContent = 'Loading speech voices...';
        statusMessage.className = 'status';
        
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = function() {
            if (speechSynthesis.getVoices().length > 0) {
                statusMessage.textContent = 'Ready to convert text to speech';
                statusMessage.className = 'status';
                speakButton.disabled = false;
            } else {
                statusMessage.textContent = 'No speech voices available';
                statusMessage.className = 'status error';
                speakButton.disabled = true;
            }
        };
    } else {
        statusMessage.textContent = 'Ready to convert text to speech';
        statusMessage.className = 'status';
        speakButton.disabled = false;
    }
    
    // Speech synthesis function
    function speakText() {
        const text = textInput.value.trim();
        
        if (text === '') {
            statusMessage.textContent = 'Please enter some text to convert';
            statusMessage.className = 'status error';
            return;
        }
        
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        // Create a new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set properties for better speech
        utterance.rate = 1;      // Speed (0.5-2)
        utterance.pitch = 1;     // Pitch (0-2)
        utterance.volume = 1;    // Volume (0-1)
        
        // Set a default voice if available
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Try to select a voice that's not for a screen reader
            const preferredVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('male') ||
                voice.name.toLowerCase().includes('english')
            );
            
            utterance.voice = preferredVoice || voices[0];
        }
        
        // Update status
        statusMessage.textContent = 'Speaking...';
        statusMessage.className = 'status speaking';
        
        // Event listeners for speech events
        utterance.onstart = function() {
            statusMessage.textContent = 'Speaking...';
            statusMessage.className = 'status speaking';
        };
        
        utterance.onend = function() {
            statusMessage.textContent = 'Speech completed';
            statusMessage.className = 'status';
            
            // Reset after a short delay
            setTimeout(() => {
                statusMessage.textContent = 'Ready to convert text to speech';
                statusMessage.className = 'status';
            }, 2000);
        };
        
        utterance.onerror = function(event) {
            statusMessage.textContent = `Error: ${event.error}`;
            statusMessage.className = 'status error';
        };
        
        // Speak the text
        speechSynthesis.speak(utterance);
    }
    
    // Event listeners
    speakButton.addEventListener('click', speakText);
    
    textInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            statusMessage.textContent = 'Ready to convert text to speech';
            statusMessage.className = 'status';
        }
    });
    
    // Add keyboard shortcut (Ctrl + Enter)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            if (!speakButton.disabled) {
                speakText();
            }
        }
    });
});