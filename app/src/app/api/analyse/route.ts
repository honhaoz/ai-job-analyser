import { NextResponse } from "next/server";
import { analyzeJD } from "@/lib/services/ai";
// import { saveAnalysis, decrementQuota } from "@/lib/services/db";
import { validateJobDescription } from "@/lib/utils/validators";

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json();

    if (!validateJobDescription(jobDescription)) {
      return NextResponse.json(
        { error: "Invalid job description" },
        { status: 400 }
      );
    }

    const aiResult = await analyzeJD(jobDescription);

    return NextResponse.json({ success: true, aiResult });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
