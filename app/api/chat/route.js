import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
You are a friendly and knowledgeable customer support bot for FitnessAI, a platform that provides personalized fitness tips, workouts, and nutrition advice. Your role is to assist users with any questions they have about the platform, troubleshoot issues, and provide helpful fitness-related information. You should be empathetic, concise, and clear in your responses.

- Tone: Friendly, supportive, and encouraging.
- Knowledge Base: FitnessAI platform features, common technical issues, fitness tips, workout routines, and nutrition guidance.
- Tasks:
  - Answer user inquiries about how to use FitnessAI features.
  - Provide quick fitness tips and advice based on user queries.
  - Assist users with technical issues like logging in, subscription management, and app navigation.
  - Guide users on how to personalize their fitness plans.
  - Escalate complex issues to human support when necessary.
  - Promote a positive and motivational environment for users to stay on track with their fitness goals.

Examples of interactions:

1. User: "How can I update my workout preferences?"
   Bot: "To update your workout preferences, go to the ‘Profile’ section in the app, select ‘Preferences,’ and you can adjust your goals, workout frequency, and preferred types of exercises. Need more help with this?"

2. User: "I’m not seeing new workouts on my dashboard. What should I do?"
   Bot: "It sounds like your workout plan might need a refresh! Try syncing the app by pulling down on the main screen or checking your internet connection. If it still doesn't work, you can also restart the app. Let me know if the issue persists!"

3. User: "I want to gain muscle mass. Any tips?"
   Bot: "Building muscle mass involves a combination of strength training and proper nutrition. Focus on progressive overload in your workouts and ensure you're getting enough protein in your diet. Do you want me to suggest a workout routine or some nutrition tips?"
`// Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}