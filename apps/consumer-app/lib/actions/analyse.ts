"use server";
import { z } from "zod";
import { analyseJD } from "@/lib/services/ai";
import { validateJobDescription } from "@/lib/utils/validators";

const JDFormSchema = z.object({
  jobDescription: z.string().min(1, "Job description is required").trim(),
});

export async function analyseJDAction(formData: FormData) {
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

    const aiResult = await analyseJD(jobDescription);

    return {
      success: true,
      data: aiResult,
    };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.error("Zod validation error");
      return {
        success: false,
        error: "Failed Zod validation to analyse job description",
        data: null,
      };
    }

    if (err instanceof Error) {
      console.error("Server action error", {
        message: err.message,
        name: err.name,
        time: new Date().toISOString(),
      });
    } else {
      console.error("Server action error", {
        error: "Unknown error",
        time: new Date().toISOString(),
      });
    }

    return {
      success: false,
      error: "Failed to analyse job description",
      data: null,
    };
  }
}
