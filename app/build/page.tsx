"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Upload, FileCode, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import CodePreview from "@/components/code-preview";
import WebsitePreview from "@/components/website-preview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function Build() {
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string>("");
  const [models, setModels] = useState<string[]>([]);
  const [chosenModel, setChosenModel] = useState<string>("Gemini-1.5 Flash");
  const [tab, setTab] = useState<string>("code");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const getModels = async () => {
    try {
      const response = await fetch("/api/list");
      const data = await response.json();
      setModels(data.models);
    } catch (error) {
      console.log("Error while getting models: ", error);
      toast.error("Error fetching Models");
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please Upload Your Resume");
      return;
    }
    if (!prompt) {
      toast.error("Please Enter Your Prompt");
      return;
    }
    setIsLoading(true);
    setResponse("");
    setTab("code");
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("file", resume);
      formData.append("prompt", prompt);
      formData.append("model", chosenModel);
      console.log("Sending Request");
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      const reader = res.body?.getReader();
      // console.log(reader);
      const decoder = new TextDecoder();
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResponse((prev) => prev + decoder.decode(value));
      }
      toast.success("Portfolio generated successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setTab("preview");
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getModels();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <BackgroundBeams />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <TextGenerateEffect
            words="Create Your Portfolio"
            className="text-4xl font-bold text-center mb-8 text-white"
          />

          <TracingBeam>
            <form onSubmit={handleUpload} className="space-y-8">
              <Card className="p-6 bg-black/50 backdrop-blur-xl border-neutral-800">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume">Upload Resume (PDF)</Label>
                    <div className="mt-2">
                      <label
                        className={cn(
                          "flex justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-md appearance-none cursor-pointer",
                          "hover:border-gray-400 focus:outline-none",
                          resume ? "border-green-500" : "border-gray-600"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col items-center space-y-2 text-center">
                            {resume ? (
                              <>
                                <FileCode className="w-8 h-8 text-green-500" />
                                <span className="text-green-500">
                                  {resume.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="font-medium text-gray-400">
                                  Drop your resume here or click to browse
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Input
                          type="file"
                          id="resume"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prompt">Customize Your Portfolio</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe how you want your portfolio to look... (e.g., 'I want a modern, minimalist design with a dark theme and emphasis on my project work')"
                      className="h-32 mt-2 bg-black/50 border-neutral-800"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 relative">
                  <span className="font-semibold">Models:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-5 py-2 rounded-lg border-2 border-gray-400">
                      {chosenModel}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-900 p-3 rounded-lg absolute z-40">
                      {models.map((model) => (
                        <DropdownMenuItem
                          onClick={() => setChosenModel(model)}
                          key={model}
                          className="px-5 py-1 rounded-lg"
                        >
                          {model}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  disabled={isLoading || !resume || !prompt}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Portfolio...
                    </>
                  ) : (
                    "Generate Portfolio"
                  )}
                </Button>
                {isLoading && (
                  <Button onClick={handleAbort} className="mt-2 w-full">
                    Cancel
                  </Button>
                )}
              </Card>
            </form>

            {response && (
              <div className="mt-12">
                <TextGenerateEffect
                  words="Your Generated Portfolio"
                  className="text-2xl font-bold mb-6"
                />

                <Tabs value={tab} className="w-full">
                  <TabsList className="w-full bg-black/50 border-neutral-800">
                    <TabsTrigger
                      value="code"
                      className="flex-1"
                      onClick={() => setTab("code")}
                    >
                      <FileCode className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="flex-1"
                      disabled={isLoading}
                      onClick={() => setTab("preview")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <Card className="bg-black/50 backdrop-blur-xl border-neutral-800">
                      <WebsitePreview code={response} />
                    </Card>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <Card className="bg-black/50 backdrop-blur-xl border-neutral-800">
                      <CodePreview code={response} />
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TracingBeam>
        </div>
      </div>
    </div>
  );
}
