"use client";
export default function WebsitePreview({ code }: { code: string }) {
  return (
    <div className="w-full h-[500px]">
      <iframe srcDoc={code} height={500} width={"100%"} />
    </div>
  );
}
