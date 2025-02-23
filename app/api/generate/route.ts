import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import ollama from "ollama";
import { getPrompt, templates } from "@/lib/ai-stuff";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file: File = formData.get("file") as File;
    const user_prompt: string = formData.get("prompt") as string;
    const model: string = formData.get("model") as string;
    const abortSignal = request.signal;
    let controllerClosed = false;

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    const resumeText = data.text;

    const idx = Math.floor(Math.random() * 3);
    const final_prompt = getPrompt(resumeText, user_prompt, templates[idx]);
    console.log("Got Prompt");
    const encoder = new TextEncoder();
    let stream;

    if (model === "Gemini-1.5 Flash") {
      const response = await askGemini(final_prompt);
      //   console.log(response);
      stream = new ReadableStream({
        async start(controller) {
          if (abortSignal.aborted) {
            controller.close();
            return;
          }
          const abortHandler = () => {
            controllerClosed = true;
            controller.enqueue(encoder.encode("Stream Aborted"));
            console.log("Stream Aborted");
            controller.close();
          };
          abortSignal.addEventListener("abort", abortHandler);
          try {
            const chunks = response.match(/.{1,1024}/g) || [];
            for (const chunk of chunks) {
              const encoded = encoder.encode(chunk);
              controller.enqueue(encoded);
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.log("Streaming error:", error);
            controller.enqueue(
              encoder.encode("Error in streaming Gemini Response")
            );
          } finally {
            controller.close();
            abortSignal.removeEventListener("abort", abortHandler);
            console.log("Controller Closed");
          }
        },
      });
    } else {
      stream = new ReadableStream({
        async start(controller) {
          if (abortSignal.aborted) {
            controller.close();
            return;
          }

          const abortHandler = () => {
            controllerClosed = true;
            controller.enqueue(encoder.encode("\nStream aborted by user."));
            controller.close();
            ollama.abort();
            console.log("Ollama stream aborted.");
          };

          abortSignal.addEventListener("abort", abortHandler);

          try {
            const response = await ollama.chat({
              model: model,
              messages: [{ role: "user", content: final_prompt }],
              stream: true,
            });

            for await (const chunk of response) {
              if (controllerClosed) break;
              controller.enqueue(encoder.encode(chunk.message?.content));
            }
          } catch (error) {
            controller.enqueue(encoder.encode("Error in streaming Portfolio"));
            ollama.abort();
            console.log("Error while streaming Porfolio: ", error);
          } finally {
            abortSignal.removeEventListener("abort", abortHandler);
            ollama.abort();
            controller.close();
          }
        },
      });
    }

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log("Error while Generating Portfolio: ", error);
    return NextResponse.json({
      error: "Error while Creating Portfolio",
      status: 500,
    });
  }
}

async function askGemini(prompt: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
