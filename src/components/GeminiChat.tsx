// Import React hooks for state management, DOM references, and side effects
import { useState, useRef, useEffect } from 'react';
// Import the CSS file that contains all the styling for the chat interface
import './ChatApp.css'; // Styling goes here

// Define a TypeScript type for message objects to ensure type safety
type Message = {
  sender: 'user' | 'gemini'; // The sender can only be 'user' or 'gemini'
  text: string; // The message content as a string
};

// Export the main chat component as a named export
export const GeminiChat = () => {
  // State hook to store an array of all chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State hook to store the current input text from the user
  const [input, setInput] = useState('');
  // State hook to track whether the API call is in progress
  const [loading, setLoading] = useState(false);

  // Create a ref to reference the bottom of the chat container for auto-scrolling
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Function to automatically scroll to the bottom of the chat
  const scrollToBottom = () => {
    // Use the ref to scroll the element into view with smooth animation
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect hook that runs whenever the messages array changes
  useEffect(() => {
    // Automatically scroll to bottom when new messages are added
    scrollToBottom();
  }, [messages]); // Dependency array - only run when messages change

  // Async function to handle form submission and send messages to Gemini API
  const sendMessage = async (e: React.FormEvent) => {
    // Prevent the default form submission behavior (page refresh)
    e.preventDefault();
    // Exit early if the input is empty or only whitespace
    if (!input.trim()) return;

    // Create a new message object for the user's input
    const userMessage: Message = { sender: 'user', text: input };
    // Add the user message to the messages array using the previous state
    setMessages((prev) => [...prev, userMessage]);
    // Clear the input field after sending the message
    setInput('');
    // Set loading state to true to show loading indicator
    setLoading(true);    

    // Make an HTTP POST request to the Gemini API
    const response = await fetch(
      // Construct the API URL with the API key from environment variables
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        // Specify the HTTP method as POST
        method: 'POST',
        // Set the content type header to indicate JSON data
        headers: { 'Content-Type': 'application/json' },
        // Convert the request body to JSON string
        body: JSON.stringify({
          // Create the contents array for the API request
          contents: messages.map((msg) => ({
            // Map user/gemini to the API's expected role names
            role: msg.sender === 'user' ? 'user' : 'model',
            // Wrap the message text in the required parts array structure
            parts: [{ text: msg.text }]
            // Concatenate the current input as the latest user message
            })).concat([{ role: 'user', parts: [{ text: input }] }]),
        }),
      }
    );

    // Parse the JSON response from the API
    const data = await response.json();
    // Extract the reply text from the nested response structure, with fallback error message
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error in response';

    // Create a new message object for Gemini's response
    const geminiMessage: Message = { sender: 'gemini', text: reply };
    // Add Gemini's response to the messages array
    setMessages((prev) => [...prev, geminiMessage]);
    // Set loading state to false to hide loading indicator
    setLoading(false);
  };

  // Return the JSX for the chat interface
  return (
    <div>
        {/* Main heading for the chat application */}
        <h3 className="gemini-heading">Gemini Chat bot</h3>
        {/* Main container for the entire chat interface */}
        <div className="chat-container">            
            {/* Scrollable container for all chat messages */}
            <div className="chat-box">
                {/* Map over all messages to render each one */}
                {messages.map((msg, idx) => (
                    // Individual message container with dynamic CSS class based on sender
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                        {/* Display the message text */}
                        {msg.text}
                        {/* Copy to clipboard icon that appears on hover */}
                        <span
                        className="copy-icon"
                        // Click handler to copy message text to clipboard
                        onClick={() => navigator.clipboard.writeText(msg.text)}
                        // Tooltip text that appears on hover
                        title="Copy to clipboard"
                        >
                        📋
                        </span>
                    </div>
                ))}
                {/* Reference element for auto-scrolling and loading indicator */}
                <div ref={chatEndRef}>{loading ? <p>Thinking...</p> : null}</div>
            </div>

            {/* Form for user input with submit handler */}
            <form className="input-form" onSubmit={sendMessage}>
                {/* Text input field for user messages */}
                <input
                type="text"
                // Controlled input - value comes from state
                value={input}
                // Update state when user types
                onChange={(e) => setInput(e.target.value)}
                // Placeholder text to guide user
                placeholder="Type your message..."
                />
                {/* Submit button that is disabled during loading */}
                <button type="submit" disabled={loading}>
                {/* Dynamic button text based on loading state */}
                {loading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    </div>
    
  );
};