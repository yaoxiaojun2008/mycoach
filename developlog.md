# recommended and deepseek
Updated UI Text: In 
RecommendedFeed.tsx
, I changed the card title from "The Nuances of Indirect Questions" to "we recommend today...".
Connected to DeepSeek: I created a new function 
getEducationNews
 in 
services/ai.ts
 that sends your exact prompts to the DeepSeek API.
System Prompt: "You are a helpful education news/blogs assistant..."
User Prompt: "please send me a list link to top 3 news and top 3 blogs..."
I added a format instruction to ensuring the AI returns a JSON structure that the app can actually display (Title, Snippet, etc.).
Wired Up Navigation: When you click that card (which navigates to 
RecommendedContent
), it now fetches data using this new 
getEducationNews
 function instead of the generic recommendation engine.
Try it out:

Go to the For You tab (Recommended Feed).
