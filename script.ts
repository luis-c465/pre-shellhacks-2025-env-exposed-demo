// Get references to all necessary DOM elements
const chatContainer = document.getElementById(
  'chat-container'
) as HTMLDivElement
const userInput = document.getElementById('user-input') as HTMLInputElement
const sendButton = document.getElementById('send-button') as HTMLButtonElement
const loadingSpinner = document.getElementById(
  'loading-spinner'
) as HTMLDivElement
const sendIcon = document.getElementById('send-icon') as HTMLDivElement

// Set up API key and URL
const apiKey = 'AIzaSyAXbMwSXzx2sAlvY8UD78FLlnor_KBE2Mc'
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`

// Attach event listeners to the send button and input field
sendButton.addEventListener('click', sendMessage)
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage()
  }
})

// Function to add a message to the chat container
function addMessage(message: string, sender: string) {
  const messageDiv = document.createElement('div')
  const bubbleDiv = document.createElement('div')
  bubbleDiv.classList.add('p-3', 'rounded-2xl', 'max-w-[80%]', 'shadow-md')

  if (sender === 'user') {
    messageDiv.classList.add('flex', 'justify-end', 'animate-fade-in-up')
    bubbleDiv.classList.add(
      'bg-gray-900',
      'text-white',
      'rounded-tr-2xl',
      'rounded-b-2xl'
    )
  } else {
    messageDiv.classList.add('flex', 'justify-start', 'animate-fade-in-up')
    bubbleDiv.classList.add(
      'bg-gray-200',
      'text-gray-800',
      'rounded-tl-2xl',
      'rounded-b-2xl'
    )
  }

  bubbleDiv.textContent = message
  messageDiv.appendChild(bubbleDiv)
  chatContainer.appendChild(messageDiv)
  // Scroll to the latest message
  chatContainer.scrollTop = chatContainer.scrollHeight
}

// Exponential backoff function for API calls
async function callGeminiApiWithRetry(
  payload: object,
  retries = 3,
  delay = 1000
) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 429) {
        if (i < retries - 1) {
          console.warn(
            `API call failed with status 429. Retrying in ${delay / 1000}s...`
          )
          await new Promise((res) => setTimeout(res, delay))
          delay *= 2 // Exponential increase in delay
          continue
        }
      }

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }
  throw new Error('Failed to fetch from API after multiple retries.')
}

// Main function to send a message
async function sendMessage() {
  const userMessage = userInput.value.trim()
  if (userMessage === '') {
    return
  }

  // Add user message to the chat and clear input
  addMessage(userMessage, 'user')
  userInput.value = ''

  // Show loading indicator and disable the send button
  sendIcon.classList.add('hidden')
  loadingSpinner.classList.remove('hidden')
  sendButton.disabled = true

  const chatHistory = [
    {
      role: 'user',
      parts: [
        {
          text: userMessage,
        },
      ],
    },
  ]
  const payload = {
    contents: chatHistory,
  }

  try {
    const result = await callGeminiApiWithRetry(payload)
    let botMessage =
      'I am sorry, I could not generate a response. Please try again.'

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      botMessage = result.candidates[0].content.parts[0].text
    }

    addMessage(botMessage, 'bot')
  } catch (error) {
    console.error('Error in API response:', error)
    addMessage('Sorry, something went wrong. Please try again later.', 'bot')
  } finally {
    // Hide loading indicator and re-enable the send button
    sendIcon.classList.remove('hidden')
    loadingSpinner.classList.add('hidden')
    sendButton.disabled = false
  }
}
