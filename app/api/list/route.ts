import ollama from "ollama";
export async function GET() {
  try {
    const res = await ollama.list();
    const models = res.models.map((model) => model.name);
    models.push("Gemini-1.5 Flash");
    return Response.json({
      success: true,
      message: "List of Models Retrieved Successfully",
      models,
    });
  } catch (error) {
    console.log("Error while getting List of Models: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while getting list of models",
      },
      {
        status: 500,
      }
    );
  }
}
