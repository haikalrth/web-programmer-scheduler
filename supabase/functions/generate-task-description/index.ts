// supabase/functions/generate-task-description/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Mock AI API call
const callGenerativeAI = async (prompt: string): Promise<string> => {
  console.log("Calling Mock AI with prompt:", prompt);
  // In a real scenario, this would be a fetch request to a service like OpenAI or Google AI
  return new Promise(resolve => {
    setTimeout(() => {
      const description = `This is a mock AI-generated description for the task: "${prompt}". It should be detailed and provide clear instructions for the programmer.`;
      resolve(description);
    }, 1000);
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const description = await callGenerativeAI(prompt);

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
