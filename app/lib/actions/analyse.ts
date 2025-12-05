"use server";
import { z } from "zod";
import { analyzeJD } from "@/lib/services/ai";
import { validateJobDescription } from "@/lib/utils/validators";

const JDFormSchema = z.object({
  jobDescription: z.string(),
});

export async function analyzeJobDescription(formData: FormData) {
  try {
    const { jobDescription } = JDFormSchema.parse({
      jobDescription: formData.get("jobDescription"),
    });

    if (!validateJobDescription(jobDescription)) {
      return {
        success: false,
        error: "Invalid job description",
        data: null,
      };
    }

    const aiResult = await analyzeJD(jobDescription);

    return {
      success: true,
      data: aiResult,
    };
  } catch (err: any) {
    console.error("Server action error:", err);
    return {
      success: false,
      error: "Failed to analyze job description",
      data: null,
    };
  }
}
